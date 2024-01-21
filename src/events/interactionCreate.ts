import { Client, CommandInteraction, Interaction } from 'discord.js';
import { bot } from '../index';
import { Event } from '@/types/command';

const event: Event = {
  name: 'interactionCreate',
  once: false,
  async execute(client: Client, interaction: Interaction) {
    if (!interaction.isCommand()) return;

    bot.commands
      .get(interaction.commandName)?.execute(client, interaction as CommandInteraction);
  },
};

export default event;
