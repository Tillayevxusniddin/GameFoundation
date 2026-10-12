// docs/04_LEVEL_DESIGN.md — css-05 skelet manifesti (4-bosqichda boyitiladi).
// CSS moduli tugagach "css-bogbon" nishoni beriladi.

import { createSkeletonManifest } from "./placeholder";

export const css05 = createSkeletonManifest({
  id: "css-05",
  moduleId: "css",
  order: 10,
  title: "CSS 5: responsive ko‘rinish",
  topic: "media query",
  prerequisites: ["css-04"],
  difficulty: 3,
  badgeId: "css-bogbon",
  nextLessonId: "js-01",
});
