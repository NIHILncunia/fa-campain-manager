Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');
const uuid_1 = require('../utils/uuid');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('캠페인등록')
    .setDescription('새로운 캠페인을 등록합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (option
      .setName('이름')
      .setDescription('캠페인의 이름을 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('이름').value;
    const findCampain = await prisma_1.campain.findFirst({
      where: {
        name: campainName,
      },
    });
    if (findCampain) {
      const embed = new discord_js_1.EmbedBuilder()
        .setColor('Red')
        .setFields([
          {
            name: '오류',
            value: `**같은 이름의 캠페인이 존재합니다. 다른 이름으로 등록하세요.**`,
          },
        ]);
      interaction.reply({
        embeds: [ embed, ],
      });
      return;
    }
    const newCampain = await prisma_1.campain.create({
      data: {
        id: (0, uuid_1.randomUUID)(),
        name: campainName,
      },
    });
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '등록 완료',
          value: `**[${newCampain.name}] 캠페인이 등록되었습니다.**`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=%EC%BA%A0%ED%8E%98%EC%9D%B8%EB%93%B1%EB%A1%9D.js.map
