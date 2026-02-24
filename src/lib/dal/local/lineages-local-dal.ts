// Local DAL implementation cho Lineage — đọc/ghi SQLite qua Prisma
import { prisma } from '@/lib/db'
import type { Lineage, LineageFormPayload } from '@/types/lineage'
import type { LineageDAL } from '../types'

// Map Prisma Lineage record → TypeScript Lineage type (phải match Rails JSON shape)
function mapLineage(record: {
    id: number
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count?: { persons: number }
}): Lineage {
    return {
        id: record.id,
        name: record.name,
        description: record.description,
        origin_story: null,
        origin_location: null,
        slug: String(record.id),
        privacy_level: 0,
        avatar: null,
        cover: null,
        members_count: 0,
        persons_count: record._count?.persons ?? 0,
        settings: {},
        created_at: record.createdAt.toISOString(),
        updated_at: record.updatedAt.toISOString(),
    }
}

export const lineagesLocalDal: LineageDAL = {
    async list() {
        const records = await prisma.lineage.findMany({
            include: { _count: { select: { persons: true } } },
            orderBy: { createdAt: 'desc' },
        })
        return records.map(mapLineage)
    },

    async get(id) {
        const record = await prisma.lineage.findUniqueOrThrow({
            where: { id },
            include: { _count: { select: { persons: true } } },
        })
        return mapLineage(record)
    },

    async create(payload) {
        const record = await prisma.lineage.create({
            data: {
                name: payload.name,
                description: payload.description ?? null,
            },
            include: { _count: { select: { persons: true } } },
        })
        return mapLineage(record)
    },

    async update(id, payload) {
        const record = await prisma.lineage.update({
            where: { id },
            data: {
                ...(payload.name !== undefined && { name: payload.name }),
                ...(payload.description !== undefined && { description: payload.description ?? null }),
            },
            include: { _count: { select: { persons: true } } },
        })
        return mapLineage(record)
    },

    async delete(id) {
        await prisma.lineage.delete({ where: { id } })
    },
}
