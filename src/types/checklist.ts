export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  createdAt: string;
}

export type ChecklistLimit = 10 | 20 | 50;

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
