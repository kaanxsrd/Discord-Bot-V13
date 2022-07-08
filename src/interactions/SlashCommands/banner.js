const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require('axios');
const client = global.bot;

module.exports = {

  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Kullanıcının yada sizin avatarınızı gönderir.")
    .addStringOption((option) => 
    
    option
    .setName("kişi")
    .setDescription("Avatarına bakmak istediğiniz üyeyi belirtiniz.")

    ),
  async execute(interaction, client) {

    const member = interaction.options.getString('kişi') || interaction.member;

    const fetchUser = await client.users.fetch(member);
		await fetchUser.fetch(); // to get user banner you need to fetch user before getting banner

    async function bannerXd(user, client) {
        const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
        if(!response.data.banner) return `https://pbs.twimg.com/media/EeLHC3eX0AEcI3T.png`
        if(response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
        else return(`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
      
    }

      let banner = await bannerXd(fetchUser.id, client)

        interaction.reply({ content: `${banner}`})
  },
};