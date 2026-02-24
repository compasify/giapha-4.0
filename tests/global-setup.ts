// Global setup cho Vitest — tạo test.db và chạy migrations trước khi test
import { execSync } from 'child_process'
import { existsSync, unlinkSync } from 'fs'
import path from 'path'

const TEST_DB = path.resolve(__dirname, '..', 'data', 'test.db')
const TEST_DB_URL = `file:${TEST_DB}`

export async function setup() {
    // Xóa database cũ nếu tồn tại
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
        const f = TEST_DB + suffix
        if (existsSync(f)) unlinkSync(f)
    }

    // Chạy migration để tạo schema in test.db
    execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..'),
        env: {
            ...process.env,
            DATABASE_URL: TEST_DB_URL,
        },
    })

    console.log(`[test-setup] Test database migrated successfully at ${TEST_DB}`)
}

export async function teardown() {
    // Xóa test database sau khi chạy xong
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
        const f = TEST_DB + suffix
        if (existsSync(f)) unlinkSync(f)
    }

    console.log('[test-teardown] Test database cleaned up')
}
