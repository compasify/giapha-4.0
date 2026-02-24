// GET /api/local/lineages/:id/persons — list persons with Ransack filter
// POST /api/local/lineages/:id/persons — create person
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode, parseRansackParams } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const lineageId = Number(id)
        const searchParams = req.nextUrl.searchParams

        // Parse Ransack params
        const ransack = parseRansackParams(searchParams)
        const name = ransack['full_name_cont'] || ransack['name_cont'] || undefined
        const gender = ransack['gender_eq'] || undefined
        const page = Number(searchParams.get('page') || '1')
        const perPage = Number(searchParams.get('per_page') || '20')

        const dal = await getDAL()
        const result = await dal.persons.listByLineage(lineageId, {
            name,
            gender,
            page,
            per_page: perPage,
        })
        return NextResponse.json(result)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const lineageId = Number(id)
        const body = await req.json()
        const payload = body.person ?? body
        const dal = await getDAL()
        const person = await dal.persons.create(lineageId, payload)
        return NextResponse.json({ data: person }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
