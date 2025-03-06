import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import TaskInput from "@/components/TaskInput";
import Calendar from "@/components/Calendar";
import SearchInput from "@/components/SearchInput";
import FloatingActionButton from "@/components/FloatingActionButton";
import ChatInterface from "@/components/ChatInterface";
import { useTasksContext } from "@/contexts/TaskContext";

const Index = () => {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Use tasks from React Query Context
  const { tasks: data , addTask, completeTask, deleteTask,error } = useTasksContext();

  useEffect(()=>{
    if(error){
    toast({
      title: "Failed to load Tasks",
          description: "Your tasks could not be loaded",
          duration: 2000,
          variant:"destructive"
    })
  }
  },[error])
  

  const handleAddTask = (text: string, date: string) => {
    const newTask = { id: Date.now().toString(), name: text, date,completed:false, active:true };
    try {
      // Optimistically update the UI
    data.push(newTask);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        duration: 2000,
        variant:"destructive"
      });
    }
    

    addTask(newTask, {
      onSuccess: () => {
        toast({
          title: "Task added",
          description: "Your new task has been added.",
          duration: 2000,
        });
      },
      onError: () => {
        // Revert the optimistic update if the request fails
        data.pop();
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          duration: 2000,
          variant:"destructive"
        });
      },
    });
  };

  const handleToggleTask = (id: string) => {
    const taskIndex = data.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      // Optimistically update the UI
      data[taskIndex].completed = !data[taskIndex].completed;

      completeTask(id, {
        onSuccess: () => {
          toast({
            title: "Task updated",
            description: "The task has been "+(data[taskIndex].completed ? "completed" : "uncompleted")+".",
            duration: 2000,
          });
        },
        onError: () => {
          // Revert the optimistic update if the request fails
          data[taskIndex].completed = !data[taskIndex].completed;
          toast({
            title: "Error",
            description: "Failed to toggle task. Please try again.",
            duration: 2000,
            variant:"destructive"
          });
        },
      });
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskIndex = data.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      const [deletedTask] = data.splice(taskIndex, 1);

      deleteTask(id, {
        onSuccess: () => {
          toast({
            title: "Task deleted",
            description: "The task has been removed.",
            duration: 2000,
          });
        },
        onError: () => {
          // Revert the optimistic update if the request fails
          data.splice(taskIndex, 0, deletedTask);
          toast({
            title: "Error",
            description: "Failed to delete task. Please try again.",
            duration: 2000,
            variant:"destructive"

          });
        },
      });
    }
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

      <main className="flex-1 flex flex-col md:flex-row gap-y-4">
        <div className="flex-1 md:border-r border-todo-border flex flex-col p-4">
          <SearchInput searchQuery={searchQuery} onSearchChange={handleSearchChange} />
          <TaskList
            tasks={data}
            selectedDate={selectedDate}
            searchQuery={searchQuery}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
          <TaskInput selectedDate={selectedDate} onAddTask={handleAddTask} />
        </div>

        <div className="md:w-96 border-t md:border-t-0 border-todo-border">
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
      </main>

      <FloatingActionButton onClick={toggleChat} />
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
