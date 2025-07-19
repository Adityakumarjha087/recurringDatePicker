import React from 'react';
import { RecurrenceFrequency } from '../types';

interface IntervalSelectorProps {
  interval: number;
  frequency: RecurrenceFrequency;
  onChange: (interval: number) => void;
  className?: string;
}

export const IntervalSelector: React.FC<IntervalSelectorProps> = ({
  interval,
  frequency,
  onChange,
  className = '',
}) => {
  const frequencyLabels: Record<RecurrenceFrequency, string> = {
    DAILY: 'day',
    WEEKLY: 'week',
    MONTHLY: 'month',
    YEARLY: 'year',
  };

  const frequencyLabel = frequencyLabels[frequency] || 'interval';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Repeat every
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          max="365"
          value={interval}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value > 0 && value <= 365) {
              onChange(value);
            }
          }}
          className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-sm text-gray-600">
          {interval === 1 ? frequencyLabel : `${frequencyLabel}s`}
        </span>
      </div>
    </div>
  );
};

export default IntervalSelector;
