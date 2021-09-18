const Discord = require('discord.js');

exports.log = function(client, title, text, user){
    console.log("HELLO");

    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor([224, 66, 245])
    .setDescription(text)
    .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
    .setAuthor(user.username + " (" + user.id + ")", user.avatarURL())

    .setTimestamp()

    client.channels.fetch(client.config.logchannel)
        .then(channel => channel.send(embed))
}