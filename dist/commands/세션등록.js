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
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var prisma_1 = require("../utils/prisma");
var uuid_1 = require("../utils/uuid");
var command = {
    // @ts-ignore
    data: new discord_js_1.SlashCommandBuilder()
        .setName('세션등록')
        .setDescription('새로운 세션을 추가합니다.')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
        .addStringOption(function (option) { return (option
        .setName('캠페인명')
        .setDescription('어떤 캠페인에 등록할지 입력하세요.')
        .setRequired(true)); })
        .addNumberOption(function (option) { return (option
        .setName('번호')
        .setDescription('세션 번호를 입력하세요.')
        .setRequired(true)); })
        .addStringOption(function (option) { return (option
        .setName('이름')
        .setDescription('세션 이름을 입력하세요.')
        .setRequired(true)); })
        .addStringOption(function (option) { return (option
        .setName('마스터')
        .setDescription('마스터를 입력하세요.')
        .setRequired(true)); })
        .addStringOption(function (option) { return (option
        .setName('보너스대상')
        .setDescription('PC 이름을 입력하세요.')
        .setRequired(true)); }),
    execute: function (client, interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var campainName, sessionNumber, sessionName, master, bonusPC, findCampain, embed_1, newSession, resultString, embed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        campainName = interaction
                            .options.get('캠페인명').value;
                        sessionNumber = interaction
                            .options.get('번호').value;
                        sessionName = interaction
                            .options.get('이름').value;
                        master = interaction
                            .options.get('마스터').value;
                        bonusPC = interaction
                            .options.get('보너스대상').value;
                        return [4 /*yield*/, prisma_1.campain.findFirst({
                                where: {
                                    name: campainName,
                                },
                            })];
                    case 1:
                        findCampain = _a.sent();
                        if (!findCampain) {
                            embed_1 = new discord_js_1.EmbedBuilder()
                                .setColor('Red')
                                .setFields([
                                {
                                    name: '오류',
                                    value: "**\uCEA0\uD398\uC778\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uCEA0\uD398\uC778\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694.**",
                                },
                            ]);
                            interaction.reply({
                                embeds: [embed_1,],
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.session.create({
                                data: {
                                    id: (0, uuid_1.randomUUID)(),
                                    campain_id: findCampain.id,
                                    name: sessionName,
                                    number: sessionNumber,
                                    gm: master,
                                    bonus_pc: bonusPC,
                                },
                            })];
                    case 2:
                        newSession = _a.sent();
                        resultString = "[".concat(newSession.number.toString().padStart(3, '0'), " - ").concat(newSession.name, "] \uC138\uC158\uC774 \uB4F1\uB85D\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
                        embed = new discord_js_1.EmbedBuilder()
                            .setColor('Red')
                            .setFields([
                            {
                                name: '등록 완료',
                                value: "**".concat(resultString, "**"),
                            },
                        ]);
                        interaction.reply({
                            embeds: [embed,],
                        });
                        return [2 /*return*/];
                }
            });
        });
    },
};
exports.default = command;
