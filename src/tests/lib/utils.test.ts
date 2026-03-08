import {
  cn,
  buildChecklistItemFromTodo,
  buildChecklistsFromTodos,
  computeChecklistProgress,
} from "@/lib/utils";
import type { Todo, ChecklistItem } from "@/types/checklist";

describe("cn", () => {
  it("retorna uma única classe sem alteração", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("combina múltiplas classes", () => {
    expect(cn("foo", "bar", "baz")).toBe("foo bar baz");
  });

  it("ignora valores undefined", () => {
    expect(cn("foo", undefined, "bar")).toBe("foo bar");
  });

  it("ignora valores null", () => {
    expect(cn("foo", null, "bar")).toBe("foo bar");
  });

  it("ignora valores false", () => {
    expect(cn("foo", false, "bar")).toBe("foo bar");
  });

  it("aplica classe quando condição é verdadeira", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("não aplica classe quando condição é falsa", () => {
    expect(cn("base", { active: false })).toBe("base");
  });

  it("deduplica classes Tailwind de padding conflitantes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("deduplica classes Tailwind de cor conflitantes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("retorna string vazia quando chamado sem argumentos", () => {
    expect(cn()).toBe("");
  });

  it("aceita array de classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("mantém classes Tailwind não conflitantes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });
});

describe("buildChecklistItemFromTodo", () => {
  const todo: Todo = { userId: 1, id: 42, title: "Fazer algo", completed: true };

  it("mapeia id do todo para string", () => {
    expect(buildChecklistItemFromTodo(todo).id).toBe("42");
  });

  it("mapeia title do todo para text", () => {
    expect(buildChecklistItemFromTodo(todo).text).toBe("Fazer algo");
  });

  it("mapeia completed do todo", () => {
    expect(buildChecklistItemFromTodo(todo).completed).toBe(true);
  });

  it("mapeia completed false corretamente", () => {
    expect(buildChecklistItemFromTodo({ ...todo, completed: false }).completed).toBe(false);
  });
});

describe("buildChecklistsFromTodos", () => {
  const makeTodos = (count: number): Todo[] =>
    Array.from({ length: count }, (_, index) => ({
      userId: 1,
      id: index + 1,
      title: `Todo ${index + 1}`,
      completed: false,
    }));

  it("sempre cria exatamente dois checklists", () => {
    expect(buildChecklistsFromTodos(makeTodos(10))).toHaveLength(2);
  });

  it("nomeia os checklists como Checklist A e Checklist B", () => {
    const [checklistA, checklistB] = buildChecklistsFromTodos(makeTodos(4));
    expect(checklistA.title).toBe("Checklist A");
    expect(checklistB.title).toBe("Checklist B");
  });

  it("divide 10 todos em 5 + 5", () => {
    const [checklistA, checklistB] = buildChecklistsFromTodos(makeTodos(10));
    expect(checklistA.items).toHaveLength(5);
    expect(checklistB.items).toHaveLength(5);
  });

  it("número ímpar — primeira metade recebe o item extra", () => {
    const [checklistA, checklistB] = buildChecklistsFromTodos(makeTodos(7));
    expect(checklistA.items).toHaveLength(4);
    expect(checklistB.items).toHaveLength(3);
  });

  it("lista vazia gera dois checklists sem itens", () => {
    const [checklistA, checklistB] = buildChecklistsFromTodos([]);
    expect(checklistA.items).toHaveLength(0);
    expect(checklistB.items).toHaveLength(0);
  });

  it("cada checklist recebe um id único", () => {
    const [checklistA, checklistB] = buildChecklistsFromTodos(makeTodos(4));
    expect(checklistA.id).not.toBe(checklistB.id);
  });

  it("inclui createdAt em formato ISO", () => {
    const [checklistA] = buildChecklistsFromTodos(makeTodos(2));
    expect(() => new Date(checklistA.createdAt)).not.toThrow();
  });

  it("mapeia os campos de cada todo para item de checklist", () => {
    const todos: Todo[] = [{ userId: 1, id: 99, title: "Item teste", completed: true }];
    const [checklistA] = buildChecklistsFromTodos(todos);
    expect(checklistA.items[0]).toEqual({ id: "99", text: "Item teste", completed: true });
  });
});

describe("computeChecklistProgress", () => {
  const makeItems = (total: number, completedCount: number): ChecklistItem[] =>
    Array.from({ length: total }, (_, index) => ({
      id: String(index),
      text: `Item ${index}`,
      completed: index < completedCount,
    }));

  it("retorna zeros para lista vazia", () => {
    const result = computeChecklistProgress([]);
    expect(result).toEqual({ completedCount: 0, totalCount: 0, progress: 0, isComplete: false });
  });

  it("calcula progresso 50% com metade concluída", () => {
    expect(computeChecklistProgress(makeItems(4, 2)).progress).toBe(50);
  });

  it("calcula progresso 100% com todos concluídos", () => {
    expect(computeChecklistProgress(makeItems(3, 3)).progress).toBe(100);
  });

  it("isComplete é true somente quando todos os itens estão concluídos", () => {
    expect(computeChecklistProgress(makeItems(3, 3)).isComplete).toBe(true);
    expect(computeChecklistProgress(makeItems(3, 2)).isComplete).toBe(false);
  });

  it("isComplete é false para lista vazia", () => {
    expect(computeChecklistProgress([]).isComplete).toBe(false);
  });

  it("retorna contagens corretas", () => {
    const result = computeChecklistProgress(makeItems(5, 3));
    expect(result.completedCount).toBe(3);
    expect(result.totalCount).toBe(5);
  });
});
