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
    version: 2.0.25  # Install specific version number
```

### With Stable Version

```yaml
- uses: pleaseai/setup-claude-code@v1
  with:
    version: stable  # Install stable version (recommended for production)
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

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `version` | Claude Code version to install. Options: `stable` (recommended), `latest`, or specific version number (e.g., `2.0.25`) | No | `latest` |

## Outputs

| Output | Description |
|--------|-------------|
| `cache-hit` | Whether cache was restored (`true` or `false`) |
| `version` | Installed Claude Code version |
| `claude-path` | Absolute path to claude executable |

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
