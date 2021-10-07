const logmanager = require("../eventlogging.js");

module.exports = (client, member) => {
    logmanager.log(client, "User left", member.user.tag, member.user)
  };