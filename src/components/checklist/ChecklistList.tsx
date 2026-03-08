"use client";

import { useChecklistStore } from "@/store/checklistStore";
import ChecklistCard from "./ChecklistCard";
import ChecklistListToolbar from "./ChecklistListToolbar";

export default function ChecklistList() {
  const checklists = useChecklistStore((state) => state.checklists);

  return (
    <div className="space-y-6">
      <ChecklistListToolbar />

      {checklists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground">Nenhum checklist disponível.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crie um novo checklist para começar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checklists.map((checklist) => (
            <ChecklistCard key={checklist.id} checklist={checklist} />
          ))}
        </div>
      )}
    </div>
  );
}
