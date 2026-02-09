import { describe, it, expect, vi } from "vitest";
import { get } from "svelte/store";
import { authStore } from "../stores/authStore";

describe("Auth Store", () => {
  it("deve ter estado inicial correto", () => {
    const state = get(authStore);

    expect(state).toHaveProperty("user");
    expect(state).toHaveProperty("token");
    expect(state).toHaveProperty("isAuthenticated");
  });

  it("deve manipular login corretamente", () => {
    const mockUser = { id: 1, username: "testuser" };
    const mockToken = "fake-token";

    authStore.login(mockUser, mockToken);

    const state = get(authStore);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toEqual(mockToken);
    expect(state.isAuthenticated).toBe(true);
  });

  it("deve manipular logout corretamente", () => {
    authStore.logout();

    const state = get(authStore);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
