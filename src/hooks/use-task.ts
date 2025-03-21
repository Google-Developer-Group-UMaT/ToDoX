import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import  axios from  "@/lib/axiosInstance";
import { Task, CreateTask, UpdateTask } from "../lib/types";

const API_URL = "http://localhost:3000/api/tasks";

// Function to get userId from localStorage/Auth context (Example)
const getUserId = () => localStorage.getItem("user") || "";

// Fetch all tasks for the logged-in user
const fetchTasks = async (): Promise<Task[]> => {
  const userId = getUserId();
  const { data } = await axios.get<Task[]>(`${API_URL}`);
  
  // Convert Firestore timestamps to readable dates
  return data.map(task => ({
    ...task,
    date: typeof task.date === "object" 
      ? new Date(task.date._seconds * 1000).toISOString() 
      : task.date,
  }));
};

// Custom hook for managing tasks
export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks, error, isLoading } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // Add Task (Optimistic Update)
  const addTask = useMutation({
    mutationFn: async (newTask: CreateTask) => {
      return axios.post<Task>(API_URL, { ...newTask });
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);
      queryClient.setQueryData(["tasks"], (oldTasks: Task[] = []) => [
        ...oldTasks,
        { id: "temp-id", ...newTask, completed: false, active: true },
      ]);

      return { previousTasks };
    },
    onError: (_error, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Update Task
  const updateTask = useMutation({
    mutationFn: async ({ id, ...updatedTask }: UpdateTask) => {
      const userId = getUserId();
      return axios.put<Task>(`${API_URL}/${id}`, { ...updatedTask, userId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Complete Task
  const completeTask = useMutation({
    mutationFn: async (id: string) => {
      const userId = getUserId();
      return axios.patch<Task>(`${API_URL}/${id}/complete`, { userId });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Delete Task (Soft Delete)
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const userId = getUserId();
      return axios.delete(`${API_URL}/${id}`, { data: { userId } });
    },
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
