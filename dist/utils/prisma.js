Object.defineProperty(exports, '__esModule', { value: true, });
exports.player = exports.session = exports.campain = void 0;
const client_1 = require('@prisma/client');

const prisma = new client_1.PrismaClient();
exports.campain = prisma.campain, exports.session = prisma.session, exports.player = prisma.player;
//# sourceMappingURL=prisma.js.map
