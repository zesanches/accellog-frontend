import { fetchTodos } from "@/lib/api";
import type { Todo } from "@/types/checklist";

const mockTodos: Todo[] = [
  { userId: 1, id: 1, title: "Task 1", completed: false },
  { userId: 1, id: 2, title: "Task 2", completed: true },
  { userId: 2, id: 3, title: "Task 3", completed: false },
];

describe("fetchTodos", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("chama a URL correta com o limite informado", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    await fetchTodos(10);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos?_limit=10"
    );
  });

  it("usa o parâmetro limit na URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await fetchTodos(20);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/todos?_limit=20"
    );
  });

  it("retorna o array de todos da resposta JSON", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    const result = await fetchTodos(10);

    expect(result).toEqual(mockTodos);
    expect(result).toHaveLength(3);
  });

  it("retorna o formato correto de cada todo", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    const result = await fetchTodos(10);

    expect(result[0]).toMatchObject({
      userId: 1,
      id: 1,
      title: "Task 1",
      completed: false,
    });
  });

  it("lança erro com info de status quando resposta não é ok (500)", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(fetchTodos(10)).rejects.toThrow(
      "Falha ao buscar dados: 500 Internal Server Error"
    );
  });

  it("lança erro com info de status quando resposta não é ok (404)", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    await expect(fetchTodos(10)).rejects.toThrow(
      "Falha ao buscar dados: 404 Not Found"
    );
  });

  it("propaga erros de rede", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchTodos(10)).rejects.toThrow("Network error");
  });

  it("retorna array vazio quando a API responde com array vazio", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await fetchTodos(10);

    expect(result).toEqual([]);
  });
});
