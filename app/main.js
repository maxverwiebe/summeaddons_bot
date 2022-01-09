const { Client, Intents, Collection } = require('discord.js');
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INVITES] });

const mongoose = require("mongoose")

const config = require('./config.json')
client.config = config
const products = require('./products.json')
client.products = products
client.commands = new Collection()
var invites = {}
client.invites = {}
client.database = require('./database/mongoose.js')

const moneyconverter = require("./moneyconverter.js")

const wait = require('util').promisify(setTimeout)

client.once('ready', async () => {
	console.log('Ready!');
	client.user.setActivity('( ͠❛ ͜ʖ ͡❛)');

	client.guilds.cache.forEach(g => {
		g.fetchInvites().then(guildInvites => {
			invites[g.id] = guildInvites;
		});
	});

	await wait(1000)

	client.invites = invites
});

async function init() {

	mongoose.connect(client.config.mongodb, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(()=>{
		console.log("Connected to the database!")
	}).catch((err) =>{
		console.log(err)
	})

	const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		const eventName = file.split(".")[0];
		console.log(`Loading... ${eventName}`)
		client.on(eventName, event.bind(null, client));
    }

	const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		const commandName = file.split(".")[0];
		console.log(`Loading... ${commandName}`)
		client.commands.set(commandName, command);
    }
	
	await client.login(config.token);

	//await syncJSONToMongo()
}

async function syncJSONToMongo() {
	fs.readdir("./purchases", (err, files) => {
		files.forEach(file => {
			if (!file.includes(".js"))
				return
			console.log(file)
			fs.readFile("./purchases/" + file, 'utf8', (err, data) => {
				if (!data)
                return 

				data = JSON.parse(data)

				console.log(data)
				var price = 0

				if (data.productPrice) {
					const splitted = data.productPrice.split(" ")
					const curCurrency = splitted[1]
					const curAmount = parseFloat(splitted[0])

					if (curCurrency.includes("USD")) {
						price = curAmount
					}

					if (curCurrency.includes("EUR")) {
						price = moneyconverter.convertToUSD(curAmount)
					}
				}

				data.productPriceUSD = price

				data.timestamp = new Date(data.timestamp)

				data.monthYear = (data.timestamp.getMonth() + 1).toString() + "-" + data.timestamp.getFullYear().toString(),

				client.database.createPurchase(data)
			})
		})
	})
}

init()