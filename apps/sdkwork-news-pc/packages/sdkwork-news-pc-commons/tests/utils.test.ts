import { describe, it, expect } from 'vitest';
import { formatDate, formatTime, formatDateTime, truncateText } from '../src/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2026-06-13T10:30:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatTime', () => {
    it('should format time string', () => {
      const result = formatTime('2026-06-13T10:30:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime string', () => {
      const result = formatDateTime('2026-06-13T10:30:00Z');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });
  });
});

