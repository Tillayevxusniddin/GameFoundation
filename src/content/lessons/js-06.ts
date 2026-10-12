// docs/04_LEVEL_DESIGN.md — js-06 skelet manifesti (4-bosqichda boyitiladi).
// JS moduli tugagach "js-ninja" nishoni beriladi.

import { createSkeletonManifest } from "./placeholder";

export const js06 = createSkeletonManifest({
  id: "js-06",
  moduleId: "js",
  order: 16,
  title: "JS 6: tugma va hodisa",
  topic: "addEventListener va click",
  prerequisites: ["js-05"],
  difficulty: 3,
  badgeId: "js-ninja",
  nextLessonId: "project-01",
});
