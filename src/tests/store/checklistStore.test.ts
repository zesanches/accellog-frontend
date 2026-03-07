import { useChecklistStore } from "@/store/checklistStore";
import type { Checklist } from "@/types/checklist";

const INITIAL_STATE = {
  checklists: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  limit: 10 as const,
};

const makeChecklist = (overrides: Partial<Checklist> = {}): Checklist => ({
  id: "cl-1",
  title: "Test Checklist",
  items: [],
  createdAt: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

const makeChecklistWithItems = (): Checklist => ({
  id: "cl-2",
  title: "With Items",
  items: [
    { id: "item-1", text: "Item 1", completed: false },
    { id: "item-2", text: "Item 2", completed: true },
  ],
  createdAt: "2024-01-01T00:00:00.000Z",
});

beforeEach(() => {
  useChecklistStore.setState(INITIAL_STATE);
});


describe("setChecklists", () => {
  it("substitui o array de checklists", () => {
    const cl = makeChecklist();
    useChecklistStore.getState().setChecklists([cl]);
    expect(useChecklistStore.getState().checklists).toEqual([cl]);
  });

  it("pode limpar todos os checklists", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().setChecklists([]);
    expect(useChecklistStore.getState().checklists).toHaveLength(0);
  });
});


describe("addChecklist", () => {
  it("adiciona checklist com o título informado", () => {
    useChecklistStore.getState().addChecklist("My List");
    const { checklists } = useChecklistStore.getState();
    expect(checklists).toHaveLength(1);
    expect(checklists[0].title).toBe("My List");
  });

  it("inicia com array de itens vazio", () => {
    useChecklistStore.getState().addChecklist("Empty");
    expect(useChecklistStore.getState().checklists[0].items).toEqual([]);
  });

  it("atribui ids únicos a cada checklist", () => {
    useChecklistStore.getState().addChecklist("First");
    useChecklistStore.getState().addChecklist("Second");
    const { checklists } = useChecklistStore.getState();
    expect(checklists[0].id).not.toBe(checklists[1].id);
  });

  it("define createdAt como string ISO válida", () => {
    useChecklistStore.getState().addChecklist("Date Test");
    const { createdAt } = useChecklistStore.getState().checklists[0];
    expect(new Date(createdAt).toISOString()).toBe(createdAt);
  });

  it("adiciona ao final da lista existente", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().addChecklist("Second");
    expect(useChecklistStore.getState().checklists).toHaveLength(2);
  });
});


describe("deleteChecklist", () => {
  it("remove o checklist pelo id", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().deleteChecklist("cl-1");
    expect(useChecklistStore.getState().checklists).toHaveLength(0);
  });

  it("remove apenas o checklist alvo", () => {
    const a = makeChecklist({ id: "a" });
    const b = makeChecklist({ id: "b", title: "B" });
    useChecklistStore.setState({ checklists: [a, b] });
    useChecklistStore.getState().deleteChecklist("a");
    const { checklists } = useChecklistStore.getState();
    expect(checklists).toHaveLength(1);
    expect(checklists[0].id).toBe("b");
  });

  it("não faz nada quando o id não existe", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().deleteChecklist("non-existent");
    expect(useChecklistStore.getState().checklists).toHaveLength(1);
  });
});


describe("addItem", () => {
  it("adiciona item ao checklist correto", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().addItem("cl-1", "New Item");
    const { items } = useChecklistStore.getState().checklists[0];
    expect(items).toHaveLength(1);
    expect(items[0].text).toBe("New Item");
  });

  it("inicia o item como não concluído", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().addItem("cl-1", "Uncompleted");
    expect(useChecklistStore.getState().checklists[0].items[0].completed).toBe(false);
  });

  it("atribui ids únicos a cada item", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().addItem("cl-1", "A");
    useChecklistStore.getState().addItem("cl-1", "B");
    const { items } = useChecklistStore.getState().checklists[0];
    expect(items[0].id).not.toBe(items[1].id);
  });

  it("não afeta outros checklists", () => {
    const cl2 = makeChecklistWithItems();
    useChecklistStore.setState({ checklists: [makeChecklist(), cl2] });
    useChecklistStore.getState().addItem("cl-1", "Only for CL1");
    expect(useChecklistStore.getState().checklists[1].items).toHaveLength(2);
  });

  it("não faz nada quando o checklistId não existe", () => {
    useChecklistStore.setState({ checklists: [makeChecklist()] });
    useChecklistStore.getState().addItem("non-existent", "Ghost");
    expect(useChecklistStore.getState().checklists[0].items).toHaveLength(0);
  });
});


