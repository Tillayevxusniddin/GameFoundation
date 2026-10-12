import { describe, expect, it } from "vitest";
import {
  ASSET_LICENSES,
  ASSET_MANIFEST,
  assetFallbackMessage,
  assetsOfType,
  getAsset,
  hasAsset,
  type AssetType,
} from "../../src/assets/manifest";
import {
  SOUND_CUES,
  createAudioPlayer,
  isSoundCue,
  soundCueMessage,
} from "../../src/assets/audio";
import { uz } from "../../src/i18n/uz";

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ASSET_TYPES: readonly AssetType[] = ["image", "tileset", "audio", "font"];

describe("resurs katalogi (asset manifest)", () => {
  it("har bir resurs identifikatori kebab-case va takrorlanmas", () => {
    const ids = ASSET_MANIFEST.map((asset) => asset.id);
    for (const id of ids) {
      expect(id).toMatch(KEBAB_CASE);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("har bir resursda path, type, litsenziya va muallif bor", () => {
    for (const asset of ASSET_MANIFEST) {
      expect(asset.path.length).toBeGreaterThan(0);
      expect(ASSET_TYPES).toContain(asset.type);
      expect(ASSET_LICENSES).toContain(asset.license);
      expect(typeof asset.author).toBe("string");
      expect((asset.author ?? "").length).toBeGreaterThan(0);
      expect(typeof asset.decorative).toBe("boolean");
    }
  });

  it("path qiymatlari noyob", () => {
    const paths = ASSET_MANIFEST.map((asset) => asset.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("getAsset/hasAsset noma'lum identifikatorni xavfsiz qaytaradi", () => {
    const first = ASSET_MANIFEST[0];
    expect(first).toBeDefined();
    expect(hasAsset(first?.id ?? "")).toBe(true);
    expect(hasAsset("yoq-bunday-resurs")).toBe(false);
    expect(getAsset("yoq-bunday-resurs")).toBeUndefined();
  });

  it("fallback xabarlari o'zbekcha va ma'noli", () => {
    expect(assetFallbackMessage("hero-idle")).toBe(uz.assetFallback);
    expect(assetFallbackMessage("yoq-bunday-resurs")).toBe(uz.assetUnknown);
    expect(uz.assetFallback.length).toBeGreaterThan(0);
    expect(uz.assetUnknown.length).toBeGreaterThan(0);
  });

  it("audio signallari manifestda mavjud", () => {
    const audio = assetsOfType("audio");
    expect(audio).toHaveLength(SOUND_CUES.length);
    for (const cue of SOUND_CUES) {
      expect(hasAsset(`sound-${cue}`)).toBe(true);
    }
  });

  it("barcha nishonlar manifestda ro'yxatga olingan", () => {
    const badgeIds = [
      "lager-tanishuv",
      "html-boshlovchi",
      "css-bogbon",
      "js-ninja",
      "web-ninja",
    ];
    for (const id of badgeIds) {
      expect(hasAsset(`badge-${id}`)).toBe(true);
    }
  });
});

describe("audio signal yordamchilari", () => {
  it("isSoundCue faqat ruxsat etilgan signallarni tan oladi", () => {
    for (const cue of SOUND_CUES) {
      expect(isSoundCue(cue)).toBe(true);
    }
    expect(isSoundCue("nomalum-signal")).toBe(false);
  });

  it("har bir signal uchun ekranda matn takrori bor", () => {
    for (const cue of SOUND_CUES) {
      const message = soundCueMessage(cue);
      expect(message.length).toBeGreaterThan(0);
    }
  });

  it("Web Audio bo'lmasa ham o'chirilgan holatda ovoz xato bermaydi", () => {
    const player = createAudioPlayer();
    expect(player.isEnabled()).toBe(false);
    // O'chirilgan: hech narsa qilmaydi.
    expect((): void => player.play("mission-success")).not.toThrow();
    // Yoqilgan, lekin AudioContext mavjud emas: jim o'tadi.
    player.setEnabled(true);
    expect((): void => {
      for (const cue of SOUND_CUES) {
        player.play(cue);
      }
    }).not.toThrow();
    expect(player.isEnabled()).toBe(true);
  });
});
