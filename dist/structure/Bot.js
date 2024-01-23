Object.defineProperty(exports, '__esModule', { value: true, });
const discord_js_1 = require('discord.js');
const fs_1 = require('fs');
const path_1 = require('path');

class Bot {
  // eslint-disable-next-line no-unused-vars
  constructor(client) {
    Object.defineProperty(this, 'client', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: client,
    });
    Object.defineProperty(this, 'commands', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new discord_js_1.Collection(),
    });
    Object.defineProperty(this, 'commandsArray', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: [],
    });
    this.client.login(process.env.TOKEN);
    this.client.on(discord_js_1.Events.Warn, (info) => console.log(info));
    this.client.on(discord_js_1.Events.Error, console.error);
    this.importEvents();
    this.importSlashCommands();
    this.registerCommands();
  }
  async importEvents() {
    const eventFiles = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), 'src', 'events'))
      .filter((file) => !file.endsWith('.map'));
    for (const file of eventFiles) {
      const filePath = (0, path_1.join)(process.cwd(), 'src', 'events', file);
      // eslint-disable-next-line no-await-in-loop
      const event = await Promise.resolve(`${filePath}`).then((s) => __importStar(require(s)));
      const currentEvent = event.default;
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
  async importSlashCommands() {
    const commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), 'src', 'commands'))
      .filter((file) => !file.endsWith('.map'));
    for (const file of commandFiles) {
      const filePath = (0, path_1.join)(process.cwd(), 'src', 'commands', file);
      // eslint-disable-next-line no-await-in-loop
      const command = await Promise.resolve(`${filePath}`).then((s) => __importStar(require(s)));
      const currentCommand = command.default;
      this.commands.set(currentCommand.data.name, currentCommand);
      console.log(`명령어 [ ${currentCommand.data.name} ] 의 로딩이 완료되었습니다.`);
      this.commandsArray.push(currentCommand.data.toJSON());
    }
  }
  async registerCommands() {
    setTimeout(() => {
      const rest = new discord_js_1.REST({ version: '10', }).setToken(process.env.TOKEN);
      rest.put(discord_js_1.Routes.applicationCommands(process.env.APPLICATION_ID), { body: this.commandsArray, })
        .then(() => {
          console.log(`성공적으로 명령어를 불러왔습니다.`);
        })
        .catch(console.error);
    }, 3000);
  }
}
exports.default = Bot;
//# sourceMappingURL=Bot.js.map
