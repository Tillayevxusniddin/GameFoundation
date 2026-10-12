// docs/13_ACCEPTANCE_CRITERIA.md — E2E qabul smoke testi: yangi o'yinchi
// oqimi, qulfli missiya, muvaffaqiyatsiz -> maslahat -> muvaffaqiyatli
// validatsiya, reloaddan keyin tiklanish va 17 missiyaning to'liq zanjiri.
// Sandbox iframe o'rniga deterministik reference sandbox ishlatiladi.

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
  LESSON_IDS,
  type StorageLike,
} from "../../src/progress/LocalProgressRepository";
import { UiPreferencesStore } from "../../src/progress/uiPreferences";
import { lessonRegistry } from "../../src/content/loader";
import type { LessonManifest } from "../../src/types/content";
import type { DraftCode, LessonStatus } from "../../src/types/progress";
import type { CodeRunner } from "../../src/types/sandbox";
import type { GameFactory } from "../../src/game/PhaserGame";
import { uz, uzMessages } from "../../src/i18n/uz";
import { runReferenceSandbox } from "../helpers/referenceSandbox";
import {
  REFERENCE_SOLUTIONS,
  WRONG_CODE,
} from "../helpers/referenceSolutions";

const FIXED_NOW = "2026-01-01T00:00:00.000Z";

const ALL_BADGES: readonly string[] = [
  "lager-tanishuv",
  "html-boshlovchi",
  "css-bogbon",
  "js-ninja",
  "web-ninja",
];

const LANGUAGE_LABELS = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
} as const;

type Language = keyof typeof LANGUAGE_LABELS;

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

// O'quvchi kodini jsdom ichida bajarib, deterministik snapshot qaytaradi.
const acceptanceRunner: CodeRunner = {
  run(request) {
    const manifest = lessonRegistry.get(request.lessonId);
    if (manifest === undefined) {
      return Promise.resolve({
        status: "error",
        snapshot: null,
        message: "Missiya topilmadi",
      });
    }
    const { snapshot } = runReferenceSandbox(manifest, request.code);
    return Promise.resolve({ status: "ok", snapshot, message: null });
  },
};

interface Harness {
  repository: LocalProgressRepository;
  preferences: UiPreferencesStore;
  container: HTMLElement;
  unmount: () => void;
}

function renderApp(
  storage: StorageLike,
  preferences?: UiPreferencesStore,
): Harness {
  const repository = new LocalProgressRepository(storage, () => FIXED_NOW);
  const prefs = preferences ?? new UiPreferencesStore(storage);
  const { container, unmount } = render(
    <App
      repository={repository}
      preferences={prefs}
      gameFactory={stubGameFactory}
      runner={acceptanceRunner}
      editorMode="plain"
    />,
  );
  return { repository, preferences: prefs, container, unmount };
}

function missionLabel(id: string, status: LessonStatus): string {
  const manifest = lessonRegistry.require(id);
  return uzMessages.missionButtonLabel(
    manifest.title,
    uzMessages.statusLabel(status),
    manifest.order,
  );
}

function enterMapWithName(name: string): void {
  const input = screen.getByLabelText(uz.playerNameLabel);
  fireEvent.change(input, { target: { value: name } });
  fireEvent.click(screen.getByRole("button", { name: uz.playerNameSave }));
}

function startMissionFromMap(lessonId: string): void {
  fireEvent.click(
    screen.getByRole("button", { name: missionLabel(lessonId, "available") }),
  );
  fireEvent.click(screen.getByRole("button", { name: uz.startMission }));
  fireEvent.click(screen.getByRole("button", { name: uz.startCoding }));
}

function setLanguageCode(
  manifest: LessonManifest,
  language: Language,
  value: string,
): void {
  const label = LANGUAGE_LABELS[language];
  if (manifest.moduleId !== "project") {
    const tab = screen.queryByRole("button", { name: label });
    if (tab !== null) {
      fireEvent.click(tab);
    }
  }
  const specific = screen.queryByRole("textbox", {
    name: `${uz.editorPaneLabel} - ${label}`,
  });
  const editor =
    specific ?? screen.getByRole("textbox", { name: uz.editorPaneLabel });
  fireEvent.change(editor, { target: { value } });
}

function applySolution(manifest: LessonManifest): void {
  const solution: DraftCode | undefined = REFERENCE_SOLUTIONS[manifest.id];
  if (solution === undefined) {
    throw new Error(`reference solution yo'q: ${manifest.id}`);
  }
  for (const language of ["html", "css", "javascript"] as const) {
    if (solution[language].trim().length > 0) {
      setLanguageCode(manifest, language, solution[language]);
    }
  }
}

function clickRun(): void {
  fireEvent.click(screen.getByRole("button", { name: uz.runCode }));
}

async function runAndAwaitSuccess(): Promise<void> {
  clickRun();
  await screen.findByText(uz.successTitle);
}

async function runAndAwaitFailure(): Promise<void> {
  clickRun();
  await screen.findByText(uz.validatorFailedTitle);
}

function openNextMission(): void {
  fireEvent.click(
    screen.getByRole("button", { name: /Keyingi missiya:/ }),
  );
}

function successXp(container: HTMLElement): string | null {
  return (
    container.querySelector(".wn-success__xp strong")?.textContent ?? null
  );
}

afterEach(() => {
  cleanup();
});

