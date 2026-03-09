import { create } from "zustand";
import type { Checklist, ChecklistLimit } from "@/types/checklist";

interface ChecklistState {
  checklists: Checklist[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  limit: ChecklistLimit;
}

interface ChecklistActions {
  setChecklists: (checklists: Checklist[]) => void;
  addChecklist: (title: string) => void;
  deleteChecklist: (id: string) => void;
  addItem: (checklistId: string, text: string) => void;
  removeItem: (checklistId: string, itemId: string) => void;
  toggleItem: (checklistId: string, itemId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: () => void;
  setLimit: (limit: ChecklistLimit) => void;
  retry: () => void;
}

type ChecklistStore = ChecklistState & ChecklistActions;

export const useChecklistStore = create<ChecklistStore>((set) => ({
  checklists: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  limit: 10,

  setChecklists: (checklists) => set({ checklists }),

  addChecklist: (title) =>
    set((state) => ({
      checklists: [
        ...state.checklists,
        {
          id: crypto.randomUUID(),
          title,
          items: [],
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  deleteChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.filter((checklist) => checklist.id !== id),
    })),

  addItem: (checklistId, text) =>
    set((state) => ({
      checklists: state.checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: [
              ...checklist.items,
              {
                id: crypto.randomUUID(),
                text,
                completed: false,
              },
            ],
          }
          : checklist
      ),
    })),

  removeItem: (checklistId, itemId) =>
    set((state) => ({
      checklists: state.checklists.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, items: checklist.items.filter((item) => item.id !== itemId) }
          : checklist
      ),
    })),

  toggleItem: (checklistId, itemId) =>
    set((state) => ({
      checklists: state.checklists.map((checklist) =>
        checklist.id === checklistId
          ? {
            ...checklist,
            items: checklist.items.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          }
          : checklist
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setInitialized: () => set({ isInitialized: true }),

  setLimit: (limit) => set({ limit, isInitialized: false, error: null }),

  retry: () => set({ isInitialized: false, error: null }),
}));
