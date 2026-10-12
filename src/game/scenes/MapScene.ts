// docs/02_GAME_DESIGN_DOCUMENT.md — top-down qahramon, xarita, collision, holatlar.
// docs/14_ASSET_GUIDE.md — barcha grafika protseduraviy generatsiya qilinadi,
// tashqi rasm talab qilinmaydi. prefers-reduced-motion hurmat qilinadi.
// docs/06_TECHNICAL_ARCHITECTURE.md — React Phaser obyektlarini boshqarmaydi;
// aloqa faqat typed EventBridge orqali.

import * as Phaser from "phaser";
import type { EventBridge } from "../../app/eventBridge";
import type {
  GameEventMap,
  MoveDirection,
} from "../../types/game";
import type { LessonStatus } from "../../types/progress";
import {
  DEFAULT_STATUS,
  HERO_HEIGHT,
  HERO_SPAWN,
  HERO_SPEED,
  HERO_WIDTH,
  MISSION_POINTS,
  OBSTACLES,
  PROXIMITY_RADIUS,
  REGIONS,
  STATUS_STYLES,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  type MissionPointDefinition,
} from "../mapData";

interface PointVisual {
  fill: Phaser.GameObjects.Arc;
  ring: Phaser.GameObjects.Arc;
  glyph: Phaser.GameObjects.Text;
}

type Bridge = EventBridge<GameEventMap>;

