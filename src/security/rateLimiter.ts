// docs/07_CODE_EXECUTION_SECURITY.md — minutiga ko'pi bilan 20 marta ishga
// tushirish. now() injektsiya qilinadi, shuning uchun test deterministtik.

import { MAX_RUNS_PER_MINUTE, RATE_WINDOW_MS } from "./limits";

export interface RateLimiterOptions {
  limit?: number;
  windowMs?: number;
  now?: () => number;
}

export class RateLimiter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly timestamps: number[] = [];

  constructor(options?: RateLimiterOptions) {
    this.limit = options?.limit ?? MAX_RUNS_PER_MINUTE;
    this.windowMs = options?.windowMs ?? RATE_WINDOW_MS;
    this.now = options?.now ?? ((): number => Date.now());
  }

  tryAcquire(): boolean {
    const current = this.now();
    this.prune(current);
    if (this.timestamps.length >= this.limit) {
      return false;
    }
    this.timestamps.push(current);
    return true;
  }

  remaining(): number {
    const current = this.now();
    this.prune(current);
    return Math.max(0, this.limit - this.timestamps.length);
  }

  reset(): void {
    this.timestamps.length = 0;
  }

  private prune(current: number): void {
    while (
      this.timestamps.length > 0 &&
      this.timestamps[0] !== undefined &&
      this.timestamps[0] <= current - this.windowMs
    ) {
      this.timestamps.shift();
    }
  }
}