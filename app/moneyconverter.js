const Discord = require('discord.js');

const EURtoUSD = 1.14

exports.convertToUSD = function(moneyAmount) {
    return parseFloat((moneyAmount * EURtoUSD).toFixed(2))
}

exports.convertToEUR = function(moneyAmount) {
    return parseFloat((moneyAmount / EURtoUSD).toFixed(2))
}