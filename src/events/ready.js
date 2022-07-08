const client = global.bot;
const settings = require("../configs/settings.json")
const {MessageEmbed} = require("discord.js")
module.exports = async () => {

let guild = client.guilds.cache.get(settings.guildID);
await guild.members.fetch();

  const { joinVoiceChannel } = require("@discordjs/voice");


    const VoiceChannel = client.channels.cache.get(settings.botSes);
    joinVoiceChannel({
        channelId: VoiceChannel.id,
        guildId: VoiceChannel.guild.id,
        adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
        selfDeaf: true
    });

  client.user.setActivity(settings.botDurum, {
    type: "STREAMING",
    url: "https://www.twitch.tv/kaanxsrd"});
};

module.exports.conf = {
  name: "ready",
};
