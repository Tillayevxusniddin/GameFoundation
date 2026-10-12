// docs/04_LEVEL_DESIGN.md — html-03 skelet manifesti (4-bosqichda boyitiladi).

import { createSkeletonManifest } from "./placeholder";

export const html03 = createSkeletonManifest({
  id: "html-03",
  moduleId: "html",
  order: 4,
  title: "HTML 3: ro‘yxat va havolalar",
  topic: "ul, li va a elementlari",
  prerequisites: ["html-02"],
  difficulty: 2,
  nextLessonId: "html-04",
});
