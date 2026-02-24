const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const STANDALONE_SRC = path.join(ROOT, '.next', 'standalone')
const STANDALONE_DST = path.join(ROOT, 'src-tauri', 'standalone')
const BINARIES_DIR = path.join(ROOT, 'src-tauri', 'binaries')

const PLATFORM_MAP = {
  'darwin-arm64': 'aarch64-apple-darwin',
  'darwin-x64': 'x86_64-apple-darwin',
  'linux-x64': 'x86_64-unknown-linux-gnu',
  'win32-x64': 'x86_64-pc-windows-msvc',
}

const platform = `${process.platform}-${process.arch}`
const triple = PLATFORM_MAP[platform]
if (!triple) {
  throw new Error(`Unsupported platform: ${platform}. Supported: ${Object.keys(PLATFORM_MAP).join(', ')}`)
}

console.log(`Platform: ${platform} -> ${triple}`)

// 1. Copy .next/standalone/ -> src-tauri/standalone/
console.log('Copying Next.js standalone output...')
fs.rmSync(STANDALONE_DST, { recursive: true, force: true })
fs.mkdirSync(STANDALONE_DST, { recursive: true })
fs.cpSync(STANDALONE_SRC, STANDALONE_DST, { recursive: true })

// 2. Copy .next/static/ -> src-tauri/standalone/.next/static/ (standalone doesn't include it)
const staticSrc = path.join(ROOT, '.next', 'static')
const staticDst = path.join(STANDALONE_DST, '.next', 'static')
fs.cpSync(staticSrc, staticDst, { recursive: true })

// 3. Copy public/ -> src-tauri/standalone/public/
const publicSrc = path.join(ROOT, 'public')
if (fs.existsSync(publicSrc)) {
  const publicDst = path.join(STANDALONE_DST, 'public')
  fs.cpSync(publicSrc, publicDst, { recursive: true })
}

// 3b. Ensure prisma/schema.prisma is in standalone (belt-and-suspenders with outputFileTracingIncludes)
const schemaSrc = path.join(ROOT, 'prisma', 'schema.prisma')
const schemaDst = path.join(STANDALONE_DST, 'prisma', 'schema.prisma')
if (fs.existsSync(schemaSrc)) {
  fs.mkdirSync(path.dirname(schemaDst), { recursive: true })
  fs.copyFileSync(schemaSrc, schemaDst)
  console.log('Prisma schema copied to standalone/prisma/schema.prisma')
}

// 3c. Copy migration runner script (CJS, runs outside Turbopack)
const migrateRunnerSrc = path.join(ROOT, 'scripts', 'migrate-runner.cjs')
const migrateRunnerDst = path.join(STANDALONE_DST, 'scripts', 'migrate-runner.cjs')
if (fs.existsSync(migrateRunnerSrc)) {
  fs.mkdirSync(path.dirname(migrateRunnerDst), { recursive: true })
  fs.copyFileSync(migrateRunnerSrc, migrateRunnerDst)
  console.log('Migration runner copied to standalone/scripts/migrate-runner.cjs')
}

// 4. Copy current Node.js binary with Tauri target-triple naming convention
//    Tauri externalBin expects: binaries/node-{target-triple}[.exe]
fs.mkdirSync(BINARIES_DIR, { recursive: true })
const nodeExt = process.platform === 'win32' ? '.exe' : ''
const nodeBinDst = path.join(BINARIES_DIR, `node-${triple}${nodeExt}`)
fs.copyFileSync(process.execPath, nodeBinDst)
if (process.platform !== 'win32') {
  fs.chmodSync(nodeBinDst, 0o755)
}

console.log(`Standalone ready: src-tauri/standalone/`)
console.log(`Node binary: src-tauri/binaries/node-${triple}${nodeExt}`)
