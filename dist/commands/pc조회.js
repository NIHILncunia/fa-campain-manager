Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');
const pcFullName_1 = require('../utils/pcFullName');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('pc조회')
    .setDescription('선택한 PC에 대한 정보를 조회합니다.')
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('캠페인 이름을 입력하세요.')
      .setRequired(true)))
    .addStringOption((option) => (option
      .setName('이름')
      .setDescription('PC 이름을 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const pcName = interaction
      .options.get('이름').value;
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
    const findPC = await prisma_1.player.findFirst({
      where: {
        name: pcName,
      },
    });
    if (!findPC) {
      const embed = new discord_js_1.EmbedBuilder()
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
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: pcFullName_1.pcFullName[findPC.name],
          value: `- 소속 캠페인 [${findCampain.name}]\n- 클래스 ${findPC.class} ${findPC.level} (${findPC.exp}%)\n- 세션 참여 횟수 ${findPC.play_count}회\n- 안식일 토큰 ${findPC.play_token}개`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=pc%EC%A1%B0%ED%9A%8C.js.map
