
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarPrimitive } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const Calendar = ({ selectedDate, onSelectDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedDate);

  // Functions to handle navigation
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Format the month and year
  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="px-6 py-4 border-b border-todo-border">
        <h3 className="text-xl font-semibold">Calendar</h3>
      </div>
      
      <div className="p-4 flex-1">
        {/* <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousMonth}
            className="text-todo-text hover:bg-todo-highlight"
          >
            <ChevronLeft size={22} />
            <span className="sr-only">Previous month</span>
          </Button>
          
          <h4 className="text-base font-medium">{monthYearString}</h4>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="text-todo-text hover:bg-todo-highlight"
          >
            <ChevronRight size={22} />
            <span className="sr-only">Next month</span>
          </Button>
        </div> */}
        
        <CalendarPrimitive
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-xl border border-todo-border p-3 w-full justify-center
          flex py-4"
          classNames={{
            day_selected: "calendar-day-selected",
            day_today: "calendar-day-today",
            day: "calendar-day hover:bg-todo-highlight",
            head_cell: "text-muted-foreground font-normal text-xs w-full",
            cell: "w-10 h-10 p-0 relative",
            row: "flex w-full",
            table: "w-full",
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
