import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/svelte";
import "@testing-library/jest-dom/vitest";

// Mock de variáveis de ambiente
vi.mock("$env/static/public", () => ({
  PUBLIC_API_URL: "http://localhost:3000",
}));

// Cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock do fetch
global.fetch = vi.fn();
