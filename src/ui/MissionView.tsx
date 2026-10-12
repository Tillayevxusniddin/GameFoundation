// docs/05_UI_UX_DESIGN.md — desktopda chap (shart), markaz (muharrir), o'ng
// (preview/validator); 1024 px va kichikda tab rejimiga o'tadi.
// docs/11 — preview/validator xabarlari aria-live orqali e'lon qilinadi.

import { useState } from "react";
import type { LessonManifest } from "../types/content";
import { uz } from "../i18n/uz";

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

export interface MissionWorkspaceProps {
  manifest: LessonManifest;
}

const HINT_KEYS = [uz.hintLevel1, uz.hintLevel2, uz.hintLevel3] as const;

export function MissionWorkspace({
  manifest,
}: MissionWorkspaceProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<MissionTab>("mission");
  const [revealedHints, setRevealedHints] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [draft, setDraft] = useState<string>(manifest.starterCode.html);

  const toggleHint = (index: number): void => {
    setRevealedHints((previous) =>
      previous.map((value, position) =>
        position === index ? !value : value,
      ),
    );
  };

  const tabs: readonly { id: MissionTab; label: string }[] = [
    { id: "mission", label: uz.tabMission },
    { id: "editor", label: uz.tabEditor },
    { id: "preview", label: uz.tabPreview },
  ];

  return (
    <section
      className="wn-workspace"
      aria-label={`${manifest.order}-missiya: ${manifest.title}`}
    >
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
          <p className="wn-hint-note">{uz.hintCostNote}</p>
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
        </article>

        <article
          className="wn-pane wn-pane--editor"
          role="tabpanel"
          id="wn-panel-editor"
          aria-labelledby="wn-tab-editor"
          aria-label={uz.editorPaneLabel}
        >
          <h2 className="wn-pane__title">{uz.editorPaneLabel}</h2>
          <label className="wn-editor-label" htmlFor="wn-editor">
            {uz.editorPaneLabel}
          </label>
          <textarea
            id="wn-editor"
            className="wn-editor"
            value={draft}
            spellCheck={false}
            placeholder={uz.editorPlaceholder}
            onChange={(event): void => setDraft(event.target.value)}
          />
          <p className="wn-editor-note">{uz.editorPlaceholder}</p>
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
            <p className="wn-preview__placeholder">{uz.previewPlaceholder}</p>
            <p className="wn-validator__placeholder">{uz.validatorPlaceholder}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
