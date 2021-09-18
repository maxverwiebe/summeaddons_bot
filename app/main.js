const { Client, Intents, Collection } = require('discord.js');
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const config = require('./config.json');
client.config = config;
const products = require('./products.json');
client.products = products
client.commands = new Collection();

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('( ͠❛ ͜ʖ ͡❛)');
});

async function init() {
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
	
	client.login(config.token);
}

init()