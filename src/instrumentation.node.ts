// Node.js-only instrumentation — auto-migrate SQLite in local mode
// Tách riêng để tránh Turbopack Edge Runtime warnings
export async function registerNodeInstrumentation() {
    if (process.env.DATA_MODE !== 'local') return

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        console.warn('[local-mode] DATABASE_URL not set — skipping migrations')
        return
    }

    try {
        // Exec migration as separate CJS process to bypass Turbopack's
        // native addon resolution issues with better-sqlite3
        const { execSync } = await import('child_process')
        const path = await import('path')
        const migrationScript = path.join(process.cwd(), 'scripts', 'migrate-runner.cjs')
        execSync(`"${process.execPath}" "${migrationScript}"`, {
            stdio: 'inherit',
            env: { ...process.env, DATABASE_URL: databaseUrl },
            cwd: process.cwd(),
        })
        console.log('[local-mode] Database migrations applied successfully')
    } catch (err) {
        console.error('[local-mode] Migration failed:', err)
    }
}
