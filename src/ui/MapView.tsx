// docs/05_UI_UX_DESIGN.md — xarita rejimi: Phaser canvas + ekrandagi tugmalar +
// tanlangan missiya kartasi. Holat faqat rang bilan emas, belgi/matn bilan
// ham farqlanadi. docs/11 — klaviatura va screen reader qo'llab-quvvatlanadi.

import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { EventBridge } from "../app/eventBridge";
import type { GameFactory } from "../game/PhaserGame";
import type { GameEventMap, MoveDirection } from "../types/game";
import type { LessonStatus } from "../types/progress";
import { MISSION_POINTS, REGIONS, STATUS_STYLES } from "../game/mapData";
import { lessonRegistry } from "../content/loader";
import { uz, uzMessages } from "../i18n/uz";
import { PhaserGame } from "../game/PhaserGame";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconLock,
} from "./icons";

export interface MapViewProps {
  bridge: EventBridge<GameEventMap>;
  states: Record<string, LessonStatus>;
  selectedLessonId: string | null;
  onSelect: (lessonId: string) => void;
  onStart: (lessonId: string) => void;
  gameFactory?: GameFactory;
}

interface DirectionButtonProps {
  direction: MoveDirection;
  label: string;
  onStart: (direction: MoveDirection) => void;
  onStop: (direction: MoveDirection) => void;
  children: JSX.Element;
}

function DirectionButton({
  direction,
  label,
  onStart,
  onStop,
  children,
}: DirectionButtonProps): JSX.Element {
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStart(direction);
    }
  };
  const handleKeyUp = (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      onStop(direction);
    }
  };
  const handlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();
    onStart(direction);
  };
  return (
    <button
      type="button"
      className={`wn-dpad__btn wn-dpad__btn--${direction}`}
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerUp={(): void => onStop(direction)}
      onPointerLeave={(): void => onStop(direction)}
      onPointerCancel={(): void => onStop(direction)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={(): void => onStop(direction)}
    >
      {children}
    </button>
  );
}

export function MapView({
  bridge,
  states,
  selectedLessonId,
  onSelect,
  onStart,
  gameFactory,
}: MapViewProps): JSX.Element {
  const startMove = (direction: MoveDirection): void => {
    bridge.emit("input:direction-start", { direction });
  };
  const stopMove = (direction: MoveDirection): void => {
    bridge.emit("input:direction-stop", { direction });
  };

  const selected =
    selectedLessonId === null ? undefined : lessonRegistry.get(selectedLessonId);
  const selectedStatus: LessonStatus | null =
    selectedLessonId === null ? null : (states[selectedLessonId] ?? "locked");

  let infoContent: JSX.Element;
  if (selected === undefined || selectedStatus === null) {
    infoContent = <p>{uz.noMissionSelected}</p>;
  } else {
    const statusLabel = uzMessages.statusLabel(selectedStatus);
    const prerequisiteId = selected.prerequisites[0];
    const prerequisite =
      prerequisiteId === undefined
        ? undefined
        : lessonRegistry.get(prerequisiteId);
    const prerequisiteTitle =
      prerequisite?.title ?? prerequisiteId ?? uz.noPrerequisite;
    infoContent = (
      <>
        <p className="wn-map__mission-title">
          {uzMessages.missionButtonLabel(
            selected.title,
            statusLabel,
            selected.order,
          )}
        </p>
        <p className="wn-map__mission-objective">
          {selected.learningObjectives[0]}
        </p>
        <p className="wn-map__mission-prereq">
          {uz.prerequisiteLabel}: {prerequisiteTitle}
        </p>
        {selectedStatus === "locked" ? (
          <p className="wn-map__locked">
            <IconLock className="wn-icon" />
            <span>
              {prerequisiteId === undefined
                ? uz.missionLocked
                : uzMessages.lockedMission(prerequisiteTitle)}
            </span>
          </p>
        ) : (
          <button
            type="button"
            className="wn-btn wn-btn--primary"
            onClick={(): void => onStart(selected.id)}
          >
            {uz.startMission}
          </button>
        )}
      </>
    );
  }

  return (
    <section className="wn-map" aria-label={uz.mapViewLabel}>
      <div className="wn-map__stage">
        <PhaserGame bridge={bridge} states={states} gameFactory={gameFactory} />
        <div
          className="wn-dpad"
          role="group"
          aria-label={uz.onScreenControlsLabel}
        >
          <DirectionButton
            direction="up"
            label={uz.moveUp}
            onStart={startMove}
            onStop={stopMove}
          >
            <IconArrowUp className="wn-icon" />
          </DirectionButton>
          <DirectionButton
            direction="left"
            label={uz.moveLeft}
            onStart={startMove}
            onStop={stopMove}
          >
            <IconArrowLeft className="wn-icon" />
          </DirectionButton>
          <DirectionButton
            direction="right"
            label={uz.moveRight}
            onStart={startMove}
            onStop={stopMove}
          >
            <IconArrowRight className="wn-icon" />
          </DirectionButton>
          <DirectionButton
            direction="down"
            label={uz.moveDown}
            onStart={startMove}
            onStop={stopMove}
          >
            <IconArrowDown className="wn-icon" />
          </DirectionButton>
        </div>
      </div>

      <div className="wn-map__side">
        <h2 className="wn-map__side-title">{uz.missionListLabel}</h2>
        <ul className="wn-region-list">
          {REGIONS.map((region) => {
            const points = MISSION_POINTS.filter(
              (point) => point.regionId === region.id,
            );
            return (
              <li key={region.id} className="wn-region">
                <h3 className="wn-region__title">{region.title}</h3>
                <ul className="wn-mission-list">
                  {points.map((point) => {
                    const manifest = lessonRegistry.get(point.lessonId);
                    const status: LessonStatus =
                      states[point.lessonId] ?? "locked";
                    const statusLabel = uzMessages.statusLabel(status);
                    const title = manifest?.title ?? point.lessonId;
                    const order = manifest?.order ?? 0;
                    return (
                      <li key={point.lessonId}>
                        <button
                          type="button"
                          className={`wn-mission-btn wn-mission-btn--${status}`}
                          aria-pressed={selectedLessonId === point.lessonId}
                          aria-label={uzMessages.missionButtonLabel(
                            title,
                            statusLabel,
                            order,
                          )}
                          onClick={(): void => onSelect(point.lessonId)}>
                          <span className="wn-mission-btn__mark" aria-hidden="true">
                            {STATUS_STYLES[status].glyph}
                          </span>
                          <span className="wn-mission-btn__title">{title}</span>
                          <span className="wn-mission-btn__status">
                            {statusLabel}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="wn-map__info" aria-live="polite" aria-atomic="true">
          <h2 className="wn-map__info-title">{uz.selectedMissionLabel}</h2>
          {infoContent}
        </div>
      </div>
    </section>
  );
}
