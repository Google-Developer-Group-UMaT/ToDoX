
import React from 'react';
import { Task } from '@/lib/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  selectedDate: Date;
  searchQuery?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList = ({ tasks, selectedDate, searchQuery = '', onToggle, onDelete }: TaskListProps) => {
  // Filter tasks for the selected date
  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
  
  // Filter tasks based on selected date and search query
  const filteredTasks = tasks?.filter(task => {
    const matchesDate = task.date === formattedSelectedDate;
    const matchesSearch = searchQuery === '' || 
      task.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDate && matchesSearch;
  });

  // Format the date as Month Day, Year
  const dateOptions: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  };
  const formattedDate = selectedDate.toLocaleDateString('en-US', dateOptions);
  
  return (
    <div className="w-full h-full flex flex-col gap-5 py-4">
      <div className="px-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {formattedDate}
        </h2>
        <h3 className="text-2xl font-semibold mt-1">To Do</h3>
      </div>
      
      <div className="flex-1 px-6 overflow-y-auto space-y-3">
        {filteredTasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-20">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <path d="M9 9h6"></path>
              <path d="M9 13h6"></path>
              <path d="M9 17h6"></path>
            </svg>
            <p className="text-base">
              {searchQuery ? "No matching tasks found" : "No tasks for this day"}
            </p>
            <p className="text-sm mt-1">
              {searchQuery ? "Try a different search term" : "Add a new task below"}
            </p>
          </div>
        ) : (
          filteredTasks?.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={onToggle} 
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
