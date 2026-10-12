// docs/04_LEVEL_DESIGN.md — js-03 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const js03 = createSkeletonManifest({
  id: "js-03",
  moduleId: "js",
  order: 13,
  title: "JS 3: funksiya",
  topic: "function va parametr",
  prerequisites: ["js-02"],
  difficulty: 2,
  nextLessonId: "js-04",
});
