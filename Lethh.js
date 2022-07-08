const { Client, Collection, User, } = require("discord.js");
const settings = require("./src/configs/settings.json");
const fs = require("fs");

const client = (global.bot = new Client({
    fetchAllMembers: true,
    intents: [ 32767 ],
  }));

client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
const discordModals = require('discord-modals');
discordModals(client);

fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`[LETHH] ${files.length} komut yüklenecek.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        console.log(`[LETHH KOMUT] ${props.conf.name} komutu yüklendi!`);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client.login(settings.token)
.then(() => console.log("Bot Başarıyla Bağlandı!"))
.catch(() => console.log("[HATA] Bot Bağlanamadı!"));

client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));


process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');  
client.slashcommands = new Collection();
var slashcommands = [];

fs.readdirSync('./src/interactions/').forEach(async category => {
      const commands = fs.readdirSync(`./src/interactions/${category}/`).filter(cmd => cmd.endsWith('.js'));
      for (const command of commands) {
      const Command = require(`./src/interactions/${category}/${command}`);
  client.slashcommands.set(Command.data.name, Command);
  slashcommands.push(Command.data.toJSON());
      }
  });

  const rest = new REST({ version: '9' }).setToken(settings.token);
(async () => {
  try {
      console.log('[LETHH] Slash ve Context Komutlar yükleniyor.');
      await rest.put(
          Routes.applicationGuildCommands(settings.BotClientID, settings.guildID),
          { body: slashcommands },
      ).then(() => {
          console.log('[LETHH] Slash ve Context Komutlar yüklendi.');
      });
  }
  catch (e) {
      console.error(e);
  }
})();

client.on('interactionCreate', (interaction) => {
if (interaction.isContextMenu() || interaction.isCommand()) {
  const command = client.slashcommands.get(interaction.commandName);
  if (interaction.user.bot) return;
  if (!interaction.inGuild() && interaction.isCommand()) return interaction.editReply({ content: 'Komutları kullanmak için bir sunucuda olmanız gerekir.' });
  if (!command) return interaction.reply({ content: 'Bu komut kullanılamıyor.', ephemeral: true }) && client.slashcommands.delete(interaction.commandName);
  try {
    command.execute(interaction, client);
  }
  catch (e) {
    console.log(e);
    return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
  }
}
});
