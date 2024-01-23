import {
  Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder
} from 'discord.js';
import { Player } from '@prisma/client';
import { Command } from '@/types/command';
import { campain, player, session } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('세션참여')
    .setDescription('세션에 참여할 PC들을 등록합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addNumberOption((option) => (
      option
        .setName('번호')
        .setDescription('세션번호를 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('목록')
        .setDescription('참여할 PC들을 쉼표로 구분해서 입력하세요.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const sessionNumber = interaction
      .options.get('번호').value as number;
    const PCList = interaction
      .options.get('목록').value as string;

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
        campain_id: findCampain.id,
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

    await session.update({
      where: {
        number: sessionNumber,
      },
      data: {
        pc: PCList,
      },
    });

    const pcArray = PCList.split(',');
    const players = await player.findMany();

    const sessionPCList: Player[] = [];

    for (const pc of players) {
      if (pcArray.includes(pc.name)) {
        const playToken = pc.play_token;
        let afterToken: number;

        if (playToken !== 0 && playToken > 1) {
          afterToken = playToken - 2;
        } else if (playToken === 1) {
          afterToken = 0;
        } else {
          afterToken = 0;
        }

        // eslint-disable-next-line no-await-in-loop
        const updatePC = await player.update({
          where: {
            id: pc.id,
          },
          data: {
            play_token: afterToken,
            play_count: pc.play_count + 1,
          },
        });

        sessionPCList.push(updatePC);
      } else {
        const playToken = pc.play_token;

        // eslint-disable-next-line no-await-in-loop
        await player.update({
          where: {
            id: pc.id,
          },
          data: {
            play_token: playToken + 1,
          },
        });
      }
    }

    // pcArray.forEach(async (pc) => {
    //   await
    // });

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '참여확정',
          value: '**아래의 PC들이 세션에 참여하며 안식일 토큰 수량이 변동됩니다.**',
        },
        ...sessionPCList.map((pc) => ({
          name: pc.name,
          value: `현재 안식일 토큰 **[${pc.play_token}]개**`,
        })),
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
