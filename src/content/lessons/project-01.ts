// docs/04_LEVEL_DESIGN.md — project-01 skelet manifesti (4-bosqichda boyitiladi).
// Yakuniy maydon: uch texnologiyali mini-loyiha; tugagach "web-ninja" nishoni.

import { createSkeletonManifest } from "./placeholder";

export const project01 = createSkeletonManifest({
  id: "project-01",
  moduleId: "project",
  order: 17,
  title: "Yakuniy maydon: mini-loyiha",
  topic: "HTML, CSS va JavaScript birgalikda",
  prerequisites: ["js-06"],
  difficulty: 3,
  badgeId: "web-ninja",
});
