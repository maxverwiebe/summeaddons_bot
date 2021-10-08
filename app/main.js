const { Console } = require('console');
const { Client, Intents, Collection } = require('discord.js');
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INVITES] });

const config = require('./config.json')
client.config = config
const products = require('./products.json')
client.products = products
client.commands = new Collection()
var invites = {}
client.invites = {}

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