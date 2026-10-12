// docs/04_LEVEL_DESIGN.md — js-01 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const js01 = createSkeletonManifest({
  id: "js-01",
  moduleId: "js",
  order: 11,
  title: "JS 1: o‘zgaruvchi va console.log",
  topic: "let, const va console.log",
  prerequisites: ["css-05"],
  difficulty: 1,
  nextLessonId: "js-02",
});
