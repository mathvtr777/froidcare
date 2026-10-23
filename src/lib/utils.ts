import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  isSameDay as dateFnsIsSameDay,
  isToday as dateFnsIsToday,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format ISO date string into readable Portuguese date: '23 de outubro de 2026'
 */
export function formatDatePt(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return isoDate;
  }
}

/**
 * Format ISO date string into short date: '23/10/2026'
 */
export function formatShortDatePt(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return isoDate;
  }
}

/**
 * Format ISO date string into short date with weekday: 'Sex, 23/10'
 */
export function formatDayWeekdayPt(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'EEE, dd/MM', { locale: ptBR });
  } catch {
    return isoDate;
  }
}

/**
 * Format ISO date string into time: '14:35'
 */
export function formatTimePt(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'HH:mm', { locale: ptBR });
  } catch {
    return '';
  }
}

/**
 * Format ISO date string into full date & time: '23 de out, 14:35'
 */
export function formatDateTimePt(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "d 'de' MMM, HH:mm", { locale: ptBR });
  } catch {
    return isoDate;
  }
}

/**
 * Check if ISO string belongs to today in user's local timezone
 */
export function isToday(isoDate: string): boolean {
  try {
    return dateFnsIsToday(parseISO(isoDate));
  } catch {
    return false;
  }
}

/**
 * Compare whether two ISO dates are on the same calendar day in local timezone
 */
export function isSameDay(isoDateA: string, isoDateB: string): boolean {
  try {
    return dateFnsIsSameDay(parseISO(isoDateA), parseISO(isoDateB));
  } catch {
    return false;
  }
}

/**
 * Calculate contextual greeting based on local hour
 */
export function getContextualGreeting(displayName?: string): { greeting: string; subtitle: string } {
  const hour = new Date().getHours();
  let timeGreeting = 'Olá';
  let subtitle = 'Como você está se percebendo hoje?';

  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Bom dia';
    subtitle = 'Comece o dia com calma e no seu próprio ritmo.';
  } else if (hour >= 12 && hour < 18) {
    timeGreeting = 'Boa tarde';
    subtitle = 'Faça uma pausa breve para respirar e se ouvir.';
  } else {
    timeGreeting = 'Boa noite';
    subtitle = 'Desacelere e dê espaço para o descanso da sua mente.';
  }

  const namePart = displayName ? `, ${displayName}` : '';
  return {
    greeting: `${timeGreeting}${namePart}`,
    subtitle,
  };
}

/**
 * Helper to obtain date boundaries as YYYY-MM-DD
 */
export function getDateRangePresets(): {
  last7Days: { start: string; end: string };
  last30Days: { start: string; end: string };
  thisMonth: { start: string; end: string };
  thisWeek: { start: string; end: string };
} {
  const now = new Date();
  const formatInput = (d: Date) => format(d, 'yyyy-MM-dd');

  return {
    last7Days: {
      start: formatInput(subDays(now, 6)),
      end: formatInput(now),
    },
    last30Days: {
      start: formatInput(subDays(now, 29)),
      end: formatInput(now),
    },
    thisMonth: {
      start: formatInput(startOfMonth(now)),
      end: formatInput(endOfMonth(now)),
    },
    thisWeek: {
      start: formatInput(startOfWeek(now, { weekStartsOn: 0 })),
      end: formatInput(endOfWeek(now, { weekStartsOn: 0 })),
    },
  };
}

