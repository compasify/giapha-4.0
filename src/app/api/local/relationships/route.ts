// POST /api/local/relationships — create relationship
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

export async function POST(req: NextRequest) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const body = await req.json()
        const payload = body.relationship ?? body
        const dal = await getDAL()
        const relationship = await dal.relationships.create(payload)
        return NextResponse.json({ data: relationship }, { status: 201 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
