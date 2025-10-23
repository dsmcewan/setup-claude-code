import { describe, expect, it } from 'vitest'
import { getCurrentDate, getPlatform } from '../src/utils'

describe('utils', () => {
  describe('getPlatform', () => {
    it('should detect platform', () => {
      const platform = getPlatform()

      expect(platform).toHaveProperty('os')
      expect(platform).toHaveProperty('arch')
      expect(platform).toHaveProperty('platform')

      expect(['darwin', 'linux']).toContain(platform.os)
      expect(['x64', 'arm64']).toContain(platform.arch)
    })

    it('should include musl suffix for musl-based systems', () => {
      const platform = getPlatform()

      if (platform.os === 'linux') {
        expect(platform.platform).toMatch(/^linux-(x64|arm64)(-musl)?$/)
      }
    })
  })

  describe('getCurrentDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getCurrentDate()

      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)

      // Verify it's a valid date
      const parsed = new Date(date)
      expect(parsed.toString()).not.toBe('Invalid Date')
    })
  })
})
