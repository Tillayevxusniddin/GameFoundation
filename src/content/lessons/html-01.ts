// docs/04_LEVEL_DESIGN.md — html-01: HTML hujjat tuzilishi (to'liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o'tadi.

import type { LessonManifest } from "../../types/content";

export const html01: LessonManifest = {
  id: "html-01",
  moduleId: "html",
  title: "HTML qishlog‘i: hujjat tuzilishi",
  order: 2,
  difficulty: 1,
  prerequisites: ["intro-01"],
  learningObjectives: [
    "HTML hujjat skeletini (doctype, html, head, body) tuzish",
    "Sahifa sarlavhasini h1 tegida yozish",
  ],
  story:
    "HTML qishlog‘i darvozasi oldida seni qishloq oqsoqoli kutmoqda. U aytadi: “Har bir uy poydevordan boshlanadi. Sahifang ham xuddi shunday: avval tuzilma, keyin mazmun.”",
  explanation:
    "HTML — sahifaning suyagi. Har bir hujjat <!doctype html> bilan boshlanadi, so‘ngra <html> ichida <head> (ko‘rinmas ma’lumot) va <body> (ko‘rinadigan mazmun) keladi. Sarlavha uchun <h1> tegidan foydalanamiz.",
  starterCode: {
    html:
      "<!doctype html>\n" +
      '<html lang="uz">\n' +
      "  <head>\n" +
      '    <meta charset="UTF-8" />\n' +
      "    <title>Mening qishlog‘im</title>\n" +
      "  </head>\n" +
      "  <body>\n" +
      "    <h1>Bu yerga sarlavha yoz</h1>\n" +
      "  </body>\n" +
      "</html>\n",
    css: "",
    javascript: "",
  },
  steps: [
    {
      id: "doctype",
      text: "Hujjat boshiga <!doctype html> qatorini qo‘y.",
    },
    {
      id: "html",
      text: "Butun mazmunni <html lang=\"uz\"> va </html> orasiga joyla.",
    },
    {
      id: "head",
      text: "<head> ichida <meta charset=\"UTF-8\" /> va <title> bo‘lsin.",
    },
    {
      id: "body",
      text: "<body> ichiga <h1> sarlavha qo‘sh.",
    },
  ],
  hints: [
    "Hujjat poydevori uchta qismdan iborat: <head> ko‘rinmas sozlamalar, <body> esa ko‘rinadigan mazmun uchun.",
    "Sarlavha uchun aynan <h1> tegidan foydalan: <h1>Matn</h1>. Pastroq darajalar keyingi missiyalarda.",
    "Minimal tuzilma:\n<!doctype html>\n<html lang=\"uz\">\n  <head><title>Salom</title></head>\n  <body><h1>Salom</h1></body>\n</html>",
  ],
  validation: [
    {
      id: "html-01-doctype",
      type: "structural",
      target: "doctype",
      messageUz:
        "Hujjat <!doctype html> bilan boshlanmadi. Eng birinchi qatorga doctype qo‘sh.",
    },
    {
      id: "html-01-head",
      type: "structural",
      target: "head",
      messageUz:
        "<head> bo‘limi topilmadi. <html> ichida ko‘rinmas sozlamalar uchun <head> qo‘sh.",
    },
    {
      id: "html-01-body",
      type: "structural",
      target: "body",
      messageUz:
        "<body> bo‘limi topilmadi. Ko‘rinadigan mazmun <body> ichida bo‘lishi kerak.",
    },
    {
      id: "html-01-h1",
      type: "structural",
      target: "h1",
      messageUz:
        "Sarlavha topilmadi. <body> ichiga <h1>Matn</h1> qo‘sh.",
    },
  ],
  commonErrors: [
    {
      pattern: "h1 yopilmagan",
      explanation:
        "h1 tegi ochilgan, lekin yopuvchi </h1> yozilmagan, shuning uchun sarlavha ko‘rinmaydi.",
      fix: "Sarlavha matnidan keyin </h1> qo‘sh.",
    },
    {
      pattern: "body ichida head",
      explanation:
        "<head> noto‘g‘ri joyga, <body> ichiga tushib qolgan.",
      fix: "Head va bodyni birodar qilib, ikkalasini ham bevosita <html> ichiga joyla.",
    },
  ],
  successMessage:
    "Zo‘r! HTML qishlog‘ining poydevorini o‘zing qurding. Endi matn va sarlavhalar bilan ishlashga o‘tamiz.",
  reflectionQuestion:
    "<head> va <body> vazifasi nimasi bilan farq qiladi? O‘z so‘zlaring bilan ayt.",
  rewardXp: 100,
  nextLessonId: "html-02",
};
