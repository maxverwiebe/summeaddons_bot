const logmanager = require("../eventlogging.js");

module.exports = (client, message) => {
    if (message.author.bot) return
    logmanager.log(client, "Message deleted", message.content, message.author)
  };