// docs/04_LEVEL_DESIGN.md — css-03 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const css03 = createSkeletonManifest({
  id: "css-03",
  moduleId: "css",
  order: 8,
  title: "CSS 3: box model",
  topic: "margin, border va padding",
  prerequisites: ["css-02"],
  difficulty: 2,
  nextLessonId: "css-04",
});
