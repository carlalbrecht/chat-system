/**
 * Hacked file-based persistence. This thing is totally web-scale and makes
 * Google's devs look like amateurs.
 */
const fs = require("fs");
const path = require("path");


const OUTFILE = "data/state.json";


const ROLES = [
  "user",
  "group_admin",
  "super_admin"
];


/**
 * Default state to load if we don't have a saved state yet.
 */
const DEFAULTS = {
  users: {
    "super": { role: "super_admin", email: "not@implemented.invalid" }
  },

  groups: {}
}

/**
 * Default attributes for new users. Individual attributes can be overridden in
 * `createUser()`
 */
const DEFAULT_USER_ATTRIBUTES = {
  role: "user",
  email: "not@implemented.invalid"
};


/**
 * @class Result
 * @type {Object}
 * @property {boolean} success - Whether or not the request succeeded.
 * @property {string} [reason] - Why the request failed.
 */
function Result(success, reason) {
  return {
    success: success,
    reason: reason
  }
}


/**
 * Generates a random string, containing {A-z, 0-9}
 *
 * Ripped from https://stackoverflow.com/a/1349426
 *
 * @param {*} length Number of characters to generate
 * @returns A random string with `length` characters
 */
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


module.exports = {

  /**
   * The current state of the program. This is set by `init()` to contain either
   * the deserialised contents of `OUTFILE`, or set to `DEFAULTS`, if `OUTFILE`
   * does not exist.
   */
  state: undefined,


  /**
   * Loads persistent state from `OUTFILE` if it exists. If it does not,
   * `DEFAULTS` is loaded, then immediately saved by calling `sync()`.
   */
  init: function () {
    if (fs.existsSync(OUTFILE)) {
      console.log("Reloading ${OUTFILE}");

      this.state = JSON.parse(fs.readFileSync(OUTFILE, { encoding: "utf-8" }));
    } else {
      console.log("Creating new state with defaults");

      this.state = DEFAULTS;
      fs.mkdirSync(path.dirname(OUTFILE), { recursive: true });
      this.sync();
    }
  },


  /**
   * Writes the current `state` to `OUTFILE`.
   */
  sync: function () {
    if (this.state === undefined) throw new Error("init() must be called first");

    fs.writeFile(OUTFILE, JSON.stringify(this.state), err => {
      if (err) throw err;

      console.log(`Saved current state to ${OUTFILE}`);
    })
  },


  /**
   * Creates a new user, if it does not yet exist.
   *
   * @param {string} name - Unique username to create attributes for.
   * @param {Object} attributes - Overrides for `DEFAULT_USER_ATTRIBUTES`.
   * @returns {Result} API response for user creation attempts.
   */
  createUser: function (name, attributes) {
    if (this.state === undefined) throw new Error("init() must be called first");

    if (name in this.state.users) {
      return { success: false, reason: "User already exists" };
    } else {
      // Create attributes object with overridden defaults from `attributes`
      let merged_attributes = { ...DEFAULT_USER_ATTRIBUTES };
      Object.keys(merged_attributes).forEach(key => {
        if (key in attributes) {
          merged_attributes[key] = attributes[key];
        }
      });

      this.state.users[name] = merged_attributes;
      this.sync();
      return { success: true };
    }
  },


  /**
   * Attempts to find a user by name, and return it.
   *
   * @param {*} name - Username to look for
   * @returns {(Object|undefined)} User attributes, if the user exists
   */
  getUser: function (name) {
    return this.state.users[name];
  },


  /**
   * Dumps the user list object.
   *
   * @returns {Object} Relational mapping between usernames and attributes
   */
  getUserList: function () {
    return this.state.users;
  },


  /**
   * Overwrites the user list! This is dirty, but it works for the demo.
   *
   * @param {Object} list List of users, in the same format as `getUserList()`
   */
  setUserList: function (list) {
    try {
      this.state.users = list;
      this.sync();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },


  /**
   * Creates a new group, and adds the creator to it.
   *
   * @param {string} name Group name
   * @param {string} creator User that created the group
   */
  createGroup: function (name, creator) {
    // Generate unique random ID
    let id = makeid(8);
    while (this.state.groups.hasOwnProperty(id)) {
      id = makeid(8);
    }

    try {
      this.state.groups[id] = {
        name: name,
        members: [creator],
        assistants: [],
        channels: {}
      };

      this.sync();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },


  removeGroup: function (groupID) {
    try {
      delete this.state.groups[groupID];
      this.sync();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },


  /**
   * Returns an object containing the groups that the user is a member of.
   *
   * @param {string} username The username to use in membership queries
   */
  getMemberGroups: function (username) {
    let memberGroups = {};
    let user = this.getUser(username);

    // Return nothing if the user doesn't exist
    if (user === undefined) return {};
    // Super admins are implicitly a member of all groups
    if (user.role == "super_admin") return this.state.groups;

    // Find all groups that `username` is a member of
    for (let groupID of Object.keys(this.state.groups)) {
      if (this.state.groups[groupID].members.includes(username)) {
        memberGroups[groupID] = this.state.groups[groupID];
      }
    }

    return memberGroups;
  },


  setAssistants: function (groupID, assistants) {
    if (this.state.groups[groupID] === undefined) return false;

    try {
      this.state.groups[groupID].assistants = assistants;
      this.sync();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },


  createChannel: function (groupID, name) {
    // We can only create channels for extant groups
    if (this.state.groups[groupID] === undefined) return false;

    // Generate unique random ID
    let id = makeid(8);
    while (this.state.groups[groupID].channels.hasOwnProperty(id)) {
      id = makeid(8);
    }

    try {
      this.state.groups[groupID].channels[id] = {
        name: name,
        members: this.state.groups[groupID].members
      };

      this.sync();

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },


  removeChannel: function (groupID, channelID) {
    if (this.state.groups[groupID] === undefined) return false;

    try {
      let group = this.state.groups[groupID];
      delete group.channels[channelID];
      this.sync();

      return true;
    } catch (err) {
      return false;
    }
  },


  getChannels: function (groupID) {
    return this.state.groups[groupID].channels;
  },


  addUserToChannel: function (groupID, channelID, username) {
    if (this.state.groups[groupID] === undefined) return false;
    let group = this.state.groups[groupID];

    if (group.channels[channelID] === undefined) return false;
    let channel = group.channels[channelID];

    try {
      this.createUser(username, {});

      if (!channel.members.includes(username)) {
        channel.members.push(username);
      }

      if (!group.members.includes(username)) {
        group.members.push(username);
      }

      this.sync();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

}
