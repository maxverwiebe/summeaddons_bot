const Discord = require("discord.js")
const config = require("./../config.json")
const purchase = require("./schema/purchase")

const mongoose = require("mongoose")

purchaseSchema = require("./schema/purchase.js")

module.exports.createPurchase = async function(data){
    let purchaseDB = new purchaseSchema({
        monthYear: data.monthYear,
        timestamp: data.timestamp,
        productIndex: data.productIndex,
        productName: data.productName,
        productPriceUSD: data.productPriceUSD,
        customerName: data.customerName,
        customerID: data.customerID,
        notes: data.notes,
    })

    await purchaseDB.save(function(err, data){
        return data
    })

    return purchaseDB
}

module.exports.getPurchase = async function(id) {
    let result = await purchaseSchema.findOne({ _id: id })
    return result
}

module.exports.removePurchase = async function(id) {
    let result = await purchaseSchema.deleteOne({ _id: id })
    return result
}

module.exports.getFromMonth = async function(monthYearString) {
    const condition = {"monthYear": monthYearString}

    let result = await purchaseSchema.find(condition)
    return result
}