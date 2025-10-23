import * as os from 'node:os'
import { describe, expect, it } from 'vitest'
import { getCacheKey, getRestoreKeys } from '../src/cache'

describe('cache', () => {
  const platform = os.platform()

  describe('getCacheKey', () => {
    it('should generate key for specific version', () => {
      const key = getCacheKey('1.0.0')

      expect(key).toBe(`claude-code-v2-${platform}-1.0.0`)
    })

    it('should generate key for latest version with date', () => {
      const key = getCacheKey('latest')

      expect(key).toMatch(new RegExp(`^claude-code-v2-${platform}-latest-\\d{4}-\\d{2}-\\d{2}$`))
    })
  })

  describe('getRestoreKeys', () => {
    it('should generate restore keys', () => {
      const keys = getRestoreKeys('1.0.0')

      expect(keys).toEqual([
        `claude-code-v2-${platform}-1.0.0-`,
        `claude-code-v2-${platform}-`,
      ])
    })

    it('should generate restore keys for latest', () => {
      const keys = getRestoreKeys('latest')

      expect(keys).toEqual([
        `claude-code-v2-${platform}-latest-`,
        `claude-code-v2-${platform}-`,
      ])
    })
  })
})
