import { render, screen, waitFor, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Gallery } from '@/components/Gallery';
import { cards } from "../fixtures/cards";
import { useUiStore } from "@/stores/ui-store";

beforeEach(() => {
  useUiStore.setState({ selectedCardId: null });
});

async function renderGallery() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Gallery cards={cards} />
    </MemoryRouter>,
  );
}

// Search is debounced, so let the timer flush before asserting
async function flushDebounce() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 320));
  });
}

it("renders a preview of the fixture cards", async () => {
  await renderGallery();
  expect(
    screen.getAllByRole("button", { name: /Buka rincian kartu/ }).length,
  ).toBe(cards.length);
});

it("filters the preview by search term", async () => {
  const user = userEvent.setup();
  await renderGallery();

  await user.type(screen.getByLabelText("Cari"), "beta");
  await flushDebounce();

  expect(
    screen.getAllByRole("button", { name: /Buka rincian kartu/ }),
  ).toHaveLength(1);
  expect(screen.getByRole("button", { name: /Beta uji/ })).toBeInTheDocument();
});

it("shows an empty state when nothing matches", async () => {
  const user = userEvent.setup();
  await renderGallery();

  await user.type(screen.getByLabelText("Cari"), "tidak ada");
  await flushDebounce();

  expect(screen.getByText("Nggak ada yang cocok")).toBeInTheDocument();
  await waitFor(() => {
    expect(
      screen.queryAllByRole("button", { name: /Buka rincian kartu/ }),
    ).toHaveLength(0);
  });
});

it("opens a card dialog straight to the full detail", async () => {
  const user = userEvent.setup();
  await renderGallery();

  await user.click(screen.getByRole("button", { name: /Beta uji/ }));

  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent("Beta uji");
  expect(dialog).toHaveTextContent("Epik");
  expect(dialog).toHaveTextContent("TEST-02");
  // No second step: art, stats, and rules are all visible at once
  expect(dialog).toHaveTextContent("Aturan uji B");
  expect(within(dialog).getByText("Gundu")).toBeInTheDocument();
  expect(
    within(dialog).queryByRole("button", { name: "Lihat selengkapnya" }),
  ).not.toBeInTheDocument();

  await user.click(within(dialog).getByRole("button", { name: "Tutup" }));
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

it("links to the full cards page", async () => {
  await renderGallery();
  const links = screen.getAllByRole("link", { name: /Liat semua kartu/ });
  expect(links.length).toBeGreaterThan(0);
  expect(links[0]).toHaveAttribute("href", "/kartu");
});
