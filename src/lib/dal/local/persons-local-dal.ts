// Local DAL implementation cho Person — FlexibleDate lưu dạng JSON string trong SQLite
import { prisma } from '@/lib/db'
import type { Person, FlexibleDate } from '@/types/person'
import type { PersonDAL, PersonsQueryParams, PersonWritePayload, PaginatedResult } from '../types'

const DEFAULT_PER_PAGE = 20

// Parse JSON string → FlexibleDate object (trả null nếu invalid)
function parseFlexibleDate(raw: string | null): FlexibleDate | null {
    if (!raw) return null
    try {
        return JSON.parse(raw) as FlexibleDate
    } catch {
        return null
    }
}

// Map Prisma Person record → TypeScript Person type
function mapPerson(record: {
    id: number
    lineageId: number
    ho: string | null
    tenDem: string | null
    ten: string
    gender: string | null
    isAlive: boolean
    generationNumber: number | null
    biography: string | null
    avatar: string | null
    birthDateJson: string | null
    deathDateJson: string | null
    tenThuongGoi: string | null
    tenHuy: string | null
    tenThuy: string | null
    tenHieu: string | null
    hanNomName: string | null
    notes: string | null
    phone: string | null
    email: string | null
    address: string | null
    birthPlace: string | null
    deathPlace: string | null
    burialPlace: string | null
    burialLatitude: number | null
    burialLongitude: number | null
    coverPhoto: string | null
    privacyLevel: number | null
    birthOrder: number
    branchId: number | null
    createdAt: Date
    updatedAt: Date
}): Person {
    const birth = parseFlexibleDate(record.birthDateJson)
    const death = parseFlexibleDate(record.deathDateJson)

    return {
        id: record.id,
        lineage_id: record.lineageId,
        branch_id: record.branchId,
        ho: record.ho,
        ten_dem: record.tenDem,
        ten: record.ten,
        ten_thuong_goi: record.tenThuongGoi,
        ten_huy: record.tenHuy,
        ten_thuy: record.tenThuy,
        ten_hieu: record.tenHieu,
        han_nom_name: record.hanNomName,
        gender: (record.gender ?? 'unknown') as Person['gender'],
        is_alive: record.isAlive,
        generation_number: record.generationNumber,
        biography: record.biography,
        avatar: record.avatar,
        birth_date: birth,
        death_date: death,
        full_name: [record.ho, record.tenDem, record.ten].filter(Boolean).join(' '),
        created_at: record.createdAt.toISOString(),
        updated_at: record.updatedAt.toISOString(),
        notes: record.notes,
        phone: record.phone,
        email: record.email,
        address: record.address,
        birth_place: record.birthPlace,
        death_place: record.deathPlace,
        burial_place: record.burialPlace,
        burial_latitude: record.burialLatitude,
        burial_longitude: record.burialLongitude,
        cover_photo: record.coverPhoto,
        privacy_level: record.privacyLevel,
        birth_order: record.birthOrder,
        parents_count: 0,
        children_count: 0,
        spouses_count: 0,
    }
}

function buildPaginationMeta(total: number, page: number, perPage: number) {
    return {
        total_entries: total,
        current_page: page,
        per_page: perPage,
        total_pages: Math.ceil(total / perPage),
    }
}

