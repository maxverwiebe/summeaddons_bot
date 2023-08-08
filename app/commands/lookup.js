const Discord = require('discord.js')

exports.run = async (client, message, [id]) => {

    const data = await client.database.getPurchase(id)

    if (!data)
        return message.reply("Not found");

    const timestamp = data.timestamp
    var date = new Date(timestamp);

    const time = date.getDate() +
        "/" + (date.getMonth() + 1) +
        "/" + date.getFullYear() +
        " " + date.getHours() +
        ":" + date.getMinutes() +
        ":" + date.getSeconds()

    const embed = new Discord.MessageEmbed()
        .setTitle("Archive: " + id)
        .setColor([0, 255, 100])
        .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")

        .setTimestamp()

        .addFields({
            name: "Product Name",
            value: data.productName
        })

        .addFields({
            name: "Product Price",
            value: data.productPriceUSD + " USD"
        })

        .addFields({
            name: "Customer Name",
            value: data.customerName
        })

        .addFields({
            name: "Customer ID",
            value: data.customerID
        })

        .addFields({
            name: "Purchase ID",
            value: id
        })

        .addFields({
            name: "Timestamp",
            value: time + " UTC + 2"
        })

    if (data.notes) {
        embed.addFields({
            name: "Notes",
            value: data.notes
        })
    }

    message.channel.send(embed);

    message.delete()
}