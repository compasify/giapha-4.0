// Singleton PrismaClient cho Prisma v7 + SQLite via better-sqlite3 adapter
// Tránh tạo nhiều instance khi Next.js hot reload (dev mode)
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaBetterSqlite3({
        url: process.env.DATABASE_URL || 'file:./data/family.db',
    })

    return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
    globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
