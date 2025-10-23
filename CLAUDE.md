# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@docs/STANDARDS.md
@docs/TDD.md
@docs/TESTING.md
@docs/commit-convention.md

## Project Overview

This is a GitHub Action (`setup-claude-code`) that installs Claude Code CLI with GitHub Actions cache support. Built with TypeScript and Node.js 24, it provides a testable, maintainable alternative to shell-based actions.

## Architecture

### TypeScript-Based Action

This action uses Node.js 24 runtime (`using: node24` in action.yml) with TypeScript source compiled to a single JavaScript bundle in `dist/index.js` using @vercel/ncc.

### Project Structure

```
src/
├── main.ts       # Entry point - orchestrates the workflow
├── installer.ts  # Installation logic (download, verify, install)
├── cache.ts      # Cache key generation and restore/save
└── utils.ts      # Platform detection, PATH management, verification

test/
├── utils.test.ts
├── cache.test.ts
└── integration.test.ts (planned)

.github/workflows/
├── test.yml          # CI: lint, typecheck, test, build
└── integration.yml   # E2E: actual installation test
```

### Key Components

**Inputs:**
- `version`: Claude Code version to install (default: "latest")

**Outputs:**
- `cache-hit`: Whether cache was restored (true/false)
- `version`: Installed Claude Code version
- `claude-path`: Absolute path to claude executable

**Installation Paths:**
- Binary: `~/.local/bin/claude`
- Data: `~/.local/share/claude`

### Caching Strategy

The action uses a two-tier caching approach:

1. **Versioned releases**: Cache key `claude-code-v2-{os}-{version}` (permanent)
2. **Latest version**: Cache key `claude-code-v2-{os}-latest-{date}` (daily rotation)

Cache restore uses fallback keys to maximize cache hits across versions and dates.

Implemented in `src/cache.ts` with `@actions/cache`.

### Installation Flow

1. **Cache restore** (`src/cache.ts`): Try to restore from cache
2. **Install** (`src/installer.ts`): If cache miss:
   - Fetch stable version from GCS bucket
   - Download manifest.json and extract checksum
   - Download binary from GCS
   - Verify SHA256 checksum
   - Run `claude install` command
3. **Cache save** (`src/cache.ts`): Save to cache if fresh install
4. **PATH setup** (`src/utils.ts`): Add `~/.local/bin` to PATH
5. **Verify** (`src/utils.ts`): Run `claude --version` and output results

## Development

### Commands

```bash
# Install dependencies
npm install

# Run tests (with watch mode)
npm test

# Run tests once with coverage
npm run test:ci

# Lint
npm run lint
npm run lint:fix

# Type check
npm run typecheck

# Build (compiles to dist/index.js)
npm run build
```

### Tech Stack

- **Runtime**: Node.js 24
- **Language**: TypeScript 5.x
- **Testing**: Vitest 3.x (faster than Jest, native TS/ESM support)
- **Linting**: @antfu/eslint-config (zero-config flat config)
- **Build**: @vercel/ncc (bundles to single file with dependencies)

### Testing

1. **Unit tests**: Run with `npm test`
   - `test/utils.test.ts`: Platform detection, date formatting
   - `test/cache.test.ts`: Cache key generation

2. **Integration tests**: Run via GitHub Actions
   - `.github/workflows/integration.yml`: Tests actual installation

3. **Local testing**: Unit tests only - full integration requires GitHub Actions environment

### Making Changes

1. Modify TypeScript source in `src/`
2. Run tests: `npm test`
3. Build: `npm run build`
4. Commit both source and `dist/` folder
5. CI will verify `dist/` matches compiled output

**Important**: Always commit the built `dist/` folder. GitHub Actions can't compile TypeScript at runtime.

### Adding New Features

1. Write tests first (TDD)
2. Implement in appropriate module (`installer.ts`, `cache.ts`, `utils.ts`)
3. Update `main.ts` if needed
4. Run full test suite: `npm run test:ci`
5. Build and commit: `npm run build && git add dist/`

## Caching Details

GCS bucket URL: `https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases`

Manifest structure:
```json
{
  "platforms": {
    "linux-x64": { "checksum": "..." },
    "linux-x64-musl": { "checksum": "..." },
    "darwin-x64": { "checksum": "..." },
    "darwin-arm64": { "checksum": "..." }
  }
}
```

## Troubleshooting

- **Type errors**: Run `npm run typecheck`
- **Lint errors**: Run `npm run lint:fix`
- **Test failures**: Run `npm test` for watch mode
- **dist/ mismatch**: Run `npm run build` and commit
- **Cache issues**: Check cache key format in `src/cache.ts`
