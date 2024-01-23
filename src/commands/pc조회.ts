import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, player } from '@/utils/prisma';
import { pcFullName } from '@/utils/pcFullName';

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
  async execute(_client: Client, interaction: CommandInteraction) {
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
          name: pcFullName[findPC.name],
          value: `- 소속 캠페인 [${findCampain.name}]\n- 클래스 ${findPC.class} ${findPC.level} (${findPC.exp}%)\n- 세션 참여 횟수 ${findPC.play_count}회\n- 안식일 토큰 ${findPC.play_token}개`,
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
