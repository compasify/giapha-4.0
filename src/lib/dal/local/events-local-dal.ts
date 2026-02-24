// Local DAL implementation cho Event — hai shapes: summary (list) và full (detail)
import { prisma } from '@/lib/db'
import type { GenealogyEvent, GenealogyEventSummary } from '@/types/event'
import type { EventDAL, EventsQueryParams, EventWritePayload, PaginatedResult } from '../types'

const DEFAULT_PER_PAGE = 20

function buildPaginationMeta(total: number, page: number, perPage: number) {
    return {
        total_entries: total,
        current_page: page,
        per_page: perPage,
        total_pages: Math.ceil(total / perPage),
    }
}

// Map Prisma Event record → GenealogyEventSummary (dùng trong list)
function mapEventSummary(record: {
    id: number
    title: string | null
    eventType: string
    description: string | null
    location: string | null
    createdAt: Date
}): GenealogyEventSummary {
    return {
        id: record.id,
        title: record.title,
        event_type: record.eventType as GenealogyEvent['event_type'],
        description: record.description,
        location: record.location,
        participants_count: 0,
        created_at: record.createdAt.toISOString(),
    }
}

// Map Prisma Event record → GenealogyEvent (full detail)
function mapEventFull(record: {
    id: number
    lineageId: number
    title: string | null
    eventType: string
    eventSubtype: string | null
    description: string | null
    notes: string | null
    location: string | null
    isRecurring: boolean
    recurrenceType: string | null
    reminderEnabled: boolean
    reminderDaysBefore: number | null
    privacyLevel: number | null
    createdAt: Date
    updatedAt: Date
}): GenealogyEvent {
    return {
        id: record.id,
        title: record.title,
        event_type: record.eventType as GenealogyEvent['event_type'],
        event_subtype: record.eventSubtype,
        description: record.description,
        notes: record.notes,
        location: record.location,
        is_recurring: record.isRecurring,
        recurrence_type: record.recurrenceType,
        reminder_enabled: record.reminderEnabled,
        reminder_days_before: record.reminderDaysBefore,
        privacy_level: record.privacyLevel,
        lineage_id: record.lineageId,
        created_at: record.createdAt.toISOString(),
        updated_at: record.updatedAt.toISOString(),
        participants: [],
        flexible_dates: [],
    }
}

export const eventsLocalDal: EventDAL = {
    async list(params) {
        const page = params.page ?? 1
        const perPage = params.per_page ?? DEFAULT_PER_PAGE
        const skip = (page - 1) * perPage

        const where = { lineageId: params.lineageId }

        const [records, total] = await Promise.all([
            prisma.event.findMany({
                where,
                skip,
                take: perPage,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    eventType: true,
                    description: true,
                    location: true,
                    createdAt: true,
                },
            }),
            prisma.event.count({ where }),
        ])

        return {
            data: records.map(mapEventSummary),
            meta: buildPaginationMeta(total, page, perPage),
        }
    },

    async get(id) {
        const record = await prisma.event.findUniqueOrThrow({ where: { id } })
        return mapEventFull(record)
    },

    async create(lineageId, payload) {
        const record = await prisma.event.create({
            data: {
                lineageId,
                title: payload.title,
                eventType: payload.event_type,
                eventSubtype: payload.event_subtype ?? null,
                description: payload.description ?? null,
                notes: payload.notes ?? null,
                location: payload.location ?? null,
                isRecurring: payload.is_recurring ?? false,
                recurrenceType: payload.recurrence_type ?? null,
                reminderEnabled: payload.reminder_enabled ?? false,
                reminderDaysBefore: payload.reminder_days_before ?? null,
                privacyLevel: payload.privacy_level ?? null,
            },
        })
        return mapEventFull(record)
    },

    async update(id, payload) {
        const record = await prisma.event.update({
            where: { id },
            data: {
                ...(payload.title !== undefined && { title: payload.title }),
                ...(payload.event_type !== undefined && { eventType: payload.event_type }),
                ...(payload.event_subtype !== undefined && { eventSubtype: payload.event_subtype }),
                ...(payload.description !== undefined && { description: payload.description }),
                ...(payload.notes !== undefined && { notes: payload.notes }),
                ...(payload.location !== undefined && { location: payload.location }),
                ...(payload.is_recurring !== undefined && { isRecurring: payload.is_recurring }),
                ...(payload.recurrence_type !== undefined && { recurrenceType: payload.recurrence_type }),
                ...(payload.reminder_enabled !== undefined && { reminderEnabled: payload.reminder_enabled }),
                ...(payload.reminder_days_before !== undefined && { reminderDaysBefore: payload.reminder_days_before }),
                ...(payload.privacy_level !== undefined && { privacyLevel: payload.privacy_level }),
            },
        })
        return mapEventFull(record)
    },

    async delete(id) {
        await prisma.event.delete({ where: { id } })
    },
}
