const Discord = require('discord.js')

exports.createEmbed = (title, showImage, data) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor([0, 255, 100])
    .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")

    if (showImage)
    embed.setImage("https://i.imgur.com/qXD4XE0.png")

    .setTimestamp()

    .addFields({
        name: "Product",
        value: data.productName
    })

    .addFields({
        name: "Product Name",
        value: data.productName
    })
}