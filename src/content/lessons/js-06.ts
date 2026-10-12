// docs/04_LEVEL_DESIGN.md — js-06: shartli mantiq va hisoblagich (to‘liq manifest).
// JS moduli tugagach "js-ninja" nishoni beriladi.

import type { LessonManifest } from "../../types/content";

export const js06: LessonManifest = {
  id: "js-06",
  moduleId: "js",
  title: "JS 6: hisoblagich va shart",
  order: 16,
  difficulty: 3,
  prerequisites: ["js-05"],
  learningObjectives: [
    "O‘zgaruvchi bilan hisoblagich yuritish",
    "if/else bilan holatga qarab turli matn ko‘rsatish",
  ],
  story:
    "Minora cho‘qqisida sehrli hisoblagich bor. Usta: “Har bosishda raqam oshsin, uchga yetganda esa maxsus so‘z chiqsin,” deydi.",
  explanation:
    "`let` bilan son o‘zgaruvchisini yasaymiz va har bosishda unga 1 qo‘shamiz. `if (shart) { ... } else { ... }` shart bajarilsa bir matnni, aks holda boshqasini ko‘rsatadi.",
  starterCode: {
    html: '<button id="qosh">Hisob: 0</button>\n',
    css: "",
    javascript:
      "// hisoblagich yasab, har bosishda oshiring va if/else bilan matnni yangilang\n",
  },
  steps: [
    { id: "top", text: '#qosh tugmasini toping.' },
    { id: "hisob", text: "`let hisob = 0;` deb hisoblagich yasang." },
    { id: "if", text: "click ichida hisobni oshirib, `if/else` bilan tugma matnini yangilang." },
  ],
  hints: [
    "Har bosishda sonni oshirish uchun qanday o‘zgaruvchi kerak?",
    "`let` hisoblagich va `if (hisob >= 3) { ... } else { ... }` ishlatiladi.",
    'Namuna:\nlet hisob = 0;\nconst tugma = document.querySelector("#qosh");\ntugma.addEventListener("click", function () {\n  hisob = hisob + 1;\n  if (hisob >= 3) {\n    tugma.textContent = "Ajoyib!";\n  } else {\n    tugma.textContent = "Hisob: " + hisob;\n  }\n});',
  ],
  validation: [
    {
      id: "js-06-click",
      type: "behavioral",
      target: "click:#qosh",
      messageUz:
        "Tugma bosilganda matni o‘zgarmayapti. Hisoblagich qo‘shib, `if/else` bilan matnni yangilang.",
    },
    {
      id: "js-06-matn",
      type: "educational",
      target: "#qosh",
      messageUz:
        "Hisoblagich tugmasi matni topilmadi.",
    },
  ],
  commonErrors: [
    {
      pattern: "const hisoblagich",
      explanation:
        "Hisoblagich `const` bilan yasalgan, shuning uchun uni oshirib bo‘lmaydi.",
      fix: "O‘zgaradigan hisoblagich uchun `let` ishlat.",
    },
    {
      pattern: "else yo‘q",
      explanation:
        "`if` yozilgan, lekin aks holat uchun `else` qo‘shilmagan.",
      fix: "`if (...) { ... } else { ... }` ko‘rinishida ikkala holatni yoz.",
    },
  ],
  successMessage:
    "Zo‘r! Sen hisoblagich va shartli mantiqni birlashtirdingiz. JavaScript minorasi zabt etildi!",
  reflectionQuestion:
    "`if/else` hisoblagichni yanada foydali qilishiga misol keltir.",
  rewardXp: 100,
  badgeId: "js-ninja",
  nextLessonId: "project-01",
};
