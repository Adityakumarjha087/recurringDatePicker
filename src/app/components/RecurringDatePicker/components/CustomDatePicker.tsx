'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format, addMonths, subMonths, isSameMonth, isSameDay, addDays, isBefore, isAfter, endOfMonth, startOfMonth, getDay } from 'date-fns';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  minDate?: Date;
  onChange: (date: Date | null) => void;
  onClose: () => void;
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  minDate,
  onChange,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  const [isOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Position the date picker relative to the trigger element
  useEffect(() => {
    if (datePickerRef.current && isOpen) {
      const triggerElement = document.activeElement as HTMLElement;
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const datePickerHeight = 350; // Approximate height of the date picker
        
        // Check if there's enough space below the input
        const spaceBelow = viewportHeight - rect.bottom;
        const positionBelow = spaceBelow > datePickerHeight || spaceBelow > rect.top;
        
        setPosition({
          left: rect.left,
          top: positionBelow ? rect.bottom + window.scrollY + 4 : rect.top + window.scrollY - datePickerHeight - 4
        });
      }
    }
  }, [isOpen]);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    // Don't allow going to previous months before minDate
    const newMonth = subMonths(currentMonth, 1);
    if (!minDate || isSameMonth(newMonth, minDate) || isAfter(newMonth, minDate)) {
      setCurrentMonth(newMonth);
    }
  };

  const onDateClick = (day: Date) => {
    onChange(day);
    onClose();
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-col px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={prevMonth}
            disabled={minDate && isSameMonth(currentMonth, minDate)}
            className={`p-1.5 rounded-lg transition-colors ${
              minDate && isSameMonth(currentMonth, minDate)
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1.5 text-gray-600 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-xs font-medium text-center text-gray-500 py-1">
              {day[0]}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = addDays(monthStart, -getDay(monthStart));
    const endDate = addDays(monthEnd, 6 - getDay(monthEnd));

    const days = [];
    let currentDate = startDate;
    const today = new Date();

    while (currentDate <= endDate) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-1 px-3 pb-3">
        {days.map((day, i) => {
          const isDisabled = (minDate && isBefore(day, minDate)) || !isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isOtherMonth = !isSameMonth(day, currentMonth);
          
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => !isDisabled && onDateClick(day)}
              disabled={isDisabled}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              className={`
                relative w-9 h-9 mx-auto rounded-lg text-sm font-medium
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${!isSelected && !isDisabled && !isOtherMonth ? 'text-gray-900 hover:bg-gray-100' : ''}
                ${!isSelected && isDisabled ? 'text-gray-300 cursor-not-allowed' : ''}
                ${isOtherMonth ? 'text-gray-300' : ''}
                transition-colors duration-150
                flex items-center justify-center
              `}
            >
              {isToday && !isSelected && !isDisabled && !isOtherMonth && (
                <span className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
              )}
              <span className="relative z-10">
                {format(day, 'd')}
              </span>
            </motion.button>
          );
        })}
      </div>
    );
  };

  const renderTodayButton = () => {
    const today = new Date();
    const isTodayDisabled = minDate && isBefore(today, minDate);
    
    return (
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <motion.button
          type="button"
          onClick={() => {
            if (!isTodayDisabled) {
              onChange(today);
              onClose();
            }
          }}
          disabled={isTodayDisabled}
          whileTap={!isTodayDisabled ? { scale: 0.95 } : {}}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isTodayDisabled
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
          }`}
        >
          Today
        </motion.button>
        <motion.button
          type="button"
          onClick={() => {
            onChange(null);
            onClose();
          }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200"
        >
          Clear
        </motion.button>
      </div>
    );
  };

  if (!isOpen) return null;

  const pickerStyle: React.CSSProperties = {
    position: 'fixed',
    left: position.left,
    top: position.top,
    zIndex: 1000,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '18rem',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  };

  return (
    <motion.div
      ref={datePickerRef}
      initial={{ opacity: 0, y: 5, scale: 0.98 }}
      animate={{ opacity: 1, y: 10, scale: 1 }}
      exit={{ opacity: 0, y: 5, scale: 0.98 }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className="bg-white rounded-xl border border-gray-100"
      style={pickerStyle}
    >
      {renderHeader()}
      {renderDays()}
      {renderTodayButton()}
    </motion.div>
  );
};

export default CustomDatePicker;
