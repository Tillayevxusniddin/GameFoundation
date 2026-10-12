// docs/04_LEVEL_DESIGN.md — html-03: ro‘yxatlar (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const html03: LessonManifest = {
  id: "html-03",
  moduleId: "html",
  title: "HTML 3: ro‘yxatlar",
  order: 4,
  difficulty: 2,
  prerequisites: ["html-02"],
  learningObjectives: [
    "Tartiblanmagan ro‘yxat uchun <ul> va <li> ishlatish",
    "Har bir ro‘yxat elementini alohida <li> ichida yozish",
  ],
  story:
    "Qishloq bozorchisi senga xarid ro‘yxati tuzishni topshirdi. “Bir qatorda hammasini yozsang, adashib ketasan,” deydi u. “Har bir narsani alohida qatorga yoz.”",
  explanation:
    "Ro‘yxat <ul> va </ul> teglari orasida yoziladi. Ichidagi har bir element <li> (list item) tegida bo‘ladi. Tartibli ro‘yxat kerak bo‘lsa <ol> ishlatiladi — u 1, 2, 3 deb raqamlaydi.",
  starterCode: {
    html:
      "<h1>Xarid ro‘yxati</h1>\n" +
      "<p>Bozordan olinadigan narsalar:</p>\n" +
      "<ul>\n" +
      "</ul>\n",
    css: "",
    javascript: "",
  },
  steps: [
    { id: "royxat", text: "<p> ostiga <ul> va </ul> qo‘sh." },
    { id: "element", text: "Ro‘yxat ichiga <li>Non</li> ko‘rinishida element yoz." },
    { id: "kopaytir", text: "Yana kamida ikkita <li> qo‘shib ro‘yxatni to‘ldir." },
  ],
  hints: [
    "Ro‘yxat ichidagi har bir alohida narsa qaysi tegda yozilishini o‘yla.",
    "Ro‘yxat elementi uchun <li> tegidan foydalan: <li>Non</li>.",
    "Namuna:\n<ul>\n  <li>Non</li>\n  <li>Sut</li>\n  <li>Olma</li>\n</ul>",
  ],
  validation: [
    {
      id: "html-03-ul",
      type: "structural",
      target: "ul, ol",
      messageUz:
        "Ro‘yxat topilmadi. Elementlarni <ul> va </ul> orasiga joyla.",
    },
    {
      id: "html-03-li",
      type: "structural",
      target: "li",
      messageUz:
        "Ro‘yxat elementlari topilmadi. Har bir narsani <li>Narsa</li> ichida yoz.",
    },
    {
      id: "html-03-li-matn",
      type: "educational",
      target: "li",
      messageUz:
        "Ro‘yxat elementi bo‘sh ko‘rinadi. <li> va </li> orasiga matn yoz.",
    },
  ],
  commonErrors: [
    {
      pattern: "li ul dan tashqarida",
      explanation:
        "Ro‘yxat elementi <ul> ichida emas, tashqarida yozilgan.",
      fix: "Har bir <li> ni <ul> va </ul> orasiga joyla.",
    },
    {
      pattern: "ul yopilmagan",
      explanation:
        "Ro‘yxat ochilgan, lekin yopuvchi </ul> qo‘yilmagan.",
      fix: "Oxirgi ro‘yxat elementidan keyin </ul> qo‘sh.",
    },
  ],
  successMessage:
    "Ajoyib! Sen tartibli ro‘yxat tuza olding, endi har bir narsa o‘z qatorida.",
  reflectionQuestion:
    "<ul> va <ol> orasidagi farq nima? Qachon qaysi birini tanlaysan?",
  rewardXp: 100,
  nextLessonId: "html-04",
};
