import { addDays, addMonths, addWeeks, addYears, isSameDay, isSameMonth, isSameYear, isToday, getDay, getDate, getDaysInMonth, getWeek, lastDayOfMonth, format, parseISO } from 'date-fns';
import { RecurrenceRule, RecurrenceFrequency, Weekday, MonthWeek, DateRange, CalendarDay } from '../types';

const WEEKDAY_MAP: Record<Weekday, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};

const MONTH_WEEK_MAP: Record<MonthWeek, number> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
  FOURTH: 4,
  LAST: 5
};

export const getWeekdayNumber = (weekday: Weekday): number => {
  return WEEKDAY_MAP[weekday];
};

export const getMonthWeekNumber = (monthWeek: MonthWeek): number => {
  return MONTH_WEEK_MAP[monthWeek];
};

export const generateRecurringDates = (rule: RecurrenceRule, count: number = 30): Date[] => {
  const { frequency, interval = 1, startDate, endDate, weekdays = [], monthWeek, monthWeekday } = rule;
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  // Add the start date if it's valid
  if (!isNaN(currentDate.getTime())) {
    dates.push(new Date(currentDate));
  }

  const getNextDate = (date: Date): Date => {
    switch (frequency) {
      case 'DAILY':
        return addDays(date, interval);
      case 'WEEKLY': {
        if (weekdays.length > 0) {
          // Find the next occurrence of any of the selected weekdays
          let nextDate = addDays(date, 1);
          const currentWeekday = getDay(nextDate);
          
          // Find the next selected weekday
          const nextWeekday = weekdays
            .map(w => WEEKDAY_MAP[w])
            .sort((a, b) => a - b)
            .find(w => w > currentWeekday);
          
          if (nextWeekday !== undefined) {
            return addDays(nextDate, nextWeekday - currentWeekday);
          } else {
            return addWeeks(nextDate, interval - 1);
          }
        }
        return addWeeks(date, interval);
      }
      case 'MONTHLY':
        if (monthWeek && monthWeekday) {
          // Handle specific month week (e.g., second Tuesday)
          const month = currentDate.getMonth();
          const year = currentDate.getFullYear();
          const weekdayNum = WEEKDAY_MAP[monthWeekday];
          
          // Get the first day of the next month
          const nextMonth = month === 11 ? 0 : month + 1;
          const nextYear = month === 11 ? year + 1 : year;
          const nextDate = new Date(nextYear, nextMonth, 1);
          
          // Find the nth occurrence of the weekday in the month
          let targetDate = new Date(nextDate);
          let occurrences = 0;
          
          while (targetDate.getMonth() === nextMonth) {
            if (getDay(targetDate) === weekdayNum) {
              occurrences++;
              if (occurrences === MONTH_WEEK_MAP[monthWeek as MonthWeek]) {
                return targetDate;
              }
            }
            targetDate = addDays(targetDate, 1);
          }
          
          // If we didn't find the exact occurrence (e.g., 5th Friday), return the last one
          return targetDate;
        }
        return addMonths(date, interval);
      case 'YEARLY':
        return addYears(date, interval);
      default:
        return addDays(date, 1);
    }
  };
  
  // Generate the requested number of dates
  while (dates.length < count) {
    currentDate = getNextDate(currentDate);
    
    // Stop if we've reached the end date
    if (endDate && currentDate > new Date(endDate)) break;
    
    // Add the date if it's valid
    if (!isNaN(currentDate.getTime())) {
      dates.push(new Date(currentDate));
    } else {
      break;
    }
  }
  
  return dates;
};

export const getWeekdayName = (weekday: Weekday): string => {
  const date = new Date(2023, 0, WEEKDAY_MAP[weekday] + 1); // Using 2023-01-01 as a Sunday
  return format(date, 'EEEE');
};

export const getMonthWeekName = (week: MonthWeek): string => {
  return week.charAt(0) + week.slice(1).toLowerCase();
};

export const getDaysInRange = (startDate: Date, endDate: Date): Date[] => {
  const days: Date[] = [];
  let current = new Date(startDate);
  
  while (current <= endDate) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }
  
  return days;
};

export const generateCalendarDays = (date: Date, selectedDates: Date[] = []): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = lastDayOfMonth(date);
  const startDate = new Date(year, month, 1 - firstDay.getDay());
  const endDate = new Date(year, month + 1, 6 - lastDay.getDay());
  
  const days: CalendarDay[] = [];
  let current = new Date(startDate);
  
  while (current <= endDate) {
    const date = new Date(current);
    const isCurrentMonth = date.getMonth() === month;
    const isDateSelected = selectedDates.some(selectedDate => 
      isSameDay(selectedDate, date)
    );
    
    days.push({
      date,
      isCurrentMonth,
      isSelected: isDateSelected,
      isToday: isToday(date),
      isInRange: false, // Will be calculated based on selection
      isStart: false,   // Will be calculated based on selection
      isEnd: false      // Will be calculated based on selection
    });
    
    current = addDays(current, 1);
  }
  
  return days;
};

export const getRecurrencePreview = (rule: RecurrenceRule): string => {
  const { frequency, interval, weekdays, monthWeek, monthWeekday } = rule;
  
  switch (frequency) {
    case 'DAILY':
      return `Every ${interval > 1 ? `${interval} days` : 'day'}`;
      
    case 'WEEKLY':
      if (weekdays && weekdays.length > 0) {
        const dayNames = weekdays.map(day => getWeekdayName(day));
        return `Every ${dayNames.join(', ')}`;
      }
      return `Every ${interval > 1 ? `${interval} weeks` : 'week'}`;
      
    case 'MONTHLY':
      if (monthWeek && monthWeekday) {
        return `The ${getMonthWeekName(monthWeek).toLowerCase()} ${getWeekdayName(monthWeekday).toLowerCase()} of every ${interval > 1 ? `${interval} months` : 'month'}`;
      }
      return `Day ${rule.startDate.getDate()} of every ${interval > 1 ? `${interval} months` : 'month'}`;
      
    case 'YEARLY':
      return `Every ${format(rule.startDate, 'MMMM d')}`;
      
    default:
      return 'Custom recurrence';
  }
};
