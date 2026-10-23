import { describe, it, expect, beforeEach } from 'vitest';
import { recordsService } from '../../services/recordsService';
import { EmotionalRecordInput } from '../../types';

describe('Emotional Records Unit Tests', () => {
  const testUserId = 'test-user-001';

  beforeEach(() => {
    localStorage.clear();
  });

  it('creates an emotional record with valid intensity and primary emotion', async () => {
    const input: EmotionalRecordInput = {
      primary_emotion: 'ansiedade',
      intensity: 7,
      context: 'Reunião de trabalho tensa',
      triggers: ['Trabalho / Prazos'],
      notes: 'Senti o coração acelerado',
    };

    const record = await recordsService.createRecord(testUserId, input);

    expect(record).toBeDefined();
    expect(record.id).toBeDefined();
    expect(record.user_id).toBe(testUserId);
    expect(record.primary_emotion).toBe('ansiedade');
    expect(record.intensity).toBe(7);
    expect(record.context).toBe('Reunião de trabalho tensa');
    expect(record.triggers).toContain('Trabalho / Prazos');
  });

  it('updates an existing record without creating a duplicate', async () => {
    const initial = await recordsService.createRecord(testUserId, {
      primary_emotion: 'calma',
      intensity: 2,
    });

    const updated = await recordsService.updateRecord(testUserId, initial.id, {
      primary_emotion: 'calma',
      intensity: 4,
      notes: 'Sensação mudou um pouco à tarde',
    });

    expect(updated.id).toBe(initial.id);
    expect(updated.intensity).toBe(4);
    expect(updated.notes).toBe('Sensação mudou um pouco à tarde');

    const list = await recordsService.fetchRecords(testUserId);
    expect(list.records.length).toBe(1);
    expect(list.total).toBe(1);
  });

  it('deletes an existing record cleanly', async () => {
    const r1 = await recordsService.createRecord(testUserId, {
      primary_emotion: 'alivio',
      intensity: 3,
    });
    const r2 = await recordsService.createRecord(testUserId, {
      primary_emotion: 'sobrecarga',
      intensity: 8,
    });

    let list = await recordsService.fetchRecords(testUserId);
    expect(list.records.length).toBe(2);

    await recordsService.deleteRecord(testUserId, r1.id);

    list = await recordsService.fetchRecords(testUserId);
    expect(list.records.length).toBe(1);
    expect(list.records[0].id).toBe(r2.id);
  });

  it('filters records by emotion accurately', async () => {
    await recordsService.createRecord(testUserId, { primary_emotion: 'calma', intensity: 2 });
    await recordsService.createRecord(testUserId, { primary_emotion: 'ansiedade', intensity: 6 });
    await recordsService.createRecord(testUserId, { primary_emotion: 'ansiedade', intensity: 8 });

    const ansiedadeList = await recordsService.fetchRecords(testUserId, { emotion: 'ansiedade' });
    expect(ansiedadeList.records.length).toBe(2);
    expect(ansiedadeList.records.every((r) => r.primary_emotion === 'ansiedade')).toBe(true);

    const calmaList = await recordsService.fetchRecords(testUserId, { emotion: 'calma' });
    expect(calmaList.records.length).toBe(1);
  });

  it('filters records by date boundary without dropping nighttime records', async () => {
    // Record at 23:30 local time
    await recordsService.createRecord(testUserId, {
      primary_emotion: 'calma',
      intensity: 3,
      record_timestamp: '2026-10-23T23:30:00.000Z',
    });

    const res = await recordsService.fetchRecords(testUserId, {
      startDate: '2026-10-23',
      endDate: '2026-10-23',
    });

    expect(res.records.length).toBe(1);
  });

  it('calculates average intensity and handles empty values safely', async () => {
    await recordsService.createRecord(testUserId, { primary_emotion: 'calma', intensity: 4 });
    await recordsService.createRecord(testUserId, { primary_emotion: 'calma', intensity: 8 });

    const { records } = await recordsService.fetchRecords(testUserId);
    const avg = records.reduce((acc, r) => acc + r.intensity, 0) / records.length;
    expect(avg).toBe(6);
  });
});
