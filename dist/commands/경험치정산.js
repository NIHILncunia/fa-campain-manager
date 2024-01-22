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
var command = {
    // @ts-ignore
    data: new discord_js_1.SlashCommandBuilder()
        .setName('경험치정산')
        .setDescription('세션의 경험치를 정산합니다.')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
        .addStringOption(function (option) { return (option
        .setName('캠페인명')
        .setDescription('어떤 캠페인에 등록할지 입력하세요.')
        .setRequired(true)); })
        .addNumberOption(function (option) { return (option
        .setName('번호')
        .setDescription('세션 번호를 입력하세요.')
        .setRequired(true)); })
        .addNumberOption(function (option) { return (option
        .setName('경험치')
        .setDescription('세션의 경험치를 입력하세요.')
        .setRequired(true)); }),
    execute: function (client, interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var campainName, sessionNumber, sessionExp, findCampain, embed_1, findSession, embed_2, pcList, _i, _a, pc, findPC, topLevel, normalExp, low1BonusExp, low2BonusExp, low3BonusExp, masterBonusExp, gmPCGainExp, gmPC, updateGmPC, updatePCList, _b, pcList_1, pc, newExp, newLevel, updatePC, embed;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        campainName = interaction
                            .options.get('캠페인명').value;
                        sessionNumber = interaction
                            .options.get('번호').value;
                        sessionExp = interaction
                            .options.get('경험치').value;
                        return [4 /*yield*/, prisma_1.campain.findFirst({
                                where: {
                                    name: campainName,
                                },
                            })];
                    case 1:
                        findCampain = _c.sent();
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
                        return [4 /*yield*/, prisma_1.session.findFirst({
                                where: {
                                    campain_id: findCampain.id,
                                    number: sessionNumber,
                                },
                            })];
                    case 2:
                        findSession = _c.sent();
                        if (!findSession) {
                            embed_2 = new discord_js_1.EmbedBuilder()
                                .setColor('Red')
                                .setFields([
                                {
                                    name: '오류',
                                    value: "**\uC138\uC158\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.**",
                                },
                            ]);
                            interaction.reply({
                                embeds: [embed_2,],
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, prisma_1.session.update({
                                where: {
                                    id: findSession.id,
                                },
                                data: {
                                    exp: sessionExp,
                                },
                            })];
                    case 3:
                        _c.sent();
                        pcList = [];
                        _i = 0, _a = findSession.pc.split(',');
                        _c.label = 4;
                    case 4:
                        if (!(_i < _a.length)) return [3 /*break*/, 7];
                        pc = _a[_i];
                        return [4 /*yield*/, prisma_1.player.findFirst({
                                where: {
                                    campain_id: findCampain.id,
                                    name: pc,
                                },
                            }).then(function (result) {
                                pcList.push(result);
                            })];
                    case 5:
                        findPC = _c.sent();
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        topLevel = pcList
                            .sort(function (a, b) {
                            var aLevel = a.level;
                            var bLevel = b.level;
                            return bLevel - aLevel;
                        }).at(0).level;
                        normalExp = sessionExp;
                        low1BonusExp = sessionExp + Math.floor(sessionExp * 0.5);
                        low2BonusExp = sessionExp * 2;
                        low3BonusExp = sessionExp + Math.floor(sessionExp * 1.5);
                        masterBonusExp = sessionExp + (sessionExp * 1.5);
                        return [4 /*yield*/, prisma_1.player.findFirst({
                                where: {
                                    campain_id: findCampain.id,
                                    name: findSession.bonus_pc,
                                },
                            })];
                    case 8:
                        gmPC = _c.sent();
                        if (topLevel === gmPC.level) {
                            gmPCGainExp = masterBonusExp;
                        }
                        else if (topLevel - 1 === gmPC.level) {
                            gmPCGainExp = masterBonusExp > low1BonusExp ? masterBonusExp : low1BonusExp;
                        }
                        else if (topLevel - 2 === gmPC.level) {
                            gmPCGainExp = masterBonusExp > low2BonusExp ? masterBonusExp : low2BonusExp;
                        }
                        else {
                            gmPCGainExp = masterBonusExp > low3BonusExp ? masterBonusExp : low3BonusExp;
                        }
                        if (gmPC.name === '리르갈') {
                            gmPCGainExp = normalExp;
                        }
                        return [4 /*yield*/, prisma_1.player.update({
                                where: {
                                    id: gmPC.id,
                                },
                                data: {
                                    exp: (gmPC.exp + gmPCGainExp) >= 100
                                        ? (gmPC.exp + gmPCGainExp) - 100
                                        : gmPC.exp + gmPCGainExp,
                                    level: (gmPC.exp + gmPCGainExp) >= 100
                                        ? gmPC.level + 1
                                        : gmPC.level,
                                },
                            })];
                    case 9:
                        updateGmPC = _c.sent();
                        updatePCList = [];
                        _b = 0, pcList_1 = pcList;
                        _c.label = 10;
                    case 10:
                        if (!(_b < pcList_1.length)) return [3 /*break*/, 13];
                        pc = pcList_1[_b];
                        newExp = void 0;
                        newLevel = void 0;
                        if (topLevel === pc.level) {
                            newExp = (pc.exp + normalExp) >= 100
                                ? (pc.exp + normalExp) - 100
                                : pc.exp + normalExp;
                            newLevel = (pc.exp + normalExp) >= 100
                                ? pc.level + 1
                                : pc.level;
                        }
                        else if (topLevel - 1 === pc.level) {
                            newExp = (pc.exp + low1BonusExp) >= 100
                                ? (pc.exp + low1BonusExp) - 100
                                : pc.exp + low1BonusExp;
                            newLevel = (pc.exp + low1BonusExp) >= 100
                                ? pc.level + 1
                                : pc.level;
                        }
                        else if (topLevel - 2 === pc.level) {
                            newExp = (pc.exp + low2BonusExp) >= 100
                                ? (pc.exp + low2BonusExp) - 100
                                : pc.exp + low2BonusExp;
                            newLevel = (pc.exp + low2BonusExp) >= 100
                                ? pc.level + 1
                                : pc.level;
                        }
                        else {
                            newExp = (pc.exp + low3BonusExp) >= 100
                                ? (pc.exp + low3BonusExp) - 100
                                : pc.exp + low3BonusExp;
                            newLevel = (pc.exp + low3BonusExp) >= 100
                                ? pc.level + 1
                                : pc.level;
                        }
                        return [4 /*yield*/, prisma_1.player.update({
                                where: {
                                    campain_id: pc.campain_id,
                                    id: pc.id,
                                },
                                data: {
                                    exp: newExp,
                                    level: newLevel,
                                },
                            })];
                    case 11:
                        updatePC = _c.sent();
                        updatePCList.push(updatePC);
                        _c.label = 12;
                    case 12:
                        _b++;
                        return [3 /*break*/, 10];
                    case 13:
                        updatePCList.push(updateGmPC);
                        embed = new discord_js_1.EmbedBuilder()
                            .setColor('Red')
                            .setFields([
                            {
                                name: '세션 경험치',
                                value: "".concat(sessionExp, "%"),
                            },
                            {
                                name: 'PC 경험치 현황',
                                value: updatePCList.map(function (pc) { return ("[".concat(pc.name, "] \uB808\uBCA8 ").concat(pc.level, " (").concat(pc.exp, "%)\n")); }).join(''),
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
