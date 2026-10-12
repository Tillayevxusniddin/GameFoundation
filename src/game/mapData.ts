// docs/02_GAME_DESIGN_DOCUMENT.md — bitta kichik xarita, hududlar, missiya
// nuqtalari va collision.
// docs/14_ASSET_GUIDE.md — tashqi rasmga bog'lanmaslik uchun barcha grafika
// protseduraviy chiziladi; bu fayl faqat sof ma'lumot saqlaydi (Phaser importsiz).

import type { LessonStatus } from "../types/progress";

export type RegionId = "lager" | "html" | "css" | "js" | "yakuniy";

export interface RegionDefinition {
  id: RegionId;
  // Hudud nomi o'zbekcha; React overlay ham shu ma'lumotdan foydalanadi.
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: number;
  border: number;
}

export interface MissionPointDefinition {
  lessonId: string;
  shortLabel: string;
  regionId: RegionId;
  x: number;
  y: number;
}

export interface ObstacleDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StatusStyle {
  fill: number;
  border: number;
  // Holat faqat rang bilan emas, belgi (glyph) bilan ham farqlanadi.
  glyph: string;
}

export const WORLD_WIDTH = 960;
export const WORLD_HEIGHT = 620;

export const HERO_WIDTH = 26;
export const HERO_HEIGHT = 30;
export const HERO_SPEED = 170;
export const PROXIMITY_RADIUS = 58;

export const HERO_SPAWN = { x: 120, y: 545 } as const;

export const REGIONS: readonly RegionDefinition[] = [
  {
    id: "lager",
    title: "Boshlang‘ich lager",
    x: 20,
    y: 430,
    width: 200,
    height: 170,
    fill: 0x243042,
    border: 0x4f6d8f,
  },
  {
    id: "html",
    title: "HTML qishlog‘i",
    x: 260,
    y: 430,
    width: 300,
    height: 170,
    fill: 0x2e2438,
    border: 0x8f6da0,
  },
  {
    id: "css",
    title: "CSS bog‘i",
    x: 600,
    y: 430,
    width: 340,
    height: 170,
    fill: 0x1f3a34,
    border: 0x54a08a,
  },
  {
    id: "js",
    title: "JavaScript minorasi",
    x: 300,
    y: 210,
    width: 380,
    height: 180,
    fill: 0x3a3320,
    border: 0xb09a54,
  },
  {
    id: "yakuniy",
    title: "Yakuniy maydon",
    x: 300,
    y: 30,
    width: 380,
    height: 130,
    fill: 0x3a2230,
    border: 0xb05f7f,
  },
];

export const MISSION_POINTS: readonly MissionPointDefinition[] = [
  { lessonId: "intro-01", shortLabel: "intro", regionId: "lager", x: 120, y: 500 },

  { lessonId: "html-01", shortLabel: "html-1", regionId: "html", x: 360, y: 495 },
  { lessonId: "html-02", shortLabel: "html-2", regionId: "html", x: 470, y: 495 },
  { lessonId: "html-03", shortLabel: "html-3", regionId: "html", x: 360, y: 555 },
  { lessonId: "html-04", shortLabel: "html-4", regionId: "html", x: 470, y: 555 },

  { lessonId: "css-01", shortLabel: "css-1", regionId: "css", x: 680, y: 495 },
  { lessonId: "css-02", shortLabel: "css-2", regionId: "css", x: 790, y: 495 },
  { lessonId: "css-03", shortLabel: "css-3", regionId: "css", x: 900, y: 495 },
  { lessonId: "css-04", shortLabel: "css-4", regionId: "css", x: 735, y: 555 },
  { lessonId: "css-05", shortLabel: "css-5", regionId: "css", x: 845, y: 555 },

  { lessonId: "js-01", shortLabel: "js-1", regionId: "js", x: 390, y: 270 },
  { lessonId: "js-02", shortLabel: "js-2", regionId: "js", x: 500, y: 270 },
  { lessonId: "js-03", shortLabel: "js-3", regionId: "js", x: 610, y: 270 },
  { lessonId: "js-04", shortLabel: "js-4", regionId: "js", x: 390, y: 340 },
  { lessonId: "js-05", shortLabel: "js-5", regionId: "js", x: 500, y: 340 },
  { lessonId: "js-06", shortLabel: "js-6", regionId: "js", x: 610, y: 340 },

  {
    lessonId: "project-01",
    shortLabel: "loyiha",
    regionId: "yakuniy",
    x: 490,
    y: 100,
  },
];

// To'siqlar (collision). Hududlar orasida yo'lak qoldiradigan devorlar va bir
// nechta tosh. Hero faqat ochiq yo'laklardan o'tadi.
export const OBSTACLES: readonly ObstacleDefinition[] = [
  { x: 224, y: 470, width: 24, height: 100 },
  { x: 570, y: 470, width: 24, height: 100 },
  { x: 260, y: 402, width: 420, height: 18 },
  { x: 300, y: 166, width: 380, height: 18 },
  { x: 250, y: 250, width: 30, height: 30 },
  { x: 700, y: 250, width: 30, height: 30 },
  { x: 250, y: 340, width: 30, height: 30 },
  { x: 700, y: 340, width: 30, height: 30 },
];

// Holat uslublari: rang + belgi. Matnli nom React overlay'da (i18n) beriladi.
export const STATUS_STYLES: Record<LessonStatus, StatusStyle> = {
  locked: { fill: 0x3a3d4d, border: 0x8a90a6, glyph: "Q" },
  available: { fill: 0x1f6f43, border: 0x7fe0a5, glyph: "M" },
  in_progress: { fill: 0x8a5a00, border: 0xffcf7a, glyph: "…" },
  completed: { fill: 0x1b4f8a, border: 0x9cc9ff, glyph: "✓" },
};

export const DEFAULT_STATUS: LessonStatus = "locked";

export function regionForLesson(lessonId: string): RegionId | undefined {
  const point = MISSION_POINTS.find((p) => p.lessonId === lessonId);
  return point?.regionId;
}

export function missionPointOf(
  lessonId: string,
): MissionPointDefinition | undefined {
  return MISSION_POINTS.find((p) => p.lessonId === lessonId);
}
