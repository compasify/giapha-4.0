// Helper functions cho local API route handlers
import { NextResponse } from 'next/server'

// Guard: kiểm tra DATA_MODE — dùng ở đầu mỗi handler
export function requireLocalMode(): NextResponse | null {
    if (process.env.DATA_MODE !== 'local') {
        return NextResponse.json({ error: 'Local mode not enabled' }, { status: 404 })
    }
    return null
}

// Parse Ransack query params: q[full_name_cont]=foo → { full_name_cont: 'foo' }
export function parseRansackParams(searchParams: URLSearchParams): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of searchParams.entries()) {
        const match = key.match(/^q\[(\w+)\]$/)
        if (match) result[match[1]] = value
    }
    return result
}
