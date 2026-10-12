// docs/04_LEVEL_DESIGN.md — css-05: karta dizayni (to‘liq manifest).
// CSS moduli tugagach "css-bogbon" nishoni beriladi.

import type { LessonManifest } from "../../types/content";

export const css05: LessonManifest = {
  id: "css-05",
  moduleId: "css",
  title: "CSS 5: karta dizayni",
  order: 10,
  difficulty: 3,
  prerequisites: ["css-04"],
  learningObjectives: [
    "Box Model va ranglarni birlashtirib karta yasash",
    "Karta ichidagi sarlavhaga alohida uslub berish",
  ],
  story:
    "Bog‘bon senga bitta qog‘oz beradi: “Undan chiroyli tashrif kartasi yasagin. U qalin chegara, yumaloq burchak va toza fon bilan ajralib tursin.”",
  explanation:
    "Karta — oddiy element, unga `padding`, `border`, `border-radius` va `background-color` beriladi. Ichidagi sarlavhaga alohida rang bersak, karta yanada jonlanadi. Bu yerda oldingi CSS bilimlarini birga qo‘llaysan.",
  starterCode: {
    html:
      '<div class="karta">\n' +
      '  <h2 class="karta__nom">Web Ninja</h2>\n' +
      '  <p class="karta__izoh">Men kod yozishni o‘rganyapman.</p>\n' +
      "</div>\n",
    css: ".karta {\n  width: 260px;\n}\n",
    javascript: "",
  },
  steps: [
    { id: "fon", text: ".karta ga `background-color: #ffffff;` fon ber." },
    { id: "chegara", text: "`border` va `border-radius: 16px;` bilan kartani bezang." },
    { id: "ichki", text: "`padding: 20px;` qo‘shib, `.karta__nom` rangini o‘zgartir." },
  ],
  hints: [
    "Kartani sahifadan ajratib turish uchun qaysi xususiyatlar kerak?",
    "Fon uchun `background-color`, chegra uchun `border`, burchak uchun `border-radius`.",
    "Namuna:\n.karta {\n  background-color: #ffffff;\n  border: 2px solid #333333;\n  border-radius: 16px;\n  padding: 20px;\n}\n.karta__nom {\n  color: #1a3d7c;\n}",
  ],
  validation: [
    {
      id: "css-05-fon",
      type: "visual",
      target: ".karta@background-color=#ffffff",
      messageUz:
        "Karta fonisiz. `.karta` ga `background-color: #ffffff;` qo‘sh.",
    },
    {
      id: "css-05-radius",
      type: "visual",
      target: ".karta@border-radius=16px",
      messageUz:
        "Karta burchaklari yumaloq emas. `border-radius: 16px;` qo‘sh.",
    },
    {
      id: "css-05-padding",
      type: "visual",
      target: ".karta@padding=20px",
      messageUz:
        "Karta ichida bo‘shliq yo‘q. `padding: 20px;` qo‘sh.",
    },
    {
      id: "css-05-rang",
      type: "visual",
      target: ".karta__nom@color=#1a3d7c",
      messageUz:
        "Karta sarlavhasi rangi o‘zgarmagan. `.karta__nom { color: #1a3d7c; }` qo‘sh.",
    },
  ],
  commonErrors: [
    {
      pattern: "karta__nom o‘rniga karta",
      explanation:
        "Sarlavha rangi butun kartaga berilgan, natijada matn ham bo‘yalgan.",
      fix: "Rangni `.karta__nom` selektoriga bering.",
    },
    {
      pattern: "background rang o‘rniga color",
      explanation:
        "Fon uchun `background-color` kerak, `color` esa matn rangini o‘zgartiradi.",
      fix: "Fon uchun `background-color` ishlat.",
    },
  ],
  successMessage:
    "Zo‘r! Sen bir necha CSS bilimini birlashtirib haqiqiy karta yasading.",
  reflectionQuestion:
    "Kartani chiroyli qilishda qaysi xususiyatlar ko‘proq ta’sir qildi?",
  rewardXp: 100,
  badgeId: "css-bogbon",
  nextLessonId: "js-01",
};
