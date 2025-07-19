export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type Weekday = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';

export type MonthWeek = 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'LAST';

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval: number;
  weekdays?: Weekday[];
  monthWeek?: MonthWeek;
  monthWeekday?: Weekday;
  startDate: Date;
  endDate?: Date | null;
  count?: number;
}

export interface RecurrenceOption {
  label: string;
  value: RecurrenceFrequency;
  hasCustomInterval?: boolean;
  hasWeekdaySelection?: boolean;
  hasMonthWeekSelection?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isInRange: boolean;
  isStart: boolean;
  isEnd: boolean;
}
