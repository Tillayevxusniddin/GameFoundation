// docs/04_LEVEL_DESIGN.md — css-02: box model (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const css02: LessonManifest = {
  id: "css-02",
  moduleId: "css",
  title: "CSS 2: Box Model (quti modeli)",
  order: 7,
  difficulty: 2,
  prerequisites: ["css-01"],
  learningObjectives: [
    "Element atrofidagi ichki va tashqi bo‘shliqni boshqarish",
    "padding, margin, border va border-radius bilan quti yasash",
  ],
  story:
    "Bog‘bon senga yog‘och quti beradi: “Har bir element aslida to‘rtburchak quti. Uning ichida bo‘shliq, chegarasi va atrofida masofa bo‘ladi.” Sen shu qutini chiroyli qilasan.",
  explanation:
    "Element qutisining ichki bo‘shlig‘i `padding`, chegarasi `border`, tashqi masofasi `margin` bilan beriladi. Burchaklarni yumaloq qilish uchun `border-radius` ishlatiladi. Shu to‘rt xususiyat “Box Model” deb ataladi.",
  starterCode: {
    html: '<div class="quti">Men bir qutiman</div>\n',
    css: ".quti {\n  background-color: lightblue;\n}\n",
    javascript: "",
  },
  steps: [
    { id: "padding", text: ".quti ga `padding: 20px;` qo‘shib ichki bo‘shliq ber." },
    { id: "margin", text: "`margin: 10px;` bilan tashqi masofani belgilang." },
    { id: "border", text: "`border` va `border-radius: 12px;` bilan chegra va yumaloq burchak yasang." },
  ],
  hints: [
    "Matn quti chegarasiga yopishib turmasligi uchun qaysi xususiyat kerak?",
    "Ichki bo‘shliq `padding`, chegra `border`, burchak `border-radius`.",
    "Namuna:\n.quti {\n  padding: 20px;\n  margin: 10px;\n  border: 2px solid black;\n  border-radius: 12px;\n}",
  ],
  validation: [
    {
      id: "css-02-padding",
      type: "visual",
      target: ".quti@padding=20px",
      messageUz:
        "Quti ichida bo‘shliq yo‘q. `.quti` ga `padding: 20px;` qo‘sh.",
    },
    {
      id: "css-02-margin",
      type: "visual",
      target: ".quti@margin=10px",
      messageUz:
        "Quti atrofida masofa yo‘q. `margin: 10px;` qo‘sh.",
    },
    {
      id: "css-02-border",
      type: "visual",
      target: ".quti@border",
      messageUz:
        "Qutida chegara ko‘rinmayapti. `border: 2px solid black;` qo‘sh.",
    },
    {
      id: "css-02-radius",
      type: "visual",
      target: ".quti@border-radius=12px",
      messageUz:
        "Burchaklar yumaloq emas. `border-radius: 12px;` qo‘sh.",
    },
  ],
  commonErrors: [
    {
      pattern: "padding qiymatsiz",
      explanation:
        "`padding` yozilgan, lekin qiymat berilmagan.",
      fix: "`padding: 20px;` ko‘rinishida o‘lcham qo‘sh.",
    },
    {
      pattern: "border-radius px siz",
      explanation:
        "`border-radius` qiymatiga birlik qo‘yilmagan.",
      fix: "`border-radius: 12px;` deb birlik yoz.",
    },
  ],
  successMessage:
    "Barakalla! Endi elementing haqiqiy qutiga o‘xshaydi: ichida bo‘shliq, atrofida masofa bor.",
  reflectionQuestion:
    "`padding` bilan `margin` farqini qanday tushuntirasan?",
  rewardXp: 100,
  nextLessonId: "css-03",
};
