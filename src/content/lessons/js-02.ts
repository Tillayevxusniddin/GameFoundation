// docs/04_LEVEL_DESIGN.md — js-02: elementni tanlash (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const js02: LessonManifest = {
  id: "js-02",
  moduleId: "js",
  title: "JS 2: elementni tanlash",
  order: 12,
  difficulty: 2,
  prerequisites: ["js-01"],
  learningObjectives: [
    "document.querySelector bilan elementni id bo‘yicha topish",
    "Topilgan elementning matnini console.log orqali ko‘rish",
  ],
  story:
    "Minora ichida javonlar to‘la. Usta: “Avval qaysi javonni ochishni ko‘rsatishing kerak,” deydi. JavaScript da buni selektor orqali qilamiz.",
  explanation:
    "`document.querySelector(\"#id\")` yoki `document.getElementById(\"id\")` sahifadagi elementni topadi. `#` belgisi id bo‘yicha izlashni bildiradi. Topilgan elementning `textContent` xususiyati uning matnini beradi.",
  starterCode: {
    html: '<h1 id="sarlavha">Eski matn</h1>\n',
    css: "",
    javascript: "// elementni top va matnini konsolga chiqar\n",
  },
  steps: [
    { id: "top", text: '`document.querySelector("#sarlavha")` bilan elementni top.' },
    { id: "saqla", text: "Topilgan elementni `const` o‘zgaruvchiga saqlang." },
    { id: "log", text: "`console.log(element.textContent);` bilan matnini chiqaring." },
  ],
  hints: [
    "Sahifadagi bitta elementni id bo‘yicha qanday topamiz?",
    "`document.querySelector` yoki `document.getElementById` ishlatiladi.",
    'Namuna:\nconst sarlavha = document.querySelector("#sarlavha");\nconsole.log(sarlavha.textContent);',
  ],
  validation: [
    {
      id: "js-02-log",
      type: "behavioral",
      target: "console:Eski matn",
      messageUz:
        'Konsolda "Eski matn" ko‘rinmayapti. Elementni topib, `textContent`ini `console.log` bilan chiqar.',
    },
    {
      id: "js-02-matn",
      type: "educational",
      target: "#sarlavha",
      messageUz:
        "Id berilgan sarlavha matni topilmadi.",
    },
  ],
  commonErrors: [
    {
      pattern: "querySelector da nuqta",
      explanation:
        "id selektori `#` bilan boshlanadi, `querySelector` ichida nuqta ishlatilgan.",
      fix: 'Id uchun `#sarlavha` yoz, class uchun `.nom`.',
    },
    {
      pattern: "textContent chaqirilmagan",
      explanation:
        "Element topilgan, lekin matnini olish uchun `textContent` yozilmagan.",
      fix: "`sarlavha.textContent` deb matnni oling.",
    },
  ],
  successMessage:
    "Ajoyib! Sen elementni topib, uning matnini konsolda ko‘rsatdingiz.",
  reflectionQuestion:
    "`querySelector` va `getElementById` orasidagi farq nima?",
  rewardXp: 100,
  nextLessonId: "js-03",
};
