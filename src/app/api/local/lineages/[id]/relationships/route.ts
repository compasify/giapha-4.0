// GET /api/local/lineages/:id/relationships — all relationships in lineage
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
        const perPage = Number(req.nextUrl.searchParams.get('per_page') || '500')

        const dal = await getDAL()
        const result = await dal.relationships.listByLineage(lineageId, { per_page: perPage })
        return NextResponse.json(result)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
