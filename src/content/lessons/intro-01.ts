// docs/04_LEVEL_DESIGN.md — intro-01: xarita va muharrir bilan tanishish.
// prompt.md §5.2 dagi 0.1 va 0.2 qadamlar bitta missiyada birlashgan.

import type { LessonManifest } from "../../types/content";

export const intro01: LessonManifest = {
  id: "intro-01",
  moduleId: "intro",
  title: "Boshlang‘ich lager: xarita va muharrir",
  order: 1,
  difficulty: 1,
  prerequisites: [],
  learningObjectives: [
    "Qahramonni xaritada harakatlantirish va missiya nuqtasini topish",
    "Muharrirda kodni o‘zgartirib, “Ishga tushirish” bilan natijani ko‘rish",
  ],
  story:
    "Sen Web Ninja lageriga yetib kelding. Usta seni kutmoqda: avval lagerni aylanib chiq, keyin sehrli taxtada birinchi yozuvingni qoldir.",
  explanation:
    "O‘yin oynasining chap tomonida vazifa, o‘rtada muharrir, o‘ng tomonda natija ko‘rinadi. Kod faqat “Ishga tushirish” bosilganda bajariladi.",
  starterCode: {
    html: "<h1>Salom, Web Ninja!</h1>\n<p>Bu mening birinchi sahifam.</p>\n",
    css: "h1 {\n  color: blue;\n}\n",
    javascript: "console.log('Tayyorman!');\n",
  },
  steps: [
    { id: "move", text: "WASD yoki yo‘nalish tugmalari bilan usta turgan nuqtagacha bor." },
    { id: "open", text: "Missiya kartasidagi “Missiyani boshlash” tugmasini bos." },
    { id: "edit", text: "Muharrirdagi sarlavha matnini o‘zingga yoqqan so‘zga almashtir." },
    { id: "run", text: "“Ishga tushirish” tugmasini bos va natijani o‘ng panelda ko‘r." },
  ],
  hints: [
    "Avval xaritada usta belgisi turgan joyni top, keyin muharrirga o‘t.",
    "Sarlavha uchun h1 tegidan foydalan: <h1>Matn</h1>.",
    "Namuna:\n<h1>Men keldim!</h1>\n“Ishga tushirish”ni bosishni unutma.",
  ],
  validation: [
    {
      id: "intro-structural-h1",
      type: "structural",
      target: "h1",
      messageUz:
        "Sarlavha topilmadi. Muharrirda h1 tegini qoldir, keyin “Ishga tushirish”ni bos.",
    },
    {
      id: "intro-behavioral-run",
      type: "behavioral",
      target: "preview-run",
      messageUz:
        "Natija yangilanmadi. “Ishga tushirish” tugmasini bosganingga ishonch hosil qil.",
    },
  ],
  commonErrors: [
    {
      pattern: "h1 yopilmagan",
      explanation:
        "h1 tegi ochilgan, lekin yopuvchi </h1> yozilmagan, shuning uchun sarlavha ko‘rinmaydi.",
      fix: "Qator oxiriga </h1> qo‘sh va qayta ishga tushir.",
    },
  ],
  successMessage:
    "Ajoyib! Sen xaritada yurding va birinchi sahifangni ishga tushirding. Endi HTML qishlog‘i yo‘li ochildi.",
  reflectionQuestion:
    "“Ishga tushirish” bosilmaguncha preview nega yangilanmaydi? O‘z so‘zlaring bilan tushuntir.",
  rewardXp: 100,
  badgeId: "lager-tanishuv",
  nextLessonId: "html-01",
};
