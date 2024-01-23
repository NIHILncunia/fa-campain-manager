Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('세션참여')
    .setDescription('세션에 참여할 PC들을 등록합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('캠페인 이름을 입력하세요.')
      .setRequired(true)))
    .addNumberOption((option) => (option
      .setName('번호')
      .setDescription('세션번호를 입력하세요.')
      .setRequired(true)))
    .addStringOption((option) => (option
      .setName('목록')
      .setDescription('참여할 PC들을 쉼표로 구분해서 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const sessionNumber = interaction
      .options.get('번호').value;
    const PCList = interaction
      .options.get('목록').value;
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
        number: sessionNumber,
      },
      data: {
        pc: PCList,
      },
    });
    const pcArray = PCList.split(',');
    const players = await prisma_1.player.findMany();
    const sessionPCList = [];
    for (const pc of players) {
      if (pcArray.includes(pc.name)) {
        const playToken = pc.play_token;
        let afterToken;
        if (playToken !== 0 && playToken > 1) {
          afterToken = playToken - 2;
        } else if (playToken === 1) {
          afterToken = 0;
        } else {
          afterToken = 0;
        }
        // eslint-disable-next-line no-await-in-loop
        const updatePC = await prisma_1.player.update({
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
        await prisma_1.player.update({
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
    const embed = new discord_js_1.EmbedBuilder()
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
exports.default = command;
//# sourceMappingURL=%EC%84%B8%EC%85%98%EC%B0%B8%EC%97%AC.js.map
