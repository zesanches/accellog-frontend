"use client";

import Link from "next/link";
import { Trash2, CheckSquare } from "lucide-react";
import type { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DeleteChecklistDialog from "./DeleteChecklistDialog";

interface ChecklistCardProps {
  checklist: Checklist;
}

export default function ChecklistCard({ checklist }: ChecklistCardProps) {
  const totalItems = checklist.items.length;
  const completedItems = checklist.items.filter((item) => item.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isComplete = totalItems > 0 && completedItems === totalItems;

  return (
    <div className="relative border rounded-xl p-5 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/checklist/${checklist.id}`}
          className="flex-1 min-w-0 group"
        >
          <div className="flex items-center gap-2">
            <CheckSquare
              className={`h-5 w-5 shrink-0 ${
                isComplete ? "text-green-500" : "text-muted-foreground"
              }`}
            />
            <h2 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              {checklist.title}
            </h2>
          </div>
        </Link>

        <DeleteChecklistDialog
          checklistId={checklist.id}
          checklistTitle={checklist.title}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label="Excluir checklist"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DeleteChecklistDialog>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {completedItems} / {totalItems} itens concluídos
          </span>
          <span
            className={`font-medium tabular-nums ${
              isComplete ? "text-green-600" : "text-foreground"
            }`}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={progress}
          className={`h-2 ${isComplete ? "[&>div]:bg-green-500" : ""}`}
        />
      </div>

      {totalItems === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Nenhum item — clique para adicionar
        </p>
      )}
    </div>
  );
}
