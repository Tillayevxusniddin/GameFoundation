// docs/04_LEVEL_DESIGN.md — html-04: rasm, havola va tugma (to‘liq manifest).
// HTML moduli tugagach "html-boshlovchi" nishoni beriladi.

import type { LessonManifest } from "../../types/content";

export const html04: LessonManifest = {
  id: "html-04",
  moduleId: "html",
  title: "HTML 4: rasm, havola va tugma",
  order: 5,
  difficulty: 2,
  prerequisites: ["html-03"],
  learningObjectives: [
    "Rasmni <img> bilan qo‘shish va alt atributini yozish",
    "Havolani <a href> va tugmani <button> bilan yasash",
  ],
  story:
    "Qishloq e’lonlar taxtasiga sen sahifa osasan. Unda rasm, boshqa sahifaga havola va bitta tugma bo‘lishi kerak. Oqsoqol: “Rasm ko‘rinmasa ham, alt matni nima borligini aytib turishi kerak,” deydi.",
  explanation:
    "<img> tegi rasmni ko‘rsatadi va uning src atributi rasm manzilini bildiradi. alt atributi rasm yuklanmasa yoki ko‘rinmasa, uning o‘rniga o‘qiladigan matn. Havola <a href=\"...\">Matn</a> ko‘rinishida yoziladi. Tugma esa <button>Bos</button> bo‘ladi.",
  starterCode: {
    html:
      "<h1>Qishloq e’loni</h1>\n" +
      '<img src="qishloq.png">\n',
    css: "",
    javascript: "",
  },
  steps: [
    { id: "alt", text: "Rasmga alt=\"...\" atributini qo‘shib, unda nima tasvirlanganini yoz." },
    { id: "havola", text: "<a href=\"https://example.com\">Matn</a> ko‘rinishida havola qo‘sh." },
    { id: "tugma", text: "<button>Matn</button> bilan bitta tugma qo‘sh." },
  ],
  hints: [
    "Rasm yuklanmasa, foydalanuvchiga nima borligini qaysi atribut aytib beradi?",
    "Havola uchun `href`, rasm uchun `alt`, tugma uchun `<button>` ishlatiladi.",
    "Namuna:\n<img src=\"qishloq.png\" alt=\"Qishloq manzarasi\">\n<a href=\"https://example.com\">Bog‘</a>\n<button>Bosing</button>",
  ],
  validation: [
    {
      id: "html-04-alt",
      type: "value",
      target: "img@alt",
      messageUz:
        "Rasmda alt atributi yo‘q. <img> ichiga alt=\"tavsif\" qo‘sh.",
    },
    {
      id: "html-04-href",
      type: "value",
      target: "a@href",
      messageUz:
        "Havolada href atributi yo‘q. <a href=\"manzil\">Matn</a> ko‘rinishida yoz.",
    },
    {
      id: "html-04-tugma",
      type: "structural",
      target: "button",
      messageUz:
        "Tugma topilmadi. Sahifaga <button>Matn</button> qo‘sh.",
    },
    {
      id: "html-04-matn",
      type: "educational",
      target: "button",
      messageUz:
        "Tugma bo‘sh ko‘rinadi. <button> va </button> orasiga matn yoz.",
    },
  ],
  commonErrors: [
    {
      pattern: "img da alt yo‘q",
      explanation:
        "Rasmga alt atributi qo‘yilmagan, shuning uchun ko‘zi ojiz foydalanuvchi rasmni bila olmaydi.",
      fix: "Har bir <img> ga alt=\"qisqa tavsif\" qo‘sh.",
    },
    {
      pattern: "href o‘rniga src",
      explanation:
        "Havolada manzil href emas, src atributida yozilgan.",
      fix: "<a> uchun href, <img> uchun src ishlatilishini esla.",
    },
  ],
  successMessage:
    "Zo‘r! Sahifangda rasm, havola va tugma bor — endi u haqiqiy e’lon taxtasiga o‘xshaydi.",
  reflectionQuestion:
    "Nega rasm uchun alt matni muhim? O‘z so‘zlaring bilan tushuntir.",
  rewardXp: 100,
  badgeId: "html-boshlovchi",
  nextLessonId: "css-01",
};
