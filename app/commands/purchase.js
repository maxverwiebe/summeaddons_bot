const Discord = require('discord.js')
const fs = require('fs')
const logmanager = require("../eventlogging.js")
const moneyconverter = require("../moneyconverter.js")


exports.run = (client, message, [mention, product, priceOverride, currency, ...restArgs]) => {
    const target = message.mentions.members.first();
    const productObj = client.products[product]

    if (typeof productObj != 'object')
        return message.reply("Err1");

    if (message.mentions.members.size === 0)
        return message.reply("Err2");

    var price = productObj[1].price
    const title = productObj[0].title
    const roleID = productObj[2].roleid
    const timestamp = Date.now()
    var notes = restArgs.join(' ')

    if (priceOverride !== undefined) {
        if (currency !== undefined) {
            if (currency === "USD") {
                price = priceOverride
            }

            if (currency === "EUR") {
                price = moneyconverter.convertToUSD(priceOverride)
            }
        }
    }

    let timeNow = new Date(Date.now())

    var data = {
        monthYear: (timeNow.getMonth() + 1).toString() + "-" + timeNow.getFullYear().toString(),
        timestamp: Date.now(),
        productIndex: product,
        productPriceUSD: price,
        customerName: target.user.username,
        customerID: target.user.id,
        notes: notes,
    }

    let productRole = message.guild.roles.cache.get(roleID);
    if (productRole) target.roles.add(productRole).catch(console.error);

    let costumerRole = message.guild.roles.cache.get(client.config.clientRole);
    if (costumerRole) target.roles.add(costumerRole).catch(console.error);

    client.database.createPurchase(data).then(schema=>{
        const embed = new Discord.MessageEmbed()
            .setTitle("Purchase confirmation")
            .setColor("#149500")
            .setDescription("Here are the details of your purchase.")
            .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
            .setAuthor(message.author.username, message.author.avatarURL())
            .setImage("https://i.imgur.com/YyNa50C.png")
            .setTimestamp()

            .addFields({
                name: ":gem: Product",
                value: title + " | " + price + " USD"
            })

            .addFields({
                name: ":eyes: Customer",
                value: target.user.username + " | " + target.user.id
            })

            .addFields({
                name: ":blue_book: Purchase ID",
                value: schema._id
            })

        if (notes) {
            embed.addFields({
                name: ":warning: Notes",
                value: notes
            })
        }

        target.send(embed)

        client.channels.fetch('856120045776011264')
        .then(channel => channel.send(embed))
    })

    logmanager.log(client, "Product purchased", title + " " + price, target.user)
    message.delete()
}