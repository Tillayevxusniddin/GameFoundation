// docs/04_LEVEL_DESIGN.md — css-01: rang va matn uslublari (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const css01: LessonManifest = {
  id: "css-01",
  moduleId: "css",
  title: "CSS 1: rang va matn uslublari",
  order: 6,
  difficulty: 1,
  prerequisites: ["html-04"],
  learningObjectives: [
    "Matn rangini color xususiyati bilan o‘zgartirish",
    "Fon rangini background-color va shrift o‘lchamini font-size bilan berish",
  ],
  story:
    "CSS bog‘iga kirganingda ranglar sochilib yotibdi. Bog‘bon aytadi: “HTML — mazmun, CSS esa uning libosi. Keling, sahifangga rang va o‘lcham beramiz.”",
  explanation:
    "CSS qoidalari `selector { xususiyat: qiymat; }` ko‘rinishida yoziladi. `color` matn rangini, `background-color` fon rangini, `font-size` esa shrift o‘lchamini beradi. Selektor — qaysi elementga uslub berilishini bildiradi.",
  starterCode: {
    html:
      '<h1 class="sarlavha">Salom, dunyo!</h1>\n' +
      '<p class="matn">Men CSS o‘rganyapman.</p>\n',
    css: "h1 {\n  color: red;\n}\n",
    javascript: "",
  },
  steps: [
    { id: "rang", text: "h1 uchun `color` xususiyatiga unga yoqqan rang ber." },
    { id: "fon", text: "body uchun `background-color` bilan fon rangini tanla." },
    { id: "olcham", text: ".matn uchun `font-size` bilan matn o‘lchamini belgilang." },
  ],
  hints: [
    "Matn rangini o‘zgartirish uchun qaysi xususiyat javob beradi?",
    "Rang uchun `color`, fon uchun `background-color`, o‘lcham uchun `font-size` ishlatiladi.",
    "Namuna:\nbody {\n  background-color: #eeeeee;\n}\nh1 {\n  color: blue;\n  font-size: 32px;\n}\n.matn {\n  font-size: 20px;\n}",
  ],
  validation: [
    {
      id: "css-01-h1-rang",
      type: "visual",
      target: "h1@color=blue",
      messageUz:
        "Sarlavha rangi hali ko‘k emas. h1 qoidasida `color: blue;` bo‘lishi kerak.",
    },
    {
      id: "css-01-fon",
      type: "visual",
      target: "body@background-color=#eeeeee",
      messageUz:
        "Sahifa fonida `background-color` ko‘rinmayapti. body qoidasiga fon rangini qo‘sh.",
    },
    {
      id: "css-01-olcham",
      type: "visual",
      target: ".matn@font-size=20px",
      messageUz:
        ".matn matni o‘lchami o‘zgarmagan. Unga `font-size: 20px;` bering.",
    },
    {
      id: "css-01-matn",
      type: "educational",
      target: "h1",
      messageUz:
        "Sarlavha matni ko‘rinmayapti. <h1> ichida matn bo‘lishi kerak.",
    },
  ],
  commonErrors: [
    {
      pattern: "color tenglik bilan",
      explanation:
        "CSS da xususiyat va qiymat ikki nuqta emas, tenglik bilan yozilgan.",
      fix: "`color: blue;` ko‘rinishida ikki nuqta va nuqtali vergul ishlat.",
    },
    {
      pattern: "nuqtali vergul yo‘q",
      explanation:
        "Bir nechta xususiyat yozilganda oxirida `;` qo‘yilmagan.",
      fix: "Har bir xususiyat qatorini `;` bilan tugat.",
    },
  ],
  successMessage:
    "Ajoyib! Sahifang endi rangli va o‘qishli ko‘rinadi. CSS bog‘ining darvozasi ochildi.",
  reflectionQuestion:
    "Nega HTML mazmun uchun, CSS esa ko‘rinish uchun javob beradi? Fikringni ayt.",
  rewardXp: 100,
  nextLessonId: "css-02",
};
