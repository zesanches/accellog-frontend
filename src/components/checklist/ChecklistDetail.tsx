"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, ListChecks, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Checklist } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useChecklistStore } from "@/store/checklistStore";
import { computeChecklistProgress } from "@/lib/utils";
import type { ChecklistProgress } from "@/lib/utils";
import ChecklistItem from "./ChecklistItem";

interface ChecklistDetailHeaderProps {
  title: string;
  isComplete: boolean;
}

function ChecklistDetailHeader({ title, isComplete }: ChecklistDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <ListChecks
        className={`h-7 w-7 shrink-0 ${
          isComplete ? "text-green-500" : "text-primary"
        }`}
      />
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

function ChecklistDetailProgress({
  completedCount,
  totalCount,
  progress,
  isComplete,
}: ChecklistProgress) {
  return (
    <div className="p-4 border rounded-xl bg-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {completedCount} de {totalCount} itens concluídos
        </span>
        <span
          className={`text-sm font-semibold tabular-nums ${
            isComplete ? "text-green-600" : "text-foreground"
          }`}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <Progress
        value={progress}
        className={`h-3 ${isComplete ? "[&>div]:bg-green-500" : ""}`}
      />
      {isComplete && totalCount > 0 && (
        <p className="flex items-center justify-center gap-1.5 text-sm text-green-600 font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Todos os itens foram concluídos!
        </p>
      )}
    </div>
  );
}

interface ChecklistAddItemFormProps {
  checklistId: string;
}

function ChecklistAddItemForm({ checklistId }: ChecklistAddItemFormProps) {
  const [newItemText, setNewItemText] = useState("");
  const addItem = useChecklistStore((state) => state.addItem);

  const handleAddItem = () => {
    const text = newItemText.trim();
    if (!text) return;

    addItem(checklistId, text);
    toast.success("Item adicionado!");
    setNewItemText("");
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Adicionar novo item..."
        value={newItemText}
        onChange={(event) => setNewItemText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") handleAddItem();
        }}
      />
      <Button
        onClick={handleAddItem}
        disabled={!newItemText.trim()}
        className="gap-1.5 shrink-0"
      >
        <Plus className="h-4 w-4" />
        Adicionar
      </Button>
    </div>
  );
}

interface ChecklistDetailProps {
  checklist: Checklist;
}

export default function ChecklistDetail({ checklist }: ChecklistDetailProps) {
  const router = useRouter();
  const progressData = computeChecklistProgress(checklist.items);

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para lista
      </Button>

      <div className="space-y-6">
        <ChecklistDetailHeader
          title={checklist.title}
          isComplete={progressData.isComplete}
        />

        <ChecklistDetailProgress {...progressData} />

        <div className="border rounded-xl overflow-hidden bg-card">
          {checklist.items.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm">Nenhum item ainda.</p>
              <p className="text-xs mt-1">Adicione um item usando o campo abaixo.</p>
            </div>
          ) : (
            <div className="divide-y">
              {checklist.items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checklistId={checklist.id}
                />
              ))}
            </div>
          )}
        </div>

        <ChecklistAddItemForm checklistId={checklist.id} />
      </div>
    </div>
  );
}