export const personsLocalDal: PersonDAL = {
    async list(params) {
        return personsLocalDal.listByLineage(params.lineageId, params)
    },

    async get(id) {
        const record = await prisma.person.findUniqueOrThrow({ where: { id } })
        return mapPerson(record)
    },

    async listByLineage(lineageId, params = {}) {
        const page = params.page ?? 1
        const perPage = params.per_page ?? DEFAULT_PER_PAGE
        const skip = (page - 1) * perPage

        const where = {
            lineageId,
            ...(params.gender ? { gender: params.gender } : {}),
            ...(params.name
                ? {
                    OR: [
                        { ho: { contains: params.name } },
                        { tenDem: { contains: params.name } },
                        { ten: { contains: params.name } },
                    ]
                }
                : {}),
        }

        const [records, total] = await Promise.all([
            prisma.person.findMany({ where, skip, take: perPage, orderBy: { birthOrder: 'asc' } }),
            prisma.person.count({ where }),
        ])

        return {
            data: records.map(mapPerson),
            meta: buildPaginationMeta(total, page, perPage),
        }
    },

    async create(lineageId, payload) {
        const record = await prisma.person.create({
            data: {
                lineageId,
                ho: payload.ho ?? null,
                tenDem: payload.ten_dem ?? null,
                ten: payload.ten,
                gender: payload.gender ?? 'unknown',
                isAlive: payload.is_alive ?? true,
                generationNumber: payload.generation_number ?? null,
                branchId: payload.branch_id ?? null,
                tenThuongGoi: payload.ten_thuong_goi ?? null,
                tenHuy: payload.ten_huy ?? null,
                tenThuy: payload.ten_thuy ?? null,
                tenHieu: payload.ten_hieu ?? null,
                hanNomName: payload.han_nom_name ?? null,
                biography: payload.biography ?? null,
                notes: payload.notes ?? null,
                address: payload.address ?? null,
                phone: payload.phone ?? null,
                email: payload.email ?? null,
                birthPlace: payload.birth_place ?? null,
                deathPlace: payload.death_place ?? null,
                birthDateJson: payload.birth_date_attributes
                    ? JSON.stringify(payload.birth_date_attributes)
                    : null,
                deathDateJson: payload.death_date_attributes
                    ? JSON.stringify(payload.death_date_attributes)
                    : null,
            },
        })
        return mapPerson(record)
    },

    async update(id, payload) {
        const record = await prisma.person.update({
            where: { id },
            data: {
                ...(payload.ho !== undefined && { ho: payload.ho }),
                ...(payload.ten_dem !== undefined && { tenDem: payload.ten_dem }),
                ...(payload.ten !== undefined && { ten: payload.ten }),
                ...(payload.gender !== undefined && { gender: payload.gender }),
                ...(payload.is_alive !== undefined && { isAlive: payload.is_alive }),
                ...(payload.generation_number !== undefined && { generationNumber: payload.generation_number }),
                ...(payload.branch_id !== undefined && { branchId: payload.branch_id }),
                ...(payload.ten_thuong_goi !== undefined && { tenThuongGoi: payload.ten_thuong_goi }),
                ...(payload.ten_huy !== undefined && { tenHuy: payload.ten_huy }),
                ...(payload.ten_thuy !== undefined && { tenThuy: payload.ten_thuy }),
                ...(payload.ten_hieu !== undefined && { tenHieu: payload.ten_hieu }),
                ...(payload.han_nom_name !== undefined && { hanNomName: payload.han_nom_name }),
                ...(payload.biography !== undefined && { biography: payload.biography }),
                ...(payload.notes !== undefined && { notes: payload.notes }),
                ...(payload.address !== undefined && { address: payload.address }),
                ...(payload.phone !== undefined && { phone: payload.phone }),
                ...(payload.email !== undefined && { email: payload.email }),
                ...(payload.birth_place !== undefined && { birthPlace: payload.birth_place }),
                ...(payload.death_place !== undefined && { deathPlace: payload.death_place }),
                ...(payload.birth_date_attributes !== undefined && {
                    birthDateJson: payload.birth_date_attributes
                        ? JSON.stringify(payload.birth_date_attributes)
                        : null,
                }),
                ...(payload.death_date_attributes !== undefined && {
                    deathDateJson: payload.death_date_attributes
                        ? JSON.stringify(payload.death_date_attributes)
                        : null,
                }),
            },
        })
        return mapPerson(record)
    },

    async delete(id) {
        await prisma.person.delete({ where: { id } })
    },
}
