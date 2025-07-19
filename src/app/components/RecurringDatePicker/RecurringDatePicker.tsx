'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RECURRENCE_OPTIONS } from './store/useRecurrenceStore';
import { getRecurrencePreview } from './utils/recurrenceUtils';
import { useRecurrenceLogic } from './useRecurrenceLogic';
import { RecurrenceRule, RecurrenceFrequency, Weekday, MonthWeek } from './types';
import React, { useMemo } from 'react';

// Import modular components
import { IntervalSelector } from './components/IntervalSelector';
import { WeekdaySelector } from './components/WeekdaySelector';
import { MonthWeekSelector } from './components/MonthWeekSelector';
import { CalendarPreview } from './components/CalendarPreview';
import { CalendarIcon, ClockIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';

export interface RecurringDatePickerProps {
  value?: Partial<RecurrenceRule> & {
    // Allow string dates that will be converted to Date objects
    startDate?: Date | string;
    endDate?: Date | string | null;
  };
  // Individual prop overrides (legacy support)
  frequency?: RecurrenceFrequency;
  interval?: number;
  weekdays?: Weekday[];
  monthWeek?: MonthWeek;
  monthWeekday?: Weekday;
  startDate?: Date | string;
  endDate?: Date | string | null;
  onChange?: (rule: RecurrenceRule) => void;
  className?: string;
}

interface RecurrenceConfigProps {
  rule: RecurrenceRule;
  selectedOption: any;
  setFrequency: (frequency: RecurrenceFrequency) => void;
  setInterval: (interval: number) => void;
  toggleWeekday: (weekday: Weekday) => void;
  setMonthWeek: (week: MonthWeek, weekday: Weekday) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
}

interface PreviewSectionProps {
  previewText: string;
  selectedDates: Date[];
  visibleDate: Date;
  setVisibleDate: (date: Date) => void;
  startDate: Date;
  endDate: Date | null | undefined;
}

interface AnimatedSectionProps {
  animationKey: string;
  children: React.ReactNode;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ animationKey, children }) => (
  <motion.div 
    key={animationKey}
    initial={{ opacity: 0, height: 0, x: -10 }}
    animate={{ opacity: 1, height: 'auto', x: 0 }}
    exit={{ opacity: 0, height: 0, x: -10 }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    className="overflow-hidden"
  >
    <div className="py-2">
      {children}
    </div>
  </motion.div>
);

const HeaderSection: React.FC = () => (
  <div className="flex items-center">
    <div className="rounded-full bg-blue-100 p-2">
      <ArrowPathRoundedSquareIcon className="h-5 w-5 text-blue-600" />
    </div>
    <h2 className="ml-3 text-lg font-medium text-gray-900">Recurrence</h2>
  </div>
);

interface FrequencySectionProps {
  rule: RecurrenceRule;
  setFrequency: (frequency: RecurrenceFrequency) => void;
}

const FrequencySection: React.FC<FrequencySectionProps> = ({ rule, setFrequency }) => {
  const selectedOption = RECURRENCE_OPTIONS.find(opt => opt.value === rule.frequency);
  
  // Icons for each frequency option
  const frequencyIcons = {
    DAILY: '📅',
    WEEKLY: '📆',
    MONTHLY: '🗓️',
    YEARLY: '🎉'
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recurrence Pattern</h3>
        </div>
        {selectedOption && (
          <p className="text-sm text-gray-500 pl-10">
            {selectedOption.description}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RECURRENCE_OPTIONS.map((option) => {
          const isSelected = rule.frequency === option.value;
          
          return (
            <motion.button
                key={option.value}
                type="button"
                onClick={() => setFrequency(option.value as RecurrenceFrequency)}
                className={`relative p-3 rounded-lg transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                }`}
                whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <span className="text-2xl">{frequencyIcons[option.value]}</span>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </motion.button>
          );
        })}
      </div>
      
      {rule.frequency === 'WEEKLY' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="pt-2"
        >
          <p className="text-sm font-medium text-gray-700 mb-2">Repeat on:</p>
          <div className="flex flex-wrap gap-2">
            {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => {
              const isSelected = rule.weekdays?.includes(day as Weekday);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    // Toggle day selection
                    const newDays = isSelected 
                      ? rule.weekdays?.filter(d => d !== day) || []
                      : [...(rule.weekdays || []), day as Weekday];
                    
                    // Update the frequency with new weekdays
                    setFrequency(rule.frequency);
                    // Manually update weekdays in the rule
                    rule.weekdays = newDays;
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'][['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].indexOf(day)]}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

interface DateRangeSectionProps {
  startDate: Date;
  endDate: Date | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date | null) => void;
}

// Wrapper component to contain the date picker popup
const DatePickerContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative isolate">
    <div className="absolute inset-0 -z-10 bg-white rounded-lg shadow-lg opacity-0 peer-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
    <div className="relative z-0">
      {children}
    </div>
    <style jsx global>{`
      /* Style the date picker popup */
      .react-datepicker {
        font-family: inherit;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 50;
      }
      .react-datepicker__header {
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .react-datepicker__current-month,
      .react-datepicker-time__header,
      .react-datepicker-year-header {
        color: #111827;
        font-weight: 500;
      }
      .react-datepicker__day--selected,
      .react-datepicker__day--keyboard-selected {
        background-color: #3b82f6;
        color: white;
      }
      .react-datepicker__day:hover {
        background-color: #f3f4f6;
      }
      .react-datepicker__day--selected:hover,
      .react-datepicker__day--keyboard-selected:hover {
        background-color: #2563eb;
      }
    `}</style>
  </div>
);

const DateRangeSection: React.FC<DateRangeSectionProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const endDateInputRef = useRef<HTMLDivElement>(null);

  // Helper function to create a date at the start of the day in local timezone
  const createLocalDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Format date for display (e.g., "Jul 19, 2023")
  const formatDateDisplay = (date: Date | null): string => {
    if (!date) return 'No end date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date for input (YYYY-MM-DD)
  const formatForInput = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get today's date in local timezone for min date
  const today = new Date();
  const todayFormatted = formatForInput(today);
  const minEndDate = startDate;

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (endDateInputRef.current && !endDateInputRef.current.contains(event.target as Node)) {
        setShowEndDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Date Range</h3>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerContainer>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formatForInput(startDate)}
                  onChange={(e) => {
                    const date = createLocalDate(e.target.value);
                    onStartDateChange(date);
                    // If end date is before new start date, clear it
                    if (endDate && date > endDate) {
                      onEndDateChange(null);
                    }
                  }}
                  min={todayFormatted}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm h-10 pl-3 pr-10 py-2 bg-white"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDateDisplay(startDate)}
              </p>
            </div>
          </DatePickerContainer>
          
          <div className="space-y-1.5 relative" ref={endDateInputRef}>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              {endDate && (
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEndDateChange(null);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 -mr-2 rounded-md hover:bg-blue-50"
                >
                  Clear
                </motion.button>
              )}
            </div>
            <motion.div 
              className="relative group"
              whileTap={!showEndDatePicker ? { scale: 0.98 } : {}}
              onClick={(e) => {
                e.stopPropagation();
                setShowEndDatePicker(!showEndDatePicker);
              }}
            >
              <div className={`w-full rounded-lg border text-sm h-10 pl-3 pr-10 py-2 flex items-center transition-colors ${
                showEndDatePicker 
                  ? 'border-blue-500 ring-2 ring-blue-100 bg-white' 
                  : 'border-gray-300 hover:border-gray-400 bg-white'
              }`}>
                <span className={`transition-colors ${!endDate ? 'text-gray-400' : 'text-gray-900'}`}>
                  {endDate ? formatDateDisplay(endDate) : 'Select end date'}
                </span>
              </div>
              <div className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-colors ${
                showEndDatePicker ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`}>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
            
            {showEndDatePicker && (
              <div className="relative z-50">
                <CustomDatePicker
                  selectedDate={endDate}
                  minDate={minEndDate}
                  onChange={(date) => {
                    onEndDateChange(date);
                    setShowEndDatePicker(false);
                  }}
                  onClose={() => setShowEndDatePicker(false)}
                  className="right-0"
                />
              </div>
            )}
          </div>
        </div>
        
        {endDate && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start">
            <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700">
              Your event will run from {formatDateDisplay(startDate)} to {formatDateDisplay(endDate)}.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const formatDateForInput = (date: Date): string => {
  if (!date) return '';
  // Create a new date object to avoid mutating the original
  const d = new Date(date);
  // Adjust for timezone offset to ensure consistent date display
  const offset = d.getTimezoneOffset();
  const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
};

interface PreviewSummaryProps {
  previewText: string;
}

const PreviewSummary: React.FC<PreviewSummaryProps> = ({ previewText }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 pt-0.5">
      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-700">
        <ClockIcon className="h-3 w-3" />
      </div>
    </div>
    <p className="ml-3 text-sm text-gray-700">
      {previewText}
    </p>
  </div>
);

const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewText,
  selectedDates = [],
  visibleDate = new Date(),
  setVisibleDate = () => {},
  startDate = new Date(),
  endDate = null,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
  >
    <div className="flex items-center mb-4">
      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 mr-3">
        <CalendarIcon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
    </div>
    
    <div className="pl-10 space-y-4">
      <PreviewSummary previewText={previewText} />
      
      <div className="border-t border-gray-100 pt-4">
        <CalendarPreview 
          selectedDates={selectedDates}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
          startDate={startDate}
          endDate={endDate}
        />
        
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">
              {selectedDates.length} occurrences
            </span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

// Importing RecurrenceConfig from components directory to avoid duplication
import { RecurrenceConfig } from './components/RecurrenceConfig';
import CustomDatePicker from './components/CustomDatePicker';

export const RecurringDatePicker: React.FC<RecurringDatePickerProps> = ({
  value = {},
  onChange,
  className = '',
}) => {
  const [visibleDate, setVisibleDate] = React.useState<Date>(new Date());
  
  const {
    rule,
    selectedDates = [],
    setFrequency,
    setInterval,
    toggleWeekday,
    setMonthWeek,
    setStartDate,
    setEndDate,
  } = useRecurrenceLogic(value, onChange);

  // Generate preview text based on the current rule
  const previewText = React.useMemo(() => {
    return getRecurrencePreview(rule);
  }, [rule]);

  // Find the selected option based on the current frequency
  const selectedOption = React.useMemo(() => {
    return RECURRENCE_OPTIONS.find(option => option.value === rule.frequency) || RECURRENCE_OPTIONS[0];
  }, [rule.frequency]);

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto ${className}`}>
      <div className="space-y-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recurring Event</h2>
          <p className="text-gray-600">Configure your recurring event schedule</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <RecurrenceConfig
            rule={rule}
            selectedOption={selectedOption}
            setFrequency={setFrequency}
            setInterval={setInterval}
            toggleWeekday={toggleWeekday}
            setMonthWeek={setMonthWeek}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <PreviewSection
            previewText={previewText}
            selectedDates={selectedDates}
            visibleDate={visibleDate}
            setVisibleDate={setVisibleDate}
            startDate={rule.startDate || new Date()}
            endDate={rule.endDate}
          />
        </div>
        
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            onClick={() => {
              // Handle save action
              if (onChange) {
                onChange(rule);
              }
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecurringDatePicker;
