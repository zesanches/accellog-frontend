import { renderHook, waitFor, act } from "@testing-library/react";
import { useInitializeChecklists } from "@/hooks/useInitializeChecklists";
import { useChecklistStore } from "@/store/checklistStore";
import { fetchTodos } from "@/lib/api";
import type { Todo } from "@/types/checklist";

jest.mock("@/lib/api");
const mockFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>;

const makeTodos = (count: number): Todo[] =>
  Array.from({ length: count }, (_, i) => ({
    userId: 1,
    id: i + 1,
    title: `Todo ${i + 1}`,
    completed: i % 2 === 0,
  }));

beforeEach(() => {
  useChecklistStore.setState({
    checklists: [],
    isLoading: false,
    error: null,
    isInitialized: false,
    limit: 10,
  });
  jest.clearAllMocks();
});

describe("useInitializeChecklists", () => {
  it("chama fetchTodos com o limite atual ao montar", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(10));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => expect(mockFetchTodos).toHaveBeenCalledWith(10));
  });

  it("não faz fetch quando já está inicializado", async () => {
    useChecklistStore.setState({ isInitialized: true });

    renderHook(() => useInitializeChecklists());

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(mockFetchTodos).not.toHaveBeenCalled();
  });

  it("cria exatamente dois checklists", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(10));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().checklists).toHaveLength(2);
    });
  });

  it("nomeia os checklists como 'Checklist A' e 'Checklist B'", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(10));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      const { checklists } = useChecklistStore.getState();
      expect(checklists[0].title).toBe("Checklist A");
      expect(checklists[1].title).toBe("Checklist B");
    });
  });

  it("divide 10 todos em 5 + 5 entre os dois checklists", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(10));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      const { checklists } = useChecklistStore.getState();
      expect(checklists[0].items).toHaveLength(5);
      expect(checklists[1].items).toHaveLength(5);
    });
  });

  it("número ímpar de todos — primeira metade recebe o item extra", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(7));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      const { checklists } = useChecklistStore.getState();
      expect(checklists[0].items).toHaveLength(4);
      expect(checklists[1].items).toHaveLength(3);
    });
  });

  it("mapeia id, title e completed do todo para os campos do item", async () => {
    mockFetchTodos.mockResolvedValueOnce([
      { userId: 1, id: 42, title: "Test Todo", completed: true },
    ]);

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      const item = useChecklistStore.getState().checklists[0].items[0];
      expect(item.id).toBe("42");
      expect(item.text).toBe("Test Todo");
      expect(item.completed).toBe(true);
    });
  });

  it("define isLoading como true durante o fetch e false após", async () => {
    let resolve: (v: Todo[]) => void;
    const pending = new Promise<Todo[]>((r) => { resolve = r; });
    mockFetchTodos.mockReturnValueOnce(pending);

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().isLoading).toBe(true);
    });

    resolve!(makeTodos(4));

    await waitFor(() => {
      expect(useChecklistStore.getState().isLoading).toBe(false);
    });
  });

  it("define isInitialized como true após fetch bem-sucedido", async () => {
    mockFetchTodos.mockResolvedValueOnce(makeTodos(10));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().isInitialized).toBe(true);
    });
  });

  it("define o estado de erro quando fetchTodos lança um Error", async () => {
    mockFetchTodos.mockRejectedValueOnce(new Error("Network error"));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().error).toBe("Network error");
    });
  });

  it("define mensagem genérica para exceções que não são Error", async () => {
    mockFetchTodos.mockRejectedValueOnce("string error");

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().error).toBe(
        "Erro desconhecido ao carregar dados"
      );
    });
  });

  it("define isLoading como false após fetch com erro", async () => {
    mockFetchTodos.mockRejectedValueOnce(new Error("fail"));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().isLoading).toBe(false);
    });
  });

  it("não define isInitialized quando ocorre erro", async () => {
    mockFetchTodos.mockRejectedValueOnce(new Error("fail"));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => {
      expect(useChecklistStore.getState().error).not.toBeNull();
    });
    expect(useChecklistStore.getState().isInitialized).toBe(false);
  });

  it("refaz o fetch quando o limite muda", async () => {
    mockFetchTodos
      .mockResolvedValueOnce(makeTodos(10))
      .mockResolvedValueOnce(makeTodos(20));

    renderHook(() => useInitializeChecklists());

    await waitFor(() => expect(mockFetchTodos).toHaveBeenCalledTimes(1));

    act(() => { useChecklistStore.getState().setLimit(20); });

    await waitFor(() => expect(mockFetchTodos).toHaveBeenCalledTimes(2));
    expect(mockFetchTodos).toHaveBeenLastCalledWith(20);
  });
});
