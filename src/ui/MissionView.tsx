// docs/05_UI_UX_DESIGN.md — chap (shart), markaz (muharrir), o'ng (preview +
// validator) uchlik; 1024 px va kichikda tab rejimi. Preview/validator xabarlari
// aria-live orqali e'lon qilinadi.
// docs/03_CURRICULUM.md — uch bosqichli maslahat yon panelda ochiladi.

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type {
  LessonManifest,
  ValidationIssue,
  ValidationResult,
} from "../types/content";
import type { DraftCode } from "../types/progress";
import type {
  CodeRunner,
  SandboxConsoleEntry,
  SandboxRunRequest,
} from "../types/sandbox";
import { compileProbes } from "../validation/probes";
import { validateLesson } from "../validation/engine";
import { CodeEditor, PlainTextArea } from "../editor/CodeEditor";
import type { LanguageId } from "../editor/languages";
import { SandboxPreview } from "./SandboxPreview";
import { ConfirmDialog } from "./ConfirmDialog";
import { useModalFocus } from "./useModalFocus";
import { soundCueMessage, type SoundCue } from "../assets/audio";
import { uz, uzMessages } from "../i18n/uz";

export interface MissionIntroProps {
  manifest: LessonManifest;
  onBeginCoding: () => void;
  onBackToMap: () => void;
}

