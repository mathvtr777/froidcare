import { jsPDF } from 'jspdf';
import { EmotionalRecord, ReportConfig } from '../types';
import { EMOTIONS } from '../constants';
import { formatDatePt, formatShortDatePt, formatTimePt } from '../lib/utils';

export const pdfService = {
  generateReport(records: EmotionalRecord[], config: ReportConfig): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let currentY = margin;

    // Helper to check page overflow and add new page
    const checkPageBreak = (neededHeight: number) => {
      if (currentY + neededHeight > pageHeight - 20) {
        doc.addPage();
        currentY = margin;
        renderHeader();
      }
    };

    const renderHeader = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Froid Care — Relatório de Bem-Estar e Acompanhamento Pessoal', margin, currentY);
      doc.text(
        `Gerado em ${formatShortDatePt(new Date().toISOString())}`,
        pageWidth - margin,
        currentY,
        { align: 'right' }
      );
      currentY += 4;
      doc.setDrawColor(210, 215, 220);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 8;
    };

    // 1. Initial Header
    renderHeader();

    // 2. Report Title & Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(24, 28, 36);
    doc.text('Relatório de Registros Emocionais', margin, currentY);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 75, 85);

    const userLabel = config.displayName ? `Usuário: ${config.displayName}` : 'Documento Pessoal';
    doc.text(userLabel, margin, currentY);
    currentY += 5;

    const periodLabel = `Período selecionado: ${formatDatePt(config.startDate)} até ${formatDatePt(config.endDate)}`;
    doc.text(periodLabel, margin, currentY);
    currentY += 5;

    doc.text(`Total de registros no período: ${records.length}`, margin, currentY);
    currentY += 8;

    // 3. Clinical Disclaimer Box (Important!)
    doc.setFillColor(245, 247, 248);
    doc.setDrawColor(200, 215, 210);
    doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(40, 75, 60);
    doc.text('Nota informativa e limitação metodológica:', margin + 4, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 65, 75);
    const disclaimerLines = doc.splitTextToSize(
      'Este documento reúne exclusivamente informações autorrelatadas pela pessoa no aplicativo Froid Care. Não constitui diagnóstico, prescrição ou parecer clínico, devendo ser interpretado como um instrumento de apoio ao diálogo com profissionais de saúde mental.',
      contentWidth - 8
    );
    doc.text(disclaimerLines, margin + 4, currentY + 9.5);
    currentY += 24;

    // 4. Summary & Descriptive Overview
    if (config.includeSummary && records.length > 0) {
      checkPageBreak(35);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(30, 35, 45);
      doc.text('1. Resumo Descritivo do Período', margin, currentY);
      currentY += 6;

      // Calculate stats
      const totalIntensity = records.reduce((acc, r) => acc + r.intensity, 0);
      const avgIntensity = (totalIntensity / records.length).toFixed(1);

      // Emotion distribution
      const emotionCounts: Record<string, number> = {};
      records.forEach((r) => {
        const emo = r.primary_emotion;
        emotionCounts[emo] = (emotionCounts[emo] || 0) + 1;
      });

      const sortedEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => {
          const def = EMOTIONS.find((e) => e.id === id);
          return `${def ? def.label : id} (${count}x, ${Math.round((count / records.length) * 100)}%)`;
        });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 55, 65);

      doc.text(`• Média de intensidade percebida: ${avgIntensity} de 10`, margin + 2, currentY);
      currentY += 5;

      const emotionSummaryText = `• Emoções mais frequentes: ${sortedEmotions.join(', ')}`;
      const wrappedEmotionSummary = doc.splitTextToSize(emotionSummaryText, contentWidth - 4);
      doc.text(wrappedEmotionSummary, margin + 2, currentY);
      currentY += wrappedEmotionSummary.length * 4.5 + 4;
    }

    // 5. Detailed Records Table
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 35, 45);
    doc.text('2. Registros Cronológicos', margin, currentY);
    currentY += 6;

    if (records.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 105, 115);
      doc.text('Nenhum registro emocional encontrado no intervalo de datas selecionado.', margin, currentY);
      currentY += 10;
    } else {
      // Table Header
      const colWidths = {
        date: 28,
        time: 14,
        emotion: 28,
        intensity: 22,
        activity: 28,
        notes: contentWidth - (28 + 14 + 28 + 22 + 28),
      };

      const renderTableHeader = () => {
        doc.setFillColor(235, 240, 243);
        doc.rect(margin, currentY, contentWidth, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(40, 45, 55);

        let colX = margin + 2;
        doc.text('Data', colX, currentY + 4.8);
        colX += colWidths.date;
        doc.text('Hora', colX, currentY + 4.8);
        colX += colWidths.time;
        doc.text('Emoção', colX, currentY + 4.8);
        colX += colWidths.emotion;
        doc.text('Intensidade', colX, currentY + 4.8);
        colX += colWidths.intensity;
        doc.text('Atividade', colX, currentY + 4.8);
        colX += colWidths.activity;
        doc.text('Anotações / Contexto', colX, currentY + 4.8);
        currentY += 8;
      };

      renderTableHeader();

      records.forEach((record, idx) => {
        const emoDef = EMOTIONS.find((e) => e.id === record.primary_emotion);
        const emoLabel = emoDef ? emoDef.label : record.primary_emotion;
        const dateStr = formatShortDatePt(record.record_timestamp);
        const timeStr = formatTimePt(record.record_timestamp);
        const intensityStr = `${record.intensity}/10${
          record.post_intensity !== null && record.post_intensity !== undefined
            ? ` (após: ${record.post_intensity})`
            : ''
        }`;

        let notesText = '';
        if (config.includeNotes) {
          const parts: string[] = [];
          if (record.context) parts.push(`Contexto: ${record.context}`);
          if (record.triggers && record.triggers.length > 0) parts.push(`Gatilhos: ${record.triggers.join(', ')}`);
          if (record.notes) parts.push(record.notes);
          notesText = parts.join(' | ') || '—';
        } else {
          notesText = 'Omitido pelo usuário';
        }

        const wrappedNotes = doc.splitTextToSize(notesText, colWidths.notes - 4);
        const rowHeight = Math.max(7, wrappedNotes.length * 3.8 + 3);

        checkPageBreak(rowHeight + 4);

        // Zebra striping
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.8);
        doc.setTextColor(45, 50, 60);

        let cellX = margin + 2;
        doc.text(dateStr, cellX, currentY + 4.2);
        cellX += colWidths.date;
        doc.text(timeStr, cellX, currentY + 4.2);
        cellX += colWidths.time;
        doc.setFont('helvetica', 'bold');
        doc.text(emoLabel, cellX, currentY + 4.2);
        doc.setFont('helvetica', 'normal');
        cellX += colWidths.emotion;
        doc.text(intensityStr, cellX, currentY + 4.2);
        cellX += colWidths.intensity;
        doc.text(record.activity_used || '—', cellX, currentY + 4.2);
        cellX += colWidths.activity;
        doc.text(wrappedNotes, cellX, currentY + 4.2);

        currentY += rowHeight;

        // Subtle row separator
        doc.setDrawColor(230, 233, 238);
        doc.setLineWidth(0.2);
        doc.line(margin, currentY, pageWidth - margin, currentY);
      });
    }

    // 6. Page Numbers on all pages
    const pageCount = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }

    return doc;
  },

  downloadReport(records: EmotionalRecord[], config: ReportConfig, fileName?: string) {
    const doc = this.generateReport(records, config);
    const resolvedName = fileName || `relatorio-froid-care-${config.startDate}-a-${config.endDate}.pdf`;
    doc.save(resolvedName);
  },
};
