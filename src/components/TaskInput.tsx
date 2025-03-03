
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';

interface TaskInputProps {
  selectedDate: Date;
  onAddTask: (text: string, date: string) => void;
}

const TaskInput = ({ selectedDate, onAddTask }: TaskInputProps) => {
  const [taskText, setTaskText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      // Convert date to ISO string and extract just the date part
      const dateString = selectedDate.toISOString().split('T')[0];
      onAddTask(taskText.trim(), dateString);
      setTaskText('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full px-6 py-4 border-t border-todo-border"
    >
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          className="flex-1 border-todo-border focus-visible:ring-todo-accent h-11"
        />
        <Button 
          type="submit"
          className="bg-todo-accent hover:bg-todo-accent/90 text-todo-text h-11 px-4"
          disabled={!taskText.trim()}
        >
          <PlusCircle className="mr-1" size={18} />
          <span>Add</span>
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;
