import {
  Client, ClientEvents, CommandInteraction, SlashCommandBuilder
} from 'discord.js';

// export interface Command {
//   name: string;
//   description: string;
//   aliases?: string[];
//   permissions?: string[];
//   cooldown?: number;
//   // eslint-disable-next-line no-unused-vars
//   execute(...args: any): any;
// }

export interface Command {
  data: SlashCommandBuilder;
  // eslint-disable-next-line no-unused-vars
  execute(client: Client, interaction: CommandInteraction): Promise<void>;
}

export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  // eslint-disable-next-line no-unused-vars
  execute(client: Client, ...args: any): any;
}
