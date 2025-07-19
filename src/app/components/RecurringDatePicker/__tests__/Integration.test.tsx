import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecurringDatePicker from '../RecurringDatePicker';
import '@testing-library/jest-dom';

describe('RecurringDatePicker Integration', () => {
  it('handles complete workflow for weekly recurrence', async () => {
    const onChange = jest.fn();
    render(<RecurringDatePicker onChange={onChange} />);
    
    // 1. Select Weekly frequency
    fireEvent.click(screen.getByText('Weekly'));
    
    // 2. Set interval to 2 weeks
    const intervalInput = screen.getByLabelText('Interval');
    fireEvent.change(intervalInput, { target: { value: '2' } });
    fireEvent.blur(intervalInput);
    
    // 3. Select weekdays (Monday and Thursday)
    fireEvent.click(screen.getByText('Mo'));
    fireEvent.click(screen.getByText('Th'));
    
    // 4. Set start date (today)
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const startDateInput = screen.getByLabelText('Start Date');
    fireEvent.change(startDateInput, { target: { value: todayString } });
    
    // 5. Verify the recurrence rule in the preview
    expect(screen.getByText(/Every Monday, Thursday/)).toBeInTheDocument();
    expect(screen.getByText(/every 2 weeks/)).toBeInTheDocument();
    
    // 6. Verify the onChange callback was called with the correct values
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        frequency: 'WEEKLY',
        interval: 2,
        weekdays: expect.arrayContaining(['MO', 'TH']),
      }));
    });
    
    // 7. Verify calendar preview shows the selected dates
    const selectedDays = screen.getAllByRole('button', { name: /selected/ });
    expect(selectedDays.length).toBeGreaterThan(0);
  });

  it('handles monthly recurrence with specific day of month', async () => {
    const onChange = jest.fn();
    render(<RecurringDatePicker onChange={onChange} />);
    
    // 1. Select Monthly frequency
    fireEvent.click(screen.getByText('Monthly'));
    
    // 2. Set interval to 3 months
    const intervalInput = screen.getByLabelText('Interval');
    fireEvent.change(intervalInput, { target: { value: '3' } });
    fireEvent.blur(intervalInput);
    
    // 3. Select "Second Tuesday" of the month
    fireEvent.click(screen.getByText('Second'));
    fireEvent.click(screen.getByText('Tuesday'));
    
    // 4. Verify the recurrence rule in the preview
    expect(screen.getByText(/The second Tuesday of every 3 months/)).toBeInTheDocument();
    
    // 5. Verify the onChange callback was called with the correct values
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        frequency: 'MONTHLY',
        interval: 3,
        monthWeek: 'SECOND',
        monthWeekday: 'TU',
      }));
    });
  });
});
