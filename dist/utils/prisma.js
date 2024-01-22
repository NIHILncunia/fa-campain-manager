"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.player = exports.session = exports.campain = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
exports.campain = prisma.campain, exports.session = prisma.session, exports.player = prisma.player;
