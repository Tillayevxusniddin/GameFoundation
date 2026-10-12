// docs/04_LEVEL_DESIGN.md — html-04 skelet manifesti (4-bosqichda boyitiladi).
// HTML moduli tugagach "html-boshlovchi" nishoni beriladi.

import { createSkeletonManifest } from "./placeholder";

export const html04 = createSkeletonManifest({
  id: "html-04",
  moduleId: "html",
  order: 5,
  title: "HTML 4: rasm va alt matni",
  topic: "img va alt atributi",
  prerequisites: ["html-03"],
  difficulty: 2,
  badgeId: "html-boshlovchi",
  nextLessonId: "css-01",
});
