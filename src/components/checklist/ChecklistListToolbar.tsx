"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChecklistStore } from "@/store/checklistStore";
import type { ChecklistLimit } from "@/types/checklist";
import CreateChecklistDialog from "./CreateChecklistDialog";

const LIMIT_OPTIONS: ChecklistLimit[] = [10, 20, 50];

export default function ChecklistListToolbar() {
  const limit = useChecklistStore((state) => state.limit);
  const setLimit = useChecklistStore((state) => state.setLimit);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Itens por carga inicial:
        </span>
        <div className="flex items-center border rounded-md overflow-hidden">
          {LIMIT_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setLimit(option)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                limit === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-accent"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <CreateChecklistDialog>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Checklist
        </Button>
      </CreateChecklistDialog>
    </div>
  );
}
