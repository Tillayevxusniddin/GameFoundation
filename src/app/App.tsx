// docs/06_TECHNICAL_ARCHITECTURE.md — app qatlami ProgressRepository,
// StateMachine, EventBridge, PhaserGame va UI panellarini birlashtiradi.
// Phaser obyektlari React state ichida boshqarilmaydi; aloqa typed event orqali.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEventBridge, type EventBridge } from "./eventBridge";
import { createStateMachine, type StateMachine } from "./stateMachine";
import { LocalProgressRepository } from "../progress/LocalProgressRepository";
import type {
  LessonStatus,
  PlayerProgress,
  ProgressRepository,
} from "../types/progress";
import type { GameEventMap, GameState } from "../types/game";
import { lessonRegistry } from "../content/loader";
import { uz } from "../i18n/uz";
import { TopNav } from "../ui/TopNav";
import { MapView } from "../ui/MapView";
import { MissionIntro, MissionWorkspace } from "../ui/MissionView";
import { SettingsPanel } from "../ui/SettingsPanel";
import type { GameFactory } from "../game/PhaserGame";

export interface AppProps {
  repository?: ProgressRepository;
  bridge?: EventBridge<GameEventMap>;
  gameFactory?: GameFactory;
}

function downloadJson(json: string): void {
  if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    return;
  }
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "web-ninja-progress.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function App({
  repository: providedRepository,
  bridge: providedBridge,
  gameFactory,
}: AppProps): JSX.Element {
  const repository = useMemo<ProgressRepository>(
    () => providedRepository ?? new LocalProgressRepository(),
    [providedRepository],
  );
  const bridge = useMemo<EventBridge<GameEventMap>>(
    () => providedBridge ?? createEventBridge(),
    [providedBridge],
  );
  const machineRef = useRef<StateMachine>(createStateMachine("loading"));

  const [gameState, setGameState] = useState<GameState>("loading");
  const [progress, setProgress] = useState<PlayerProgress>(() =>
    repository.load(),
  );
  const [warning, setWarning] = useState<string | null>(() =>
    repository.getWarning(),
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progressJson, setProgressJson] = useState("");

  const states = useMemo<Record<string, LessonStatus>>(() => {
    const next: Record<string, LessonStatus> = {};
    for (const lesson of lessonRegistry.lessons) {
      next[lesson.id] = progress.lessons[lesson.id]?.status ?? "locked";
    }
    return next;
  }, [progress]);
  const statesRef = useRef(states);
  statesRef.current = states;

  const transition = useCallback(
    (to: GameState): boolean => {
      const machine = machineRef.current;
      const from = machine.get();
      if (!machine.go(to)) {
        return false;
      }
      setGameState(to);
      bridge.emit("game:state-changed", { from, to });
      return true;
    },
    [bridge],
  );

  useEffect(() => {
    const machine = machineRef.current;
    const from = machine.get();
    if (machine.go("map")) {
      setGameState("map");
      bridge.emit("game:state-changed", { from, to: "map" });
    }
  }, [bridge]);

  useEffect(() => {
    const offNearby = bridge.subscribe("map:mission-nearby", ({ lessonId }) => {
      setSelectedLessonId(lessonId);
    });
    const offReady = bridge.subscribe("game:ready", () => {
      bridge.emit("map:states-updated", { states: statesRef.current });
    });
    return () => {
      offNearby();
      offReady();
    };
  }, [bridge]);

  useEffect(() => {
    bridge.emit("map:states-updated", { states });
  }, [bridge, states]);

  const handleSelect = useCallback((lessonId: string): void => {
    setSelectedLessonId(lessonId);
  }, []);

  const handleStart = useCallback(
    (lessonId: string): void => {
      const manifest = lessonRegistry.get(lessonId);
      const status = statesRef.current[lessonId] ?? "locked";
      if (manifest === undefined || status === "locked") {
        setSelectedLessonId(lessonId);
        return;
      }
      setActiveLessonId(lessonId);
      setSelectedLessonId(lessonId);
      bridge.emit("map:mission-selected", { lessonId });
      transition("mission_intro");
    },
    [bridge, transition],
  );

  const handleBeginCoding = useCallback((): void => {
    const lessonId = activeLessonId;
    if (lessonId === null) {
      return;
    }
    if (transition("coding")) {
      bridge.emit("mission:started", { lessonId });
    }
  }, [activeLessonId, bridge, transition]);

  const handleBackToMap = useCallback((): void => {
    transition("map");
  }, [transition]);

  const handleOpenSettings = useCallback((): void => {
    setProgressJson(repository.exportJson());
    setSettingsOpen(true);
  }, [repository]);

  const handleCloseSettings = useCallback((): void => {
    setSettingsOpen(false);
  }, []);

  const handleExport = useCallback((): void => {
    const json = repository.exportJson();
    setProgressJson(json);
    downloadJson(json);
  }, [repository]);

  const handleImport = useCallback(
    (json: string): void => {
      const next = repository.importJson(json);
      setProgress(next);
      setWarning(repository.getWarning());
    },
    [repository],
  );

  const activeManifest =
    activeLessonId === null ? undefined : lessonRegistry.get(activeLessonId);

  return (
    <div className="wn-app">
      <TopNav
        totalXp={progress.totalXp}
        badgesCount={progress.badges.length}
        showBackToMap={gameState !== "map" && gameState !== "loading"}
        onBackToMap={handleBackToMap}
        onOpenSettings={handleOpenSettings}
        onExport={handleExport}
        onImportJson={handleImport}
      />
      <main className="wn-main">
        <h1 className="wn-visually-hidden">{uz.appTitle}</h1>
        {warning !== null ? (
          <p className="wn-banner" role="status">
            {warning}
          </p>
        ) : null}

        {gameState === "map" ? (
          <MapView
            bridge={bridge}
            states={states}
            selectedLessonId={selectedLessonId}
            onSelect={handleSelect}
            onStart={handleStart}
            gameFactory={gameFactory}
          />
        ) : null}

        {gameState === "mission_intro" && activeManifest !== undefined ? (
          <MissionIntro
            manifest={activeManifest}
            onBeginCoding={handleBeginCoding}
            onBackToMap={handleBackToMap}
          />
        ) : null}

        {gameState === "coding" && activeManifest !== undefined ? (
          <MissionWorkspace manifest={activeManifest} />
        ) : null}

        {gameState === "loading" ? (
          <p className="wn-loading" role="status">
            {uz.mapLoading}
          </p>
        ) : null}
      </main>

      {settingsOpen ? (
        <SettingsPanel
          warning={warning}
          progressJson={progressJson}
          onClose={handleCloseSettings}
        />
      ) : null}
    </div>
  );
}
