// docs/04_LEVEL_DESIGN.md — js-02 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const js02 = createSkeletonManifest({
  id: "js-02",
  moduleId: "js",
  order: 12,
  title: "JS 2: shart operatori",
  topic: "if va else",
  prerequisites: ["js-01"],
  difficulty: 2,
  nextLessonId: "js-03",
});
