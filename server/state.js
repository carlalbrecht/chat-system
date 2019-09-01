/**
 * Hacked file-based persistence. This thing is totally web-scale and makes
 * Google's devs look like amateurs.
 */
const fs = require("fs");


const ROLES = [
  "user",
  "group_assist",
  "group_admin",
  "super_admin"
];


/**
 * Default state to load if we don't have a saved state yet.
 */
const DEFAULTS = {
  users: {
    "super": { role: "super_admin" }
  },

  groups: []
}

/**
 * Default attributes for new users. Individual attributes can be overridden in
 * `createUser()`
 */
const DEFAULT_USER_ATTRIBUTES = {
  role: "user"
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


module.exports = {

  /**
   * The current state of the program. This is set by `init()` to contain either
   * the deserialised contents of `state.json`, or set to `DEFAULTS`, if
   * `state.json` does not exist.
   */
  state: undefined,


  /**
   * Loads persistent state from `state.json` if it exists. If it does not,
   * `DEFAULTS` is loaded, then immediately saved by calling `sync()`.
   */
  init: function () {
    if (fs.existsSync("state.json")) {
      console.log("Reloading existing state.json");

      this.state = JSON.parse(fs.readFileSync("state.json", { encoding: "utf-8" }));
    } else {
      console.log("Creating new state with defaults");

      this.state = DEFAULTS;
      this.sync();
    }
  },


  /**
   * Writes the current `state` to `state.json`.
   */
  sync: function () {
    if (this.state === undefined) throw new Error("init() must be called first");

    fs.writeFile("state.json", JSON.stringify(this.state), err => {
      if (err) throw err;

      console.log("Saved current state to state.json");
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
  }

}
