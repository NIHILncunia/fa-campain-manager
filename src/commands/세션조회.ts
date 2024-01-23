import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, session } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('세션조회')
    .setDescription('지정한 세션 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('어떤 캠페인에 등록할지 입력하세요.')
        .setRequired(true)
    ))
    .addNumberOption((option) => (
      option
        .setName('번호')
        .setDescription('세션 번호를 입력하세요.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const sessionNumber = interaction
      .options.get('번호').value as number;

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
            value: `**캠페인이 없습니다. 캠페인을 확인해주세요.**`,
          },
        ]);

      interaction.reply({
        embeds: [ embed, ],
      });

      return;
    }

    const findSession = await session.findFirst({
      where: {
        number: sessionNumber,
      },
    });

    if (!findSession) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**세션을 찾을 수 없습니다.**`,
          },
        ]);

      interaction.reply({
        embeds: [ embed, ],
      });

      return;
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: `[${findSession.number.toString().padStart(3, '0')} - ${findSession.name}]`,
          value: `- 마스터 [${findSession.gm}]\n- 참여 PC [${findSession.pc}]\n- 세션 경험치 [${findSession.exp}%]`,
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
