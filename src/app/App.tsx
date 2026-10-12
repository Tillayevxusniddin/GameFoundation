// docs/06_TECHNICAL_ARCHITECTURE.md — app qatlami ProgressRepository,
// StateMachine, EventBridge, PhaserGame va UI panellarini birlashtiradi.
// Phaser obyektlari React state ichida boshqarilmaydi; aloqa typed event orqali.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEventBridge, type EventBridge } from "./eventBridge";
import { createStateMachine, type StateMachine } from "./stateMachine";
import { LocalProgressRepository } from "../progress/LocalProgressRepository";
import {
  UiPreferencesStore,
  type UiPreferences,
} from "../progress/uiPreferences";
import type {
  DraftCode,
  LessonStatus,
  PlayerProgress,
  ProgressRepository,
} from "../types/progress";
import type { GameEventMap, GameState } from "../types/game";
import type { CodeRunner } from "../types/sandbox";
import { SandboxRunner } from "../security/sandboxRunner";
import { createAudioPlayer, type AudioPlayer, type SoundCue } from "../assets/audio";
import { lessonRegistry } from "../content/loader";
import { uz } from "../i18n/uz";
import { TopNav } from "../ui/TopNav";
import { MapView } from "../ui/MapView";
import {
  MissionIntro,
  MissionWorkspace,
  type EditorMode,
} from "../ui/MissionView";
import { SettingsModal, type ImportErrorInfo } from "../ui/SettingsModal";
import { WelcomeDialog } from "../ui/WelcomeDialog";
import { SmallScreenNotice } from "../ui/SmallScreenNotice";
import type { GameFactory } from "../game/PhaserGame";

