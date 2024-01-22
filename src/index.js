"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
var discord_js_1 = require("discord.js");
var dotenv_1 = require("dotenv");
var Bot_1 = require("./structure/Bot");
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
