import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';

const command: Command = {
  data: new SlashCommandBuilder()
    .setName('핑')
    .setDescription('봇의 핑을 체크합니다.'),
  async execute(client: Client, interaction: CommandInteraction) {
    const embed = new EmbedBuilder()
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

export default command;
