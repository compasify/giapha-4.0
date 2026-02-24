// Next.js instrumentation — runs once when server starts
// Used to auto-migrate SQLite database in local mode
export async function register() {
    // Only run in Node.js runtime (not Edge)
    if (process.env.NEXT_RUNTIME !== 'nodejs') return
    // Only run when local mode
    if (process.env.DATA_MODE !== 'local') return

    try {
        const { execSync } = await import('child_process')
        execSync('npx prisma migrate deploy', {
            stdio: 'inherit',
            env: { ...process.env },
        })
        console.log('[local-mode] Database migrations applied successfully')
    } catch (err) {
        console.error('[local-mode] Migration failed:', err)
        // Don't throw — app continues, errors will surface when querying
    }
}
