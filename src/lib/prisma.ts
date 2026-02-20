import { PrismaClient } from '@prisma/client';

declare const global: typeof globalThis & { prisma?: PrismaClient };

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}