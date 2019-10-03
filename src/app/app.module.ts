import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserService } from './services/user.service';
import { UserListService } from './services/user-list.service';
import { GroupsService } from './services/groups.service';
import { ChannelsService } from './services/channels.service';
import { MediaService } from './services/media.service';
import { ChatService } from './services/chat.service';

import { AuthenticatedGuard } from "./guards/authenticated.guard";


export function getBaseUrl() {
  return isDevMode() ? "//localhost:3000" : "";
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    UserService,
    UserListService,
    GroupsService,
    ChannelsService,
    MediaService,
    ChatService,
    AuthenticatedGuard,
    { provide: "BASE_URL", useFactory: getBaseUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
