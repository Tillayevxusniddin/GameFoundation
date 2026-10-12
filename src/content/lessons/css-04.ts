// docs/04_LEVEL_DESIGN.md — css-04: Flexbox layout (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const css04: LessonManifest = {
  id: "css-04",
  moduleId: "css",
  title: "CSS 4: Flexbox layout",
  order: 9,
  difficulty: 3,
  prerequisites: ["css-03"],
  learningObjectives: [
    "display: flex bilan elementlarni yonma-yon joylash",
    "justify-content, align-items va gap bilan joylashuvni boshqarish",
  ],
  story:
    "Bog‘dagi uchta quti bir-birining ustiga tushib qolgan. Bog‘bon: “Ularni bir qatorga terib, o‘rtaga joylashtirsak-chi?” deydi. Buning uchun Flexbox yordam beradi.",
  explanation:
    "Otalar elementga `display: flex;` berilsa, uning bolalari yonma-yon tiziladi. `justify-content` gorizontal joylashuvni, `align-items` vertikal tekislashni, `gap` esa oradagi masofani boshqaradi.",
  starterCode: {
    html:
      '<div class="qator">\n' +
      '  <div class="element">1</div>\n' +
      '  <div class="element">2</div>\n' +
      '  <div class="element">3</div>\n' +
      "</div>\n",
    css: ".element {\n  background-color: #dddddd;\n}\n",
    javascript: "",
  },
  steps: [
    { id: "flex", text: ".qator ga `display: flex;` ber." },
    { id: "justify", text: "`justify-content: center;` bilan elementlarni o‘rtaga tort." },
    { id: "align", text: "`align-items: center;` va `gap: 10px;` bilan tekislang va masofa qo‘sh." },
  ],
  hints: [
    "Bir elementning bolalarini yonma-yon qilish uchun qaysi xususiyat kerak?",
    "`display: flex`, `justify-content`, `align-items`, `gap` ishlatiladi.",
    "Namuna:\n.qator {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n}",
  ],
  validation: [
    {
      id: "css-04-flex",
      type: "visual",
      target: ".qator@display=flex",
      messageUz:
        "Elementlar hali yonma-yon emas. `.qator` ga `display: flex;` qo‘sh.",
    },
    {
      id: "css-04-justify",
      type: "visual",
      target: ".qator@justify-content=center",
      messageUz:
        "Elementlar o‘rtaga joylashmagan. `justify-content: center;` qo‘sh.",
    },
    {
      id: "css-04-align",
      type: "visual",
      target: ".qator@align-items=center",
      messageUz:
        "Elementlar vertikal tekislanmagan. `align-items: center;` qo‘sh.",
    },
    {
      id: "css-04-gap",
      type: "visual",
      target: ".qator@gap=10px",
      messageUz:
        "Elementlar orasida masofa yo‘q. `gap: 10px;` qo‘sh.",
    },
  ],
  commonErrors: [
    {
      pattern: "flex bolalarga berilgan",
      explanation:
        "`display: flex` bolalarga emas, ularni o‘rab turgan otasiga berilishi kerak.",
      fix: "`display: flex;` ni `.qator` ga bering.",
    },
    {
      pattern: "align-content ishlatilgan",
      explanation:
        "Bitta qator uchun `align-items` kerak, `align-content` emas.",
      fix: "Vertikal tekislash uchun `align-items` ishlat.",
    },
  ],
  successMessage:
    "Ajoyib! Endi qutilaring bir qatorda, tekis va oraliq masofa bilan turadi.",
  reflectionQuestion:
    "`display: flex` qaysi elementga beriladi va nima uchun?",
  rewardXp: 100,
  nextLessonId: "css-05",
};
