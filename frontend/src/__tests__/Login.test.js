import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Login from "../pages/Login.svelte";

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar o formulário de login", () => {
    render(Login);

    expect(screen.getByPlaceholderText(/usuário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("deve validar campos obrigatórios", async () => {
    render(Login);

    const submitButton = screen.getByRole("button", { name: /entrar/i });
    await fireEvent.click(submitButton);

    // Verifica se não houve chamada de API sem preencher campos
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("deve exibir campos de entrada", () => {
    render(Login);

    const usernameInput = screen.getByPlaceholderText(/usuário/i);
    const passwordInput = screen.getByPlaceholderText(/senha/i);

    expect(usernameInput).toBeVisible();
    expect(passwordInput).toBeVisible();
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
