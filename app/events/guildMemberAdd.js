const logmanager = require("../eventlogging.js");

module.exports = (client, message) => {
    logmanager.log(client, "User joined", message.tag)
  };