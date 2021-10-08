const Discord = require('discord.js');
const fs = require('fs');
const logmanager = require("../eventlogging.js");

function SaveMoney(value, currency) {
    if (currency != "USD") {
        value = value * 1.19
    }

    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;

    const stamp = m + "-" + y

    console.log(stamp)

    fs.readFile("./earned/"+stamp+".txt", "utf8", (err, data) => {
        var money = 0
        if (data)
            money = parseInt(data)
            value = parseInt(value)

        money = money + value

        fs.writeFileSync("./earned/"+stamp+".txt", money.toString())
    })
}

exports.run = (client, message, [mention, product, priceOverride, currency, ...restArgs]) => {
    const target = message.mentions.members.first();
    const productObj = client.products[product]

    if (typeof productObj != 'object')
        return message.reply("Err1");

    if (message.mentions.members.size === 0)
        return message.reply("Err2");

    console.log(productObj)
    var price = productObj[1].price
    const title = productObj[0].title
    const roleID = productObj[2].roleid
    const timestamp = Date.now()
    var notes = restArgs.join(' ')

    if (priceOverride) {
        price = priceOverride + " " + currency
        SaveMoney(priceOverride, currency)
    }
    else {
        SaveMoney(price, "USD")
        price = price.toString() + " USD"
    }

    let productRole = message.guild.roles.cache.get(roleID);
    if (productRole) target.roles.add(productRole).catch(console.error);

    let costumerRole = message.guild.roles.cache.get(client.config.clientRole);
    if (costumerRole) target.roles.add(costumerRole).catch(console.error);

    var date = new Date(timestamp);

    const time = date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes()+
    ":"+date.getSeconds()

    fs.readdir("./purchases", (err, files) => {
        const purchaseID = files.length

        let data = {
            productIndex: product,
            productName: title,
            productPrice: price,
            customerName: target.user.username,
            customerID: target.user.id,
            timestamp: timestamp,
            notes: notes,
        };
        
        data = JSON.stringify(data);
        fs.writeFileSync('./purchases/' + purchaseID + '.json', data);

        const embed = new Discord.MessageEmbed()
        .setTitle("Purchase confirmation")
        //.setThumbnail(target.user.avatarURL())
        .setColor([0, 255, 0])
        .setDescription("Here are the details of your purchase.")
        .setFooter("Summe‘s Addons", "https://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064")
        .setAuthor(message.author.username, message.author.avatarURL())
        
        .setTimestamp()

        .addFields({ name: ":gem: Product",
            value: title + " | " + price})

        .addFields({ name: ":eyes: Customer",
            value: target.user.username + " | " + target.user.id})

        .addFields({ name: ":blue_book: Purchase ID",
            value: purchaseID + " | " + time})

        if (notes) {
            embed.addFields({ name: ":warning: Notes",
                value: notes})
        }

        target.send(embed)

        client.channels.fetch('856120045776011264')
        .then(channel => channel.send(embed))
    });

    logmanager.log(client, "Product purchased", title + " " + price, target.user)
    message.delete()
}