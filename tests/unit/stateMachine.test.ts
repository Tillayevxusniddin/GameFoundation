import { describe, expect, it } from "vitest";
import {
  createStateMachine,
  isAllowedTransition,
} from "../../src/app/stateMachine";

describe("state machine", () => {
  it("asosiy oqim bo'yicha o'tishlarga ruxsat beradi", () => {
    const sm = createStateMachine("loading");
    expect(sm.go("map")).toBe(true);
    expect(sm.go("mission_intro")).toBe(true);
    expect(sm.go("coding")).toBe(true);
    expect(sm.go("running")).toBe(true);
    expect(sm.go("success")).toBe(true);
    expect(sm.get()).toBe("success");
  });

  it("noto'g'ri o'tishni rad etadi va holatni o'zgartirmaydi", () => {
    const sm = createStateMachine("loading");
    expect(sm.go("coding")).toBe(false);
    expect(sm.get()).toBe("loading");
    expect(isAllowedTransition("loading", "coding")).toBe(false);
  });

  it("validation_error faqat coding ga qaytadi", () => {
    const sm = createStateMachine("running");
    expect(sm.go("validation_error")).toBe(true);
    expect(sm.go("map")).toBe(false);
    expect(sm.go("coding")).toBe(true);
    expect(sm.get()).toBe("coding");
  });

  it("paused holatidan map yoki coding ga qaytish mumkin", () => {
    const sm = createStateMachine("map");
    expect(sm.go("paused")).toBe(true);
    expect(sm.go("coding")).toBe(true);
    expect(sm.get()).toBe("coding");
  });
});
