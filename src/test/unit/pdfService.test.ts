import { describe, it, expect } from 'vitest';
import { pdfService } from '../../services/pdfService';
import { EmotionalRecord, ReportConfig } from '../../types';

describe('PDF Report Service Unit Tests', () => {
  const dummyRecords: EmotionalRecord[] = [
    {
      id: 'rec-1',
      user_id: 'usr-1',
      record_timestamp: '2026-10-20T10:00:00.000Z',
      primary_emotion: 'calma',
      intensity: 3,
      context: 'Manhã tranquila em casa',
      notes: 'Respiração profunda e café da manhã acolhedor.',
      activity_used: 'Respiração Guiada',
      created_at: '2026-10-20T10:00:00.000Z',
      updated_at: '2026-10-20T10:00:00.000Z',
    },
    {
      id: 'rec-2',
      user_id: 'usr-1',
      record_timestamp: '2026-10-22T19:30:00.000Z',
      primary_emotion: 'ansiedade',
      intensity: 7,
      context: 'Prazos acumulados',
      triggers: ['Trabalho / Prazos'],
      notes: 'Tensão muscular na região dos ombros e mandíbula.',
      activity_used: 'Aterramento Sensorial (5-4-3-2-1)',
      post_intensity: 5,
      created_at: '2026-10-22T19:30:00.000Z',
      updated_at: '2026-10-22T19:30:00.000Z',
    },
  ];

  const config: ReportConfig = {
    periodType: '7d',
    startDate: '2026-10-18',
    endDate: '2026-10-24',
    includeNotes: true,
    includeSummary: true,
    includeCharts: true,
    includeActivities: true,
    displayName: 'Matheus Teste',
  };

  it('generates a valid jsPDF document instance with real records', () => {
    const doc = pdfService.generateReport(dummyRecords, config);
    expect(doc).toBeDefined();
    // Document should have pages and be exportable to arraybuffer
    const output = doc.output('arraybuffer');
    expect(output.byteLength).toBeGreaterThan(1000);
  });

  it('handles empty records list without crashing and still generates document', () => {
    const doc = pdfService.generateReport([], config);
    expect(doc).toBeDefined();
    const output = doc.output('arraybuffer');
    expect(output.byteLength).toBeGreaterThan(500);
  });
});
