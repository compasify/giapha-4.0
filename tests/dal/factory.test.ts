// Test cho DAL factory — getDAL() routing logic
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('getDAL()', () => {
    beforeEach(() => {
        // Reset module cache để resetDAL singleton
        vi.resetModules()
    })

    it('trả LocalDAL khi DATA_MODE=local', async () => {
        vi.stubEnv('DATA_MODE', 'local')

        const { getDAL } = await import('@/lib/dal')
        const dal = await getDAL()

        expect(dal).toBeDefined()
        expect(dal.lineages).toBeDefined()
        expect(dal.persons).toBeDefined()
        expect(dal.relationships).toBeDefined()
        expect(dal.events).toBeDefined()
    })

    it('throw error khi DATA_MODE=api (chưa implement)', async () => {
        vi.stubEnv('DATA_MODE', 'api')

        const { getDAL } = await import('@/lib/dal')
        await expect(getDAL()).rejects.toThrow('ApiDAL chưa implement')
    })

    it('default DATA_MODE là "api" → throw', async () => {
        vi.stubEnv('DATA_MODE', '')

        const { getDAL } = await import('@/lib/dal')
        await expect(getDAL()).rejects.toThrow('ApiDAL chưa implement')
    })
})
