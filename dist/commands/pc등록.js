Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');
const uuid_1 = require('../utils/uuid');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('pc등록')
    .setDescription('새로운 PC를 등록합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('캠페인 이름을 입력하세요.')
      .setRequired(true)))
    .addStringOption((option) => (option
      .setName('이름')
      .setDescription('PC 이름을 입력하세요. 풀네임이 아닌 자주 부를 이름만 입력합니다.')
      .setRequired(true)))
    .addStringOption((option) => (option
      .setName('클래스')
      .setDescription('PC의 클래스를 입력하세요.')
      .setRequired(true)))
    .addNumberOption((option) => (option
      .setName('레벨')
      .setDescription('시작 레벨을 입력하세요.')
      .setRequired(true))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const pcName = interaction
      .options.get('이름').value;
    const pcClass = interaction
      .options.get('클래스').value;
    const level = interaction
      .options.get('레벨').value;
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
    const newPC = await prisma_1.player.create({
      data: {
        id: (0, uuid_1.randomUUID)(),
        campain_id: findCampain.id,
        name: pcName,
        level,
        class: pcClass,
      },
    });
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '등록완료',
          value: `**[${newPC.name}] PC가 등록되었습니다.**`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=pc%EB%93%B1%EB%A1%9D.js.map
