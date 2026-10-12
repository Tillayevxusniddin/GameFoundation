// docs/04_LEVEL_DESIGN.md — project-01: uch texnologiyali mini-loyiha.
// docs/00_PROJECT_VISION.md — "Sehrli profil kartasi" yakuniy loyihasi.
// project-01 tugagach "web-ninja" nishoni beriladi.

import type { LessonManifest } from "../../types/content";

export const project01: LessonManifest = {
  id: "project-01",
  moduleId: "project",
  title: "Yakuniy maydon: Sehrli profil kartasi",
  order: 17,
  difficulty: 3,
  prerequisites: ["js-06"],
  learningObjectives: [
    "HTML bilan karta mazmunini tuzish",
    "CSS bilan kartaga chiroyli ko‘rinish berish",
    "JavaScript bilan tugma orqali interaksiya qo‘shish",
  ],
  story:
    "Sen Web Ninja maktabini tamomlayapsan. Yakuniy sinov — o‘z “Sehrli profil kartangizni” yasash. Unda isming, qisqa tavsif va sehrni ishga tushiruvchi tugma bo‘lishi kerak.",
  explanation:
    "Bu loyihada uch texnologiya birlashadi: HTML karta mazmunini (ism, tavsif, tugma) beradi, CSS unga chegara, yumaloq burchak va fon beradi, JavaScript esa tugma bosilganda kartani “jonlantiradi”.",
  starterCode: {
    html:
      '<div class="karta">\n' +
      '  <h1 class="karta__ism">Ismingiz</h1>\n' +
      '  <p class="karta__tavsif">Qisqa tavsif yozing.</p>\n' +
      '  <button id="sehr">Sehrni ko‘rsat</button>\n' +
      "</div>\n",
    css: ".karta {\n  width: 280px;\n}\n",
    javascript: "// tugma bosilganda kartani jonlantiring\n",
  },
  steps: [
    { id: "html", text: "Kartaga ismingiz va tavsifingizni yozing." },
    { id: "css", text: "CSS da `.karta`ga fon, chegara va `border-radius: 16px;` bering." },
    { id: "js", text: "Tugmaga click qo‘shib, bosilganda uning matnini o‘zgartir." },
  ],
  hints: [
    "Kartani sahifadan ajratish uchun qaysi CSS xususiyatlari kerak edi?",
    "Fon `background-color`, chegra `border`, burchak `border-radius`; interaksiya uchun `addEventListener`.",
    'Namuna:\nconst tugma = document.querySelector("#sehr");\ntugma.addEventListener("click", function () {\n  if (tugma.textContent === "Sehrni ko‘rsat") {\n    tugma.textContent = "Sehr ishga tushdi!";\n  } else {\n    tugma.textContent = "Sehrni ko‘rsat";\n  }\n});',
  ],
  validation: [
    {
      id: "project-ism",
      type: "structural",
      target: ".karta__ism",
      messageUz:
        "Karta ismi topilmadi. `class=\"karta__ism\"` bilan sarlavha qo‘sh.",
    },
    {
      id: "project-fon",
      type: "visual",
      target: ".karta@background-color=#ffffff",
      messageUz:
        "Karta fonisiz qolgan. `.karta` ga `background-color: #ffffff;` qo‘sh.",
    },
    {
      id: "project-radius",
      type: "visual",
      target: ".karta@border-radius=16px",
      messageUz:
        "Karta burchaklari yumaloq emas. `border-radius: 16px;` qo‘sh.",
    },
    {
      id: "project-click",
      type: "behavioral",
      target: "click:#sehr",
      messageUz:
        "Tugma bosilganda karta jonlanmayapti. `addEventListener(\"click\", ...)` qo‘shib, `textContent`ni o‘zgartiring.",
    },
  ],
  commonErrors: [
    {
      pattern: "class nomi mos emas",
      explanation:
        "HTML dagi class nomi CSS dagi selektorga mos kelmaydi.",
      fix: "HTML va CSS da bir xil class nomini ishlat, masalan `karta__ism`.",
    },
    {
      pattern: "click da funksiya darhol ishlaydi",
      explanation:
        "`addEventListener`ga funksiya emas, uning natijasi berilgan.",
      fix: "`function () { ... }` yoki `() => { ... }` ko‘rinishida funksiya bering.",
    },
  ],
  successMessage:
    "Tabriklaymiz! Sen HTML, CSS va JavaScriptni birlashtirib haqiqiy mini-loyiha yasadingiz — endi sen Web Ninjasan!",
  reflectionQuestion:
    "Loyihada HTML, CSS va JavaScript qanday vazifani bo‘lib oldi?",
  rewardXp: 150,
  badgeId: "web-ninja",
};
