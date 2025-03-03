
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskInput from '@/components/TaskInput';
import Calendar from '@/components/Calendar';
import SearchInput from '@/components/SearchInput';
import FloatingActionButton from '@/components/FloatingActionButton';
import ChatInterface from '@/components/ChatInterface';
import { Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage if available
    const savedTasks = localStorage.getItem(`tasks-${userId}`);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`tasks-${userId}`, JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  const handleAddTask = (text: string, date: string) => {
    const newTask: Task = {
      id: uuidv4(),
      text,
      completed: false,
      date,
      userId
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task added",
      description: "Your new task has been added to the list.",
      duration: 2000,
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list.",
      duration: 2000,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-todo-bg">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 md:border-r border-todo-border flex flex-col">
          <SearchInput 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
          <TaskList 
            tasks={tasks.filter(task => task.userId === userId)}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
          <TaskInput 
            selectedDate={selectedDate}
            onAddTask={handleAddTask}
          />
        </div>
        
        <div className="md:w-96 border-t md:border-t-0 border-todo-border">
          <Calendar 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </main>

      <FloatingActionButton onClick={toggleChat} />
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
