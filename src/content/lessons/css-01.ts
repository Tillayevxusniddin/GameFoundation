// docs/04_LEVEL_DESIGN.md — css-01 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const css01 = createSkeletonManifest({
  id: "css-01",
  moduleId: "css",
  order: 6,
  title: "CSS 1: selectorga kirish",
  topic: "element va class selektori",
  prerequisites: ["html-04"],
  difficulty: 1,
  nextLessonId: "css-02",
});
