const Discord = require('discord.js');
const moneyconverter = require("../moneyconverter.js")

exports.run = async (client, message, [monthYearString]) => { // 1-2021
    if (!monthYearString) {
        let timeNow = new Date(Date.now())
        monthYearString = (timeNow.getMonth() + 1).toString() + "-" + timeNow.getFullYear().toString()
    }

    let result = await client.database.getFromMonth(monthYearString)

    var amount = 0

    result.forEach(data => {
        amount = data.productPriceUSD + amount
    })

    amount.toFixed(2)

    const embed = new Discord.MessageEmbed()
    .setTitle("Earnings: " + monthYearString)
    .setColor([255, 80, 80])
    .setFooter("Summe Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
    .setDescription(amount + " USD or rather " + moneyconverter.convertToEUR(amount) + " EUR")
    .setTimestamp()

    .addFields({
        name: "Purchases",
        value: result.length
    })

    console.log(result)

    message.channel.send(embed)
}