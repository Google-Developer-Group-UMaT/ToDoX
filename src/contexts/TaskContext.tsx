/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode } from "react";
import { useTasks } from "../hooks/use-task";
import { CreateTask, Task, UpdateTask } from "@/lib/types";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface TasksContextType {
  tasks: Task[] | undefined;
  error: Error;
  isLoading: boolean;
  addTask: UseMutateFunction<AxiosResponse<Task, any>, Error, CreateTask, unknown>;
  updateTask: UseMutateFunction<AxiosResponse<Task, any>, Error, UpdateTask, unknown>;
  completeTask: UseMutateFunction<AxiosResponse<Task, any>, Error, string, unknown>;
  deleteTask: UseMutateFunction<AxiosResponse<void, any>, Error, string, unknown>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const tasksState = useTasks();

  return (
    <TasksContext.Provider value={tasksState}>
      {children}
    </TasksContext.Provider>
  );
};

// Custom hook to use tasks context
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }
  return context;
};
