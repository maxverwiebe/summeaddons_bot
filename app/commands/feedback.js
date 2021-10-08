const Discord = require('discord.js');
const { futimes } = require('fs');

function GetHelpEmbed(message, prods, error) {
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle("How to: Feedback")
    .setColor([235, 52, 79])
    .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
    .setAuthor(message.author.username, message.author.avatarURL())
    .setTimestamp()

    var productList = ""

    for (var index in prods) {
        productList = productList + index + ", "
    }

    if (error != "") {
        helpEmbed.addFields({ name: ":small_red_triangle: Error:",
            value: error})
    }

    helpEmbed.addFields({ name: "Available product names:",
        value: productList})

    helpEmbed.addFields({ name: "Command:",
        value: "!feedback product_name star_count reason"})

    helpEmbed.addFields({ name: "Example:",
        value: "!feedback comlink 5 Good product, has greatly improved roleplay communication and users love it!"})
    
    helpEmbed.setImage("https://i.imgur.com/KHvG1tG.png")

    return helpEmbed
}

exports.run = (client, message, [product, starsCount, ...restArgs]) => {
    const productObj = client.products[product]
    const prods = client.products

    if (product == "help") {
        return message.reply(GetHelpEmbed(message, prods))
    }

    if (typeof productObj != 'object') {
        return message.reply(GetHelpEmbed(message, prods, "Product not found! Please use a different product name as stated down below!"))
    }

    const roleID = productObj[2].roleid
    const title = productObj[0].title

    if (!message.member.roles.cache.has(roleID)) {
        return message.reply(GetHelpEmbed(message, prods, "You don't own that product!"))
    }

    if (!starsCount) {
        return message.reply(GetHelpEmbed(message, prods, "Please specify a star count!"))
    }

    if (starsCount > 5) {
        starsCount = 5
    }

    if (starsCount < 1) {
        starsCount = 1
    }

    const starEmoji = ':star:'
    const starBlankEmoji = client.emojis.cache.find(emoji => emoji.name === "star_blank");

    var stars = `${starEmoji}`

    for (let i = 1; i < starsCount; i++) {
        stars = stars + `${starEmoji}`
    }

    const restStars = 5 - starsCount

    for (let i = 1; i <= restStars; i++) {
        stars = stars + `${starBlankEmoji}`
    }

    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor([245, 182, 66])
    .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
    .setAuthor(message.author.username, message.author.avatarURL())
    .setTimestamp()

    .addFields({ name: "Rating",
        value: stars})

    if (restArgs != "") {

        const reason = restArgs.join(' ')

        embed.addFields({ name: "Reason",
            value: reason})
    }

    client.channels.fetch('895726792923566130')
        .then(channel => channel.send(embed))

    message.reply("Successfully sent in <#895726792923566130>!")
}