export interface AppProps {
  repository?: ProgressRepository;
  bridge?: EventBridge<GameEventMap>;
  gameFactory?: GameFactory;
  runner?: CodeRunner;
  editorMode?: EditorMode;
  preferences?: UiPreferencesStore;
  audioPlayer?: AudioPlayer;
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
  runner: providedRunner,
  editorMode: providedEditorMode,
  preferences: providedPreferences,
  audioPlayer: providedAudioPlayer,
}: AppProps): JSX.Element {
  const repository = useMemo<ProgressRepository>(
    () => providedRepository ?? new LocalProgressRepository(),
    [providedRepository],
  );
  const bridge = useMemo<EventBridge<GameEventMap>>(
    () => providedBridge ?? createEventBridge(),
    [providedBridge],
  );
  const runner = useMemo<CodeRunner>(
    () => providedRunner ?? new SandboxRunner(),
    [providedRunner],
  );
  const preferencesStore = useMemo<UiPreferencesStore>(
    () => providedPreferences ?? new UiPreferencesStore(),
    [providedPreferences],
  );
  const audioPlayer = useMemo<AudioPlayer>(
    () => providedAudioPlayer ?? createAudioPlayer(),
    [providedAudioPlayer],
  );
  const editorMode: EditorMode = providedEditorMode ?? "codemirror";
  const machineRef = useRef<StateMachine>(createStateMachine("loading"));

  const [gameState, setGameState] = useState<GameState>("loading");
  const [progress, setProgress] = useState<PlayerProgress>(() =>
    repository.load(),
  );
  const [warning, setWarning] = useState<string | null>(() =>
    repository.getWarning(),
  );
  const [preferences, setPreferences] = useState<UiPreferences>(() =>
    preferencesStore.load(),
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progressJson, setProgressJson] = useState("");
  const [importError, setImportError] = useState<ImportErrorInfo | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    audioPlayer.setEnabled(preferences.audioEnabled);
  }, [audioPlayer, preferences.audioEnabled]);

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
    setImportError(null);
    setImportSuccess(false);
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
      const currentWarning = repository.getWarning();
      setProgress(next);
      if (currentWarning === uz.progressImportInvalid) {
        setWarning((previous) =>
          previous === uz.progressImportInvalid ? null : previous,
        );
        setImportSuccess(false);
        setImportError({
          what: uz.importErrorWhat,
          why: uz.importErrorWhy,
          nextStep: uz.importErrorNextStep,
        });
      } else {
        setWarning(currentWarning);
        setImportError(null);
        setImportSuccess(true);
      }
    },
    [repository],
  );

  const handleSaveName = useCallback(
    (name: string): void => {
      setProgress(repository.setPlayerName(name));
      const next = preferencesStore.update({ introSeen: true });
      setPreferences(next);
    },
    [repository, preferencesStore],
  );

  const handleSkipWelcome = useCallback((): void => {
    setPreferences(preferencesStore.update({ introSeen: true }));
  }, [preferencesStore]);

  const handleToggleAudio = useCallback(
    (enabled: boolean): void => {
      setPreferences(preferencesStore.update({ audioEnabled: enabled }));
    },
    [preferencesStore],
  );

  const handleToggleReducedMotion = useCallback(
    (enabled: boolean): void => {
      setPreferences(preferencesStore.update({ reducedMotion: enabled }));
    },
    [preferencesStore],
  );

  const handleResetAll = useCallback((): void => {
    const fresh = repository.resetAll();
    setProgress(fresh);
    setWarning(repository.getWarning());
    setProgressJson(JSON.stringify(fresh));
    setImportError(null);
    setImportSuccess(false);
  }, [repository]);

  const handleDismissSmallScreen = useCallback((): void => {
    setPreferences(
      preferencesStore.update({ smallScreenNoticeDismissed: true }),
    );
  }, [preferencesStore]);

  const handleSoundCue = useCallback(
    (cue: SoundCue): void => {
      audioPlayer.play(cue);
    },
    [audioPlayer],
  );

  const activeManifest =
    activeLessonId === null ? undefined : lessonRegistry.get(activeLessonId);

  const activeProgress =
    activeLessonId === null
      ? undefined
      : progress.lessons[activeLessonId];

  const initialHintsUsed = activeProgress?.hintsUsed ?? 0;

  const initialDraft = useMemo<DraftCode>((): DraftCode => {
    if (activeManifest === undefined) {
      return { html: "", css: "", javascript: "" };
    }
    const saved = progress.lessons[activeManifest.id]?.draftCode;
    const starter = activeManifest.starterCode;
    return {
      html: saved !== undefined && saved.html.length > 0 ? saved.html : starter.html,
      css: saved !== undefined && saved.css.length > 0 ? saved.css : starter.css,
      javascript:
        saved !== undefined && saved.javascript.length > 0
          ? saved.javascript
          : starter.javascript,
    };
  }, [activeManifest, progress]);

  const nextManifest =
    activeManifest?.nextLessonId === undefined
      ? undefined
      : lessonRegistry.get(activeManifest.nextLessonId);

  const handleSaveDraft = useCallback(
    (lessonId: string, draft: DraftCode): void => {
      setProgress(repository.saveDraft(lessonId, draft));
    },
    [repository],
  );

  const handleComplete = useCallback(
    (lessonId: string, hintsUsed: number): void => {
      const manifest = lessonRegistry.get(lessonId);
      const next = repository.completeLesson(lessonId, hintsUsed, manifest?.badgeId);
      setProgress(next);
      const gainedXp = hintsUsed > 0 ? 80 : 100;
      bridge.emit("mission:completed", { lessonId, xp: gainedXp });
    },
    [repository, bridge],
  );

  const handleOpenNextMission = useCallback((): void => {
    const nextId = activeManifest?.nextLessonId;
    if (nextId === undefined) {
      return;
    }
    setActiveLessonId(nextId);
    setSelectedLessonId(nextId);
    bridge.emit("map:mission-selected", { lessonId: nextId });
  }, [activeManifest, bridge]);

  const showWelcome = !preferences.introSeen;

  return (
    <div
      className={
        preferences.reducedMotion ? "wn-app wn-reduce-motion" : "wn-app"
      }
    >
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

        {!preferences.smallScreenNoticeDismissed ? (
          <SmallScreenNotice onDismiss={handleDismissSmallScreen} />
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
          <MissionWorkspace
            key={activeLessonId ?? "unknown"}
            manifest={activeManifest}
            initialDraft={initialDraft}
            initialHintsUsed={initialHintsUsed}
            runner={runner}
            editorMode={editorMode}
            onSaveDraft={(draft): void => {
              if (activeLessonId !== null) {
                handleSaveDraft(activeLessonId, draft);
              }
            }}
            onComplete={(hintsUsed): void => {
              if (activeLessonId !== null) {
                handleComplete(activeLessonId, hintsUsed);
              }
            }}
            onBackToMap={handleBackToMap}
            onOpenNextMission={
              nextManifest !== undefined ? handleOpenNextMission : undefined
            }
            onSoundCue={handleSoundCue}
          />
        ) : null}

        {gameState === "loading" ? (
          <p className="wn-loading" role="status">
            {uz.mapLoading}
          </p>
        ) : null}
      </main>

      {showWelcome ? (
        <WelcomeDialog
          initialName={progress.playerName ?? ""}
          onSaveName={handleSaveName}
          onSkip={handleSkipWelcome}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsModal
          progress={progress}
          progressJson={progressJson}
          warning={warning}
          audioEnabled={preferences.audioEnabled}
          reducedMotion={preferences.reducedMotion}
          importError={importError}
          importSuccess={importSuccess}
          onSaveName={handleSaveName}
          onToggleAudio={handleToggleAudio}
          onToggleReducedMotion={handleToggleReducedMotion}
          onExport={handleExport}
          onImport={handleImport}
          onResetAll={handleResetAll}
          onClose={handleCloseSettings}
        />
      ) : null}
    </div>
  );
}
