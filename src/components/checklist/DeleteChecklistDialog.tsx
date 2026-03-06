"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useChecklistStore } from "@/store/checklistStore";
import { buttonVariants } from "@/components/ui/button";

interface DeleteChecklistDialogProps {
  checklistId: string;
  checklistTitle: string;
  children: ReactNode;
}

export default function DeleteChecklistDialog({
  checklistId,
  checklistTitle,
  children,
}: DeleteChecklistDialogProps) {
  const deleteChecklist = useChecklistStore((state) => state.deleteChecklist);

  const handleDelete = () => {
    deleteChecklist(checklistId);
    toast.success(`"${checklistTitle}" foi excluído com sucesso.`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Checklist</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>&quot;{checklistTitle}&quot;</strong>? Esta ação não pode
            ser desfeita e todos os itens serão perdidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className={buttonVariants({ variant: "destructive" })}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
