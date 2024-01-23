import {
  Client, ClientEvents, CommandInteraction, SlashCommandBuilder
} from 'discord.js';

export interface Command {
  data: SlashCommandBuilder;
  execute(client: Client, interaction: CommandInteraction): Promise<void>;
}
export interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute(client: Client, ...args: any): any;
}
//# sourceMappingURL=command.d.ts.map
