// Test helpers — seed data và cleanup giữa các test
// Dùng chính singleton prisma từ DAL code để tránh dual-connection issues
import { prisma } from '@/lib/db'

// Xóa toàn bộ data (giữ schema) — dùng giữa describe blocks
export async function cleanDatabase() {
    // Thứ tự xóa quan trọng vì foreign keys
    await prisma.relationship.deleteMany()
    await prisma.event.deleteMany()
    await prisma.person.deleteMany()
    await prisma.lineage.deleteMany()
}

// Seed 1 lineage cơ bản để test
export async function seedLineage(name = 'Test Lineage', description = 'For testing') {
    return prisma.lineage.create({
        data: { name, description },
    })
}

// Seed 1 person
export async function seedPerson(lineageId: number, overrides: Partial<{
    ho: string
    tenDem: string
    ten: string
    gender: string
    isAlive: boolean
    generationNumber: number
    birthOrder: number
    birthDateJson: string
}> = {}) {
    return prisma.person.create({
        data: {
            lineageId,
            ho: overrides.ho ?? 'Nguyễn',
            tenDem: overrides.tenDem ?? 'Văn',
            ten: overrides.ten ?? 'A',
            gender: overrides.gender ?? 'male',
            isAlive: overrides.isAlive ?? true,
            generationNumber: overrides.generationNumber ?? 1,
            birthOrder: overrides.birthOrder ?? 0,
            birthDateJson: overrides.birthDateJson ?? null,
        },
    })
}

// Seed 1 relationship
export async function seedRelationship(fromId: number, toId: number, relType = 'parent_child') {
    return prisma.relationship.create({
        data: { fromId, toId, relType },
    })
}

// Seed 1 event
export async function seedEvent(lineageId: number, overrides: Partial<{
    title: string
    eventType: string
    description: string
}> = {}) {
    return prisma.event.create({
        data: {
            lineageId,
            title: overrides.title ?? 'Test Event',
            eventType: overrides.eventType ?? 'anniversary',
            description: overrides.description ?? 'Test event description',
        },
    })
}
