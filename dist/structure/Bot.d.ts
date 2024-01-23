import { Client, Collection } from 'discord.js';

export default class Bot {
  readonly client: Client;
  commands: Collection<string, any>;
  private commandsArray;
  constructor(client: Client);
  private importEvents;
  private importSlashCommands;
  private registerCommands;
}
//# sourceMappingURL=Bot.d.ts.map
