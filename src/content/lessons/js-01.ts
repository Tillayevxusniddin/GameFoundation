// docs/04_LEVEL_DESIGN.md — js-01: o‘zgaruvchilar (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const js01: LessonManifest = {
  id: "js-01",
  moduleId: "js",
  title: "JS 1: o‘zgaruvchilar",
  order: 11,
  difficulty: 1,
  prerequisites: ["css-05"],
  learningObjectives: [
    "const bilan o‘zgarmas qiymat saqlash",
    "Saqlangan qiymatni console.log orqali ko‘rish",
  ],
  story:
    "JavaScript minorasining birinchi eshigi sehrli qutichaga olib boradi. Usta: “Qiymatni qutiga solib, keyin uni ekranga chiqaramiz,” deydi. Quti — bu o‘zgaruvchi.",
  explanation:
    "`const` bilan qiymatni bir marta saqlaymiz va u keyin o‘zgarmaydi. Agar qiymat o‘zgarishi kerak bo‘lsa `let` ishlatamiz. `console.log(...)` esa saqlangan qiymatni natija panelining console qismida ko‘rsatadi.",
  starterCode: {
    html: '<h1 id="natija">?</h1>\n',
    css: "",
    javascript: "// bu yerda o‘zgaruvchi e’lon qil\n",
  },
  steps: [
    { id: "const", text: '`const` bilan bitta o‘zgaruvchi yasang, masalan ism.' },
    { id: "log", text: "`console.log(ism);` bilan uni konsolga chiqaring." },
    { id: "let", text: "Yana bitta o‘zgaruvchini `let` bilan yasab ko‘ring." },
  ],
  hints: [
    "Qiymatni saqlash uchun qanday kalit so‘z ishlatiladi?",
    "`const` yoki `let` bilan e’lon qilinadi, konsolga chiqarish uchun `console.log` ishlatiladi.",
    'Namuna:\nconst ism = "Web Ninja";\nconsole.log(ism);',
  ],
  validation: [
    {
      id: "js-01-log",
      type: "behavioral",
      target: "console:Web Ninja",
      messageUz:
        'Konsolda "Web Ninja" ko‘rinmayapti. `const` bilan qiymat saqlab, `console.log` bilan chiqar.',
    },
    {
      id: "js-01-matn",
      type: "educational",
      target: "h1",
      messageUz:
        "Sahifadagi <h1> matni ko‘rinmayapti. Uni o‘chirmasdan qoldir.",
    },
  ],
  commonErrors: [
    {
      pattern: "qo‘shtirnoqsiz matn",
      explanation:
        "Matn qiymati qo‘shtirnoq ichida yozilmagan.",
      fix: 'Matnni `const ism = "Web Ninja";` ko‘rinishida qo‘shtirnoqqa oling.',
    },
    {
      pattern: "const qayta tayinlangan",
      explanation:
        "`const` bilan yasalgan o‘zgaruvchiga yangi qiymat berilgan, bu xato beradi.",
      fix: "O‘zgaruvchi qayta tayinlanishi kerak bo‘lsa `let` ishlat.",
    },
  ],
  successMessage:
    "Barakalla! Sen birinchi o‘zgaruvchingizni saqlab, konsolda ko‘rsata oldingiz.",
  reflectionQuestion:
    "`const` va `let` orasidagi farqni qanday tushuntirasan?",
  rewardXp: 100,
  nextLessonId: "js-02",
};
