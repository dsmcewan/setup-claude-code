import { describe, expect, it } from 'vitest'
import { parseList, parsePluginList } from '../src/plugins'

describe('plugins', () => {
  describe('parseList', () => {
    it('should parse comma-separated list', () => {
      const result = parseList('item1,item2,item3')

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should parse newline-separated list', () => {
      const result = parseList('item1\nitem2\nitem3')

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should parse mixed comma and newline separated list', () => {
      const result = parseList('item1,item2\nitem3\nitem4,item5')

      expect(result).toEqual(['item1', 'item2', 'item3', 'item4', 'item5'])
    })

    it('should handle YAML multiline format with pipes', () => {
      const yamlMultiline = `owner1/repo1
owner2/repo2
owner3/repo3`

      const result = parseList(yamlMultiline)

      expect(result).toEqual(['owner1/repo1', 'owner2/repo2', 'owner3/repo3'])
    })

    it('should trim whitespace from items', () => {
      const result = parseList('  item1  ,  item2  \n  item3  ')

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should filter out empty items', () => {
      const result = parseList('item1,,\n\nitem2,,,\n\n\nitem3')

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })
  })

  describe('parsePluginList', () => {
    it('should parse comma-separated plugin list', () => {
      const result = parsePluginList('plugin1@marketplace,plugin2@marketplace')

      expect(result).toEqual(['plugin1@marketplace', 'plugin2@marketplace'])
    })

    it('should trim whitespace from plugin names', () => {
      const result = parsePluginList('plugin1@marketplace , plugin2@marketplace  ,  plugin3@marketplace')

      expect(result).toEqual([
        'plugin1@marketplace',
        'plugin2@marketplace',
        'plugin3@marketplace',
      ])
    })

    it('should filter out empty plugin names', () => {
      const result = parsePluginList('plugin1@marketplace,,plugin2@marketplace,  ,')

      expect(result).toEqual(['plugin1@marketplace', 'plugin2@marketplace'])
    })

    it('should handle single plugin', () => {
      const result = parsePluginList('single-plugin@marketplace')

      expect(result).toEqual(['single-plugin@marketplace'])
    })

    it('should return empty array for empty string', () => {
      const result = parsePluginList('')

      expect(result).toEqual([])
    })

    it('should return empty array for whitespace only', () => {
      const result = parsePluginList('   ,  ,  ')

      expect(result).toEqual([])
    })

    it('should handle plugins without marketplace suffix', () => {
      const result = parsePluginList('plugin1,plugin2,plugin3')

      expect(result).toEqual(['plugin1', 'plugin2', 'plugin3'])
    })
  })
})
