"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var path_1 = require("path");
var Bot = /** @class */ (function () {
    // eslint-disable-next-line no-unused-vars
    function Bot(client) {
        this.client = client;
        this.commands = new discord_js_1.Collection();
        this.commandsArray = [];
        this.client.login(process.env.TOKEN);
        this.client.on(discord_js_1.Events.Warn, function (info) { return console.log(info); });
        this.client.on(discord_js_1.Events.Error, console.error);
        this.importEvents();
        this.importSlashCommands();
        this.registerCommands();
    }
    Bot.prototype.importEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var eventFiles, _loop_1, this_1, _i, eventFiles_1, file;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        eventFiles = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), 'src', 'events'))
                            .filter(function (file) { return !file.endsWith('.map'); });
                        _loop_1 = function (file) {
                            var filePath, event_1, currentEvent;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        filePath = (0, path_1.join)(process.cwd(), 'src', 'events', file);
                                        return [4 /*yield*/, Promise.resolve("".concat(filePath)).then(function (s) { return require(s); })];
                                    case 1:
                                        event_1 = _b.sent();
                                        currentEvent = event_1.default;
                                        if (currentEvent.once) {
                                            this_1.client.once(currentEvent.name, function () {
                                                var args = [];
                                                for (var _i = 0; _i < arguments.length; _i++) {
                                                    args[_i] = arguments[_i];
                                                }
                                                currentEvent.execute.apply(currentEvent, __spreadArray([_this.client], args, false));
                                            });
                                        }
                                        else {
                                            this_1.client.on(currentEvent.name, function () {
                                                var args = [];
                                                for (var _i = 0; _i < arguments.length; _i++) {
                                                    args[_i] = arguments[_i];
                                                }
                                                currentEvent.execute.apply(currentEvent, __spreadArray([_this.client], args, false));
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, eventFiles_1 = eventFiles;
                        _a.label = 1;
                    case 1:
                        if (!(_i < eventFiles_1.length)) return [3 /*break*/, 4];
                        file = eventFiles_1[_i];
                        return [5 /*yield**/, _loop_1(file)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.importSlashCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var commandFiles, _i, commandFiles_1, file, filePath, command, currentCommand;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), 'src', 'commands'))
                            .filter(function (file) { return !file.endsWith('.map'); });
                        _i = 0, commandFiles_1 = commandFiles;
                        _a.label = 1;
                    case 1:
                        if (!(_i < commandFiles_1.length)) return [3 /*break*/, 4];
                        file = commandFiles_1[_i];
                        filePath = (0, path_1.join)(process.cwd(), 'src', 'commands', file);
                        return [4 /*yield*/, Promise.resolve("".concat(filePath)).then(function (s) { return require(s); })];
                    case 2:
                        command = _a.sent();
                        currentCommand = command.default;
                        this.commands.set(currentCommand.data.name, currentCommand);
                        console.log("\uBA85\uB839\uC5B4 [ ".concat(currentCommand.data.name, " ] \uC758 \uB85C\uB529\uC774 \uC644\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
                        this.commandsArray.push(currentCommand.data.toJSON());
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Bot.prototype.registerCommands = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setTimeout(function () {
                    var rest = new discord_js_1.REST({ version: '10', }).setToken(process.env.TOKEN);
                    rest.put(discord_js_1.Routes.applicationCommands(process.env.APPLICATION_ID), { body: _this.commandsArray, })
                        .then(function () {
                        console.log("\uC131\uACF5\uC801\uC73C\uB85C \uBA85\uB839\uC5B4\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4.");
                    })
                        .catch(console.error);
                }, 3000);
                return [2 /*return*/];
            });
        });
    };
    return Bot;
}());
exports.default = Bot;
