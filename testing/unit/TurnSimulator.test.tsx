import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { TurnSimulator } from "@/components/TurnSimulator";
import { SimResultBanner } from "@/components/SimResultBanner";

function renderSimulator() {
  return render(<TurnSimulator bare />);
}

/** The one element the simulator points at right now. */
function hintedElements(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-hint=true]"));
}

/** Waits for the card exit animation so only the live hint is counted. */
async function settledHints() {
  await waitFor(() => expect(hintedElements()).toHaveLength(1));
  return hintedElements();
}

it("points the guide and the glow at the same thing", async () => {
  const user = userEvent.setup();
  renderSimulator();

  // Opening hand holds two AIR copies, but only one may glow.
  const hints = hintedElements();
  expect(hints).toHaveLength(1);
  expect(hints[0]).toHaveAttribute("data-type", "energy");
  expect(hints[0]).toHaveTextContent("AIR");

  const guide = screen.getByRole("status");
  expect(guide).toHaveTextContent("Pasang Energy Air");
  expect(guide).toHaveTextContent("Laras, Si Langkah Tinggi");

  // Playing the highlighted card advances both the guide and the glow.
  await user.click(hints[0]);

  const next = await settledHints();
  expect(next[0]).toHaveAttribute("data-type", "power_up");
  expect(screen.getByRole("status")).toHaveTextContent("Egrang");
});

it("keeps the guide and the glow in sync once the turn moves on", async () => {
  const user = userEvent.setup();
  renderSimulator();

  await user.click(hintedElements()[0]); // attach AIR
  await user.click((await settledHints())[0]); // equip Egrang

  // Now the strike button is the highlighted target, and the guide says so.
  const hints = await settledHints();
  expect(hints[0]).toHaveTextContent("Serang");
  expect(screen.getByRole("status")).toHaveTextContent("Klik Serang");
});

it("shows a lose banner on the board when the round is over", async () => {
  const user = userEvent.setup();
  // No dodges: every rival attack lands, so the round always ends in a loss.
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  renderSimulator();

  for (let turn = 0; turn < 30; turn++) {
    if (screen.queryByTestId("sim-result-banner")) break;
    await user.click(screen.getByRole("button", { name: /Akhiri giliran/ }));
  }

  const banner = screen.getByTestId("sim-result-banner");
  expect(banner).toHaveAttribute("data-outcome", "lost");
  expect(banner).toHaveTextContent("Kalah.");
});

it("lets the player close the result and look at the final board", async () => {
  const user = userEvent.setup();
  vi.spyOn(Math, "random").mockReturnValue(0.99);
  renderSimulator();

  for (let turn = 0; turn < 30; turn++) {
    if (screen.queryByTestId("sim-result-banner")) break;
    await user.click(screen.getByRole("button", { name: /Akhiri giliran/ }));
  }

  await user.click(screen.getByRole("button", { name: "Liat papan" }));
  await waitFor(() => {
    expect(screen.queryByTestId("sim-result-banner")).not.toBeInTheDocument();
  });
  // The board stays put, so the final state is still readable.
  expect(screen.getByRole("status")).toHaveTextContent("kalah");
});

it("shows a win banner when the player wins", () => {
  render(
    <SimResultBanner
      won
      reason="Sekar, Sang Pemanen KO. Poin kamu naik. 3 KO. Kamu menang."
      turn={7}
      ko={3}
      koToWin={3}
      onPlayAgain={() => {}}
    />,
  );

  const banner = screen.getByTestId("sim-result-banner");
  expect(banner).toHaveAttribute("data-outcome", "won");
  expect(banner).toHaveTextContent("Menang!");
  expect(banner).toHaveTextContent("3 KO");
  expect(banner).toHaveTextContent("Giliran 7");
});
