Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const prisma_1 = require('../utils/prisma');

const command = {
  // @ts-ignore
  data: new discord_js_1.SlashCommandBuilder()
    .setName('pc수정')
    .setDescription('선택한 PC를 수정합니다.')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (option
      .setName('캠페인명')
      .setDescription('캠페인 이름을 입력하세요.')
      .setRequired(true)))
    .addStringOption((option) => (option
      .setName('이름')
      .setDescription('PC 이름을 입력하세요.')
      .setRequired(true)))
    .addNumberOption((option) => (option
      .setName('레벨')
      .setDescription('변경할 레벨을 입력하세요.')))
    .addNumberOption((option) => (option
      .setName('경험치')
      .setDescription('변경할 경험치를 입력하세요.')))
    .addNumberOption((option) => (option
      .setName('안식일토큰')
      .setDescription('변경할 수량을 입력하세요.'))),
  async execute(_client, interaction) {
    const campainName = interaction
      .options.get('캠페인명').value;
    const pcName = interaction
      .options.get('이름').value;
    let level;
    let exp;
    let token;
    if (interaction.options.get('레벨')) {
      level = interaction.options.get('레벨').value;
    }
    if (interaction.options.get('경험치')) {
      exp = interaction.options.get('경험치').value;
    }
    if (interaction.options.get('안식일토큰')) {
      token = interaction.options.get('안식일토큰').value;
    }
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
    const updatePC = await prisma_1.player.update({
      where: {
        id: findPC.id,
      },
      data: {
        level,
        exp,
        play_token: token,
      },
    });
    console.log(level);
    console.log(exp);
    console.log(token);
    const levelString = level ? `[${updatePC.name}] [레벨 ${updatePC.level}](으)로 변경\n` : '';
    const expString = exp ? `[${updatePC.name}] [경험치 ${updatePC.exp}%]로 변경\n` : '';
    const tokenString = token !== undefined ? `[${updatePC.name}] [안식일 토큰 ${updatePC.play_token}개]로 변경` : '';
    const embed = new discord_js_1.EmbedBuilder()
      .setColor('Red')
      .setFields([
        {
          name: '수정완료',
          value: `${levelString}${expString}${tokenString}`,
        },
      ]);
    interaction.reply({
      embeds: [ embed, ],
    });
  },
};
exports.default = command;
//# sourceMappingURL=pc%EC%88%98%EC%A0%95.js.map
