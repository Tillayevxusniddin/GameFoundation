// docs/04_LEVEL_DESIGN.md — js-03: matnni o‘zgartirish (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const js03: LessonManifest = {
  id: "js-03",
  moduleId: "js",
  title: "JS 3: matnni o‘zgartirish",
  order: 13,
  difficulty: 2,
  prerequisites: ["js-02"],
  learningObjectives: [
    "Topilgan elementning textContent qiymatini o‘zgartirish",
    "Sahifadagi matn o‘zgarganini konsolda tasdiqlash",
  ],
  story:
    "Minora devoridagi yozuv eskirgan. Usta: “Yozuvni o‘chirib, yangisini yoz,” deydi. Element matnini `textContent` orqali almashtiramiz.",
  explanation:
    "Element matnini ko‘rish uchun `textContent` o‘qiladi, o‘zgartirish uchun esa unga yangi qiymat beriladi: `element.textContent = \"Yangi matn\";`. Sahifa darhol yangilanadi va “Ishga tushirish”dan keyin ko‘rinadi.",
  starterCode: {
    html: '<p id="xabar">Bu yerda eski xabar</p>\n',
    css: "",
    javascript: "// element matnini yangi xabarga almashtir va konsolga chiqar\n",
  },
  steps: [
    { id: "top", text: '#xabar elementini `document.querySelector` bilan top.' },
    { id: "yoz", text: '`element.textContent = "Salom, o‘quvchi!";` deb matnni o‘zgartir.' },
    { id: "log", text: "O‘zgargan matnni `console.log` bilan chiqarib tasdiqlang." },
  ],
  hints: [
    "Element ichidagi matnni qaysi xususiyat orqali o‘zgartiramiz?",
    "`textContent` ga yangi qiymat bering.",
    'Namuna:\nconst xabar = document.querySelector("#xabar");\nxabar.textContent = "Salom, o‘quvchi!";\nconsole.log(xabar.textContent);',
  ],
  validation: [
    {
      id: "js-03-log",
      type: "behavioral",
      target: "console:Salom, o‘quvchi!",
      messageUz:
        'Konsolda yangi matn ko‘rinmayapti. `textContent`ga yangi matn bering va `console.log` bilan chiqar.',
    },
    {
      id: "js-03-matn",
      type: "educational",
      target: "#xabar",
      messageUz:
        "Element matni topilmadi. `#xabar` elementini saqlab qol.",
    },
  ],
  commonErrors: [
    {
      pattern: "textContent o‘qilgan",
      explanation:
        "`textContent` faqat o‘qilgan, ammo unga yangi qiymat berilmagan.",
      fix: '`element.textContent = "Yangi matn";` deb qiymat bering.',
    },
    {
      pattern: "innerText xato yozilgan",
      explanation:
        "`innerText` nomi noto‘g‘ri yozilgan yoki aralashgan.",
      fix: "MVPda `textContent` ishlatiladi; nomini to‘g‘ri yoz.",
    },
  ],
  successMessage:
    "Barakalla! Sen sahifadagi matnni o‘zgartirib, konsolda tasdiqladingiz.",
  reflectionQuestion:
    "Element matni o‘zgarishi nega darhol previewda ko‘rinadi?",
  rewardXp: 100,
  nextLessonId: "js-04",
};
