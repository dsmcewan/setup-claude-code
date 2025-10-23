import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'

export interface Platform {
  os: string
  arch: string
  platform: string
}

/**
 * Detect the current platform (OS + architecture)
 */
export function getPlatform(): Platform {
  const osType = os.platform()
  const archType = os.arch()

  let detectedOs: string
  let detectedArch: string

  // Map OS
  switch (osType) {
    case 'darwin':
      detectedOs = 'darwin'
      break
    case 'linux':
      detectedOs = 'linux'
      break
    case 'win32':
      throw new Error('Windows is not supported')
    default:
      throw new Error(`Unsupported OS: ${osType}`)
  }

  // Map architecture
  if (archType === 'x64') {
    detectedArch = 'x64'
  }
  else if (archType === 'arm64') {
    detectedArch = 'arm64'
  }
  else {
    throw new Error(`Unsupported architecture: ${archType}`)
  }

  // Check for musl on Linux
  let platform = `${detectedOs}-${detectedArch}`
  if (detectedOs === 'linux') {
    platform = isMusl() ? `${platform}-musl` : platform
  }

  return {
    os: detectedOs,
    arch: detectedArch,
    platform,
  }
}

/**
 * Check if the system is using musl libc (e.g., Alpine Linux)
 */
function isMusl(): boolean {
  try {
    const isMuslPath
      = fs.existsSync('/lib/libc.musl-x86_64.so.1')
        || fs.existsSync('/lib/libc.musl-aarch64.so.1')

    return isMuslPath
  }
  catch {
    return false
  }
}

/**
 * Add a directory to the system PATH
 */
export async function addToPath(dir: string): Promise<void> {
  core.info(`Adding ${dir} to PATH`)
  core.addPath(dir)
}

/**
 * Get the home directory path
 */
export function getHomeDir(): string {
  return os.homedir()
}

/**
 * Get the Claude Code installation paths
 */
export function getClaudePaths() {
  const home = getHomeDir()
  return {
    bin: path.join(home, '.local', 'bin'),
    data: path.join(home, '.local', 'share', 'claude'),
    executable: path.join(home, '.local', 'bin', 'claude'),
  }
}

/**
 * Verify the Claude Code installation
 */
export async function verifyInstallation(): Promise<{ version: string, path: string }> {
  try {
    const paths = getClaudePaths()

    // Check if executable exists
    if (!fs.existsSync(paths.executable)) {
      throw new Error('Claude Code executable not found')
    }

    // Get version
    let version = 'unknown'
    try {
      const result = await exec.getExecOutput('claude', ['--version'], {
        silent: true,
      })
      version = result.stdout.trim() || 'unknown'
    }
    catch (error) {
      core.warning(`Failed to get Claude Code version: ${error}`)
    }

    core.info(`✅ Claude Code installation verified`)
    core.info(`   Version: ${version}`)
    core.info(`   Path: ${paths.executable}`)

    return {
      version,
      path: paths.executable,
    }
  }
  catch (error) {
    throw new Error(`Failed to verify Claude Code installation: ${error}`)
  }
}

/**
 * Get the current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}
