// GET /api/local/persons/:id/relationships — relationships by person
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const dal = await getDAL()
        const relationships = await dal.relationships.listByPerson(Number(id))
        return NextResponse.json({ data: relationships })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
