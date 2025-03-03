
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types';
import { Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div 
      className="group flex items-center gap-3 p-4 rounded-xl border border-todo-border bg-white hover:border-todo-highlight hover:shadow-sm transition-all duration-200 animate-fade-in"
    >
      <Checkbox 
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="data-[state=checked]:bg-todo-accent data-[state=checked]:text-todo-text border-todo-border"
      />
      <label 
        htmlFor={`task-${task.id}`}
        className={`flex-1 text-base cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
      >
        {task.text}
      </label>
      <button 
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity duration-200"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TaskItem;
