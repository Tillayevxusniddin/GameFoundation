// docs/14_ASSET_GUIDE.md — audio signallar Web Audio API orqali protseduraviy
// sintezlanadi: tashqi fayl yuklanmaydi, hajm kichik saqlanadi.
// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — audio majburiy emas; Web Audio
// mavjud bo'lmasa yoki o'chirilgan bo'lsa hech qanday xato bermaydi va har bir
// signal ekranda matn (aria-live) bilan takrorlanadi.

import { uz } from "../i18n/uz";

export const SOUND_CUES = [
  "mission-success",
  "validation-error",
  "hint-used",
  "badge-unlocked",
] as const;

export type SoundCue = (typeof SOUND_CUES)[number];

export function isSoundCue(value: string): value is SoundCue {
  return (SOUND_CUES as readonly string[]).includes(value);
}

// Audio signal matni: ekranda aria-live orqali takrorlanadi.
export function soundCueMessage(cue: SoundCue): string {
  switch (cue) {
    case "mission-success":
      return uz.soundMissionSuccess;
    case "validation-error":
      return uz.soundValidationError;
    case "hint-used":
      return uz.soundHintUsed;
    case "badge-unlocked":
      return uz.soundBadgeUnlocked;
  }
}

interface CueProfile {
  frequency: number;
  waveform: OscillatorType;
  durationSeconds: number;
}

const CUE_PROFILES: Record<SoundCue, CueProfile> = {
  "mission-success": { frequency: 660, waveform: "sine", durationSeconds: 0.18 },
  "validation-error": {
    frequency: 200,
    waveform: "square",
    durationSeconds: 0.22,
  },
  "hint-used": { frequency: 440, waveform: "triangle", durationSeconds: 0.12 },
  "badge-unlocked": { frequency: 880, waveform: "sine", durationSeconds: 0.24 },
};

export interface AudioPlayer {
  play(cue: SoundCue): void;
  setEnabled(enabled: boolean): void;
  isEnabled(): boolean;
}

type AudioContextCtor = new () => AudioContext;

function getAudioContextCtor(): AudioContextCtor | null {
  const holder = globalThis as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return holder.AudioContext ?? holder.webkitAudioContext ?? null;
}

export function createAudioPlayer(): AudioPlayer {
  let enabled = false;
  let context: AudioContext | null = null;

  const ensureContext = (): AudioContext | null => {
    if (context !== null) {
      return context;
    }
    const Ctor = getAudioContextCtor();
    if (Ctor === null) {
      return null;
    }
    try {
      context = new Ctor();
    } catch {
      context = null;
    }
    return context;
  };

  const play = (cue: SoundCue): void => {
    if (!enabled) {
      return;
    }
    const audioContext = ensureContext();
    if (audioContext === null) {
      return;
    }
    try {
      if (audioContext.state === "suspended") {
        void audioContext.resume();
      }
      const profile = CUE_PROFILES[cue];
      const startAt = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = profile.waveform;
      oscillator.frequency.setValueAtTime(profile.frequency, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.08, startAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startAt + profile.durationSeconds,
      );
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startAt);
      oscillator.stop(startAt + profile.durationSeconds);
    } catch {
      // Audio mavjud bo'lmasa ham jim davom etamiz; matn takrori yetarli.
    }
  };

  return {
    play,
    setEnabled(value: boolean): void {
      enabled = value;
    },
    isEnabled(): boolean {
      return enabled;
    },
  };
}
