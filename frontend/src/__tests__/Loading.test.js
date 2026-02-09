import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import Loading from "../components/Loading.svelte";

describe("Loading Component", () => {
  it("deve renderizar o componente de loading", () => {
    render(Loading);

    // Verifica se o componente foi renderizado
    const loadingElement =
      screen.getByTestId("loading-spinner") ||
      document.querySelector(".loading");
    expect(loadingElement || screen.getByText(/carregando/i)).toBeTruthy();
  });
});
