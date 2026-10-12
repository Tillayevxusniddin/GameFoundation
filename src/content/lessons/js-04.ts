// docs/04_LEVEL_DESIGN.md — js-04 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const js04 = createSkeletonManifest({
  id: "js-04",
  moduleId: "js",
  order: 14,
  title: "JS 4: elementni tanlash",
  topic: "document.querySelector",
  prerequisites: ["js-03"],
  difficulty: 3,
  nextLessonId: "js-05",
});
