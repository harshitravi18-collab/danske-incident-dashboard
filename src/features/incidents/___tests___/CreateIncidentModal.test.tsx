import { describe, it, expect, vi, type MockedFunction } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateIncidentModal } from "../components/CreateIncidentModal";
import { renderWithProviders } from "@test/render";
import type { Incident, User } from "@api/types";

vi.mock("@services/incidents", () => ({
  createIncident: vi.fn(),
  listIncidents: vi.fn(),
  getIncident: vi.fn(),
  updateIncident: vi.fn(),
}));

import { createIncident, listIncidents } from "@services/incidents";

const mockedCreateIncident = createIncident as MockedFunction<
  typeof createIncident
>;
const mockedListIncidents = listIncidents as MockedFunction<
  typeof listIncidents
>;

const users: User[] = [
  {
    id: "u1",
    name: "Alex",
    email: "alex@example.com",
  },
];

describe("CreateIncidentModal", () => {
  it("validates title and description", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <CreateIncidentModal open onClose={() => {}} users={users} />,
    );

    await user.click(screen.getByTestId("create-incident-submit"));

    expect(
      await screen.findByText(/title must be at least/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/description must be at least/i),
    ).toBeInTheDocument();
  });

  it("submits valid payload", async () => {
    const user = userEvent.setup();

    mockedCreateIncident.mockResolvedValue({
      id: "new",
      title: "New incident",
      description: "This is a valid description",
      severity: "Medium",
      status: "Open",
      assigneeId: null,
      createdAt: new Date().toISOString(),
      statusHistory: [],
      updatedAt: "",
    } satisfies Incident);

    //  invalidateQueries waits for incidents to refetch
    mockedListIncidents.mockResolvedValue([]);

    const onCreated = vi.fn();

    renderWithProviders(
      <CreateIncidentModal
        open
        onClose={() => {}}
        users={users}
        onCreated={onCreated}
      />,
    );

    await user.type(
      screen.getByTestId("create-incident-title"),
      "New incident",
    );
    await user.type(
      screen.getByTestId("create-incident-description"),
      "This is a valid description",
    );

    await user.click(screen.getByTestId("create-incident-submit"));

    await waitFor(() => expect(mockedCreateIncident).toHaveBeenCalledTimes(1), {
      timeout: 10000,
    });
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith("new"), {
      timeout: 10000,
    });
  }, 150000);
});
