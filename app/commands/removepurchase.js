const Discord = require('discord.js')

exports.run = async (client, message, [id]) => {

    await client.database.removePurchase(id)

    message.delete()
}