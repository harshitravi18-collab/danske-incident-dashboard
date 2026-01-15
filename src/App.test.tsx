import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "@test/render";

describe("App", () => {
  it("renders the app title", async () => {
    renderWithProviders(<App />, { route: "/incidents" });

    expect(await screen.findByTestId("app-title")).toBeInTheDocument();
  });
});
