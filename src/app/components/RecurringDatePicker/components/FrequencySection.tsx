import React from 'react';
import { RecurrenceFrequency } from '../types';
import { RECURRENCE_OPTIONS } from '../store/useRecurrenceStore';

interface FrequencySectionProps {
  rule: {
    frequency: RecurrenceFrequency;
  };
  setFrequency: (frequency: RecurrenceFrequency) => void;
}

export const FrequencySection: React.FC<FrequencySectionProps> = ({
  rule,
  setFrequency,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Repeats
    </label>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {RECURRENCE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setFrequency(option.value as RecurrenceFrequency)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            rule.frequency === option.value
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);
