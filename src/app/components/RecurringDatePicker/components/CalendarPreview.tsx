import React, { useMemo } from 'react';
import { format, addMonths, subMonths, isSameDay, getDaysInMonth, startOfMonth, getDay, addDays } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

interface CalendarPreviewProps {
  selectedDates: Date[];
  visibleDate: Date;
  onVisibleDateChange: (date: Date) => void;
  startDate: Date;
  endDate: Date | null | undefined;
  className?: string;
}

export const CalendarPreview: React.FC<CalendarPreviewProps> = ({
  selectedDates = [],
  visibleDate = new Date(),
  onVisibleDateChange,
  startDate = new Date(),
  endDate = null,
  className = '',
}) => {
  const daysInMonth = getDaysInMonth(visibleDate);
  const startDay = startOfMonth(visibleDate);
  const startDayOfWeek = getDay(startDay);
  
  const days = useMemo(() => {
    const result = [];
    const totalDays = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;
    
    for (let i = 0; i < totalDays; i++) {
      const day = i - startDayOfWeek + 1;
      const date = addDays(startDay, day - 1);
      
      result.push({
        date,
        day,
        isCurrentMonth: day > 0 && day <= daysInMonth,
        isSelected: selectedDates.some(selectedDate => isSameDay(selectedDate, date)),
        isInRange: date >= startDate && (endDate ? date <= endDate : true),
      });
    }
    
    return result;
  }, [selectedDates, startDate, endDate, daysInMonth, startDay, startDayOfWeek]);

  const handlePrevMonth = () => {
    onVisibleDateChange(subMonths(visibleDate, 1));
  };

  const handleNextMonth = () => {
    onVisibleDateChange(addMonths(visibleDate, 1));
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <h3 className="text-lg font-medium text-gray-900">
          {format(visibleDate, 'MMMM yyyy')}
        </h3>
        
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => (
          <div
            key={`${format(day.date, 'yyyy-MM-dd')}-${day.day}-${day.isCurrentMonth ? 'current' : 'other'}`}
            className={`relative bg-white py-2 ${!day.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}
          >
            <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${
                  day.isSelected
                    ? 'bg-blue-600 text-white'
                    : day.isInRange
                    ? 'hover:bg-gray-100'
                    : 'opacity-50'
                }`}
              >
                {day.day > 0 && day.day <= daysInMonth ? day.day : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPreview;
