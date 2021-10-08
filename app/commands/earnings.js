const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client, message, [id]) => {
    
    try {

        if (!id) {
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
        
            id = m + "-" + y
        }

        fs.readFile('./earned/' + id + '.txt', 'utf8', (err, data) => {
        
            if (!data)
                return message.reply("Err1");

            data

            const embed = new Discord.MessageEmbed()
            .setTitle("Earnings: " + id)
            .setColor([255, 50, 50])
            .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
            .setDescription(data + " USD or rather " + (data / 1.19).toFixed(2) + " EUR")
            .setTimestamp()

            message.channel.send(embed);

        })

    } catch (err) {
        console.error(err)
    }

    message.delete()
}