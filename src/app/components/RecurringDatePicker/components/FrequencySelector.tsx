import React from 'react';
import { RecurrenceFrequency } from '../types';
import { RECURRENCE_OPTIONS } from '../store/useRecurrenceStore';

interface FrequencySelectorProps {
  selectedFrequency: RecurrenceFrequency;
  onSelect: (frequency: RecurrenceFrequency) => void;
  className?: string;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  selectedFrequency,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RECURRENCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value as RecurrenceFrequency)}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedFrequency === option.value
                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FrequencySelector;
