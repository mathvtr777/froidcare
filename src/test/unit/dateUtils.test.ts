import { describe, it, expect } from 'vitest';
import {
  formatDatePt,
  formatShortDatePt,
  formatTimePt,
  getContextualGreeting,
  getDateRangePresets,
  isSameDay,
} from '../../lib/utils';

describe('Date & Localization Utilities Unit Tests', () => {
  it('formats dates into readable Portuguese text', () => {
    const formatted = formatDatePt('2026-10-23T14:30:00.000Z');
    expect(formatted).toContain('outubro');
    expect(formatted).toContain('2026');
  });

  it('formats short dates in dd/MM/yyyy format', () => {
    const formatted = formatShortDatePt('2026-10-23T14:30:00.000Z');
    expect(formatted).toBe('23/10/2026');
  });

  it('formats time correctly', () => {
    const formatted = formatTimePt('2026-10-23T15:45:00.000Z');
    expect(formatted).toMatch(/^\d{2}:\d{2}$/);
  });

  it('returns valid date range presets (7d, 30d, month)', () => {
    const presets = getDateRangePresets();
    expect(presets.last7Days.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(presets.last7Days.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(presets.last30Days.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(presets.thisMonth.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('checks if two ISO strings fall on the same day', () => {
    const same1 = '2026-10-23T08:00:00.000Z';
    const same2 = '2026-10-23T20:00:00.000Z';
    const different = '2026-10-24T08:00:00.000Z';

    expect(isSameDay(same1, same2)).toBe(true);
    expect(isSameDay(same1, different)).toBe(false);
  });

  it('returns contextual greeting with or without display name', () => {
    const withName = getContextualGreeting('Matheus');
    expect(withName.greeting).toContain('Matheus');
    expect(withName.subtitle).toBeTruthy();

    const withoutName = getContextualGreeting();
    expect(withoutName.greeting).toBeTruthy();
    expect(withoutName.subtitle).toBeTruthy();
  });
});
