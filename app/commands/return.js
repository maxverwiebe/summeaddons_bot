const Discord = require('discord.js')

exports.run = async (client, message, [id]) => {

    const data = await client.database.getPurchasesFromUser(message.author.id)

    if (!data)
        return message.reply("Nothing found.");

    const embed = new Discord.MessageEmbed()
        .setTitle("Purchase Handler")
        .setColor([50, 255, 0])
        .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
        .setTimestamp()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription("Getting products back...")

        for (var index in data) {
            const productObj = client.products[data[index].productIndex]

            embed.addFields({
                name: productObj[0].title + " (" + data[index].productPriceUSD + " USD" + ") " + data[index].monthYear,
                value: data[index]._id
            })

            const roleID = productObj[2].roleid

            if (roleID == "" && roleID == undefined) {
                continue
            }

            let productRole = message.guild.roles.cache.get(roleID)
            if (productRole) message.member.roles.add(productRole).catch(console.error)

            let customerRole = message.guild.roles.cache.get(client.config.clientRole);
            if (customerRole) message.member.roles.add(customerRole).catch(console.error);
        }

        message.author.send(embed)

        const embedTwo = new Discord.MessageEmbed()
            .setTitle("You successfully got your access back!")
            .setColor([0, 255, 0])
            .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
            .setTimestamp()
            .setAuthor(message.author.username, message.author.avatarURL())
            .setDescription("Details sent via DM.")
    
        message.channel.send(embedTwo)

}