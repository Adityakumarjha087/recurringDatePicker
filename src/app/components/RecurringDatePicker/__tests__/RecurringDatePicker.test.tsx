import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecurringDatePicker } from '../RecurringDatePicker';
import '@testing-library/jest-dom';

describe('RecurringDatePicker', () => {
  it('renders the component with default values', () => {
    render(<RecurringDatePicker />);
    
    // Check if the frequency selector is rendered
    expect(screen.getByText('Daily')).toBeInTheDocument();
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
    
    // Check if the interval selector is rendered
    expect(screen.getByLabelText('Interval')).toBeInTheDocument();
    
    // Check if the date range selector is rendered
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date (Optional)')).toBeInTheDocument();
  });

  it('allows changing the frequency', () => {
    render(<RecurringDatePicker />);
    
    // Click on the Weekly option
    const weeklyOption = screen.getByText('Weekly');
    fireEvent.click(weeklyOption);
    
    // Check if weekday selector is visible for weekly frequency
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Tu')).toBeInTheDocument();
    expect(screen.getByText('We')).toBeInTheDocument();
    expect(screen.getByText('Th')).toBeInTheDocument();
    expect(screen.getByText('Fr')).toBeInTheDocument();
    expect(screen.getByText('Sa')).toBeInTheDocument();
  });

  it('allows selecting weekdays for weekly frequency', () => {
    render(<RecurringDatePicker />);
    
    // Select Weekly frequency
    fireEvent.click(screen.getByText('Weekly'));
    
    // Click on Monday and Wednesday
    fireEvent.click(screen.getByText('Mo'));
    fireEvent.click(screen.getByText('We'));
    
    // Check if the selected weekdays are highlighted
    expect(screen.getByText('Mo')).toHaveClass('bg-blue-100');
    expect(screen.getByText('We')).toHaveClass('bg-blue-100');
    
    // Check if the preview shows the selected weekdays
    expect(screen.getByText(/Every Monday, Wednesday/)).toBeInTheDocument();
  });

  it('allows setting a custom interval', () => {
    render(<RecurringDatePicker />);
    
    // Change the interval to 2
    const intervalInput = screen.getByLabelText('Interval');
    fireEvent.change(intervalInput, { target: { value: '2' } });
    fireEvent.blur(intervalInput);
    
    // Check if the preview updates with the new interval
    expect(screen.getByText(/Every 2 days/)).toBeInTheDocument();
  });
});
