# Setup Claude Code

[![Test](https://github.com/pleaseai/setup-claude-code/actions/workflows/test.yml/badge.svg)](https://github.com/pleaseai/setup-claude-code/actions/workflows/test.yml)
[![Integration Test](https://github.com/pleaseai/setup-claude-code/actions/workflows/integration.yml/badge.svg)](https://github.com/pleaseai/setup-claude-code/actions/workflows/integration.yml)
[![codecov](https://codecov.io/gh/pleaseai/setup-claude-code/graph/badge.svg?token=UDgUvPCl4k)](https://codecov.io/gh/pleaseai/setup-claude-code)
[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

Install [Claude Code CLI](https://claude.ai/code) in your GitHub Actions workflows with built-in caching support.

## Features

- ⚡ **Fast**: Built-in caching reduces installation time
- 🔒 **Secure**: Verifies binary checksums via SHA256
- 🧪 **Tested**: Comprehensive unit and integration tests
- 📦 **TypeScript**: Type-safe, maintainable codebase
- 🚀 **Node 24**: Uses the latest Node.js runtime
- 🔌 **Plugins**: Install marketplace and plugins in one step

## Usage

### Basic Example

```yaml
name: CI
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pleaseai/setup-claude-code@v1
        with:
          version: latest

      - run: claude --version
```

### With Specific Version

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    version: 2.0.25 # Install specific version number
```

### With Stable Version

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    version: stable # Install stable version (recommended for production)
```

### Using Outputs

```yaml
- uses: pleaseai/setup-claude-code@v1
  id: setup-claude
  with:
    version: latest

- run: |
    echo "Cache hit: ${{ steps.setup-claude.outputs.cache-hit }}"
    echo "Version: ${{ steps.setup-claude.outputs.version }}"
    echo "Path: ${{ steps.setup-claude.outputs.claude-path }}"
```

### Installing Plugins

#### Single Marketplace with Comma-Separated Plugins

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    marketplaces: chatbot-pf/claude-plugins
    plugins: dev-tools@passionfactory,pr-review-toolkit@passionfactory
```

#### Private Repositories

The action automatically uses `${{ github.token }}` for git authentication. For private repositories with custom access requirements, you can provide a Personal Access Token (PAT):

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    github_token: ${{ secrets.MY_PAT }} # Optional: only needed for custom access
    marketplaces: your-org/private-plugins
    plugins: private-plugin@your-org
```

#### Multiple Marketplaces with Multiline Format

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    marketplaces: |
      chatbot-pf/claude-plugins
      company/private-plugins
      https://gitlab.com/org/plugins.git
    plugins: |
      dev-tools@passionfactory
      pr-review-toolkit@passionfactory
      custom-plugin@company
```

#### From Various Sources

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    marketplaces: |
      owner/repo
      https://gitlab.com/company/plugins.git
      https://url.of/marketplace.json
      ./local/marketplace
    plugins: plugin1,plugin2,plugin3
```

#### Note on Marketplaces

**Important**: Claude Code CLI does not have a default marketplace. You must add at least one marketplace before installing plugins. The `marketplaces` input is required if you want to use the `plugins` input.

Example with marketplace and plugins together:

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    marketplaces: chatbot-pf/claude-plugins
    plugins: |
      dev-tools@passionfactory
      pr-review-toolkit@passionfactory
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `version` | Claude Code version to install. Options: `stable` (recommended), `latest`, or specific version number (e.g., `2.0.25`) | No | `latest` |
| `github_token` | GitHub token for accessing plugin repositories. Automatically defaults to `${{ github.token }}`. Provide a custom PAT only if you need special access permissions. | No | `${{ github.token }}` |
| `marketplaces` | Plugin marketplace sources. Supports: GitHub (`owner/repo`), Git URL, local path, or remote URL. Can be comma-separated or newline-separated (with `\|`) for multiple marketplaces. **Required if installing plugins.** | No | - |
| `plugins` | List of plugins to install. Can be comma-separated or newline-separated (with `\|`). **Requires `marketplaces` to be specified.** | No | - |

## Outputs

| Output | Description |
|--------|-------------|
| `cache-hit` | Whether cache was restored (`true` or `false`) |
| `version` | Installed Claude Code version |
| `claude-path` | Absolute path to claude executable |
| `marketplaces_added` | Number of marketplaces added or updated |
| `plugins_installed` | Comma-separated list of successfully installed plugins |

## Caching

This action automatically caches Claude Code installations to speed up your workflows:

- **Latest version**: Daily cache rotation (cache key includes date)
- **Specific versions**: Permanent cache (cache key is version-specific)

Cache keys follow the pattern:
- Latest: `claude-code-v2-{os}-latest-{date}`
- Versioned: `claude-code-v2-{os}-{version}`

## Platform Support

- ✅ Linux (x64, arm64)
- ✅ Linux with musl (x64, arm64) - Alpine, etc.
- ✅ macOS (x64, arm64)
- ❌ Windows (not supported by Claude Code CLI)

## Development

This action is built with TypeScript and uses modern tooling:

- **Runtime**: Node.js 24
- **Testing**: Vitest 3.x
- **Linting**: @antfu/eslint-config
- **Build**: @vercel/ncc

### Setup

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

### Commands

```bash
npm test          # Run tests in watch mode
npm run test:ci   # Run tests once with coverage
npm run lint      # Check code style
npm run lint:fix  # Auto-fix style issues
npm run typecheck # Type check without emitting
npm run build     # Compile to dist/index.js
```

### Making Changes

1. Modify TypeScript source in `src/`
2. Write/update tests in `test/`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Commit both source and compiled `dist/` folder

**Important**: Always commit the `dist/` folder. GitHub Actions cannot compile TypeScript at runtime.

## Architecture

```
src/
├── main.ts       # Entry point
├── installer.ts  # Download, verify, install logic
├── cache.ts      # Cache key generation and operations
└── utils.ts      # Platform detection, PATH management

test/
├── utils.test.ts
└── cache.test.ts

.github/workflows/
├── test.yml          # CI: lint, test, build
└── integration.yml   # E2E: actual installation test
```

## License

MIT

## Author

Minsu Lee ([@amondnet](https://github.com/amondnet))
