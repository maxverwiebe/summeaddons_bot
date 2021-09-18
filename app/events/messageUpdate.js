const logmanager = require("../eventlogging.js");

module.exports = (client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return
    logmanager.log(client, "Message edited", oldMessage.content + " -> " + newMessage.content, oldMessage.author)
  };