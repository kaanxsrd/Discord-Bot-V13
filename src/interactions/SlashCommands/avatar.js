const { SlashCommandBuilder } = require("@discordjs/builders");
const client = global.bot;

module.exports = {

  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Kullanıcının yada sizin avatarınızı gönderir.")
    .addStringOption((option) => 
    
    option
    .setName("kişi")
    .setDescription("Avatarına bakmak istediğiniz üyeyi belirtiniz.")

    ),
  async execute(interaction, client) {

    const member = interaction.options.getString('kişi') || interaction.member;

    const fetchUser = await client.users.fetch(member);
		await fetchUser.fetch();

   interaction.reply({ content: `${fetchUser.displayAvatarURL({ dynamic: true, size: 4096 })}` });
  },
};