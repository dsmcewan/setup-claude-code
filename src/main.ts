import * as core from '@actions/core'
import { restoreCache, saveCache } from './cache'
import { installClaudeCode } from './installer'
import { addOrUpdateMarketplaces, installPlugins, setGitHubToken } from './plugins'
import { addToPath, getClaudePaths, setupGitCredentials, verifyInstallation } from './utils'

async function run(): Promise<void> {
  try {
    // Get inputs
    const version = core.getInput('version') || 'latest'
    const githubToken = core.getInput('github_token')
    const marketplacesInput = core.getInput('marketplaces')
    const pluginList = core.getInput('plugins')

    core.info(`Setting up Claude Code version: ${version}`)

    // Try to restore from cache
    const cacheHit = await restoreCache({ version })
    core.setOutput('cache-hit', cacheHit ? 'true' : 'false')

    // Install if cache miss
    if (!cacheHit) {
      await installClaudeCode({ version })

      // Save to cache
      await saveCache({ version })
    }
    else {
      core.info('Using cached Claude Code installation')
    }

    // Add to PATH
    const paths = getClaudePaths()
    await addToPath(paths.bin)

    // Verify installation
    const { version: installedVersion, path: claudePath } = await verifyInstallation()

    // Set outputs
    core.setOutput('version', installedVersion)
    core.setOutput('claude-path', claudePath)

    core.info('✅ Claude Code setup completed successfully!')

    // Setup Git credentials for plugin installation (converts SSH to HTTPS)
    // This is needed even for public repositories to avoid SSH authentication issues
    if ((marketplacesInput || pluginList) && githubToken) {
      core.info('')
      await setupGitCredentials(githubToken)

      // Set GitHub token for claude CLI commands (for private marketplace/plugin repos)
      setGitHubToken(githubToken)
    }

    // Handle plugin marketplace and installation
    if (marketplacesInput) {
      core.info('')
      const addedCount = await addOrUpdateMarketplaces(marketplacesInput)
      core.setOutput('marketplaces_added', addedCount.toString())
    }

    if (pluginList) {
      core.info('')
      const installedPlugins = await installPlugins(pluginList)
      core.setOutput('plugins_installed', installedPlugins.join(','))
    }

    if (marketplacesInput || pluginList) {
      core.info('')
      core.info('🎉 Plugin setup completed successfully!')
    }
  }
  catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
    else {
      core.setFailed(String(error))
    }
  }
}

run()