describe("qabul smoke: yangi o'yinchi oqimi", () => {
  it("intro-01 ni yakunlaydi, html-01 ochiladi va xato-maslahat-to'g'ri oqimi 180 XP beradi", async () => {
    const storage = createMemoryStorage();
    const harness = renderApp(storage, new UiPreferencesStore(storage));

    // 1. Yangi o'yinchi ism kiritadi.
    enterMapWithName("Nodir");
    expect(harness.repository.load().playerName).toBe("Nodir");

    // 2. Xaritada intro-01 ochiq, html-01 qulfli.
    expect(
      screen.getByRole("button", {
        name: missionLabel("intro-01", "available"),
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: missionLabel("html-01", "locked") }),
    ).toBeTruthy();

    // 3. Qulfli missiya old shartsiz ochilmaydi.
    fireEvent.click(
      screen.getByRole("button", { name: missionLabel("html-01", "locked") }),
    );
    expect(
      screen.queryByRole("button", { name: uz.startMission }),
    ).toBeNull();
    expect(
      screen.getByText(
        uzMessages.lockedMission(lessonRegistry.require("intro-01").title),
      ),
    ).toBeTruthy();

    // 4. intro-01 namunali yechim bilan yakunlanadi (100 XP).
    startMissionFromMap("intro-01");
    applySolution(lessonRegistry.require("intro-01"));
    await runAndAwaitSuccess();
    expect(successXp(harness.container)).toBe("100");
    await waitFor(() => {
      const progress = harness.repository.load();
      expect(progress.totalXp).toBe(100);
      expect(progress.lessons["intro-01"]?.status).toBe("completed");
      expect(progress.lessons["html-01"]?.status).toBe("available");
      expect(progress.badges).toContain("lager-tanishuv");
    });

    // 5. Keyingi missiya tugmasi html-01 ni ochadi.
    openNextMission();
    const html01 = lessonRegistry.require("html-01");

    // 6. Avval ataylab xato kod: 3 qismli xato.
    setLanguageCode(html01, "html", WRONG_CODE.html);
    await runAndAwaitFailure();
    expect(screen.getAllByText(uz.issueWhyLabel).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(uz.issueNextStepLabel).length,
    ).toBeGreaterThan(0);

    // 7. 1-daraja maslahat olinadi.
    const hintButtons = screen.getAllByRole("button", {
      name: new RegExp(uz.hintReveal),
    });
    expect(hintButtons.length).toBe(3);
    fireEvent.click(hintButtons[0] as HTMLElement);

    // 8. To'g'ri kod bilan yakunlanadi: maslahat sabab 80 XP, jami 180 XP.
    setLanguageCode(html01, "html", REFERENCE_SOLUTIONS["html-01"]?.html ?? "");
    await runAndAwaitSuccess();
    expect(successXp(harness.container)).toBe("80");

    await waitFor(() => {
      const progress = harness.repository.load();
      expect(progress.totalXp).toBe(180);
      expect(progress.lessons["html-01"]?.status).toBe("completed");
      expect(progress.lessons["html-02"]?.status).toBe("available");
    });
  });
});

describe("qabul smoke: reloaddan keyin tiklanish", () => {
  it("180 XP, o'yinchi ismi va html-02 holati yangi App instansiyasida tiklanadi", async () => {
    const storage = createMemoryStorage();
    const first = renderApp(storage, new UiPreferencesStore(storage));

    enterMapWithName("Nodir");
    startMissionFromMap("intro-01");
    applySolution(lessonRegistry.require("intro-01"));
    await runAndAwaitSuccess();
    openNextMission();

    const html01 = lessonRegistry.require("html-01");
    setLanguageCode(html01, "html", WRONG_CODE.html);
    await runAndAwaitFailure();
    fireEvent.click(
      screen.getAllByRole("button", {
        name: new RegExp(uz.hintReveal),
      })[0] as HTMLElement,
    );
    setLanguageCode(html01, "html", REFERENCE_SOLUTIONS["html-01"]?.html ?? "");
    await runAndAwaitSuccess();

    await waitFor(() => {
      expect(first.repository.load().totalXp).toBe(180);
    });

    // Reload: bir xil xotira bilan yangi repository va yangi App.
    first.unmount();
    const second = renderApp(storage, new UiPreferencesStore(storage));

    expect(
      screen.queryByRole("dialog", { name: uz.welcomeTitle }),
    ).toBeNull();
    expect(screen.getByLabelText(uz.xpLabel).textContent).toContain("180");

    await waitFor(() => {
      const progress = second.repository.load();
      expect(progress.totalXp).toBe(180);
      expect(progress.playerName).toBe("Nodir");
      expect(progress.lessons["html-02"]?.status).toBe("available");
    });
  });
});

describe("qabul smoke: to'liq 17 missiya zanjiri", () => {
  it("barcha missiyalar namunali yechim bilan yakunlanadi va 5 nishon beriladi", async () => {
    const storage = createMemoryStorage();
    const harness = renderApp(storage, new UiPreferencesStore(storage));
    enterMapWithName("Ninja");

    startMissionFromMap("intro-01");
    applySolution(lessonRegistry.require("intro-01"));
    await runAndAwaitSuccess();
    openNextMission();

    for (const manifest of lessonRegistry.lessons) {
      if (manifest.id === "intro-01") {
        continue;
      }
      applySolution(manifest);
      await runAndAwaitSuccess();
      if (manifest.nextLessonId !== undefined) {
        openNextMission();
      }
    }

    await waitFor(() => {
      const progress = harness.repository.load();
      for (const lessonId of LESSON_IDS) {
        expect(
          progress.lessons[lessonId]?.status,
          `${lessonId} yakunlanmagan`,
        ).toBe("completed");
      }
      for (const badge of ALL_BADGES) {
        expect(progress.badges, `${badge} nishoni yo'q`).toContain(badge);
      }
      expect(progress.lessons["project-01"]?.status).toBe("completed");
    });
  });
});
