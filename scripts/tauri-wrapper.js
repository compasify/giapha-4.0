/**
 * Cross-platform Tauri CLI wrapper.
 * Sets APPIMAGE_EXTRACT_AND_RUN=1 so linuxdeploy works without FUSE (CI containers).
 * Uses shell:true + npx for Windows compatibility (.cmd resolution).
 */
const { spawnSync } = require('child_process')

// Fix linuxdeploy FUSE requirement in CI containers
process.env.APPIMAGE_EXTRACT_AND_RUN = '1'

const args = process.argv.slice(2)
const result = spawnSync('npx', ['tauri', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
})

process.exit(result.status || 0)
