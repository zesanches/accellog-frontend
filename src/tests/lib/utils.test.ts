import { cn } from "@/lib/utils";

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