function prefersReducedMotion(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export class MapScene extends Phaser.Scene {
  private bridge: Bridge | undefined;
  private hero!: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private keyUp: Phaser.Input.Keyboard.Key | undefined;
  private keyDown: Phaser.Input.Keyboard.Key | undefined;
  private keyLeft: Phaser.Input.Keyboard.Key | undefined;
  private keyRight: Phaser.Input.Keyboard.Key | undefined;
  private readonly pressed = new Set<MoveDirection>();
  private readonly visualByLesson = new Map<string, PointVisual>();
  private states: Record<string, LessonStatus> = {};
  private nearbyLessonId: string | null = null;
  private reducedMotion = false;

  constructor() {
    super("MapScene");
  }

  create(): void {
    this.bridge = this.registry.get("wn-bridge") as Bridge | undefined;
    this.reducedMotion = prefersReducedMotion();
    this.states = (this.registry.get("wn-states") as
      | Record<string, LessonStatus>
      | undefined) ?? {};

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.drawBackground();
    this.drawRegions();
    this.createHero();
    this.createObstacles();
    this.createMissionPoints();
    this.setupInput();
    this.subscribeBridge();
    this.applyAllStates();

    this.bridge?.emit("game:ready", { timestamp: new Date().toISOString() });
  }

  update(): void {
    this.updateVelocity();
    this.checkProximity();
  }

  private drawBackground(): void {
    const g = this.add.graphics();
    g.fillStyle(0x11131a, 1);
    g.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    g.lineStyle(1, 0x1e2230, 1);
    const step = 40;
    for (let x = 0; x <= WORLD_WIDTH; x += step) {
      g.lineBetween(x, 0, x, WORLD_HEIGHT);
    }
    for (let y = 0; y <= WORLD_HEIGHT; y += step) {
      g.lineBetween(0, y, WORLD_WIDTH, y);
    }
  }

  private drawRegions(): void {
    for (const region of REGIONS) {
      const g = this.add.graphics();
      g.fillStyle(region.fill, 1);
      g.fillRoundedRect(region.x, region.y, region.width, region.height, 12);
      g.lineStyle(3, region.border, 1);
      g.strokeRoundedRect(region.x, region.y, region.width, region.height, 12);
      this.add
        .text(region.x + 10, region.y + 8, region.title, {
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#e8ecf7",
        })
        .setDepth(2);
    }
  }

  private createObstacles(): void {
    const rects: Phaser.GameObjects.Rectangle[] = [];
    for (const obstacle of OBSTACLES) {
      const rect = this.add.rectangle(
        obstacle.x + obstacle.width / 2,
        obstacle.y + obstacle.height / 2,
        obstacle.width,
        obstacle.height,
        0x2a2f3a,
      );
      rect.setStrokeStyle(1, 0x4a5060, 1);
      this.physics.add.existing(rect, true);
      rects.push(rect);
    }
    this.physics.add.collider(this.hero, rects);
  }

  private createMissionPoints(): void {
    for (const point of MISSION_POINTS) {
      const style = STATUS_STYLES[this.statusOf(point.lessonId)];
      const ring = this.add
        .circle(point.x, point.y, 16, 0x000000, 0)
        .setStrokeStyle(3, style.border, 1)
        .setDepth(3);
      const fill = this.add
        .circle(point.x, point.y, 11, style.fill, 1)
        .setDepth(3);
      const glyph = this.add
        .text(point.x, point.y, style.glyph, {
          fontFamily: "sans-serif",
          fontSize: "14px",
          color: "#ffffff",
          fontStyle: "bold",
        })
        .setOrigin(0.5)
        .setDepth(4);
      this.add
        .text(point.x, point.y + 24, point.shortLabel, {
          fontFamily: "sans-serif",
          fontSize: "11px",
          color: "#cdd6f4",
        })
        .setOrigin(0.5)
        .setDepth(4);
      this.visualByLesson.set(point.lessonId, { fill, ring, glyph });
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: ring,
          scale: { from: 1, to: 1.14 },
          duration: 900,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }

  private createHero(): void {
    this.ensureHeroTexture();
    this.hero = this.physics.add.sprite(HERO_SPAWN.x, HERO_SPAWN.y, "wn-hero");
    this.hero.setCollideWorldBounds(true);
    this.hero.setDepth(5);
    const body = this.hero.body as Phaser.Physics.Arcade.Body;
    body.setSize(HERO_WIDTH, HERO_HEIGHT);
  }

  private ensureHeroTexture(): void {
    if (this.textures.exists("wn-hero")) {
      return;
    }
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x2b2f45, 1);
    g.fillRoundedRect(1, 11, 24, 17, 6);
    g.fillStyle(0xffcf5a, 1);
    g.fillRect(1, 21, 24, 3);
    g.fillStyle(0xf2c49b, 1);
    g.fillCircle(13, 8, 7);
    g.fillStyle(0xc62828, 1);
    g.fillRect(6, 5, 14, 5);
    g.generateTexture("wn-hero", HERO_WIDTH, HERO_HEIGHT);
    g.destroy();
  }

  private setupInput(): void {
    const keyboard = this.input.keyboard;
    if (keyboard === null || keyboard === undefined) {
      return;
    }
    this.cursors = keyboard.createCursorKeys();
    this.keyUp = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyDown = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyLeft = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyRight = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  private subscribeBridge(): void {
    const bridge = this.bridge;
    if (bridge === undefined) {
      return;
    }
    bridge.subscribe("input:direction-start", ({ direction }) => {
      this.pressed.add(direction);
    });
    bridge.subscribe("input:direction-stop", ({ direction }) => {
      this.pressed.delete(direction);
    });
    bridge.subscribe("map:states-updated", ({ states }) => {
      this.states = states;
      this.applyAllStates();
    });
  }

  private statusOf(lessonId: string): LessonStatus {
    return this.states[lessonId] ?? DEFAULT_STATUS;
  }

  private applyAllStates(): void {
    for (const point of MISSION_POINTS) {
      this.applyPointStyle(point);
    }
  }

  private applyPointStyle(point: MissionPointDefinition): void {
    const visual = this.visualByLesson.get(point.lessonId);
    if (visual === undefined) {
      return;
    }
    const style = STATUS_STYLES[this.statusOf(point.lessonId)];
    visual.fill.setFillStyle(style.fill, 1);
    visual.ring.setStrokeStyle(3, style.border, 1);
    visual.glyph.setText(style.glyph);
  }

  private updateVelocity(): void {
    const body = this.hero.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;
    if (this.isDown("left")) {
      vx -= HERO_SPEED;
    }
    if (this.isDown("right")) {
      vx += HERO_SPEED;
    }
    if (this.isDown("up")) {
      vy -= HERO_SPEED;
    }
    if (this.isDown("down")) {
      vy += HERO_SPEED;
    }
    body.setVelocity(vx, vy);
  }

  private isDown(direction: MoveDirection): boolean {
    if (this.pressed.has(direction)) {
      return true;
    }
    switch (direction) {
      case "up":
        return (
          (this.cursors?.up.isDown ?? false) || (this.keyUp?.isDown ?? false)
        );
      case "down":
        return (
          (this.cursors?.down.isDown ?? false) || (this.keyDown?.isDown ?? false)
        );
      case "left":
        return (
          (this.cursors?.left.isDown ?? false) || (this.keyLeft?.isDown ?? false)
        );
      case "right":
        return (
          (this.cursors?.right.isDown ?? false) ||
          (this.keyRight?.isDown ?? false)
        );
    }
  }

  private checkProximity(): void {
    let nearest: MissionPointDefinition | null = null;
    let nearestDistance = PROXIMITY_RADIUS;
    for (const point of MISSION_POINTS) {
      const distance = Phaser.Math.Distance.Between(
        this.hero.x,
        this.hero.y,
        point.x,
        point.y,
      );
      if (distance <= nearestDistance) {
        nearest = point;
        nearestDistance = distance;
      }
    }
    const nextId = nearest === null ? null : nearest.lessonId;
    if (nextId === this.nearbyLessonId) {
      return;
    }
    const previousId = this.nearbyLessonId;
    this.nearbyLessonId = nextId;
    if (previousId !== null) {
      this.bridge?.emit("map:mission-left", { lessonId: previousId });
    }
    if (nearest !== null) {
      this.bridge?.emit("map:mission-nearby", {
        lessonId: nearest.lessonId,
        status: this.statusOf(nearest.lessonId),
      });
    }
  }
}
