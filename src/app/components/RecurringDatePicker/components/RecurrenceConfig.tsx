import React from 'react';
import { motion } from 'framer-motion';
import { RecurrenceRule, RecurrenceFrequency, Weekday, MonthWeek, RecurrenceOption } from '../types';
import { IntervalSelector } from './IntervalSelector';
import { WeekdaySelector } from './WeekdaySelector';
import { MonthWeekSelector } from './MonthWeekSelector';
import { AnimatedSection } from './AnimatedSection';
import { HeaderSection } from './HeaderSection';
import { FrequencySection } from './FrequencySection';
import { DateRangeSection } from './DateRangeSection';
interface RecurrenceConfigProps {
  rule: RecurrenceRule;
  selectedOption: RecurrenceOption;
  setFrequency: (frequency: RecurrenceFrequency) => void;
  setInterval: (interval: number) => void;
  toggleWeekday: (weekday: Weekday) => void;
  setMonthWeek: (week: MonthWeek, weekday: Weekday) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date | null) => void;
}

export const RecurrenceConfig: React.FC<RecurrenceConfigProps> = ({
  rule,
  selectedOption,
  setFrequency,
  setInterval,
  toggleWeekday,
  setMonthWeek,
  setStartDate,
  setEndDate,
}) => (
  <motion.div 
    className="space-y-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)'
    }}
    transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
  >
    <HeaderSection />
    
    <div className="space-y-6 pl-1.5">
      <FrequencySection 
        rule={rule} 
        setFrequency={setFrequency} 
      />
      
      {selectedOption?.hasCustomInterval && (
        <AnimatedSection key="interval-selector" animationKey={`interval-selector-${rule.frequency}-${rule.interval}`}>
          <IntervalSelector 
            interval={rule.interval}
            frequency={rule.frequency}
            onChange={setInterval}
          />
        </AnimatedSection>
      )}

      {rule.frequency === 'WEEKLY' && (
        <AnimatedSection key="weekday-selector" animationKey={`weekday-selector-${rule.weekdays?.join('-') || 'none'}`}>
          <WeekdaySelector 
            selectedWeekdays={rule.weekdays || []}
            onToggle={toggleWeekday}
          />
        </AnimatedSection>
      )}

      {(rule.frequency === 'MONTHLY' || rule.frequency === 'YEARLY') && (
        <AnimatedSection 
          key="monthweek-selector" 
          animationKey={`monthweek-selector-${rule.frequency}-${rule.monthWeek}-${rule.monthWeekday}`}
        >
          <MonthWeekSelector
            monthWeek={rule.monthWeek}
            monthWeekday={rule.monthWeekday}
            onSelect={(week, weekday) => setMonthWeek(week, weekday)}
          />
        </AnimatedSection>
      )}
      
      <div className="pt-2">
        <DateRangeSection
          startDate={rule.startDate || new Date()}
          endDate={rule.endDate || null}
          onStartDateChange={(date) => date && setStartDate(date)}
          onEndDateChange={setEndDate}
        />
      </div>
    </div>
  </motion.div>
);
