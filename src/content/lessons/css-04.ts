// docs/04_LEVEL_DESIGN.md — css-04 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const css04 = createSkeletonManifest({
  id: "css-04",
  moduleId: "css",
  order: 9,
  title: "CSS 4: flexbox layout",
  topic: "display flex va justify-content",
  prerequisites: ["css-03"],
  difficulty: 3,
  nextLessonId: "css-05",
});
