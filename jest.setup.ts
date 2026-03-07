import "@testing-library/jest-dom";

// crypto.randomUUID não está disponível no jsdom — usa a implementação do Node.js
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: require("crypto").randomUUID },
  writable: true,
});
