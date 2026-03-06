import type { Todo } from "@/types/checklist";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTodos(limit: number): Promise<Todo[]> {
  const response = await fetch(`${API_URL}?_limit=${limit}`);

  if (!response.ok) {
    throw new Error(
      `Falha ao buscar dados: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<Todo[]>;
}
