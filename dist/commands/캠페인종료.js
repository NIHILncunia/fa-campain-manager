Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('캠페인종료')
    .setDescription('캠페인의 종료를 선언합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
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
    const updateCampain = await prisma_1.campain.update({
      where: {
        id: findCampain.id,
      },
      data: {
        status: 'CLOSE',
      },
    });
    const sessions = await prisma_1.session.findMany({
      where: {
        campain_id: findCampain.id,
      },
    });
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '캠페인 종료',
          value: `[${updateCampain.name}] 캠페인이`
                    + `**${sessions.length}**번의 세션을 진행하고 종료되었습니다.`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=%EC%BA%A0%ED%8E%98%EC%9D%B8%EC%A2%85%EB%A3%8C.js.map
