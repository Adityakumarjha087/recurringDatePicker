import { create } from 'zustand';
import { RecurrenceRule, RecurrenceFrequency, Weekday, MonthWeek } from '../types';
import { generateRecurringDates } from '../utils/recurrenceUtils';

const DEFAULT_RECURRENCE_RULE: RecurrenceRule = {
  frequency: 'WEEKLY',
  interval: 1,
  weekdays: [],
  startDate: new Date(),
  endDate: null,
};

interface RecurrenceOption {
  label: string;
  value: RecurrenceFrequency;
  description: string;
  hasCustomInterval: boolean;
  hasWeekdaySelection?: boolean;
  hasMonthWeekSelection?: boolean;
}

export const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  { 
    label: 'Daily', 
    value: 'DAILY',
    description: 'Repeat every day',
    hasCustomInterval: true
  },
  { 
    label: 'Weekly', 
    value: 'WEEKLY',
    description: 'Repeat on specific weekdays',
    hasCustomInterval: true,
    hasWeekdaySelection: true
  },
  { 
    label: 'Monthly', 
    value: 'MONTHLY',
    description: 'Repeat monthly on specific days',
    hasCustomInterval: true,
    hasMonthWeekSelection: true
  },
  { 
    label: 'Yearly', 
    value: 'YEARLY',
    description: 'Repeat yearly',
    hasCustomInterval: false
  },
];

interface RecurrenceState {
  rule: RecurrenceRule;
  selectedDates: Date[];
  visibleDate: Date;
  
  // Actions
  setFrequency: (frequency: RecurrenceFrequency) => void;
  setInterval: (interval: number) => void;
  toggleWeekday: (weekday: Weekday) => void;
  setMonthWeek: (week: MonthWeek, weekday: Weekday) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
  setVisibleDate: (date: Date) => void;
  generateDates: (count?: number) => void;
  reset: () => void;
}

export const useRecurrenceStore = create<RecurrenceState>((set, get) => ({
  rule: { ...DEFAULT_RECURRENCE_RULE },
  selectedDates: [],
  visibleDate: new Date(),

  setFrequency: (frequency) => {
    // Get the current state
    const currentState = get();
    
    // Create a new rule object with the updated frequency
    const updatedRule: RecurrenceRule = { 
      ...currentState.rule,
      frequency,
      // Reset weekdays when switching to non-weekly frequency
      weekdays: frequency === 'WEEKLY' ? (currentState.rule.weekdays || []) : [],
    };
    
    // Only reset month week settings when switching to non-monthly/yearly frequency
    if (frequency !== 'MONTHLY' && frequency !== 'YEARLY') {
      updatedRule.monthWeek = undefined;
      updatedRule.monthWeekday = undefined;
    }
    
    // Update the store with the new rule and generate dates in a single state update
    set({ 
      rule: updatedRule,
      // Don't clear selectedDates to prevent UI flicker
      // We'll update them immediately in the same state update
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  setInterval: (interval) => {
    const currentState = get();
    const updatedRule = { 
      ...currentState.rule, 
      interval: Math.max(1, interval) 
    };
    set({ 
      rule: updatedRule,
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  toggleWeekday: (weekday) => {
    const currentState = get();
    const { weekdays = [] } = currentState.rule;
    const newWeekdays = weekdays.includes(weekday)
      ? weekdays.filter(w => w !== weekday)
      : [...weekdays, weekday].sort((a, b) => a.localeCompare(b));
    
    const updatedRule = { 
      ...currentState.rule, 
      weekdays: newWeekdays 
    };
    
    set({ 
      rule: updatedRule,
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  setMonthWeek: (week, weekday) => {
    const currentState = get();
    const updatedRule = { 
      ...currentState.rule, 
      monthWeek: week,
      monthWeekday: weekday
    };
    
    set({ 
      rule: updatedRule,
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  setStartDate: (startDate) => {
    const currentState = get();
    const updatedRule = { 
      ...currentState.rule, 
      startDate 
    };
    
    set({ 
      rule: updatedRule,
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  setEndDate: (endDate) => {
    const currentState = get();
    const updatedRule = { 
      ...currentState.rule, 
      endDate 
    };
    
    set({ 
      rule: updatedRule,
      selectedDates: generateRecurringDates(updatedRule, 30)
    });
  },

  setVisibleDate: (visibleDate) => {
    set({ visibleDate });
  },

  generateDates: (count = 30) => {
    const { rule } = get();
    try {
      const dates = generateRecurringDates(rule, count);
      set({ selectedDates: dates });
    } catch (error) {
      console.error('Error generating dates:', error);
      // Reset to default if there's an error
      const resetRule = { ...DEFAULT_RECURRENCE_RULE };
      set({ 
        rule: resetRule,
        selectedDates: generateRecurringDates(resetRule, count)
      });
    }
  },

  reset: () => {
    set({ 
      rule: { ...DEFAULT_RECURRENCE_RULE },
      selectedDates: [],
      visibleDate: new Date()
    });
  },
}));

// Initialize with some default dates
useRecurrenceStore.getState().generateDates();
