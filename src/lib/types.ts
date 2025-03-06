export interface Task {
    id: string;
    name: string;
    date: string | { _seconds: number; _nanoseconds: number };
    completed: boolean;
    active?: boolean;
  }
  
  export interface CreateTask {
    name: string;
    date: string;
  }
  
  export interface UpdateTask {
    id: string;
    name?: string;
    date?: string;
  }
  