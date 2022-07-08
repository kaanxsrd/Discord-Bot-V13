const { Modal, TextInputComponent, showModal } = require('discord-modals')
const { SlashCommandBuilder } = require("@discordjs/builders");
const Config = require('../../configs/settings.json');
const client = global.bot;
    module.exports = {
      data: new SlashCommandBuilder()
      .setName("eval")
      .setDescription("eval"),

      async execute(interaction, client) {

        if(!Config.owners.includes(interaction.user.id)) {
            return interaction.reply({ content: ":x: Bot developerı olmadığın için kullanamazsın.", ephemeral: true })
        } else {
      const modal = new Modal()
      .setCustomId('evalkode') 
      .setTitle('EVAL CODE')
      .addComponents(
        new TextInputComponent()
        .setCustomId('evalcode')
        .setLabel('Eval Kodunuz')
        .setStyle('LONG')
        .setMaxLength(4000)
        .setPlaceholder('') 
        .setRequired(true)
      );
      showModal(modal, { client, interaction });

    }
  }
}

client.on('modalSubmit', async (modal) => {

    const evalcode = modal.getTextInputValue('evalcode');
  
    try {
    var result = clean(await eval(evalcode));
    if (result.includes(client.token))
    return modal.reply({  content: "Tokeni yarramın başını yersen alırsın orospu evladı"});
    modal.reply({ content: `\`\`\`js\n${result}\n\`\`\``});
    } catch (e) {
      return modal.reply({ content: `\`\`\`js\n${e}\n\`\`\`` });
    }
  
  },
  );
  
  function clean(text) {
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 0 });
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
    return text;
  }
