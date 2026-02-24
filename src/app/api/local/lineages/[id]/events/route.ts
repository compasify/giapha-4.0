// GET /api/local/lineages/:id/events — list events with pagination
// POST /api/local/lineages/:id/events — create event
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const lineageId = Number(id)
        const page = Number(req.nextUrl.searchParams.get('page') || '1')
        const perPage = Number(req.nextUrl.searchParams.get('per_page') || '20')

        const dal = await getDAL()
        const result = await dal.events.list({ lineageId, page, per_page: perPage })
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
        const payload = body.event ?? body
        const dal = await getDAL()
        const event = await dal.events.create(lineageId, payload)
        return NextResponse.json({ data: event }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
