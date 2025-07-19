import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useRecurrenceStore } from './store/useRecurrenceStore';
import { RecurrenceRule, RecurrenceFrequency, Weekday } from './types';
import { WEEKDAY_MAP } from './constants';

interface UseRecurrenceLogicReturn {
  rule: RecurrenceRule;
  selectedDates: Date[];
  visibleDate: Date;
  setFrequency: (frequency: string) => void;
  setInterval: (interval: number) => void;
  toggleWeekday: (weekday: string) => void;
  setMonthWeek: (week: string, weekday: string) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
  setVisibleDate: (date: Date) => void;
}

export const useRecurrenceLogic = (
  value: Partial<RecurrenceRule> = {},
  onChange?: (rule: RecurrenceRule) => void
): UseRecurrenceLogicReturn => {
  const [visibleDate, setVisibleDate] = useState<Date>(new Date());
  
  const {
    rule,
    selectedDates = [],
    setFrequency: setStoreFrequency,
    setInterval,
    toggleWeekday,
    setMonthWeek,
    setStartDate,
    setEndDate,
    generateDates,
  } = useRecurrenceStore();

  // Handle frequency change with proper cleanup
  const setFrequency = useCallback((frequency: RecurrenceFrequency) => {
    // Get current rule state directly from the store to ensure we have the latest values
    const currentRule = useRecurrenceStore.getState().rule;
    
    // Reset month week and weekday when switching to non-monthly/yearly frequencies
    if (frequency !== 'MONTHLY' && frequency !== 'YEARLY' && currentRule.monthWeek) {
      setMonthWeek('FIRST', 'MO');
    }
    
    // Reset weekdays when switching to non-weekly frequency
    if (frequency !== 'WEEKLY' && currentRule.weekdays && currentRule.weekdays.length > 0) {
      // Find the current day of week from startDate
      const dayOfWeek = currentRule.startDate.getDay();
      const defaultWeekday = Object.entries(WEEKDAY_MAP).find(
        ([_, value]) => value === dayOfWeek
      )?.[0] as Weekday | undefined;
      
      // If we have a valid default weekday, set it, otherwise default to Monday
      if (defaultWeekday) {
        setMonthWeek('FIRST', defaultWeekday);
      }
    }
    
    // Update the frequency in the store
    setStoreFrequency(frequency);
  }, [setStoreFrequency, setMonthWeek]);

  // Initialize with default dates on mount
  useEffect(() => {
    generateDates(30);
  }, []);

  // Memoize the current rule to prevent unnecessary effect triggers
  const currentRule = useMemo(() => rule, [rule]);

  // Sync with external value prop
  useEffect(() => {
    if (!value) return;
    
    const { frequency, interval, startDate, endDate, weekdays, monthWeek, monthWeekday } = value;
    const store = useRecurrenceStore.getState();
    let shouldUpdate = false;
    
    // Check each property for changes
    if (frequency && frequency !== store.rule.frequency) {
      setFrequency(frequency);
      shouldUpdate = true;
    }
    
    if (interval !== undefined && interval !== store.rule.interval) {
      setInterval(interval);
      shouldUpdate = true;
    }
    
    if (startDate) {
      const date = typeof startDate === 'string' ? new Date(startDate) : startDate;
      if (!isNaN(date.getTime()) && date.getTime() !== store.rule.startDate.getTime()) {
        setStartDate(date);
        shouldUpdate = true;
      }
    }
    
    if (endDate !== undefined) {
      const date = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
      const currentEndTime = store.rule.endDate ? store.rule.endDate.getTime() : null;
      const newEndTime = date ? date.getTime() : null;
      
      if (currentEndTime !== newEndTime) {
        setEndDate(date);
        shouldUpdate = true;
      }
    }

    // Handle weekdays update
    if (weekdays && JSON.stringify(weekdays) !== JSON.stringify(store.rule.weekdays || [])) {
      // Update weekdays directly in the store
      store.rule.weekdays = [...weekdays];
      shouldUpdate = true;
    }

    // Handle month week and weekday updates
    if (monthWeek && monthWeek !== store.rule.monthWeek) {
      // Update month week directly in the store
      store.rule.monthWeek = monthWeek;
      shouldUpdate = true;
    }

    if (monthWeekday && monthWeekday !== store.rule.monthWeekday) {
      // Update month weekday directly in the store
      store.rule.monthWeekday = monthWeekday;
      shouldUpdate = true;
    }
    
    if (shouldUpdate) {
      // Force a re-render by updating the store
      store.generateDates(30);
    }
  }, [value, setFrequency, setInterval, setStartDate, setEndDate]);

  // Handle changes with debouncing
  const prevRuleRef = useRef<RecurrenceRule>(currentRule);
  const changeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  useEffect(() => {
    const handleChange = () => {
      if (!onChange) return;
      
      // Get the latest state from the store
      const store = useRecurrenceStore.getState();
      
      // Create a new rule object with proper date handling
      const currentRule: RecurrenceRule = {
        ...store.rule,
        startDate: store.rule.startDate instanceof Date ? 
          new Date(store.rule.startDate) : 
          new Date(store.rule.startDate),
        endDate: store.rule.endDate ? 
          (store.rule.endDate instanceof Date ? 
            new Date(store.rule.endDate) : 
            new Date(store.rule.endDate)) : 
          null,
      };
      
      onChange(currentRule);
      prevRuleRef.current = currentRule;
    };

    // Only trigger change if something actually changed
    if (JSON.stringify(currentRule) !== JSON.stringify(prevRuleRef.current)) {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      
      // Use a shorter debounce for better responsiveness
      changeTimeoutRef.current = setTimeout(handleChange, 30);
    }
    
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, [currentRule, onChange]);

  return {
    rule,
    selectedDates,
    visibleDate,
    setFrequency: setFrequency as (frequency: string) => void,
    setInterval: setInterval as (interval: number) => void,
    toggleWeekday: toggleWeekday as (weekday: string) => void,
    setMonthWeek: setMonthWeek as (week: string, weekday: string) => void,
    setStartDate: setStartDate as (date: Date) => void,
    setEndDate: setEndDate as (date: Date | null) => void,
    setVisibleDate,
  };
};
