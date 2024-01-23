Object.defineProperty(exports, '__esModule', { value: true, });
exports.bot = void 0;
const tslib_1 = require('tslib');
const discord_js_1 = require('discord.js');
const dotenv_1 = require('dotenv');
const Bot_1 = tslib_1.__importDefault(require('./structure/Bot'));

(0, dotenv_1.config)();
exports.bot = new Bot_1.default(new discord_js_1.Client({
  intents: [
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.MessageContent,
    discord_js_1.GatewayIntentBits.GuildMembers,
    discord_js_1.GatewayIntentBits.GuildMessageReactions,
    discord_js_1.GatewayIntentBits.DirectMessages,
  ],
}));
//# sourceMappingURL=index.js.map
