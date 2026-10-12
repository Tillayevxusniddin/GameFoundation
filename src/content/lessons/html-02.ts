// docs/04_LEVEL_DESIGN.md — html-02: sarlavha va paragraf (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const html02: LessonManifest = {
  id: "html-02",
  moduleId: "html",
  title: "HTML 2: sarlavha va paragraf",
  order: 3,
  difficulty: 1,
  prerequisites: ["html-01"],
  learningObjectives: [
    "Sahifaga sarlavha uchun <h1> elementini qo‘shish",
    "Matn uchun <p> paragraf elementlarini yozish",
  ],
  story:
    "Qishloq oqsoqoli seni gazeta tayyorlashga chaqirdi. U aytadi: “Gazetada avval katta sarlavha bo‘ladi, keyin ostida yangilik matni keladi.” Sen ham xuddi shunday sahifa tuzasan.",
  explanation:
    "Katta sarlavha <h1> tegida yoziladi. Oddiy matn esa <p> (paragraf) ichida bo‘ladi. Bir nechta paragraf kerak bo‘lsa, har biri uchun alohida <p> ishlatamiz. Matn doim shu teglar ichida turishi kerak.",
  starterCode: {
    html: "<h1>Qishloq yangiliklari</h1>\n",
    css: "",
    javascript: "",
  },
  steps: [
    { id: "sarlavha", text: "Sahifada bitta <h1> sarlavha bo‘lsin." },
    { id: "matn", text: "Sarlavha ostiga <p> va </p> orasida yangilik matnini yoz." },
    { id: "ikkinchi", text: "Yana bitta <p> qo‘shib, ikkinchi xabar yoz." },
  ],
  hints: [
    "Sarlavhadan keyin oddiy matn qaysi teg ichida yozilishini o‘yla.",
    "Matn uchun aynan <p> tegidan foydalan: <p>Matn</p>.",
    "Namuna:\n<h1>Yangi kun</h1>\n<p>Bugun quyosh chiqdi.</p>",
  ],
  validation: [
    {
      id: "html-02-h1",
      type: "structural",
      target: "h1",
      messageUz:
        "Sarlavha topilmadi. Sahifada bitta <h1>Sarlavha</h1> bo‘lishi kerak.",
    },
    {
      id: "html-02-p",
      type: "structural",
      target: "p",
      messageUz:
        "Paragraf topilmadi. Sarlavha ostiga <p>Matn</p> qo‘sh.",
    },
    {
      id: "html-02-p-matn",
      type: "educational",
      target: "p",
      messageUz:
        "Paragraf bo‘sh ko‘rinadi. <p> va </p> orasiga tushunarli matn yoz.",
    },
  ],
  commonErrors: [
    {
      pattern: "p yopilmagan",
      explanation:
        "Paragraf ochilgan, lekin yopuvchi </p> yozilmagan, shuning uchun keyingi matnlar ham unga qo‘shilib ketadi.",
      fix: "Paragraf matnidan keyin </p> qo‘sh.",
    },
    {
      pattern: "matn to‘g‘ridan-to‘g‘ri body ichida",
      explanation:
        "Matn teg ichida emas, to‘g‘ridan-to‘g‘ri sahifa ichiga yozilgan.",
      fix: "Har bir matnni <p>Matn</p> ichiga joyla.",
    },
  ],
  successMessage:
    "Barakalla! Endi sahifangda mazmunli sarlavha va paragraflar bor.",
  reflectionQuestion:
    "<h1> va <p> vazifasi nimasi bilan farq qiladi? O‘z so‘zlaring bilan ayt.",
  rewardXp: 100,
  nextLessonId: "html-03",
};
