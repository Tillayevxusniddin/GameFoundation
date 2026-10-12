import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { App } from "../../src/app/App";
import {
  LocalProgressRepository,
  type StorageLike,
} from "../../src/progress/LocalProgressRepository";
import type { GameFactory } from "../../src/game/PhaserGame";
import type { CodeRunner, SandboxSnapshot } from "../../src/types/sandbox";
import { uz } from "../../src/i18n/uz";

const FIXED_NOW = "2026-01-01T00:00:00.000Z";

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

// Sandbox iframe o'rniga deterministik snapshot qaytaradi. Faqat o'quvchi
// kodidagi h1 mavjudligiga qarab natija tayyorlaydi.
const fakeRunner: CodeRunner = {
  run(request): Promise<{
    status: "ok";
    snapshot: SandboxSnapshot;
    message: null;
  }> {
    const snapshot: SandboxSnapshot = {
      dom: request.code.html,
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

afterEach(() => {
  cleanup();
});

function openCoding(): { repository: LocalProgressRepository; container: HTMLElement } {
  const repository = new LocalProgressRepository(
    createMemoryStorage(),
    () => FIXED_NOW,
  );
  const { container } = render(
    <App
      repository={repository}
      gameFactory={stubGameFactory}
      runner={fakeRunner}
      editorMode="plain"
    />,
  );

  fireEvent.click(
    screen.getByRole("button", { name: /1-missiya: Boshlang.ich lager/ }),
  );
  fireEvent.click(screen.getByRole("button", { name: uz.startMission }));
  fireEvent.click(screen.getByRole("button", { name: uz.startCoding }));

  return { repository, container };
}

describe("kod yozish sikli", () => {
  it("xato -> maslahat -> to'g'ri kod -> 80 XP va html-01 ochilishi", async () => {
    const { repository, container } = openCoding();

    const editor = screen.getByRole("textbox", { name: uz.editorPaneLabel });

    // 1. Noto'g'ri kod yozib ishga tushiramiz.
    fireEvent.change(editor, { target: { value: "<p>sarlavha yo'q</p>" } });
    fireEvent.click(screen.getByRole("button", { name: uz.runCode }));

    await screen.findByText(uz.validatorFailedTitle);

    // 2. Maslahat olamiz (yon panelda, modal emas).
    const hintButtons = screen.getAllByRole("button", {
      name: new RegExp(uz.hintReveal),
    });
    expect(hintButtons.length).toBe(3);
    fireEvent.click(hintButtons[0] as HTMLElement);

    // 3. To'g'ri kod yozib qayta ishga tushiramiz.
    fireEvent.change(editor, {
      target: { value: "<h1>Salom, Web Ninja!</h1>" },
    });
    fireEvent.click(screen.getByRole("button", { name: uz.runCode }));

    await screen.findByText(uz.successTitle);

    // 4. Maslahat olingani uchun 80 XP.
    expect(
      container.querySelector(".wn-success__xp strong")?.textContent,
    ).toBe("80");

    // 5. Progress repository: intro-01 tugadi, html-01 ochildi.
    await waitFor(() => {
      const progress = repository.load();
      expect(progress.lessons["intro-01"]?.status).toBe("completed");
      expect(progress.lessons["html-01"]?.status).toBe("available");
      expect(progress.totalXp).toBe(80);
      expect(progress.badges).toContain("lager-tanishuv");
    });
  });

  it("maslahatsiz yakunlanganda 100 XP beriladi", async () => {
    const { repository, container } = openCoding();

    const editor = screen.getByRole("textbox", { name: uz.editorPaneLabel });
    fireEvent.change(editor, {
      target: { value: "<h1>Salom, Web Ninja!</h1>" },
    });
    fireEvent.click(screen.getByRole("button", { name: uz.runCode }));

    await screen.findByText(uz.successTitle);
    expect(
      container.querySelector(".wn-success__xp strong")?.textContent,
    ).toBe("100");

    await waitFor(() => {
      expect(repository.load().totalXp).toBe(100);
    });
  });

  it("reset tugmasi tasdiqlash modalini ochadi", async () => {
    openCoding();

    fireEvent.click(screen.getByRole("button", { name: uz.resetCode }));
    expect(
      screen.getByRole("dialog", { name: uz.resetConfirmTitle }),
    ).toBeTruthy();
  });
});
