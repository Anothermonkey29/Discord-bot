//Require
const fs = require('fs')
const Discord = require("discord.js")
const config = require('./config.json')
//

//Discord
const client = new Discord.Client()
client.commands = new Discord.Collection()
//

//Commands settings
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}
//

const inspiringEmbedColors = ["#ff0000", "#ffa500", "#ffff00", "#008000", "#0000ff", "#4b0082", "#ee82ee"]
const sadWords = ["sad", "depressed", "unhappy", "angry"]
const encouragements = ["Cheer up!", "Hang in there", "You are a great person!"]

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
    })
    .then(data => {

      const inspiringEmbedColor = inspiringEmbedColors[Math.floor(Math.random()*inspiringEmbedColors.length)]

      return inspiringEmbed = new Discord.MessageEmbed()
      .setColor(inspiringEmbedColor)
      .setTitle(data[0]["a"])
      .setURL(config.rickRoll)
      .setDescription(data[0]["q"])
      .setThumbnail(config.quoteImage)
      .setTimestamp();
    })
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

	const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase()
  console.log(args)
  console.log(commandName)

	if (!client.commands.has(commandName)) {
    msg.channel.send("Cette commande n'existe pas")
    return
  }

  const command = client.commands.get(commandName)

	try {
		command.execute(msg, args)
	} catch (error) {
		console.error(error);
		msg.channel.send('<@370972148581400597> Qu\'est-ce que tu fais ?!?!? Ton code est encore plein de bug, VA LE RÉPARER!');
	}
})

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content === "$inspire") {
    getQuote().then(quote => msg.channel.send(quote))
  }

  if (sadWords.some(word => msg.content.includes(word))) {
    const encouragement = encouragements[Math.floor(Math.random()*encouragements.length)]
    msg.reply(encouragement)
  }


})

client.login(config.token)