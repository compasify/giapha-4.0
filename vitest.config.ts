/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'path'

const testDbPath = path.resolve(__dirname, 'data', 'test.db')

export default defineConfig({
    test: {
        // Vitest 4: sequential execution to avoid SQLite concurrency
        sequence: {
            concurrent: false,
        },
        fileParallelism: false,
        testTimeout: 15000,
        exclude: [
            '**/node_modules/**',
            '**/bfs-pathfinder.test.ts',
        ],
        // Setup env vars cho test — dùng absolute path
        env: {
            DATA_MODE: 'local',
            DATABASE_URL: `file:${testDbPath}`,
            LOCAL_AUTH_DISABLED: 'true',
            NEXT_PUBLIC_LOCAL_AUTH_DISABLED: 'true',
        },
        // Global setup/teardown
        globalSetup: './tests/global-setup.ts',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})
