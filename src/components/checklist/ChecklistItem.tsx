"use client";

import { Trash2 } from "lucide-react";
import type { ChecklistItem as ChecklistItemType } from "@/types/checklist";
import { Button } from "@/components/ui/button";
import { useChecklistStore } from "@/store/checklistStore";

interface ChecklistItemProps {
  item: ChecklistItemType;
  checklistId: string;
}

export default function ChecklistItem({
  item,
  checklistId,
}: ChecklistItemProps) {
  const toggleItem = useChecklistStore((state) => state.toggleItem);
  const removeItem = useChecklistStore((state) => state.removeItem);

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-accent/50 group transition-colors">
      <input
        type="checkbox"
        id={`item-${item.id}`}
        checked={item.completed}
        onChange={() => toggleItem(checklistId, item.id)}
        className="h-4 w-4 rounded border-gray-300 text-primary cursor-pointer accent-primary"
      />
      <label
        htmlFor={`item-${item.id}`}
        className={`flex-1 text-sm cursor-pointer select-none ${
          item.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {item.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity"
        onClick={() => removeItem(checklistId, item.id)}
        aria-label="Remover item"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
