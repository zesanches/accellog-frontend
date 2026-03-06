"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChecklistStore } from "@/store/checklistStore";

interface CreateChecklistDialogProps {
  children: ReactNode;
}

export default function CreateChecklistDialog({
  children,
}: CreateChecklistDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const addChecklist = useChecklistStore((state) => state.addChecklist);

  const handleCreate = () => {
    if (!title.trim()) return;

    addChecklist(title.trim());
    toast.success(`Checklist "${title.trim()}" criado com sucesso!`);
    setTitle("");
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen) setTitle("");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Checklist</DialogTitle>
          <DialogDescription>
            Digite um título para identificar o novo checklist.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <Input
            placeholder="Ex: Tarefas do projeto, Compras da semana..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()}>
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
