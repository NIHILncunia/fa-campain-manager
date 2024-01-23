Object.defineProperty(exports, '__esModule', { value: true, });
const index_1 = require('../index');

const event = {
  name: 'interactionCreate',
  once: false,
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;
    index_1.bot.commands
      .get(interaction.commandName)?.execute(client, interaction);
  },
};
exports.default = event;
//# sourceMappingURL=interactionCreate.js.map
