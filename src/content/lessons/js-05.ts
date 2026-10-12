// docs/04_LEVEL_DESIGN.md — js-05: hodisalar (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const js05: LessonManifest = {
  id: "js-05",
  moduleId: "js",
  title: "JS 5: tugma va hodisa",
  order: 15,
  difficulty: 3,
  prerequisites: ["js-04"],
  learningObjectives: [
    "addEventListener bilan click hodisasini tinglash",
    "Tugma bosilganda uning matnini o‘zgartirish",
  ],
  story:
    "Minora eshigi tugmadan ochiladi. Usta: “Tugmaga quloq sol — bosilganda javob qaytaring,” deydi. JavaScript da buni `addEventListener` qiladi.",
  explanation:
    "`element.addEventListener(\"click\", funksiya)` elementga hodisa tinglovchi qo‘shadi. Foydalanuvchi tugmani bosganda funksiya ishga tushadi. Ichida `textContent`ni o‘zgartirsak, tugma matni darhol yangilanadi.",
  starterCode: {
    html:
      '<h1 id="sarlavha">Salom!</h1>\n' +
      '<button id="tugma">Bosing</button>\n',
    css: "",
    javascript: "// tugmaga click hodisasini qo‘sh\n",
  },
  steps: [
    { id: "top", text: '#tugma ni `document.querySelector` bilan top.' },
    { id: "hodisa", text: '`tugma.addEventListener("click", function () { ... });` yoz.' },
    { id: "matn", text: 'Funksiya ichida `tugma.textContent = "Bosildi!";` qilib matnni o‘zgartir.' },
  ],
  hints: [
    "Tugma bosilganini JavaScript qanday sezadi?",
    'Hodisa uchun `addEventListener("click", ...)` ishlatiladi.',
    'Namuna:\nconst tugma = document.querySelector("#tugma");\ntugma.addEventListener("click", function () {\n  tugma.textContent = "Bosildi!";\n});',
  ],
  validation: [
    {
      id: "js-05-click",
      type: "behavioral",
      target: "click:#tugma",
      messageUz:
        "Tugma bosilganda matni o‘zgarmayapti. `addEventListener(\"click\", ...)` qo‘shib, ichida `textContent`ni o‘zgartiring.",
    },
    {
      id: "js-05-matn",
      type: "educational",
      target: "#tugma",
      messageUz:
        "Tugma matni topilmadi. `<button id=\"tugma\">Bosing</button>`ni saqlab qol.",
    },
  ],
  commonErrors: [
    {
      pattern: "click qo‘shtirnoqsiz",
      explanation:
        'Hodisa nomi qo‘shtirnoq ichida yozilmagan.',
      fix: '`addEventListener("click", ...)` deb yoz.',
    },
    {
      pattern: "funksiya chaqirilgan",
      explanation:
        "Tinglovchiga funksiya uzatilishi kerak, lekin u darhol chaqirilgan.",
      fix: "`() => { ... }` yoki `function () { ... }` ko‘rinishida funksiya bering.",
    },
  ],
  successMessage:
    "Ajoyib! Endi tugma bosilganda sahifa javob qaytaradi — bu haqiqiy interaksiya.",
  reflectionQuestion:
    "Nega funksiyani darhol chaqirmasdan, `addEventListener`ga uzatamiz?",
  rewardXp: 100,
  nextLessonId: "js-06",
};
