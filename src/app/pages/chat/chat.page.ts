import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { UserService } from 'src/app/services/user.service';
import { ModalService } from 'src/app/services/modal.service';
import { GroupsService, GroupList } from 'src/app/services/groups.service';
import { ChannelsService, ChannelList } from 'src/app/services/channels.service';


@Component({
  selector: "page-chat",
  templateUrl: "./chat.page.html",
  styleUrls: ["./chat.page.scss"]
})
export class ChatPage implements OnInit {

  public currentGroup: string | undefined;
  public currentChannel: string | undefined;

  public newGroupName: string = "";
  public newChannelName: string = "";
  public newUserName: string = "";

  public groupList: GroupList = {};
  public channelList: ChannelList = {};


  /**
   * Function re-export to allow iterating objects from inside template.
   */
  public objectKeys = Object.keys;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalService,
    private groups: GroupsService,
    private channels: ChannelsService,
    public user: UserService
  ) {
    route.params.subscribe(async params => {
      if (params.group === undefined) {
        // Select the first group if none is specified, if we have at least one
        const groups = await this.groups.getGroups();
        for (let key of Object.keys(groups)) {
          this.selectGroup(key);
          break;
        }
      } else if (params.channel === undefined) {
        // Select the first channel, as above
        const channels = await this.channels.getChannels(params.group);
        for (let key of Object.keys(channels)) {
          this.selectChannel(key, params.group);
          break;
        }
      }

      this.currentGroup = params.group;
      this.currentChannel = params.channel;
    });
  }


  public async ngOnInit() {
    this.groupList = await this.groups.getGroups();

    if (this.currentGroup !== undefined) {
      this.channelList = await this.channels.getChannels(this.currentGroup);
    }
  }


  public inChannel(channelID: string) {
    return this.channelList[channelID].members.includes(this.user.name);
  }


  public selectGroup(groupID: string) {
    this.router.navigate([`/chat/${groupID}`]);
  }


  public selectChannel(channelID: string, groupID: string = this.currentGroup) {
    this.router.navigate([`/chat/${groupID}/${channelID}`]);
  }


  public isAssistant(name: string = this.user.name): boolean {
    if (this.currentGroup === undefined) return false;
    return this.groupList[this.currentGroup].assistants.includes(name);
  }


  public addAssistant(name: string) {
    if (this.groupList === {}) return;

    this.groupList[this.currentGroup].assistants.push(name);
    this.groups.setAssistants(this.currentGroup, this.groupList[this.currentGroup].assistants);
  }


  public removeAssistant(name: string) {
    if (this.groupList === {}) return;

    this.groupList[this.currentGroup].assistants =
      this.groupList[this.currentGroup].assistants.filter(x => x !== name);

    this.groups.setAssistants(this.currentGroup, this.groupList[this.currentGroup].assistants);
  }


  public addGroup() {
    this.newGroupName = "";
    this.modal.open("modal-create-group");
  }


  public cancelAddGroup() {
    this.modal.close("modal-create-group");
  }


  public async doAddGroup() {
    this.modal.close("modal-create-group");
    await this.groups.createGroup(this.newGroupName);
    this.groupList = await this.groups.getGroups();
  }


  public async deleteGroup() {
    await this.groups.removeGroup(this.currentGroup);
    this.router.navigate(["/chat"]);
  }


  public addChannel() {
    this.newChannelName = "";
    this.modal.open("modal-create-channel");
  }


  public cancelAddChannel() {
    this.modal.close("modal-create-channel");
  }


  public async doAddChannel() {
    this.modal.close("modal-create-channel");
    await this.channels.createChannel(this.currentGroup, this.newChannelName);
    this.channelList = await this.channels.getChannels(this.currentGroup);
  }


  public async deleteChannel() {
    await this.channels.removeChannel(this.currentGroup, this.currentChannel);
    this.router.navigate([`/chat/${this.currentGroup}`]);
  }


  public addUser() {
    this.newUserName = "";
    this.modal.open("modal-add-user");
  }


  public cancelAddUser() {
    this.modal.close("modal-add-user");
  }


  public async doAddUser() {
    this.modal.close("modal-add-user");
    await this.channels.addUser(this.currentGroup, this.currentChannel, this.newUserName);
    this.channelList = await this.channels.getChannels(this.currentGroup);
  }


  public async removeUser(username: string) {
    await this.channels.removeUser(this.currentGroup, this.currentChannel, username);
    this.channelList = await this.channels.getChannels(this.currentGroup);
  }


  public dashboard() {
    this.router.navigate(["/dashboard"]);
  }


  public logout() {
    this.user.logout();
    this.router.navigate(["/login"]);
  }

}
