// GET /api/local/persons/:id
// PATCH /api/local/persons/:id
// DELETE /api/local/persons/:id
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
        const person = await dal.persons.get(Number(id))
        return NextResponse.json({ data: person })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const body = await req.json()
        const payload = body.person ?? body
        const dal = await getDAL()
        const person = await dal.persons.update(Number(id), payload)
        return NextResponse.json({ data: person })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    const guard = requireLocalMode()
    if (guard) return guard

    try {
        const { id } = await params
        const dal = await getDAL()
        await dal.persons.delete(Number(id))
        return new NextResponse(null, { status: 204 })
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
