// DAL factory — trả về implementation phù hợp dựa vào DATA_MODE env var
// Chỉ chạy trong server context (Route Handlers, Server Actions, instrumentation)
import type { DALInterface } from './types'

let _dal: DALInterface | null = null

export async function getDAL(): Promise<DALInterface> {
    if (_dal) return _dal

    const mode = process.env.DATA_MODE ?? 'api'

    if (mode === 'local') {
        // Dynamic import để Prisma client không bị bundle vào client-side code
        const { localDal } = await import('./local')
        _dal = localDal
    } else {
        // Mode "api" vẫn dùng /api/proxy/ trực tiếp từ hooks — không cần DAL
        throw new Error(
            'ApiDAL chưa implement. Mode "api" vẫn dùng /api/proxy/ trực tiếp từ hooks.'
        )
    }

    return _dal
}

export type { DALInterface } from './types'
