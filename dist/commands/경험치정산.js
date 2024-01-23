Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('경험치정산')
    .setDescription('세션의 경험치를 정산합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('어떤 캠페인에 등록할지 입력하세요.')
      .setRequired(true)))
    .addNumberOption((option) => (option
      .setName('번호')
      .setDescription('세션 번호를 입력하세요.')
      .setRequired(true)))
    .addNumberOption((option) => (option
      .setName('경험치')
      .setDescription('세션의 경험치를 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const sessionNumber = interaction
      .options.get('번호').value;
    const sessionExp = interaction
      .options.get('경험치').value;
    const findCampain = await prisma_1.campain.findFirst({
      where: {
        name: campainName,
      },
    });
    if (!findCampain) {
      const embed = new discord_js_1.EmbedBuilder()
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
    const findSession = await prisma_1.session.findFirst({
      where: {
        campain_id: findCampain.id,
        number: sessionNumber,
      },
    });
    if (!findSession) {
      const embed = new discord_js_1.EmbedBuilder()
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
    await prisma_1.session.update({
      where: {
        id: findSession.id,
      },
      data: {
        exp: sessionExp,
      },
    });
    const pcList = [];
    // 이런식으로 돌려봤는데 pcList에 값이 없음.
    for (const pc of findSession.pc.split(',')) {
      // eslint-disable-next-line no-await-in-loop
      await prisma_1.player.findFirst({
        where: {
          campain_id: findCampain.id,
          name: pc,
        },
      }).then((result) => {
        pcList.push(result);
      });
    }
    const topLevel = pcList
      .sort((a, b) => {
        const aLevel = a.level;
        const bLevel = b.level;
        return bLevel - aLevel;
      }).at(0).level;
    const normalExp = sessionExp;
    const low1BonusExp = sessionExp + Math.floor(sessionExp * 0.5);
    const low2BonusExp = sessionExp * 2;
    const low3BonusExp = sessionExp + Math.floor(sessionExp * 1.5);
    const masterBonusExp = sessionExp + (sessionExp * 1.5);
    let gmPCGainExp;
    const gmPC = await prisma_1.player.findFirst({
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
    const updateGmPC = await prisma_1.player.update({
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
    const updatePCList = [];
    for (const pc of pcList) {
      let newExp;
      let newLevel;
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
      const updatePC = await prisma_1.player.update({
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
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '세션 경험치',
          value: `${sessionExp}%`,
        },
        {
          name: 'PC 경험치 현황',
          value: updatePCList.map((pc) => (`[${pc.name}] 레벨 ${pc.level} (${pc.exp}%)\n`)).join(''),
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=%EA%B2%BD%ED%97%98%EC%B9%98%EC%A0%95%EC%82%B0.js.map
