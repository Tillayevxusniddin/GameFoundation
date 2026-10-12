import { describe, expect, it, vi } from "vitest";
import { createEventBridge } from "../../src/app/eventBridge";

describe("event bridge", () => {
  it("obuna bo'lgan handler typed payload oladi", () => {
    const bridge = createEventBridge();
    const handler = vi.fn();
    bridge.subscribe("map:mission-selected", handler);
    bridge.emit("map:mission-selected", { lessonId: "intro-01" });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ lessonId: "intro-01" });
  });

  it("unsubscribe dan keyin handler chaqirilmaydi", () => {
    const bridge = createEventBridge();
    const handler = vi.fn();
    const off = bridge.subscribe("editor:run-requested", handler);
    off();
    bridge.emit("editor:run-requested", { lessonId: "html-01" });
    expect(handler).not.toHaveBeenCalled();
    expect(bridge.listenerCount("editor:run-requested")).toBe(0);
  });

  it("bir nechta listener bir xil eventni oladi", () => {
    const bridge = createEventBridge();
    const first = vi.fn();
    const second = vi.fn();
    bridge.subscribe("mission:completed", first);
    bridge.subscribe("mission:completed", second);
    bridge.emit("mission:completed", { lessonId: "intro-01", xp: 100 });
    expect(first).toHaveBeenCalledWith({ lessonId: "intro-01", xp: 100 });
    expect(second).toHaveBeenCalledWith({ lessonId: "intro-01", xp: 100 });
  });
});
