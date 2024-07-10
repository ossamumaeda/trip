import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    log: ['query'], // Mostra as querys que estao sendo executas no cmd
})