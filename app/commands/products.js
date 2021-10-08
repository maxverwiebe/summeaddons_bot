const Discord = require('discord.js');


exports.run = (client, message, [id]) => {
    var productList = ""

    const prods = client.products

    const embed = new Discord.MessageEmbed()
        .setTitle("Product list")
        .setColor([255, 255, 0])
        .setDescription(productList)
        .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")

        .setTimestamp()

    for (var index in prods) {
        productList = productList + index + ", "
        console.log(prods[index])
        embed.addFields({ name: prods[index][0].title + " ("+index+")",
        value: prods[index][1].price + " USD"})
    }

    message.channel.send(embed)

    message.delete()
}