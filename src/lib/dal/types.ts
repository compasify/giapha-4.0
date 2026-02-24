// Data Access Layer — interface contract cho cả 2 mode (local và api)
import type { Person } from '@/types/person'
import type { Lineage, LineageFormPayload } from '@/types/lineage'
import type { Relationship, RelationshipType } from '@/types/relationship'
import type { GenealogyEvent, GenealogyEventSummary, EventType } from '@/types/event'
import type { PaginationMeta } from '@/types/api'

// Pagination wrapper — giống Rails response shape
export interface PaginatedResult<T> {
    data: T[]
    meta: PaginationMeta
}

// Query params cho persons
export interface PersonsQueryParams {
    lineageId: number
    name?: string
    gender?: string
    page?: number
    per_page?: number
}

// Payload tạo/sửa Person — subset của PersonFormValues sau khi parse
export interface PersonWritePayload {
    ho?: string | null
    ten_dem?: string | null
    ten: string
    gender: string
    branch_id?: number | null
    generation_number?: number | null
    ten_thuong_goi?: string | null
    ten_huy?: string | null
    ten_thuy?: string | null
    ten_hieu?: string | null
    han_nom_name?: string | null
    is_alive?: boolean
    birth_place?: string | null
    death_place?: string | null
    biography?: string | null
    notes?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
    birth_date_attributes?: Record<string, unknown> | null
    death_date_attributes?: Record<string, unknown> | null
}

// Query params cho events
export interface EventsQueryParams {
    lineageId: number
    page?: number
    per_page?: number
}

// Payload tạo/sửa Event
export interface EventWritePayload {
    title: string
    event_type: EventType
    event_subtype?: string | null
    description?: string | null
    notes?: string | null
    location?: string | null
    is_recurring?: boolean
    recurrence_type?: string | null
    reminder_enabled?: boolean
    reminder_days_before?: number | null
    privacy_level?: number | null
    participant_ids?: number[]
    flexible_dates_attributes?: Record<string, unknown>[]
}

// Payload tạo relationship
export interface RelationshipWritePayload {
    from_person_id: number
    to_person_id: number
    relationship_type: RelationshipType
    notes?: string | null
}

// Sub-interfaces cho từng entity
export interface LineageDAL {
    list(): Promise<Lineage[]>
    get(id: number): Promise<Lineage>
    create(payload: LineageFormPayload): Promise<Lineage>
    update(id: number, payload: Partial<LineageFormPayload>): Promise<Lineage>
    delete(id: number): Promise<void>
}

export interface PersonDAL {
    list(params: PersonsQueryParams): Promise<PaginatedResult<Person>>
    get(id: number): Promise<Person>
    listByLineage(lineageId: number, params?: Omit<PersonsQueryParams, 'lineageId'>): Promise<PaginatedResult<Person>>
    create(lineageId: number, payload: PersonWritePayload): Promise<Person>
    update(id: number, payload: PersonWritePayload): Promise<Person>
    delete(id: number): Promise<void>
}

export interface RelationshipDAL {
    listByLineage(lineageId: number, params?: { per_page?: number }): Promise<PaginatedResult<Relationship>>
    listByPerson(personId: number): Promise<Relationship[]>
    create(payload: RelationshipWritePayload): Promise<Relationship>
    delete(id: number): Promise<void>
}

export interface EventDAL {
    list(params: EventsQueryParams): Promise<PaginatedResult<GenealogyEventSummary>>
    get(id: number): Promise<GenealogyEvent>
    create(lineageId: number, payload: EventWritePayload): Promise<GenealogyEvent>
    update(id: number, payload: Partial<EventWritePayload>): Promise<GenealogyEvent>
    delete(id: number): Promise<void>
}

// Master interface kết hợp 4 entity DALs
export interface DALInterface {
    lineages: LineageDAL
    persons: PersonDAL
    relationships: RelationshipDAL
    events: EventDAL
}
