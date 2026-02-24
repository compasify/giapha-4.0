#!/usr/bin/env node
// Standalone migration runner — runs outside Next.js/Turbopack context
// Called by instrumentation.ts via execSync to avoid Turbopack's native addon issues
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    console.error('[migrate] DATABASE_URL not set')
    process.exit(1)
}

const Database = require('better-sqlite3')
const dbPath = databaseUrl.replace(/^file:/, '')

// Ensure parent directory exists
const dbDir = path.dirname(dbPath)
fs.mkdirSync(dbDir, { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
            "id"                    TEXT PRIMARY KEY NOT NULL,
            "checksum"              TEXT NOT NULL,
            "finished_at"           DATETIME,
            "migration_name"        TEXT NOT NULL,
            "logs"                  TEXT,
            "rolled_back_at"        DATETIME,
            "started_at"            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
        )
    `)

    const applied = new Set(
        db.prepare('SELECT migration_name FROM _prisma_migrations WHERE rolled_back_at IS NULL').all()
            .map(r => r.migration_name)
    )

    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')
    if (!fs.existsSync(migrationsDir)) {
        console.log('[migrate] No prisma/migrations/ directory — skipping')
        process.exit(0)
    }

    const migrationDirs = fs.readdirSync(migrationsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort()

    let count = 0
    for (const dirName of migrationDirs) {
        if (applied.has(dirName)) continue

        const sqlPath = path.join(migrationsDir, dirName, 'migration.sql')
        if (!fs.existsSync(sqlPath)) continue

        const sql = fs.readFileSync(sqlPath, 'utf-8')
        const checksum = crypto.createHash('sha256').update(sql).digest('hex')
        const migrationId = crypto.randomUUID()

        console.log(`[migrate] Applying: ${dirName}`)

        const apply = db.transaction(() => {
            db.exec(sql)
            db.prepare(`
                INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, applied_steps_count)
                VALUES (?, ?, datetime('now'), ?, 1)
            `).run(migrationId, checksum, dirName)
        })
        apply()
        count++
    }

    if (count > 0) {
        console.log(`[migrate] Applied ${count} migration(s)`)
    } else {
        console.log('[migrate] Database up to date')
    }
} finally {
    db.close()
}
