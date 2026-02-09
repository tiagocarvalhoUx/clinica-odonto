import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Navbar from "../components/Navbar.svelte";

describe("Navbar Component", () => {
  beforeEach(() => {
    // Mock do localStorage para simular usuário logado
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        token: "fake-token",
        user: { id: 1, username: "testuser" },
      }),
    );
  });

  it("deve renderizar a navbar", () => {
    render(Navbar);

    expect(screen.getByText(/clínica odontológica/i)).toBeInTheDocument();
  });

  it("deve exibir links de navegação quando autenticado", () => {
    render(Navbar);

    // Verifica se existe o título/nome da clínica
    const clinicName = screen.getByText(/gygy/i);
    expect(clinicName).toBeInTheDocument();
  });
});
