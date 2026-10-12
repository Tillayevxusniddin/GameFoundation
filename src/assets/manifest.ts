// docs/14_ASSET_GUIDE.md — resurslar katalogi: har bir tashqi/protseduraviy
// resurs uchun manba, litsenziya va muallif qayd etiladi. MVPda grafika
// protseduraviy chiziladi, shuning uchun ko'p resurslar "procedural".
// Resurs yuklanmasa fallback xabar beruvchi yordamchilar shu yerda.

import { uz } from "../i18n/uz";

export type AssetType = "image" | "tileset" | "audio" | "font";

export interface AssetManifestItem {
  id: string;
  path: string;
  type: AssetType;
  license: string;
  author?: string;
  decorative: boolean;
}

// Ruxsat etilgan litsenziyalar; noma'lum litsenziya qabul qilinmaydi.
export const ASSET_LICENSES: readonly string[] = ["CC0", "MIT", "procedural"];

const TEAM = "Web Ninja jamoasi";

export const ASSET_MANIFEST: readonly AssetManifestItem[] = [
  // Qahramon (protseduraviy).
  {
    id: "hero-idle",
    path: "characters/hero-idle.png",
    type: "image",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },
  {
    id: "hero-walk",
    path: "characters/hero-walk.png",
    type: "image",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },

  // Hudud tilesetlari (protseduraviy).
  {
    id: "lager-tileset",
    path: "maps/lager.tileset.png",
    type: "tileset",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },
  {
    id: "html-village-tileset",
    path: "maps/html-village.tileset.png",
    type: "tileset",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },
  {
    id: "css-garden-tileset",
    path: "maps/css-garden.tileset.png",
    type: "tileset",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },
  {
    id: "js-tower-tileset",
    path: "maps/js-tower.tileset.png",
    type: "tileset",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },
  {
    id: "final-field-tileset",
    path: "maps/final-field.tileset.png",
    type: "tileset",
    license: "procedural",
    author: TEAM,
    decorative: false,
  },

  // Missiya nuqtasi holatlari (rang + belgi + matn).
  {
    id: "mission-locked",
    path: "ui/mission-locked.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "mission-available",
    path: "ui/mission-available.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "mission-in-progress",
    path: "ui/mission-in-progress.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "mission-completed",
    path: "ui/mission-completed.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },

  // Interfeys ikonkalari.
  {
    id: "icon-map",
    path: "ui/icon-map.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "icon-settings",
    path: "ui/icon-settings.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "icon-export",
    path: "ui/icon-export.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },
  {
    id: "icon-import",
    path: "ui/icon-import.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: true,
  },

  // Nishonlar.
  {
    id: "badge-lager-tanishuv",
    path: "badges/lager-tanishuv.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: false,
  },
  {
    id: "badge-html-boshlovchi",
    path: "badges/html-boshlovchi.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: false,
  },
  {
    id: "badge-css-bogbon",
    path: "badges/css-bogbon.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: false,
  },
  {
    id: "badge-js-ninja",
    path: "badges/js-ninja.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: false,
  },
  {
    id: "badge-web-ninja",
    path: "badges/web-ninja.svg",
    type: "image",
    license: "CC0",
    author: TEAM,
    decorative: false,
  },

  // Audio signallar (Web Audio orqali protseduraviy sintez).
  {
    id: "sound-mission-success",
    path: "audio/mission-success.cue",
    type: "audio",
    license: "procedural",
    author: TEAM,
    decorative: true,
  },
  {
    id: "sound-validation-error",
    path: "audio/validation-error.cue",
    type: "audio",
    license: "procedural",
    author: TEAM,
    decorative: true,
  },
  {
    id: "sound-hint-used",
    path: "audio/hint-used.cue",
    type: "audio",
    license: "procedural",
    author: TEAM,
    decorative: true,
  },
  {
    id: "sound-badge-unlocked",
    path: "audio/badge-unlocked.cue",
    type: "audio",
    license: "procedural",
    author: TEAM,
    decorative: true,
  },
];

const ASSET_BY_ID: ReadonlyMap<string, AssetManifestItem> = new Map(
  ASSET_MANIFEST.map((item) => [item.id, item]),
);

export function getAsset(id: string): AssetManifestItem | undefined {
  return ASSET_BY_ID.get(id);
}

export function hasAsset(id: string): boolean {
  return ASSET_BY_ID.has(id);
}

// Resurs yuklanmasa foydalanuvchiga tushunarli o'zbekcha xabar qaytaradi.
export function assetFallbackMessage(id: string): string {
  return hasAsset(id) ? uz.assetFallback : uz.assetUnknown;
}

export function assetsOfType(type: AssetType): readonly AssetManifestItem[] {
  return ASSET_MANIFEST.filter((item) => item.type === type);
}
