
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO format: YYYY-MM-DD
  userId?: string; // Optional user ID for filtering tasks by user
}
