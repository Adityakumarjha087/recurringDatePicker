import React from 'react';
import { MonthWeek, Weekday } from '../types';

interface MonthWeekSelectorProps {
  monthWeek?: MonthWeek;
  monthWeekday?: Weekday;
  onSelect: (week: MonthWeek, weekday: Weekday) => void;
  className?: string;
}

const MONTH_WEEK_OPTIONS: { value: MonthWeek; label: string }[] = [
  { value: 'FIRST', label: 'First' },
  { value: 'SECOND', label: 'Second' },
  { value: 'THIRD', label: 'Third' },
  { value: 'FOURTH', label: 'Fourth' },
  { value: 'LAST', label: 'Last' },
];

const WEEKDAY_OPTIONS: { value: Weekday; label: string }[] = [
  { value: 'SU', label: 'Sunday' },
  { value: 'MO', label: 'Monday' },
  { value: 'TU', label: 'Tuesday' },
  { value: 'WE', label: 'Wednesday' },
  { value: 'TH', label: 'Thursday' },
  { value: 'FR', label: 'Friday' },
  { value: 'SA', label: 'Saturday' },
];

export const MonthWeekSelector: React.FC<MonthWeekSelectorProps> = ({
  monthWeek = 'FIRST',
  monthWeekday = 'MO',
  onSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          On the
        </label>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={monthWeek}
            onChange={(e) => onSelect(e.target.value as MonthWeek, monthWeekday)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {MONTH_WEEK_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            value={monthWeekday}
            onChange={(e) => onSelect(monthWeek, e.target.value as Weekday)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            {WEEKDAY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-xs text-gray-500">
        {`Occurs on the ${monthWeek.toLowerCase()} ${WEEKDAY_OPTIONS.find(w => w.value === monthWeekday)?.label?.toLowerCase()} of the month`}
      </p>
    </div>
  );
};

export default MonthWeekSelector;
