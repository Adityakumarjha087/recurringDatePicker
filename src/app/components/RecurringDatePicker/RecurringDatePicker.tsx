'use client';

import { useMemo, useState } from 'react';
import { RECURRENCE_OPTIONS } from './store/useRecurrenceStore';
import { getRecurrencePreview } from './utils/recurrenceUtils';
import { useRecurrenceLogic } from './useRecurrenceLogic';
import { RecurrenceRule, RecurrenceFrequency, Weekday, MonthWeek, RecurrenceOption } from './types';

// Import components
import { RecurrenceConfig } from './components/RecurrenceConfig';
import { PreviewSection } from './components/PreviewSection';

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

const RecurringDatePicker: React.FC<RecurringDatePickerProps> = ({
  value = {},
  onChange,
  className = '',
}) => {
  const [visibleDate, setVisibleDate] = useState<Date>(new Date());
  
  const {
    rule,
    selectedDates = [],
    setFrequency,
    setInterval: setRecurrenceInterval, // Renamed to avoid conflict with window.setInterval
    toggleWeekday,
    setMonthWeek,
    setStartDate,
    setEndDate,
  } = useRecurrenceLogic(value, onChange);

  // Generate preview text based on the current rule
  const previewText = useMemo(() => getRecurrencePreview(rule), [rule]);

  // Find the selected option based on the current frequency
  const selectedOption = useMemo<RecurrenceOption>(
    () => RECURRENCE_OPTIONS.find(option => option.value === rule.frequency) || RECURRENCE_OPTIONS[0],
    [rule.frequency]
  );

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
            setInterval={setRecurrenceInterval}
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
