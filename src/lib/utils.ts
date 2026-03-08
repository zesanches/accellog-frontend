import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Todo, ChecklistItem, Checklist } from "@/types/checklist";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildChecklistItemFromTodo(todo: Todo): ChecklistItem {
  return {
    id: String(todo.id),
    text: todo.title,
    completed: todo.completed,
  };
}

export function buildChecklistsFromTodos(todos: Todo[]): Checklist[] {
  const midpoint = Math.ceil(todos.length / 2);

  return [
    {
      id: crypto.randomUUID(),
      title: "Checklist A",
      createdAt: new Date().toISOString(),
      items: todos.slice(0, midpoint).map(buildChecklistItemFromTodo),
    },
    {
      id: crypto.randomUUID(),
      title: "Checklist B",
      createdAt: new Date().toISOString(),
      items: todos.slice(midpoint).map(buildChecklistItemFromTodo),
    },
  ];
}

export interface ChecklistProgress {
  completedCount: number;
  totalCount: number;
  progress: number;
  isComplete: boolean;
}

export function computeChecklistProgress(
  items: ChecklistItem[]
): ChecklistProgress {
  const totalCount = items.length;
  const completedCount = items.filter((item) => item.completed).length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return { completedCount, totalCount, progress, isComplete };
}
