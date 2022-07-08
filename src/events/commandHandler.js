const { MessageEmbed } = require("discord.js");
const client = global.bot;
let sended = false;
const settings = require("../configs/settings.json")
setInterval(() => {
  client.cooldown.forEach((x, index) => {
    if (Date.now() - x.lastUsage > x.cooldown) client.cooldown.delete(index);
  });
}, 8000);

module.exports = async (message) => {
  let prefix = settings.prefix.find((x) => message.content.toLowerCase().startsWith(x));
  if (message.author.bot || !message.guild || !prefix) return;
  let args = message.content.substring(prefix.length).trim().split(" ");
  let commandName = args[0].toLowerCase();

  const embed = new MessageEmbed().setFooter({ text: "Lethh ❤️ Pussy Jaylen" }).setColor("#2f3136").setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true })});

  args = args.splice(1);
  let cmd = client.commands.has(commandName) ? client.commands.get(commandName) : client.commands.get(client.aliases.get(commandName));
  let komutLog = client.channels.cache.find(x => x.name == "Komut-Log");

  if (cmd) {
    if (cmd.conf.owner && !settings.owners.includes(message.author.id)) return;
    const cooldown = cmd.conf.cooldown || 3000;
    const cd = client.cooldown.get(message.author.id);
    if (cd) {
      const diff = Date.now() - cd.lastUsage;
      if (diff < cooldown)
        if (!sended) {
          sended = true;
          return message.channel.send({ content:`${message.author}, Bu komutu tekrar kullanabilmek için **${Number(((cooldown - diff) / 1000).toFixed(2))}** daha beklemelisin!`}).then((x) => x.delete({ timeout: (cooldown - diff) }));
        }
    } else client.cooldown.set(message.author.id, { cooldown, lastUsage: Date.now() });
    cmd.run(client, message, args, embed, prefix);
    const Lethh = new MessageEmbed()
    .setColor("#2f3136")
    .setTimestamp()
    .setFooter({ text: `Kullanma Zamanı :`})
    .setDescription(`
    ${message.author} tarafından ${message.channel} kanalında \`${prefix}${commandName}\` komutu kullanıldı.
                        
    \`•\` Komut Kanalı: ${message.channel} - (\`${message.channel.id}\`)
    \`•\` Komut Sahibi: ${message.author} - (\`${message.author.id}\`)
    \`•\` Komut İçeriği: \`\`\`${message.content}\`\`\`
    `)
    if(komutLog) komutLog.wsend({ embeds: [Lethh]})
  }
};

module.exports.conf = {
  name: "messageCreate",
};
