// docs/04_LEVEL_DESIGN.md — css-02 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const css02 = createSkeletonManifest({
  id: "css-02",
  moduleId: "css",
  order: 7,
  title: "CSS 2: rang va shrift",
  topic: "color, background va font",
  prerequisites: ["css-01"],
  difficulty: 2,
  nextLessonId: "css-03",
});
