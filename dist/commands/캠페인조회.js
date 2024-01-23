Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('캠페인조회')
    .setDescription('선택한 캠페인의 정보를 조회합니다.')
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('캠페인의 이름을 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
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
            value: `**존재하지 않는 캠페인입니다. 이름을 다시 확인해주세요.**`,
          },
        ]);
      interaction.reply({
        embeds: [ embed, ],
      });
      return;
    }
    const sessions = await prisma_1.session.findMany({
      where: {
        campain_id: findCampain.id,
      },
    });
    const embed = new discord_js_1.EmbedBuilder()
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
exports.default = command;
//# sourceMappingURL=%EC%BA%A0%ED%8E%98%EC%9D%B8%EC%A1%B0%ED%9A%8C.js.map