export function MissionIntro({
  manifest,
  onBeginCoding,
  onBackToMap,
}: MissionIntroProps): JSX.Element {
  return (
    <section
      className="wn-intro"
      aria-label={`${manifest.order}-missiya: ${manifest.title}`}
    >
      <h2 className="wn-intro__title">
        {manifest.order}-missiya: {manifest.title}
      </h2>
      <h3>{uz.missionStoryLabel}</h3>
      <p>{manifest.story}</p>
      <h3>{uz.missionObjectiveLabel}</h3>
      <ul>
        {manifest.learningObjectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
      <h3>{uz.missionExplanationLabel}</h3>
      <p>{manifest.explanation}</p>
      <div className="wn-intro__actions">
        <button
          type="button"
          className="wn-btn wn-btn--primary"
          onClick={onBeginCoding}
        >
          {uz.startCoding}
        </button>
        <button type="button" className="wn-btn" onClick={onBackToMap}>
          {uz.backToMap}
        </button>
      </div>
    </section>
  );
}

export type MissionTab = "mission" | "editor" | "preview";
export type EditorMode = "codemirror" | "plain";

export interface MissionWorkspaceProps {
  manifest: LessonManifest;
  initialDraft: DraftCode;
  initialHintsUsed: number;
  runner: CodeRunner;
  editorMode: EditorMode;
  onSaveDraft: (draft: DraftCode) => void;
  onComplete: (hintsUsed: number) => void;
  onBackToMap: () => void;
  onOpenNextMission?: () => void;
  onSoundCue?: (cue: SoundCue) => void;
}

const HINT_KEYS = [uz.hintLevel1, uz.hintLevel2, uz.hintLevel3] as const;

type CodeLanguage = "html" | "css" | "javascript";

const LANGUAGE_ORDER: readonly CodeLanguage[] = [
  "html",
  "css",
  "javascript",
];

function languageLabel(language: LanguageId): string {
  switch (language) {
    case "html":
      return "HTML";
    case "css":
      return "CSS";
    case "javascript":
      return "JavaScript";
    case "plain":
      return "Text";
  }
}

function starterFor(manifest: LessonManifest): DraftCode {
  return {
    html: manifest.starterCode.html,
    css: manifest.starterCode.css,
    javascript: manifest.starterCode.javascript,
  };
}

function errorResult(
  lessonId: string,
  message: string,
): ValidationResult {
  const issue: ValidationIssue = {
    ruleId: "sandbox",
    what: message,
    why: uz.issueWhySandbox,
    nextStep: uz.issueNextSandbox,
  };
  return {
    success: false,
    lessonId,
    issues: [issue],
    checkedAt: new Date().toISOString(),
  };
}

interface SuccessDialogProps {
  manifest: LessonManifest;
  hintsUsedCount: number;
  reflectionAnswer: string;
  onReflectionChange: (value: string) => void;
  onDismiss: () => void;
  onBackToMap: () => void;
  onOpenNextMission?: () => void;
}

// docs/05_UI_UX_DESIGN.md — muvaffaqiyat oynasi modal: fokus ichida qoladi,
// Escape bilan yopiladi va fokus ochgan elementga qaytadi. Rangga bog'liq
// bo'lmagan matnli sarlavha va nishon belgisi saqlanadi.
function SuccessDialog({
  manifest,
  hintsUsedCount,
  reflectionAnswer,
  onReflectionChange,
  onDismiss,
  onBackToMap,
  onOpenNextMission,
}: SuccessDialogProps): JSX.Element {
  const dialogRef = useModalFocus({ onClose: onDismiss });
  const badge = manifest.badgeId !== undefined;
  const next = manifest.nextLessonId;

  return (
    <div className="wn-backdrop">
      <div
        ref={dialogRef}
        className="wn-success"
        role="dialog"
        aria-modal="true"
        aria-label={uz.successTitle}
        tabIndex={-1}
      >
        <h3 className="wn-success__title">{uz.successTitle}</h3>
        <p>{manifest.successMessage}</p>
        <p className="wn-success__xp">
          {uz.successXpMessage}:{" "}
          <strong>{hintsUsedCount > 0 ? 80 : 100}</strong> XP
        </p>
        {badge ? <p className="wn-success__badge">{uz.badgeEarned}</p> : null}
        <h4>{uz.reflectionQuestionLabel}</h4>
        <p className="wn-success__question">{manifest.reflectionQuestion}</p>
        <label className="wn-sr-label" htmlFor="wn-reflection">
          {uz.reflectionPlaceholder}
        </label>
        <textarea
          id="wn-reflection"
          className="wn-reflection"
          value={reflectionAnswer}
          placeholder={uz.reflectionPlaceholder}
          onChange={(event): void => onReflectionChange(event.target.value)}
        />
        <div className="wn-success__actions">
          {next !== undefined && onOpenNextMission !== undefined ? (
            <button
              type="button"
              className="wn-btn wn-btn--primary"
              onClick={onOpenNextMission}
            >
              {uzMessages.nextMissionButton(next)}
            </button>
          ) : null}
          <button type="button" className="wn-btn" onClick={onDismiss}>
            {uz.closeDialog}
          </button>
          <button type="button" className="wn-btn" onClick={onBackToMap}>
            {uz.backToMap}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MissionWorkspace({
  manifest,
  initialDraft,
  initialHintsUsed,
  runner,
  editorMode,
  onSaveDraft,
  onComplete,
  onBackToMap,
  onOpenNextMission,
  onSoundCue,
}: MissionWorkspaceProps): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [activeTab, setActiveTab] = useState<MissionTab>("mission");
  const [draft, setDraft] = useState<DraftCode>(initialDraft);
  const [activeLanguage, setActiveLanguage] = useState<CodeLanguage>("html");
  const [runState, setRunState] = useState<"idle" | "running" | "error" | "success">(
    "idle",
  );
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [consoleLines, setConsoleLines] = useState<SandboxConsoleEntry[]>([]);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [hintsUsedCount, setHintsUsedCount] = useState(initialHintsUsed);
  const [showReset, setShowReset] = useState(false);
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const [successDismissed, setSuccessDismissed] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  // Audio signal + ekranda matnli takror (aria-live). Audio o'chiq bo'lsa ham
  // matn ko'rsatiladi.
  const announce = (cue: SoundCue): void => {
    setLiveMessage(soundCueMessage(cue));
    onSoundCue?.(cue);
  };

  const isCombined = manifest.moduleId === "project";
  const extraLanguages = LANGUAGE_ORDER.filter(
    (language) => manifest.starterCode[language].trim().length > 0,
  );
  const hasMultipleLanguages = extraLanguages.length > 1;

  const runRef = useRef<() => Promise<void>>(async () => {
    // Bo'sh bosqich; har safar yangilanadi.
  });
  const saveDraftRef = useRef<() => void>(() => {});
  saveDraftRef.current = (): void => {
    onSaveDraft(draft);
  };

  const runCode = async (): Promise<void> => {
    setRunState("running");
    setRuntimeError(null);
    setConsoleLines([]);
    const request: SandboxRunRequest = {
      lessonId: manifest.id,
      code: draft,
      probes: compileProbes(manifest),
    };
    const outcome = await runner.run(request, iframeRef.current);
    if (outcome.status !== "ok" || outcome.snapshot === null) {
      const message = outcome.message ?? uz.previewNotReady;
      setRuntimeError(message);
      setValidation(errorResult(manifest.id, message));
      setRunState("error");
      announce("validation-error");
      return;
    }
    const snapshot = outcome.snapshot;
    setConsoleLines(snapshot.console);
    const result = validateLesson(manifest, {
      code: draft,
      snapshot,
    });
    setValidation(result);
    if (result.success) {
      setRunState("success");
      setSuccessDismissed(false);
      onComplete(hintsUsedCount);
      announce(manifest.badgeId !== undefined ? "badge-unlocked" : "mission-success");
    } else {
      setRunState("error");
      announce("validation-error");
    }
  };
  runRef.current = (): Promise<void> => runCode();

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      const modifier = event.ctrlKey || event.metaKey;
      if (!modifier) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target !== null && target.closest(".cm-content, textarea")) {
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        void runRef.current();
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveDraftRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return (): void => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const toggleHint = (index: number): void => {
    setRevealedHints((previous) => {
      const next = [...previous];
      if (!(next[index] ?? false)) {
        next[index] = true;
        setHintsUsedCount((count) => count + 1);
        onSoundCue?.("hint-used");
        setLiveMessage(soundCueMessage("hint-used"));
      } else {
        next[index] = false;
      }
      return next;
    });
  };

  const handleResetConfirm = (): void => {
    const starter = starterFor(manifest);
    setDraft(starter);
    setRunState("idle");
    setValidation(null);
    setRuntimeError(null);
    setConsoleLines([]);
    setShowReset(false);
    setSuccessDismissed(false);
    onSaveDraft(starter);
  };

  const updateLanguage = (language: CodeLanguage, value: string): void => {
    const nextDraft: DraftCode = { ...draft, [language]: value };
    setDraft(nextDraft);
  };

  const tabs: readonly { id: MissionTab; label: string }[] = [
    { id: "mission", label: uz.tabMission },
    { id: "editor", label: uz.tabEditor },
    { id: "preview", label: uz.tabPreview },
  ];

  const editorProps = (language: CodeLanguage) => ({
    value: draft[language],
    language,
    onChange: (value: string): void => updateLanguage(language, value),
    onRun: (): void => void runRef.current(),
    onSaveDraft: (): void => saveDraftRef.current(),
    errorLine: null,
    ariaLabel: `${uz.editorPaneLabel} - ${languageLabel(language)}`,
  });

  const renderEditors = (): JSX.Element => {
    if (isCombined) {
      return (
        <div className="wn-code-stack">
          {extraLanguages.map((language) => (
            <div key={language} className="wn-code-stack__item">
              <h3 className="wn-code-stack__title">{languageLabel(language)}</h3>
              {editorMode === "codemirror" ? (
                <CodeEditor {...editorProps(language)} />
              ) : (
                <PlainTextArea
                  value={draft[language]}
                  ariaLabel={`${uz.editorPaneLabel} - ${languageLabel(language)}`}
                  onChange={(value: string): void =>
                    updateLanguage(language, value)
                  }
                  onKeyDown={handlePlainShortcut}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    return editorMode === "codemirror" ? (
      <CodeEditor {...editorProps(activeLanguage)} />
    ) : (
      <PlainTextArea
        value={draft[activeLanguage]}
        ariaLabel={uz.editorPaneLabel}
        onChange={(value: string): void =>
          updateLanguage(activeLanguage, value)
        }
        onKeyDown={handlePlainShortcut}
      />
    );
  };

  function handlePlainShortcut(
    event: ReactKeyboardEvent<HTMLTextAreaElement>,
  ): void {
    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      void runRef.current();
    } else if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveDraftRef.current();
    }
  }

  const renderValidatorReport = (): JSX.Element => {
    if (runState === "idle") {
      return (
        <p className="wn-validator__placeholder">{uz.previewEmpty}</p>
      );
    }
    if (runState === "running") {
      return <p role="status">{uz.runPending}</p>;
    }
    if (runState === "success" && validation !== null) {
      return (
        <div className="wn-validator wn-validator--success" role="status">
          <p className="wn-validator__success">{uz.validatorSuccess}</p>
        </div>
      );
    }
    return (
      <div className="wn-validator" role="status">
        <h3 className="wn-validator__title">{uz.validatorFailedTitle}</h3>
        {runtimeError !== null ? (
          <p className="wn-validator__runtime" role="alert">
            {runtimeError}
          </p>
        ) : null}
        {validation !== null ? (
          <ul className="wn-issues">
            {validation.issues.map((issue) => (
              <li key={issue.ruleId} className="wn-issue">
                <p className="wn-issue__what">{issue.what}</p>
                <dl className="wn-issue__detail">
                  <dt>{uz.issueWhyLabel}</dt>
                  <dd>{issue.why}</dd>
                  <dt>{uz.issueNextStepLabel}</dt>
                  <dd>{issue.nextStep}</dd>
                </dl>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  };

  const renderConsole = (): JSX.Element => {
    if (consoleLines.length === 0) {
      return <p className="wn-console__empty">{uz.noConsoleOutput}</p>;
    }
    return (
      <ul className="wn-console">
        {consoleLines.map((entry, index) => (
          <li key={`${index}-${entry.level}`} className={`wn-console__line wn-console__line--${entry.level}`}>
            <span className="wn-console__level">{entry.level}</span>
            <span className="wn-console__text">{entry.text}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderSuccessDialog = (): JSX.Element | null => {
    if (runState !== "success" || successDismissed) {
      return null;
    }
    return (
      <SuccessDialog
        manifest={manifest}
        hintsUsedCount={hintsUsedCount}
        reflectionAnswer={reflectionAnswer}
        onReflectionChange={setReflectionAnswer}
        onDismiss={(): void => setSuccessDismissed(true)}
        onBackToMap={onBackToMap}
        onOpenNextMission={onOpenNextMission}
      />
    );
  };

  return (
    <section
      className="wn-workspace"
      aria-label={`${manifest.order}-missiya: ${manifest.title}`}
    >
      <p className="wn-visually-hidden" role="status" aria-live="polite">
        {liveMessage}
      </p>
      <div className="wn-tabs" role="tablist" aria-label={uz.missionTabsLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`wn-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`wn-panel-${tab.id}`}
            className="wn-tab"
            onClick={(): void => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={`wn-panes wn-panes--${activeTab}`}>
        <article
          className="wn-pane wn-pane--mission"
          role="tabpanel"
          id="wn-panel-mission"
          aria-labelledby="wn-tab-mission"
          aria-label={uz.missionBriefLabel}
        >
          <h2 className="wn-pane__title">{uz.missionBriefLabel}</h2>
          <p>{manifest.story}</p>
          <h3>{uz.missionObjectiveLabel}</h3>
          <ul>
            {manifest.learningObjectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
          <h3>{uz.missionStepsLabel}</h3>
          <ol className="wn-steps">
            {manifest.steps.map((step) => (
              <li key={step.id}>{step.text}</li>
            ))}
          </ol>
          <h3>{uz.missionHintsLabel}</h3>
          <p className="wn-hint-note">
            {uz.hintCostNote} {uz.hintsUsedLabel}: {hintsUsedCount}
          </p>
          <ul className="wn-hints">
            {manifest.hints.map((hint, index) => {
              const revealed = revealedHints[index] ?? false;
              const key = HINT_KEYS[index] ?? uz.hintLevel1;
              return (
                <li key={key} className="wn-hint">
                  <button
                    type="button"
                    className="wn-btn wn-btn--hint"
                    aria-expanded={revealed}
                    onClick={(): void => toggleHint(index)}
                  >
                    {revealed ? uz.hintHide : uz.hintReveal}: {key}
                  </button>
                  {revealed ? <p className="wn-hint__text">{hint}</p> : null}
                </li>
              );
            })}
          </ul>
          <p className="wn-run-hints">
            {uz.runRequestsHint}
            <br />
            {uz.saveRequestsHint}
          </p>
        </article>

        <article
          className="wn-pane wn-pane--editor"
          role="tabpanel"
          id="wn-panel-editor"
          aria-labelledby="wn-tab-editor"
          aria-label={uz.editorPaneLabel}
        >
          <h2 className="wn-pane__title">{uz.editorPaneLabel}</h2>
          {!isCombined && hasMultipleLanguages ? (
            <div
              className="wn-lang-tabs"
              role="group"
              aria-label={uz.editorLanguageLabel}
            >
              {extraLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  className="wn-lang-tab"
                  aria-pressed={activeLanguage === language}
                  onClick={(): void => setActiveLanguage(language)}
                >
                  {languageLabel(language)}
                </button>
              ))}
            </div>
          ) : null}
          <div className="wn-editor-wrap">
            {renderEditors()}
          </div>
          <div className="wn-editor-actions">
            <button
              type="button"
              className="wn-btn wn-btn--primary"
              disabled={runState === "running"}
              onClick={(): void => void runRef.current()}
            >
              {uz.runCode}
            </button>
            <button
              type="button"
              className="wn-btn"
              onClick={saveDraftRef.current}
            >
              {uz.saveDraft}
            </button>
            <button
              type="button"
              className="wn-btn"
              onClick={(): void => setShowReset(true)}
            >
              {uz.resetCode}
            </button>
          </div>
        </article>

        <article
          className="wn-pane wn-pane--preview"
          role="tabpanel"
          id="wn-panel-preview"
          aria-labelledby="wn-tab-preview"
          aria-label={uz.previewPaneLabel}
        >
          <h2 className="wn-pane__title">{uz.previewPaneLabel}</h2>
          <div className="wn-preview" aria-live="polite" aria-atomic="true">
            <SandboxPreview iframeRef={iframeRef} />
            <h3 className="wn-pane__subtitle">{uz.consoleLabel}</h3>
            {renderConsole()}
            <h3 className="wn-pane__subtitle">{uz.validatorReportLabel}</h3>
            {renderValidatorReport()}
          </div>
        </article>
      </div>

      {renderSuccessDialog()}

      {showReset ? (
        <ConfirmDialog
          title={uz.resetConfirmTitle}
          body={uzMessages.resetConfirmMessage(manifest.title)}
          onConfirm={handleResetConfirm}
          onCancel={(): void => setShowReset(false)}
        />
      ) : null}
    </section>
  );
}