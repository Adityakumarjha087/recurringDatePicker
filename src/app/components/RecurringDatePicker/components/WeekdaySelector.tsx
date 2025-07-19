import React from 'react';
import { Weekday } from '../types';

interface WeekdaySelectorProps {
  selectedWeekdays: Weekday[];
  onToggle: (weekday: Weekday) => void;
  className?: string;
}

const WEEKDAY_LABELS: Record<Weekday, string> = {
  SU: 'Sun',
  MO: 'Mon',
  TU: 'Tue',
  WE: 'Wed',
  TH: 'Thu',
  FR: 'Fri',
  SA: 'Sat',
};

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedWeekdays = [],
  onToggle,
  className = '',
}) => {
  const weekdays: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        On days
      </label>
      <div className="flex flex-wrap gap-2">
        {weekdays.map((weekday) => (
          <button
            key={weekday}
            type="button"
            onClick={() => onToggle(weekday)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              selectedWeekdays.includes(weekday)
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {WEEKDAY_LABELS[weekday]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekdaySelector;
