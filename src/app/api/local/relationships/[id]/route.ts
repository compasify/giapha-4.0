// DELETE /api/local/relationships/:id
import { NextRequest, NextResponse } from 'next/server'
import { requireLocalMode } from '@/lib/api/local-route-helpers'
import { getDAL } from '@/lib/dal'

type RouteParams = { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const dal = await getDAL()
        await dal.relationships.delete(Number(id))
        return new NextResponse(null, { status: 204 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
