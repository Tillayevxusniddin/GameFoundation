// docs/04_LEVEL_DESIGN.md — css-03: class va selektorlar (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const css03: LessonManifest = {
  id: "css-03",
  moduleId: "css",
  title: "CSS 3: class bilan uslublash",
  order: 8,
  difficulty: 2,
  prerequisites: ["css-02"],
  learningObjectives: [
    "HTML elementga class atributi berish",
    "Class selektori (.nom) orqali faqat kerakli elementlarni uslublash",
  ],
  story:
    "Do‘kondagi mevalar hammasi bir xil rangda. Sotuvchi: “Olma yashil, banan esa alohida bo‘lsin,” deydi. Sehrli yorliq — class yordamida ularni ajratamiz.",
  explanation:
    "Elementga class yorlig‘ini `class=\"nom\"` bilan beramiz. CSS da esa class selektori nuqta bilan yoziladi: `.nom { ... }`. Shu tariqa bir xil tegdagi elementlarni alohida uslublay olamiz. Element selektori (`div`) barcha divlarga ta’sir qiladi.",
  starterCode: {
    html:
      "<h1>Do‘kon</h1>\n" +
      "<div>Olma</div>\n" +
      "<div>Banan</div>\n",
    css: "div {\n  color: green;\n}\n",
    javascript: "",
  },
  steps: [
    { id: "class", text: "Har bir meva diviga `class=\"meva\"` qo‘sh." },
    { id: "selektor", text: "CSS da `div` o‘rniga `.meva` selektoridan foydalan." },
    { id: "ajrat", text: "Banan uchun alohida `.shirin` class qo‘shib, boshqacha uslubla." },
  ],
  hints: [
    "Bir xil tegdagi faqat ayrim elementlarni qanday ajratamiz?",
    "Class atributi va nuqtali selektor `.nom` ishlatiladi.",
    "Namuna:\n<div class=\"meva\">Olma</div>\n.meva {\n  color: green;\n}\n.shirin {\n  font-weight: bold;\n}",
  ],
  validation: [
    {
      id: "css-03-class",
      type: "value",
      target: "div@class",
      messageUz:
        "Elementlarda class atributi yo‘q. `class=\"meva\"` qo‘shib, selektor bilan uslubla.",
    },
    {
      id: "css-03-shirin",
      type: "visual",
      target: ".shirin@font-weight=bold",
      messageUz:
        "Banan ajralib ko‘rinmayapti. `.shirin { font-weight: bold; }` qo‘sh.",
    },
    {
      id: "css-03-matn",
      type: "educational",
      target: ".meva",
      messageUz:
        "Class berilgan elementda matn yo‘q yoki class topilmadi.",
    },
  ],
  commonErrors: [
    {
      pattern: "class o‘rniga id",
      explanation:
        "Element class emas, id bilan belgilangan; id takrorlanmasligi kerak.",
      fix: "Bir nechta element uchun `class` ishlat, `.nom` selektori bilan uslubla.",
    },
    {
      pattern: "nuqta unutilgan",
      explanation:
        "CSS da class selektori yozilganda oldiga nuqta qo‘yilmagan.",
      fix: "`.meva { ... }` deb nuqta bilan yoz.",
    },
  ],
  successMessage:
    "Zo‘r! Endi class yorlig‘i bilan elementlarni ajratib uslublay olasan.",
  reflectionQuestion:
    "Class selektori element selektoridan nimasi bilan afzal?",
  rewardXp: 100,
  nextLessonId: "css-04",
};
