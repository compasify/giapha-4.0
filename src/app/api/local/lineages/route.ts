// GET /api/local/lineages — list all lineages
// POST /api/local/lineages — create a new lineage
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

export async function GET() {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const dal = await getDAL()
        const lineages = await dal.lineages.list()
        return NextResponse.json({
            data: lineages,
            meta: {
                total_entries: lineages.length,
                current_page: 1,
                per_page: 100,
                total_pages: 1,
            },
        })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const body = await req.json()
        const payload = body.lineage ?? body
        const dal = await getDAL()
        const lineage = await dal.lineages.create(payload)
        return NextResponse.json({ data: lineage }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
