// docs/04_LEVEL_DESIGN.md — js-05 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const js05 = createSkeletonManifest({
  id: "js-05",
  moduleId: "js",
  order: 15,
  title: "JS 5: matnni o‘zgartirish",
  topic: "textContent",
  prerequisites: ["js-04"],
  difficulty: 3,
  nextLessonId: "js-06",
});
