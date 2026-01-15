import { describe, it, expect, vi, type MockedFunction } from "vitest";
import { screen } from "@testing-library/react";
import { IncidentsPage } from "../IncidentsPage";
import { renderWithProviders } from "@test/render";
import type { Incident, User } from "@api/types";

vi.mock("@services/incidents", () => ({
  listIncidents: vi.fn(),
  getIncident: vi.fn(),
  createIncident: vi.fn(),
  updateIncident: vi.fn(),
}));

vi.mock("@services/users", () => ({
  listUsers: vi.fn(),
}));

import { listIncidents } from "@services/incidents";
import { listUsers } from "@services/users";

const mockedListIncidents = listIncidents as MockedFunction<
  typeof listIncidents
>;
const mockedListUsers = listUsers as MockedFunction<typeof listUsers>;

const incidents: Incident[] = [
  {
    id: "1",
    title: "Payments failing",
    description: "Payments fail on checkout",
    severity: "High",
    status: "Open",
    assigneeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: "",
    statusHistory: [],
  },
];

const users: User[] = [
  {
    id: "u1",
    name: "Alex",
    email: "alex@example.com",
  },
];

describe("IncidentsPage", () => {
  it("renders incidents list", async () => {
    mockedListIncidents.mockResolvedValue(incidents);
    mockedListUsers.mockResolvedValue(users);

    renderWithProviders(<IncidentsPage />);

    expect(await screen.findByText("Payments failing")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("shows retry state when list fails", async () => {
    mockedListIncidents.mockRejectedValue(new Error("boom"));
    mockedListUsers.mockResolvedValue(users);

    renderWithProviders(<IncidentsPage />);

    expect(
      await screen.findByText(/something went wrong/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("incidents-retry-button")).toBeInTheDocument();
  });
});
