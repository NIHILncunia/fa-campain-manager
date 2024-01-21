import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const { campain, session, player, } = prisma;
