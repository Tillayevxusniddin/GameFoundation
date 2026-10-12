// docs/04_LEVEL_DESIGN.md — html-02 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const html02 = createSkeletonManifest({
  id: "html-02",
  moduleId: "html",
  order: 3,
  title: "HTML 2: sarlavha va paragraf",
  topic: "h1 va p elementlari",
  prerequisites: ["html-01"],
  difficulty: 1,
  nextLessonId: "html-03",
});
