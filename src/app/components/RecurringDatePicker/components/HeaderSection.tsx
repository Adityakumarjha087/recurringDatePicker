import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

export const HeaderSection: React.FC = () => (
  <div className="flex items-center space-x-3">
    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
      <CalendarIcon className="h-6 w-6" />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Recurring Schedule</h2>
      <p className="text-sm text-gray-500">Set up your recurring event pattern</p>
    </div>
  </div>
);
