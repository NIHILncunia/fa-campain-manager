import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, session } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('캠페인종료')
    .setDescription('캠페인의 종료를 선언합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인의 이름을 입력하세요.')
        .setRequired(true)
    )),
  async execute(client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;

    const findCampain = await campain.findFirst({
      where: {
        name: campainName,
      },
    });

    if (!findCampain) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**존재하지 않는 캠페인입니다. 이름을 다시 확인해주세요.**`,
          },
        ]);

      interaction.reply({
        embeds: [ embed, ],
      });

      return;
    }

    const updateCampain = await campain.update({
      where: {
        id: findCampain.id,
      },
      data: {
        status: 'CLOSE',
      },
    });

    const sessions = await session.findMany({
      where: {
        campain_id: findCampain.id,
      },
    });

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '캠페인 종료',
          value: `[${updateCampain.name}] 캠페인이`
            + `**${sessions.length}**번의 세션을 진행하고 종료되었습니다.`,

        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
