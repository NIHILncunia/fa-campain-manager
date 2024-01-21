import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, player } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('pc조회')
    .setDescription('선택한 PC에 대한 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('PC 이름을 입력하세요.')
        .setRequired(true)
    )),
  async execute(client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const pcName = interaction
      .options.get('이름').value as string;

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

    const findPC = await player.findFirst({
      where: {
        name: pcName,
      },
    });

    if (!findPC) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**PC가 없습니다. 이름을 확인해주세요.**`,
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
          name: '소속 캠페인',
          value: findCampain.name,
        },
        {
          name: '이름',
          value: findPC.name,
        },
        {
          name: '클래스',
          value: findPC.class,
        },
        {
          name: '레벨 (경험치)',
          value: `${findPC.level} (${findPC.exp}%)`,
        },
        {
          name: '세션 참여 횟수',
          value: `${findPC.play_count}회`,
        },
        {
          name: '안식일 토큰',
          value: `${findPC.play_token}개`,
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
