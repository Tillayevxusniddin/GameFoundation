// docs/04_LEVEL_DESIGN.md — js-04: classList (to‘liq manifest).
// docs/09_CONTENT_SCHEMA.md — barcha maydonlar runtime validatordan o‘tadi.

import type { LessonManifest } from "../../types/content";

export const js04: LessonManifest = {
  id: "js-04",
  moduleId: "js",
  title: "JS 4: class o‘zgartirish",
  order: 14,
  difficulty: 3,
  prerequisites: ["js-03"],
  learningObjectives: [
    "classList.add bilan elementga yangi class qo‘shish",
    "O‘zgargan className qiymatini console.log orqali ko‘rish",
  ],
  story:
    "Minora devoridagi karta hozircha kulrang. Usta: “Unga sehrli class yorlig‘ini qo‘shsak, CSS uni boshqacha bezaydi,” deydi.",
  explanation:
    "`element.classList` element classlarini boshqaradi. `classList.add(\"faol\")` yangi class qo‘shadi, `remove` olib tashlaydi, `toggle` esa almashtiradi. `element.className` esa barcha classlarni bitta matn qilib beradi.",
  starterCode: {
    html: '<div id="karta" class="karta">Men kartaman</div>\n',
    css: ".karta {\n  background-color: #dddddd;\n}\n",
    javascript: "// kartaga yangi class qo‘sh va className ni konsolga chiqar\n",
  },
  steps: [
    { id: "top", text: '#karta elementini `document.querySelector` bilan top.' },
    { id: "add", text: '`karta.classList.add("faol");` bilan class qo‘sh.' },
    { id: "log", text: "`console.log(karta.className);` bilan natijani ko‘r." },
  ],
  hints: [
    "Elementga yangi class qo‘shish uchun qaysi obyekt kerak?",
    "`classList.add(\"nom\")` ishlatiladi, barcha classlar `className`da ko‘rinadi.",
    'Namuna:\nconst karta = document.querySelector("#karta");\nkarta.classList.add("faol");\nconsole.log(karta.className);',
  ],
  validation: [
    {
      id: "js-04-log",
      type: "behavioral",
      target: "console:faol",
      messageUz:
        'Konsolda "faol" ko‘rinmayapti. `classList.add("faol")` qo‘shib, `className`ni chiqar.',
    },
    {
      id: "js-04-matn",
      type: "educational",
      target: "#karta",
      messageUz:
        "Karta elementi matni topilmadi. `#karta`ni saqlab qol.",
    },
  ],
  commonErrors: [
    {
      pattern: "classList o‘rniga class",
      explanation:
        "`element.class` deb yozilgan; bunday xususiyat yo‘q.",
      fix: "Classlar uchun `classList` yoki `className` ishlat.",
    },
    {
      pattern: "nuqta add ichida",
      explanation:
        '`classList.add(".faol")` deb nuqta qo‘shilgan.',
      fix: 'Class nomini nuqtasiz yoz: `classList.add("faol")`.',
    },
  ],
  successMessage:
    "Zo‘r! Endi JavaScript class qo‘shib, CSS ko‘rinishini boshqara olasan.",
  reflectionQuestion:
    "JavaScript class qo‘shsa, CSS qanday qilib ko‘rinishni o‘zgartiradi?",
  rewardXp: 100,
  nextLessonId: "js-05",
};
