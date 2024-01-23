import {
  Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder
} from 'discord.js';
import { Player } from '@prisma/client';
import { Command } from '@/types/command';
import { campain, player } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('pc그룹조회')
    .setDescription('여러 PC의 정보를 조회합니다.')
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('조회목록')
        .setDescription('조회할 PC 이름들을 입력하세요. 쉼표로 구분합니다.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const pcNameList = interaction
      .options.get('조회목록').value as string;

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

    const pcList: Player[] = [];

    // 이런식으로 돌려봤는데 pcList에 값이 없음.
    for (const pc of pcNameList.split(',')) {
      // eslint-disable-next-line no-await-in-loop
      const findPC = await player.findFirst({
        where: {
          campain_id: findCampain.id,
          name: pc,
        },
      });

      pcList.push(findPC);
    }

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '조회완료',
          value: pcList.map((pc) => (
            `[${pc.name}] 레벨 ${pc.level} (${pc.exp}%)\n- 참여 횟수 ${pc.play_count}회 안식일 토큰 ${pc.play_token}개\n\n`
          )).join(''),
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
