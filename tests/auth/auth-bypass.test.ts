// Test cho auth bypass logic (local mode)
import { describe, it, expect } from 'vitest'
import { LOCAL_FAKE_USER } from '@/lib/auth/local-user'
import { initLocalUser, useAuthStore } from '@/stores/auth-store'

describe('Auth bypass (local mode)', () => {
    describe('LOCAL_FAKE_USER', () => {
        it('có đúng shape AuthUser', () => {
            expect(LOCAL_FAKE_USER).toMatchObject({
                id: expect.any(Number),
                email: expect.stringContaining('@'),
                name: expect.any(String),
                username: expect.any(String),
                role: 'admin',
            })
        })
    })

    describe('initLocalUser()', () => {
        it('set user khi NEXT_PUBLIC_LOCAL_AUTH_DISABLED=true', () => {
            // Env đã set trong vitest.config.ts
            const store = useAuthStore.getState()
            store.clearUser()

            initLocalUser()

            const state = useAuthStore.getState()
            expect(state.isAuthenticated).toBe(true)
            expect(state.user?.email).toBe('local@desktop.app')
        })
    })
})
