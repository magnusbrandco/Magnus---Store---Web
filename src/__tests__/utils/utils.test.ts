import { describe, it, expect } from 'vitest'
import { truncate } from '@/lib/utils'

describe('Utils', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      const longString = 'This is a very long string that should be truncated'
      expect(truncate(longString, 10)).toBe('This is a ...')
    })

    it('should not truncate short strings', () => {
      const shortString = 'Short'
      expect(truncate(shortString, 10)).toBe('Short')
    })

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('should handle exact length match', () => {
      expect(truncate('Short', 5)).toBe('Short')
    })
  })
})
