import {PrismaClient} from '@prisma/client'

declare global {
    namespace NodeJS {
        interface Global {
            prisma: PrismaClient;
        }
    }
}

const prisma = global.prisma || new PrismaClient()

// add prisma to the NodeJS global type if in development
if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma