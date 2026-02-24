/**
 * Cross-platform Tauri CLI wrapper.
 * Sets APPIMAGE_EXTRACT_AND_RUN=1 so linuxdeploy works without FUSE (CI containers).
 * Forwards all CLI args to the real `tauri` binary.
 */
const { execFileSync } = require('child_process')
const path = require('path')

// Fix linuxdeploy FUSE requirement in CI containers
process.env.APPIMAGE_EXTRACT_AND_RUN = '1'

const tauriBin = path.join(__dirname, '..', 'node_modules', '.bin', 'tauri')
const args = process.argv.slice(2)

try {
  execFileSync(tauriBin, args, { stdio: 'inherit', env: process.env })
} catch (e) {
  process.exit(e.status || 1)
}
