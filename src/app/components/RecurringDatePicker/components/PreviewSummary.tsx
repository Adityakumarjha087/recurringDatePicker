import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

export interface PreviewSummaryProps {
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

export { PreviewSummary };
export default PreviewSummary;
