import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { App } from "../../src/app/App";
import {
  LocalProgressRepository,
  type StorageLike,
} from "../../src/progress/LocalProgressRepository";
import type { GameFactory } from "../../src/game/PhaserGame";
import { uz } from "../../src/i18n/uz";

const FIXED_NOW = "2026-01-01T00:00:00.000Z";

// Phaser jsdom muhitida ishlamaydi; testda faqat UI/typed aloqa tekshiriladi.
const stubGameFactory: GameFactory = () => ({ destroy(): void {} });

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      map.set(key, value);
    },
    removeItem(key: string): void {
      map.delete(key);
    },
  };
}

function renderApp(): { container: HTMLElement } {
  const repository = new LocalProgressRepository(
    createMemoryStorage(),
    () => FIXED_NOW,
  );
  return render(<App repository={repository} gameFactory={stubGameFactory} />);
}

afterEach(() => {
  cleanup();
});

describe("xarita va navigatsiya", () => {
  it("boshida xarita holati, navigatsiya va missiya ro'yxati ko'rinadi", () => {
    const { container } = renderApp();

    expect(
      screen.getByRole("navigation", { name: uz.navPrimaryLabel }),
    ).toBeTruthy();
    expect(
      screen.getByRole("region", { name: uz.mapViewLabel }),
    ).toBeTruthy();
    expect(container.querySelector(`[aria-label="${uz.xpLabel}"]`)).toBeTruthy();
    expect(
      container.querySelector(`[aria-label="${uz.badgeLabel}"]`),
    ).toBeTruthy();
    expect(screen.getByText(uz.selectedMissionLabel)).toBeTruthy();

    // intro-01 ochiq, html-01 qulfli.
    const introButton = screen.getByRole("button", {
      name: /1-missiya: Boshlang.ich lager/,
    });
    expect(introButton.getAttribute("aria-label")).toContain("Mavjud");
    const htmlButton = screen.getByRole("button", {
      name: /2-missiya: HTML qishlog.i/,
    });
    expect(htmlButton.getAttribute("aria-label")).toContain("Qulfli");
  });

  it("qulfli missiya tanlansa old shart ko'rsatiladi (aria-live)", () => {
    const { container } = renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /2-missiya: HTML qishlog.i/ }),
    );

    expect(screen.getByText(/Qulfli: avval/)).toBeTruthy();
    expect(screen.getByText(/missiyasini yakunlang/)).toBeTruthy();

    const info = container.querySelector(".wn-map__info");
    expect(info?.getAttribute("aria-live")).toBe("polite");
  });

  it("ochiq missiyani tanlab mission_intro va coding holatiga o'tadi", () => {
    const { container } = renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /1-missiya: Boshlang.ich lager/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: uz.startMission }));

    // mission_intro holati.
    expect(
      screen.getByRole("button", { name: uz.startCoding }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: uz.startCoding }));

    // coding holati: uch panelli tuzilma va tablar.
    const tablist = screen.getByRole("tablist", {
      name: uz.missionTabsLabel,
    });
    expect(tablist).toBeTruthy();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(
      screen.getByRole("tab", { name: uz.tabMission }).getAttribute(
        "aria-selected",
      ),
    ).toBe("true");
    expect(
      screen.getByRole("tabpanel", { name: uz.editorPaneLabel }),
    ).toBeTruthy();
    expect(
      screen.getByRole("textbox", { name: uz.editorPaneLabel }),
    ).toBeTruthy();

    // preview/validator aria-live.
    const preview = container.querySelector(".wn-preview");
    expect(preview?.getAttribute("aria-live")).toBe("polite");
  });

  it("ekrandagi harakat tugmalari va navigatsiya tugmalari matnli nomga ega", () => {
    renderApp();

    expect(
      screen.getByRole("button", { name: uz.moveUp }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.moveDown }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.moveLeft }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.moveRight }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.openSettings }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.exportProgress }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: uz.importProgress }),
    ).toBeTruthy();
    expect(screen.getByLabelText(uz.importFileLabel)).toBeTruthy();
  });

  it("sozlamalar oynasi modal sifatida ochiladi va progress JSON ko'rsatadi", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: uz.openSettings }));
    expect(
      screen.getByRole("dialog", { name: uz.settingsTitle }),
    ).toBeTruthy();
    expect(
      screen.getByRole("textbox", { name: uz.progressJsonLabel }),
    ).toBeTruthy();
  });

  it("coding holatidan xaritaga qaytish mumkin", () => {
    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /1-missiya: Boshlang.ich lager/ }),
    );
    fireEvent.click(screen.getByRole("button", { name: uz.startMission }));
    fireEvent.click(screen.getByRole("button", { name: uz.startCoding }));

    expect(screen.getByRole("tablist")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: uz.backToMap }));
    expect(
      screen.getByRole("region", { name: uz.mapViewLabel }),
    ).toBeTruthy();
  });
});
