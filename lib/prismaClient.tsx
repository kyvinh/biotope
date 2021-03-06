import {Prisma, PrismaClient} from '@prisma/client'

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

const logLevels = (process.env.NODE_ENV === 'development') ? [/*'query',*/ 'info', 'warn', 'error'] : ['warn', 'error'];

const prisma = global.prisma || new PrismaClient({
    log: logLevels as Prisma.LogLevel[],
})

// add prisma to the NodeJS global type if in development
if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma