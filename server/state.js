/**
 * Hacked file-based persistence. This thing is totally web-scale and makes
 * Google's devs look like amateurs.
 */
const { MongoClient, ObjectID } = require("mongodb");

const fs = require("fs");
const path = require("path");


const OUTFILE = "data/state.json";


const DB_URL = "mongodb://localhost:27017";
const DB_NAME = "chat_system";

const DB_OPTIONS = {
  poolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true
};


const ROLES = [
  "user",
  "group_admin",
  "super_admin"
];


/**
 * Default attributes for new users. Individual attributes can be overridden in
 * `createUser()`
 */
const DEFAULT_USER_ATTRIBUTES = {
  password: "password",
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
   * MongoDB database handle. Set by `init()` once the server is connected.
   */
  db: null,


  /**
   * Opens a new MongoDB connection, and creates / opens our application
   * database. This method must be called before any other.
   *
   * @returns {Promise} Promise object which is resolved once the database is open
   */
  init: function () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(DB_URL, DB_OPTIONS, (err, client) => {
        if (err) {
          reject(err);
        } else {
          this.db = client.db(DB_NAME);

          // Create default user, if it does not already exist
          this.createUser("super", {
            role: "super_admin",
            password: "super",
            email: "not@implemented.invalid"
          });

          resolve();
        }
      })
    });
  },


  /**
   * Creates a new user, if it does not yet exist.
   *
   * @param {string} name - Unique username to create attributes for.
   * @param {Object} attributes - Overrides for `DEFAULT_USER_ATTRIBUTES`.
   * @returns {Promise} API `Result` response for user creation attempts.
   */
  createUser: function (name, attributes) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("users");

      collection.find({ name: name }).count((err, count) => {
        if (err) {
          reject(err);
        } else if (count > 0) {
          resolve({ success: false, reason: "User already exists" });
        } else {
          let merged_attributes = { ...DEFAULT_USER_ATTRIBUTES };
          Object.keys(merged_attributes).forEach(key => {
            if (key in attributes) {
              merged_attributes[key] = attributes[key];
            }
          });

          collection.insertOne({ name: name, ...merged_attributes }, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve({ succes: true });
            }
          })
        }
      });
    });
  },


  /**
   * Attempts to find a user by name, and return it.
   *
   * @param {*} name - Username to look for
   * @returns {(Object|undefined)} User attributes, if the user exists
   */
  getUser: function (name) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("users");

      collection.find({ name: name }).limit(1).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs.length == 0 ? undefined : docs[0]);
        }
      })
    });
  },


  /**
   * Dumps the user list object.
   *
   * @returns {Object} Relational mapping between usernames and attributes
   */
  getUserList: function () {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("users");

      collection.find({}).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else {
          // Convert to old key-associative object format
          let userList = {}

          for (let doc of docs) {
            userList[doc.name] = doc;
          }

          resolve(userList);
        }
      })
    });
  },


  /**
   * Overwrites the user list! This is dirty, but it works for the demo.
   *
   * @param {Object} list List of users, in the same format as `getUserList()`
   */
  setUserList: function (list) {
    let userList = [];

    // Convert to mongodb format
    Object.keys(list).forEach(key => {
      delete list[key]._id;
      userList.push({ name: key, ...list[key] });
    });

    // Write new list to temporary collection
    return new Promise((resolve, reject) => {
      const collection = this.db.collection("new_users");

      collection.insertMany(userList, (err, response) => {
        if (err) {
          reject(err);
        } else {
          // Swap old and new collections
          this.db.collection("users").rename("old_users", err => {
            if (err) reject(err); else collection.rename("users", err => {
              if (err) reject(err); else this.db.collection("old_users").drop((err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              })
            });
          });
        }
      });
    });
  },


  /**
   * Creates a new group, and adds the creator to it.
   *
   * @param {string} name Group name
   * @param {string} creator User that created the group
   */
  createGroup: function (name, creator) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("groups");

      // Generate unique random ID
      const id = makeid(8);

      collection.insertOne({
        id: id,
        name: name,
        members: [creator],
        assistants: []
      }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },


  getGroup: function (groupID) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("groups");

      collection.find({ id: groupID }).limit(1).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else if (docs !== undefined && docs.length > 0) {
          resolve(docs[0]);
        } else {
          resolve({});
        }
      });
    });
  },


  removeGroup: function (groupID) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("groups");

      collection.deleteOne({ id: groupID }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
  },


  /**
   * Returns an object containing the groups that the user is a member of.
   *
   * @param {string} username The username to use in membership queries
   */
  getMemberGroups: function (username) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      this.getUser(username).then(user => {
        const collection = this.db.collection("groups");

        // Super admins are implicitly a member of all groups
        const filter = user.role == "super_admin" ? {} : { members: username };

        collection.find(filter).toArray((err, docs) => {
          if (err) {
            reject(err)
          } else {
            // Convert to old key-associative object format
            let memberGroups = {}

            for (let doc of docs) {
              memberGroups[doc.id] = doc;
            }

            resolve(memberGroups);
          }
        })
      }).catch(err => reject(err));
    });
  },


  setAssistants: function (groupID, assistants) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("groups");

      collection.updateOne({ id: groupID }, {
        assistants: assistants
      }, () => {
        resolve();
      });
    });
  },


  createChannel: function (groupID, name) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      this.getGroup(groupID).then(group => {
        const collection = this.db.collection("channels");

        // Generate unique random ID
        const id = makeid(8);

        collection.insertOne({
          id: id,
          groupId: groupID,
          name: name,
          members: group.members
        }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  },


  removeChannel: function (groupID, channelID) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("channels");

      collection.deleteOne({ id: channelID }, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },


  getChannels: function (groupID) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      const collection = this.db.collection("channels");

      collection.find({ groupId: groupID }).toArray((err, docs) => {
        if (err) {
          reject(err);
        } else {
          // Convert to old key-associative object format
          let channels = {}

          for (let doc of docs) {
            channels[doc.id] = doc;
          }

          resolve(channels);
        }
      })
    });
  },


  addUserToChannel: function (groupID, channelID, username) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      this.createUser(username, {}).then(() => {
        // Add user to channel
        const channels = this.db.collection("channels");

        channels.updateOne({ id: channelID, groupId: groupID }, {
          $addToSet: { "members": username }
        }, () => {
          // Add user to group
          const groups = this.db.collection("groups");

          groups.updateOne({ id: groupID }, {
            $addToSet: { "members": username }
          }, () => resolve());
        });
      });
    });
  },


  removeUserFromChannel: function (groupID, channelID, username) {
    if (this.db === null) throw new Error("init() must be called first");

    return new Promise((resolve, reject) => {
      // Remove user from channel
      const channels = this.db.collection("channels");

      channels.updateOne({ id: channelID, groupId: groupID }, {
        $pull: { "members": username }
      }, () => {
        // Remove user from group if no longer in any of the group's channels
        channels.find({ members: username }).count((err, count) => {
          if (err) {
            reject(err);
          } else if (count == 0) {
            // Not in any of the group's channels
            const groups = this.db.collection("groups");

            groups.updateOne({ id: groupID }, {
              $pull: { "members": username }
            }, () => resolve());
          } else {
            // User is still in some of the group's channels
            resolve();
          }
        })
      });
    });
  }

}
