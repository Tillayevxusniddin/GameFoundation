import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../../src/app/App";
import {
  LocalProgressRepository,
  STORAGE_KEY,
  type StorageLike,
} from "../../src/progress/LocalProgressRepository";
import { UiPreferencesStore } from "../../src/progress/uiPreferences";
import type { GameFactory } from "../../src/game/PhaserGame";
import type { CodeRunner, SandboxSnapshot } from "../../src/types/sandbox";
import { uz, uzMessages } from "../../src/i18n/uz";

const FIXED_NOW = "2026-01-01T00:00:00.000Z";

const stubGameFactory: GameFactory = () => ({ destroy(): void {} });

const fakeRunner: CodeRunner = {
  run(): Promise<{ status: "ok"; snapshot: SandboxSnapshot; message: null }> {
    const snapshot: SandboxSnapshot = {
      dom: "<h1>Salom</h1>",
      nodeCount: 1,
      console: [],
      errors: [],
      securityViolations: [],
      visual: {},
      behavior: {},
      truncated: false,
      timedOut: false,
      durationMs: 1,
    };
    return Promise.resolve({ status: "ok", snapshot, message: null });
  },
};

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

function createPreferences(introSeen = true): UiPreferencesStore {
  const store = new UiPreferencesStore(createMemoryStorage());
  store.update({ introSeen });
  return store;
}

function renderApp(options?: {
  repository?: LocalProgressRepository;
  preferences?: UiPreferencesStore;
}): LocalProgressRepository {
  const repository =
    options?.repository ??
    new LocalProgressRepository(createMemoryStorage(), () => FIXED_NOW);
  render(
    <App
      repository={repository}
      preferences={options?.preferences ?? createPreferences()}
      gameFactory={stubGameFactory}
      runner={fakeRunner}
      editorMode="plain"
    />,
  );
  return repository;
}

afterEach(() => {
  cleanup();
});

describe("modal fokus va klaviatura", () => {
  it("fokus modal ichiga o'tadi, Escape yopadi va fokus ochgan tugmaga qaytadi", () => {
    renderApp();

    const trigger = screen.getByRole("button", { name: uz.openSettings });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: uz.settingsTitle });
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(dialog.contains(trigger)).toBe(false);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(
      screen.queryByRole("dialog", { name: uz.settingsTitle }),
    ).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("progress eksport va import", () => {
  it("eksport qilingan JSON yangi holatga xavfsiz tiklanadi", () => {
    const source = new LocalProgressRepository(
      createMemoryStorage(),
      () => FIXED_NOW,
    );
    source.completeLesson("intro-01", 0, "lager-tanishuv");
    renderApp({ repository: source });

    fireEvent.click(screen.getByRole("button", { name: uz.openSettings }));
    const exportArea = screen.getByRole("textbox", {
      name: uz.progressJsonLabel,
    }) as HTMLTextAreaElement;
    const exported = exportArea.value;
    expect(exported).toContain("intro-01");

    cleanup();

    const target = new LocalProgressRepository(
      createMemoryStorage(),
      () => FIXED_NOW,
    );
    renderApp({ repository: target });
    fireEvent.click(screen.getByRole("button", { name: uz.openSettings }));

    const importArea = screen.getByRole("textbox", {
      name: uz.importTextLabel,
    });
    fireEvent.change(importArea, { target: { value: exported } });
    fireEvent.click(screen.getByRole("button", { name: uz.importButton }));

    expect(screen.getByText(uz.importSuccess)).toBeTruthy();
    expect(target.load().totalXp).toBe(100);
    expect(target.load().lessons["intro-01"]?.status).toBe("completed");
  });

  it("buzilgan JSON xavfsiz rad etiladi va progress buzilmaydi", () => {
    const repository = new LocalProgressRepository(
      createMemoryStorage(),
      () => FIXED_NOW,
    );
    renderApp({ repository });
    fireEvent.click(screen.getByRole("button", { name: uz.openSettings }));

    const importArea = screen.getByRole("textbox", {
      name: uz.importTextLabel,
    });
    fireEvent.change(importArea, { target: { value: "{ buzilgan json" } });
    fireEvent.click(screen.getByRole("button", { name: uz.importButton }));

    expect(screen.getByText(uz.importErrorTitle)).toBeTruthy();
    expect(screen.getByText(uz.issueWhatLabel)).toBeTruthy();
    expect(screen.getByText(uz.issueNextStepLabel)).toBeTruthy();
    expect(repository.load().totalXp).toBe(0);
    expect(repository.load().lessons["intro-01"]?.status).toBe("available");
  });
});

describe("buzilgan localStorage ogohlantirishi", () => {
  it("progressCorrupted uchun banner ko'rsatiladi", () => {
    const storage = createMemoryStorage();
    storage.setItem(STORAGE_KEY, "{{{ buzilgan ma'lumot");
    const repository = new LocalProgressRepository(storage, () => FIXED_NOW);

    renderApp({ repository });

    expect(screen.getByText(uz.progressCorrupted)).toBeTruthy();
  });
});

describe("holatlar rangga bog'liq emas va matn toza", () => {
  it("missiya holatlari aria-label orqali matndan o'qiladi", () => {
    renderApp();

    const introButton = screen.getByRole("button", {
      name: /1-missiya: Boshlang.ich lager/,
    });
    expect(introButton.getAttribute("aria-label")).toContain(
      uzMessages.statusLabel("available"),
    );

    const lockedButton = screen.getByRole("button", {
      name: /2-missiya: HTML qishlog.i/,
    });
    expect(lockedButton.getAttribute("aria-label")).toContain(
      uzMessages.statusLabel("locked"),
    );
  });

  it("o'zbekcha matnlarda to'g'ri o'/g' harflari ishlatiladi", () => {
    for (const value of Object.values(uz)) {
      if (typeof value === "string") {
        expect(value).not.toMatch(/[oOgG]'/);
      }
    }
  });
});
