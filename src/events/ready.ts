import { Client } from 'discord.js';
import { Event } from '@/types/command';

const event: Event = {
  name: 'ready',
  once: true,
  execute(client: Client) {
    console.log(`봇 [ ${client.user.tag} ] 가 성공적으로 로그인 되었습니다.`);
  },
};

export default event;
