import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Task, CreateTask, UpdateTask } from "../lib/types";

const API_URL = "http://localhost:3000/api/tasks";

// Fetch all tasks
const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await axios.get<Task[]>(API_URL);
  return data;
};

// Custom hook for managing tasks
export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, error, isLoading } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks
  });

  // Add Task
  const addTask = useMutation({
    mutationFn: (newTask: CreateTask) => axios.post<Task>(API_URL, newTask),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Update Task
  const updateTask = useMutation({
    mutationFn: ({ id, ...updatedTask }: UpdateTask) =>
      axios.put<Task>(`${API_URL}/${id}`, updatedTask),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Complete Task
  const completeTask = useMutation({
    mutationFn: (id: string) => axios.patch<Task>(`${API_URL}/${id}/complete`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Delete Task
  const deleteTask = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    tasks,
    error,
    isLoading,
    addTask: addTask.mutate,
    updateTask: updateTask.mutate,
    completeTask: completeTask.mutate,
    deleteTask: deleteTask.mutate,
  };
};
