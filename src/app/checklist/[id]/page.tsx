"use client";

import { useParams, useRouter } from "next/navigation";
import { useChecklistStore } from "@/store/checklistStore";
import { Checklist } from "@/components/checklist";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ChecklistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const checklist = useChecklistStore((state) =>
    state.checklists.find((checklist) => checklist.id === id)
  );

  if (!checklist) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4">
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <p className="text-lg font-medium">Checklist não encontrado</p>
          <p className="text-sm text-muted-foreground">
            Este checklist pode ter sido excluído ou a sessão foi reiniciada.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="gap-2 mt-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a lista
          </Button>
        </div>
      </div>
    );
  }

  return <Checklist.Detail checklist={checklist} />;
}
