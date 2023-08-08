const { Double } = require("mongodb")
const mongoose = require("mongoose")

module.exports = mongoose.model("purchase", new mongoose.Schema({
    monthYear: { type: String },
    timestamp: { type: Date, default: Date.now() },
    productIndex: { type: String },
    productName: { type: String },
    productPriceUSD: { type: Number },
    customerName: { type: String },
    customerID: { type: String },
    notes: { type: String },
}))