import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, session } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('캠페인조회')
    .setDescription('선택한 캠페인의 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인의 이름을 입력하세요.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
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

    const sessions = await session.findMany({
      where: {
        campain_id: findCampain.id,
      },
    });

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '이름',
          value: findCampain.name,
        },
        {
          name: '상태',
          value: findCampain.status === 'OPEN' ? '진행중' : '종료',
        },
        {
          name: '진행된 세션 수',
          value: sessions.length.toString(),
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
