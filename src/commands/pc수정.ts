import {
  Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain, player } from '@/utils/prisma';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('pc수정')
    .setDescription('선택한 PC를 수정합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (
      option
        .setName('캠페인명')
        .setDescription('캠페인 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('PC 이름을 입력하세요.')
        .setRequired(true)
    ))
    .addNumberOption((option) => (
      option
        .setName('레벨')
        .setDescription('변경할 레벨을 입력하세요.')
    ))
    .addNumberOption((option) => (
      option
        .setName('경험치')
        .setDescription('변경할 경험치를 입력하세요.')
    ))
    .addNumberOption((option) => (
      option
        .setName('안식일토큰')
        .setDescription('변경할 수량을 입력하세요.')
    )),
  async execute(_client: Client, interaction: CommandInteraction) {
    const campainName = interaction
      .options.get('캠페인명').value as string;
    const pcName = interaction
      .options.get('이름').value as string;

    let level: number;
    let exp: number;
    let token: number;

    if (interaction.options.get('레벨')) {
      level = interaction.options.get('레벨').value as number;
    }

    if (interaction.options.get('경험치')) {
      exp = interaction.options.get('경험치').value as number;
    }

    if (interaction.options.get('안식일토큰')) {
      token = interaction.options.get('안식일토큰').value as number;
    }

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

    const findPC = await player.findFirst({
      where: {
        name: pcName,
      },
    });

    if (!findPC) {
      const embed = new EmbedBuilder()
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

    const updatePC = await player.update({
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

    const embed = new EmbedBuilder()
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

export default command;
