import {
  Client, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder
} from 'discord.js';
import { Command } from '@/types/command';
import { campain } from '@/utils/prisma';
import { randomUUID } from '@/utils/uuid';

const command: Command = {
  // @ts-ignore
  data: new SlashCommandBuilder()
    .setName('캠페인등록')
    .setDescription('새로운 캠페인을 등록합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => (
      option
        .setName('이름')
        .setDescription('캠페인의 이름을 입력하세요.')
        .setRequired(true)
    )),
  async execute(_client: Client, interaction: CommandInteraction): Promise<void> {
    const campainName = interaction
      .options.get('이름').value as string;

    const findCampain = await campain.findFirst({
      where: {
        name: campainName,
      },
    });

    if (findCampain) {
      const embed = new EmbedBuilder()
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

    const newCampain = await campain.create({
      data: {
        id: randomUUID(),
        name: campainName,
      },
    });

    const embed = new EmbedBuilder()
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

export default command;
