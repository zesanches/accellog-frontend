import { useEffect } from "react";
import { useChecklistStore } from "@/store/checklistStore";
import { fetchTodos } from "@/lib/api";
import type { Checklist } from "@/types/checklist";

export function useInitializeChecklists() {
  const isInitialized = useChecklistStore((state) => state.isInitialized);
  const limit = useChecklistStore((state) => state.limit);
  const setChecklists = useChecklistStore((state) => state.setChecklists);
  const setLoading = useChecklistStore((state) => state.setLoading);
  const setError = useChecklistStore((state) => state.setError);
  const setInitialized = useChecklistStore((state) => state.setInitialized);

  useEffect(() => {
    if (isInitialized) return;

    let cancelled = false;

    async function loadTodos() {
      setLoading(true);
      setError(null);

      try {
        const todos = await fetchTodos(limit);

        if (cancelled) return;

        const half = Math.ceil(todos.length / 2);

        const checklists: Checklist[] = [
          {
            id: crypto.randomUUID(),
            title: "Checklist A",
            createdAt: new Date().toISOString(),
            items: todos.slice(0, half).map((todo) => ({
              id: String(todo.id),
              text: todo.title,
              completed: todo.completed,
            })),
          },
          {
            id: crypto.randomUUID(),
            title: "Checklist B",
            createdAt: new Date().toISOString(),
            items: todos.slice(half).map((todo) => ({
              id: String(todo.id),
              text: todo.title,
              completed: todo.completed,
            })),
          },
        ];

        setChecklists(checklists);
        setInitialized();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Erro desconhecido ao carregar dados"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTodos();

    return () => {
      cancelled = true;
    };
  }, [isInitialized, limit, setChecklists, setLoading, setError, setInitialized]);
}
