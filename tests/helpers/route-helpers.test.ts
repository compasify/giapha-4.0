// Test cho local route helpers
import { describe, it, expect } from 'vitest'
import { parseRansackParams, requireLocalMode } from '@/lib/api/local-route-helpers'

describe('parseRansackParams', () => {
    it('parse q[key]=value format', () => {
        const params = new URLSearchParams('q[full_name_cont]=Nguyễn&q[gender_eq]=male')
        const result = parseRansackParams(params)

        expect(result).toEqual({
            full_name_cont: 'Nguyễn',
            gender_eq: 'male',
        })
    })

    it('ignore non-Ransack params', () => {
        const params = new URLSearchParams('page=1&per_page=20&q[name_cont]=An')
        const result = parseRansackParams(params)

        expect(result).toEqual({ name_cont: 'An' })
    })

    it('trả empty object khi không có Ransack params', () => {
        const params = new URLSearchParams('page=1')
        const result = parseRansackParams(params)

        expect(result).toEqual({})
    })

    it('handle empty value', () => {
        const params = new URLSearchParams('q[name_cont]=')
        const result = parseRansackParams(params)

        expect(result).toEqual({ name_cont: '' })
    })
})

describe('requireLocalMode', () => {
    it('trả null khi DATA_MODE=local', () => {
        // Env đã set trong vitest.config.ts
        const result = requireLocalMode()
        expect(result).toBeNull()
    })
})
