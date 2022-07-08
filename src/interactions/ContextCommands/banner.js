const { MessageEmbed } = require('discord.js');
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { ApplicationCommandType } = require('discord-api-types/v10');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Banner')
    .setType(ApplicationCommandType.User),
        
  async execute(interaction, client) {
      
        const user = client.users.cache.get(interaction.targetId);

        await interaction.reply({ content: `${user.bannerURL({ dynamic: true, size: 2048 })}` });
    }
};