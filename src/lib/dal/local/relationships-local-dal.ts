// Local DAL implementation cho Relationship — join với Person để trả nested objects
import { prisma } from '@/lib/db'
import type { Relationship, RelationshipPersonSummary } from '@/types/relationship'
import type { RelationshipDAL, RelationshipWritePayload, PaginatedResult } from '../types'

const DEFAULT_PER_PAGE = 500  // Relationships thường load all để render family tree

// Map Prisma Person record → RelationshipPersonSummary
function mapPersonSummary(p: {
    id: number
    ho: string | null
    tenDem: string | null
    ten: string
    gender: string | null
    isAlive: boolean
    avatar: string | null
    generationNumber: number | null
}): RelationshipPersonSummary {
    return {
        id: p.id,
        full_name: [p.ho, p.tenDem, p.ten].filter(Boolean).join(' '),
        ho: p.ho,
        ten_dem: p.tenDem,
        ten: p.ten,
        gender: p.gender ?? 'unknown',
        is_alive: p.isAlive,
        avatar: p.avatar,
        generation_number: p.generationNumber,
    }
}

// Include clause dùng lại trong các queries
const PERSON_SELECT = {
    id: true,
    ho: true,
    tenDem: true,
    ten: true,
    gender: true,
    isAlive: true,
    avatar: true,
    generationNumber: true,
} as const

export const relationshipsLocalDal: RelationshipDAL = {
    async listByLineage(lineageId, params = {}) {
        const perPage = params.per_page ?? DEFAULT_PER_PAGE

        // Lấy tất cả persons của lineage để filter relationships
        const personIds = await prisma.person
            .findMany({ where: { lineageId }, select: { id: true } })
            .then((ps) => ps.map((p) => p.id))

        const records = await prisma.relationship.findMany({
            where: {
                OR: [
                    { fromId: { in: personIds } },
                    { toId: { in: personIds } },
                ],
            },
            take: perPage,
            include: {
                from: { select: PERSON_SELECT },
                to: { select: PERSON_SELECT },
            },
        })

        const total = records.length
        return {
            data: records.map((r) => ({
                id: r.id,
                relationship_type: r.relType as Relationship['relationship_type'],
                notes: r.notes ?? null,
                from_person: mapPersonSummary(r.from),
                to_person: mapPersonSummary(r.to),
            })),
            meta: {
                total_entries: total,
                current_page: 1,
                per_page: perPage,
                total_pages: 1,
            },
        }
    },

    async listByPerson(personId) {
        const records = await prisma.relationship.findMany({
            where: {
                OR: [{ fromId: personId }, { toId: personId }],
            },
            include: {
                from: { select: PERSON_SELECT },
                to: { select: PERSON_SELECT },
            },
        })

        return records.map((r) => ({
            id: r.id,
            relationship_type: r.relType as Relationship['relationship_type'],
            notes: r.notes ?? null,
            from_person: mapPersonSummary(r.from),
            to_person: mapPersonSummary(r.to),
        }))
    },

    async create(payload) {
        const record = await prisma.relationship.create({
            data: {
                fromId: payload.from_person_id,
                toId: payload.to_person_id,
                relType: payload.relationship_type,
                notes: payload.notes ?? null,
            },
            include: {
                from: { select: PERSON_SELECT },
                to: { select: PERSON_SELECT },
            },
        })

        return {
            id: record.id,
            relationship_type: record.relType as Relationship['relationship_type'],
            notes: record.notes ?? null,
            from_person: mapPersonSummary(record.from),
            to_person: mapPersonSummary(record.to),
        }
    },

    async delete(id) {
        await prisma.relationship.delete({ where: { id } })
    },
}
