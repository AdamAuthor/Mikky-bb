const Discord = require('discord.js')

require('dotenv').config()

const client = new Discord.Client({
    intents: ['GUILDS']
})

let bot = {
    client
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.slashcommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require('./handlers/slashcommands')(bot, reload)
client.loadSlashCommands(bot, false)

client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return
    if (!interaction.inGuild()) return interaction.reply('This command can be used in a server')

    const slashcmd = client.slashcommands.get(interaction.commandName)

    if (!slashcmd) return interaction.reply('Invalid slash command')

    if (slashcmd.permission && !interaction.member.permissions.has(slashcmd.permission)) {
        return interaction.reply('You don`t have permission for this command')
    }

    slashcmd.run(client, interaction)
})

client.login(process.env.TOKEN)