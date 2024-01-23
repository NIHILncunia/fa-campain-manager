import {
  Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder
} from 'discord.js';
import { Player } from '@prisma/client';
import { Command } from '@/types/command';
import { campain, player, session } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('경험치정산')
    .setDescription('세션의 경험치를 정산합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
    ))
    .addNumberOption((option) => (
      option
        .setName('경험치')
        .setDescription('세션의 경험치를 입력하세요.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const sessionNumber = interaction
      .options.get('번호').value as number;
    const sessionExp = interaction
      .options.get('경험치').value as number;

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
        id: findSession.id,
      },
      data: {
        exp: sessionExp,
      },
    });

    const pcList: Player[] = [];

    // 이런식으로 돌려봤는데 pcList에 값이 없음.
    for (const pc of findSession.pc.split(',')) {
      // eslint-disable-next-line no-await-in-loop
      await player.findFirst({
        where: {
          campain_id: findCampain.id,
          name: pc,
        },
      }).then((result) => {
        pcList.push(result);
      });
    }

    const topLevel = pcList
      .sort((a: Player, b: Player) => {
        const aLevel = a.level;
        const bLevel = b.level;

        return bLevel - aLevel;
      }).at(0).level;

    const normalExp = sessionExp;
    const low1BonusExp = sessionExp + Math.floor(sessionExp * 0.5);
    const low2BonusExp = sessionExp * 2;
    const low3BonusExp = sessionExp + Math.floor(sessionExp * 1.5);

    const masterBonusExp = sessionExp + (sessionExp * 1.5);
    let gmPCGainExp: number;

    const gmPC = await player.findFirst({
      where: {
        campain_id: findCampain.id,
        name: findSession.bonus_pc,
      },
    });

    if (topLevel === gmPC.level) {
      gmPCGainExp = masterBonusExp;
    } else if (topLevel - 1 === gmPC.level) {
      gmPCGainExp = masterBonusExp > low1BonusExp ? masterBonusExp : low1BonusExp;
    } else if (topLevel - 2 === gmPC.level) {
      gmPCGainExp = masterBonusExp > low2BonusExp ? masterBonusExp : low2BonusExp;
    } else {
      gmPCGainExp = masterBonusExp > low3BonusExp ? masterBonusExp : low3BonusExp;
    }

    if (gmPC.name === '리르갈') {
      gmPCGainExp = normalExp;
    }

    const updateGmPC = await player.update({
      where: {
        id: gmPC.id,
      },
      data: {
        exp: (gmPC.exp + gmPCGainExp) >= 100
          ? (gmPC.exp + gmPCGainExp) - 100
          : gmPC.exp + gmPCGainExp,
        level: (gmPC.exp + gmPCGainExp) >= 100
          ? gmPC.level + 1
          : gmPC.level,
      },
    });

    const updatePCList: Player[] = [];

    for (const pc of pcList) {
      let newExp: number;
      let newLevel: number;

      if (topLevel === pc.level) {
        newExp = (pc.exp + normalExp) >= 100
          ? (pc.exp + normalExp) - 100
          : pc.exp + normalExp;
        newLevel = (pc.exp + normalExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else if (topLevel - 1 === pc.level) {
        newExp = (pc.exp + low1BonusExp) >= 100
          ? (pc.exp + low1BonusExp) - 100
          : pc.exp + low1BonusExp;
        newLevel = (pc.exp + low1BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else if (topLevel - 2 === pc.level) {
        newExp = (pc.exp + low2BonusExp) >= 100
          ? (pc.exp + low2BonusExp) - 100
          : pc.exp + low2BonusExp;
        newLevel = (pc.exp + low2BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      } else {
        newExp = (pc.exp + low3BonusExp) >= 100
          ? (pc.exp + low3BonusExp) - 100
          : pc.exp + low3BonusExp;
        newLevel = (pc.exp + low3BonusExp) >= 100
          ? pc.level + 1
          : pc.level;
      }

      // eslint-disable-next-line no-await-in-loop
      const updatePC = await player.update({
        where: {
          campain_id: pc.campain_id,
          id: pc.id,
        },
        data: {
          exp: newExp,
          level: newLevel,
        },
      });

      updatePCList.push(updatePC);
    }

    updatePCList.push(updateGmPC);

    const embed = new EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '세션 경험치',
          value: `${sessionExp}%`,
        },
        {
          name: 'PC 경험치 현황',
          value: updatePCList.map((pc) => (
            `[${pc.name}] 레벨 ${pc.level} (${pc.exp}%)\n`
          )).join(''),
        },
      ]);

    interaction.reply({
      embeds: [ embed, ],
    });
  },
};

export default command;
