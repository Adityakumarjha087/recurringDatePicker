import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { CalendarPreview } from './CalendarPreview';
import PreviewSummary from './PreviewSummary';

interface PreviewSectionProps {
  previewText: string;
  selectedDates: Date[];
  visibleDate: Date;
  setVisibleDate: (date: Date) => void;
  startDate: Date;
  endDate: Date | null | undefined;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewText,
  selectedDates = [],
  visibleDate = new Date(),
  setVisibleDate = () => {},
  startDate = new Date(),
  endDate = null,
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-4"
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

export default PreviewSection;
