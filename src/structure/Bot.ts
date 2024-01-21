import {
  Client, Collection, Events, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command, Event } from '@/types/command';

export default class Bot {
  public commands = new Collection<string, any>();
  private commandsArray: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  // eslint-disable-next-line no-unused-vars
  constructor(public readonly client: Client) {
    this.client.login(process.env.TOKEN);

    this.client.on(Events.Warn, (info) => console.log(info));
    this.client.on(Events.Error, console.error);

    this.importEvents();
    this.importSlashCommands();
    this.registerCommands();
  }

  private async importEvents() {
    const eventFiles = readdirSync(join(process.cwd(), 'src', 'events'))
      .filter((file) => !file.endsWith('.map'));

    for (const file of eventFiles) {
      const filePath = join(process.cwd(), 'src', 'events', file);
      // eslint-disable-next-line no-await-in-loop
      const event = await import(filePath);
      const currentEvent: Event = event.default;

      if (currentEvent.once) {
        this.client.once(currentEvent.name, (...args) => {
          currentEvent.execute(this.client, ...args);
        });
      } else {
        this.client.on(currentEvent.name, (...args) => {
          currentEvent.execute(this.client, ...args);
        });
      }
    }
  }

  private async importSlashCommands() {
    const commandFiles = readdirSync(join(process.cwd(), 'src', 'commands'))
      .filter((file) => !file.endsWith('.map'));

    for (const file of commandFiles) {
      const filePath = join(process.cwd(), 'src', 'commands', file);
      // eslint-disable-next-line no-await-in-loop
      const command = await import(filePath);
      const currentCommand: Command = command.default;

      this.commands.set(currentCommand.data.name, currentCommand);
      console.log(`명령어 [ ${currentCommand.data.name} ] 의 로딩이 완료되었습니다.`);

      this.commandsArray.push(currentCommand.data.toJSON());
    }
  }

  private async registerCommands() {
    setTimeout(() => {
      const rest = new REST({ version: '10', }).setToken(process.env.TOKEN);

      rest.put(
        Routes.applicationCommands(process.env.APPLICATION_ID),
        { body: this.commandsArray, }
      )
        .then(() => {
          console.log(`성공적으로 명령어를 불러왔습니다.`);
        })
        .catch(console.error);
    }, 3000);
  }
}