describe("removeItem", () => {
  it("remove o item especificado do checklist", () => {
    useChecklistStore.setState({ checklists: [makeChecklistWithItems()] });
    useChecklistStore.getState().removeItem("cl-2", "item-1");
    const { items } = useChecklistStore.getState().checklists[0];
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("item-2");
  });

  it("não afeta outros checklists", () => {
    useChecklistStore.setState({ checklists: [makeChecklist(), makeChecklistWithItems()] });
    useChecklistStore.getState().removeItem("cl-2", "item-1");
    expect(useChecklistStore.getState().checklists[0].items).toHaveLength(0);
  });

  it("não faz nada quando o itemId não existe", () => {
    useChecklistStore.setState({ checklists: [makeChecklistWithItems()] });
    useChecklistStore.getState().removeItem("cl-2", "non-existent");
    expect(useChecklistStore.getState().checklists[0].items).toHaveLength(2);
  });
});


describe("toggleItem", () => {
  it("marca item incompleto como concluído", () => {
    useChecklistStore.setState({ checklists: [makeChecklistWithItems()] });
    useChecklistStore.getState().toggleItem("cl-2", "item-1");
    expect(useChecklistStore.getState().checklists[0].items[0].completed).toBe(true);
  });

  it("marca item concluído como incompleto", () => {
    useChecklistStore.setState({ checklists: [makeChecklistWithItems()] });
    useChecklistStore.getState().toggleItem("cl-2", "item-2");
    expect(useChecklistStore.getState().checklists[0].items[1].completed).toBe(false);
  });

  it("não afeta outros itens do mesmo checklist", () => {
    useChecklistStore.setState({ checklists: [makeChecklistWithItems()] });
    useChecklistStore.getState().toggleItem("cl-2", "item-1");
    expect(useChecklistStore.getState().checklists[0].items[1].completed).toBe(true);
  });
});


describe("setLoading", () => {
  it("define isLoading como true", () => {
    useChecklistStore.getState().setLoading(true);
    expect(useChecklistStore.getState().isLoading).toBe(true);
  });

  it("define isLoading como false", () => {
    useChecklistStore.setState({ isLoading: true });
    useChecklistStore.getState().setLoading(false);
    expect(useChecklistStore.getState().isLoading).toBe(false);
  });
});


describe("setError", () => {
  it("define a mensagem de erro", () => {
    useChecklistStore.getState().setError("Something went wrong");
    expect(useChecklistStore.getState().error).toBe("Something went wrong");
  });

  it("limpa o erro existente com null", () => {
    useChecklistStore.setState({ error: "Previous error" });
    useChecklistStore.getState().setError(null);
    expect(useChecklistStore.getState().error).toBeNull();
  });
});


describe("setInitialized", () => {
  it("define isInitialized como true", () => {
    useChecklistStore.getState().setInitialized();
    expect(useChecklistStore.getState().isInitialized).toBe(true);
  });
});


describe("setLimit", () => {
  it("atualiza o valor do limite", () => {
    useChecklistStore.getState().setLimit(20);
    expect(useChecklistStore.getState().limit).toBe(20);
  });

  it("reseta isInitialized para false", () => {
    useChecklistStore.setState({ isInitialized: true });
    useChecklistStore.getState().setLimit(50);
    expect(useChecklistStore.getState().isInitialized).toBe(false);
  });

  it("limpa qualquer erro existente", () => {
    useChecklistStore.setState({ error: "Some error" });
    useChecklistStore.getState().setLimit(10);
    expect(useChecklistStore.getState().error).toBeNull();
  });

  it("aceita todos os valores válidos de limite (10 | 20 | 50)", () => {
    useChecklistStore.getState().setLimit(10);
    expect(useChecklistStore.getState().limit).toBe(10);
    useChecklistStore.getState().setLimit(20);
    expect(useChecklistStore.getState().limit).toBe(20);
    useChecklistStore.getState().setLimit(50);
    expect(useChecklistStore.getState().limit).toBe(50);
  });
});


describe("retry", () => {
  it("reseta isInitialized para false", () => {
    useChecklistStore.setState({ isInitialized: true });
    useChecklistStore.getState().retry();
    expect(useChecklistStore.getState().isInitialized).toBe(false);
  });

  it("limpa o erro", () => {
    useChecklistStore.setState({ error: "Some error" });
    useChecklistStore.getState().retry();
    expect(useChecklistStore.getState().error).toBeNull();
  });

  it("não altera outros campos do estado", () => {
    useChecklistStore.setState({
      checklists: [makeChecklist()],
      isLoading: false,
      limit: 20,
    });
    useChecklistStore.getState().retry();
    const state = useChecklistStore.getState();
    expect(state.checklists).toHaveLength(1);
    expect(state.isLoading).toBe(false);
    expect(state.limit).toBe(20);
  });
});
