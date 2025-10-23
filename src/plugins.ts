import * as core from '@actions/core'
import * as exec from '@actions/exec'

export interface MarketplaceInfo {
  name: string
  repo: string
}

/**
 * Check if a marketplace is already installed
 */
export async function isMarketplaceInstalled(repo: string): Promise<MarketplaceInfo | null> {
  try {
    const result = await exec.getExecOutput('claude', ['plugin', 'marketplace', 'list'], {
      silent: true,
    })

    const lines = result.stdout.split('\n')

    // Parse output to find marketplace by repo
    // Expected format: "  ❯ marketplace-name"
    //                  "    Source: GitHub (owner/repo)"
    let currentMarketplaceName: string | null = null

    for (const line of lines) {
      // Check if line is a marketplace name (starts with ❯)
      const nameMatch = line.match(/^\s*❯\s*(\S.*)$/)
      if (nameMatch) {
        currentMarketplaceName = nameMatch[1].trim()
        continue
      }

      // Check if line contains the repo
      if (currentMarketplaceName) {
        const repoMatch = line.match(/Source:\s*GitHub\s*\(([^)]+)\)/)
        if (repoMatch && repoMatch[1] === repo) {
          return {
            name: currentMarketplaceName,
            repo,
          }
        }
      }
    }

    return null
  }
  catch (error) {
    core.debug(`Failed to check marketplace: ${error}`)
    return null
  }
}

/**
 * Add or update a plugin marketplace
 * Supports multiple formats:
 * - GitHub: owner/repo
 * - Git URL: https://gitlab.com/company/plugins.git
 * - Local path: ./my-marketplace or ./path/to/marketplace.json
 * - Remote URL: https://url.of/marketplace.json
 */
export async function addOrUpdateMarketplace(source: string): Promise<boolean> {
  core.info(`📦 Checking plugin marketplace: ${source}`)

  // For GitHub repos, check if already installed
  // For other sources, we'll just try to add and handle errors
  const isGitHubRepo = /^[\w-]+\/[\w-]+$/.test(source)

  if (isGitHubRepo) {
    const existing = await isMarketplaceInstalled(source)

    if (existing) {
      core.info(`  ✅ Marketplace already installed: ${existing.name}`)
      core.info('  🔄 Updating marketplace...')

      try {
        await exec.exec('claude', ['plugin', 'marketplace', 'update', existing.name])
        core.info('  ✅ Marketplace updated successfully')
        return false // Not newly added
      }
      catch (error) {
        throw new Error(`Failed to update marketplace: ${error}`)
      }
    }
  }

  // Add new marketplace (works for all source types)
  core.info('  📦 Adding marketplace...')

  try {
    await exec.exec('claude', ['plugin', 'marketplace', 'add', source])
    core.info('  ✅ Marketplace added successfully')
    return true // Newly added
  }
  catch (error) {
    throw new Error(`Failed to add marketplace: ${error}`)
  }
}

/**
 * Parse a multiline or comma-separated string into array
 * Supports both formats:
 * - Comma-separated: "item1,item2,item3"
 * - Newline-separated: "item1\nitem2\nitem3"
 * - Mixed: "item1,item2\nitem3"
 */
export function parseList(input: string): string[] {
  return input
    .split(/[\n,]/) // Split by newline or comma
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

/**
 * Parse plugin list string into array
 */
export function parsePluginList(pluginList: string): string[] {
  return parseList(pluginList)
}

/**
 * Add or update multiple plugin marketplaces
 */
export async function addOrUpdateMarketplaces(marketplacesInput: string): Promise<number> {
  const marketplaces = parseList(marketplacesInput)

  if (marketplaces.length === 0) {
    core.warning('No marketplaces specified to add')
    return 0
  }

  core.info(`📦 Processing ${marketplaces.length} marketplace(s)...`)

  let addedOrUpdated = 0

  for (const marketplace of marketplaces) {
    try {
      const wasAdded = await addOrUpdateMarketplace(marketplace)
      addedOrUpdated++

      if (wasAdded) {
        core.info(`  ✅ Added: ${marketplace}`)
      }
      else {
        core.info(`  ✅ Updated: ${marketplace}`)
      }
    }
    catch (error) {
      throw new Error(`Failed to process marketplace "${marketplace}": ${error}`)
    }
  }

  core.info(`✅ Processed ${addedOrUpdated} marketplace(s) successfully`)

  return addedOrUpdated
}

/**
 * Install multiple plugins
 */
export async function installPlugins(pluginList: string): Promise<string[]> {
  const plugins = parsePluginList(pluginList)

  if (plugins.length === 0) {
    core.warning('No plugins specified to install')
    return []
  }

  core.info(`📥 Installing ${plugins.length} plugin(s)...`)

  const installed: string[] = []

  for (const plugin of plugins) {
    core.info(`  Installing: ${plugin}`)

    try {
      await exec.exec('claude', ['plugin', 'install', plugin])
      core.info('    ✅ Installed successfully')
      installed.push(plugin)
    }
    catch (error) {
      throw new Error(`Failed to install plugin "${plugin}": ${error}`)
    }
  }

  core.info(`✅ All ${installed.length} plugin(s) installed successfully`)

  return installed
}
