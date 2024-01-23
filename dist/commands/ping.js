Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');

const command = {
  data: new discord_js_1.SlashCommandBuilder()
    .setName('핑')
    .setDescription('봇의 핑을 체크합니다.'),
  async execute(client, interaction) {
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '핑',
          value: `**${client.ws.ping}ms**`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=ping.js.map
