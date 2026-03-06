"use client";

import { useInitializeChecklists } from "@/hooks/useInitializeChecklists";
import { useChecklistStore } from "@/store/checklistStore";
import ChecklistList from "@/components/checklist/ChecklistList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function HomePage() {
  useInitializeChecklists();

  const isLoading = useChecklistStore((state) => state.isLoading);
  const isInitialized = useChecklistStore((state) => state.isInitialized);
  const error = useChecklistStore((state) => state.error);
  const retry = useChecklistStore((state) => state.retry);

  return (
    <main className="container mx-auto max-w-5xl py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Gerenciador de Checklists
        </h1>
        <p className="text-muted-foreground mt-1">
          Organize suas tarefas em checklists interativos
        </p>
      </header>

      {isLoading || !isInitialized ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={retry} />
      ) : (
        <ChecklistList />
      )}
    </main>
  );
}
