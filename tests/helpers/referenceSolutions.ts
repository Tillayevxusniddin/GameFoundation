// docs/10_TESTING_STRATEGY.md — namunaviy (reference) yechimlar va ataylab
// xato kod bitta joyda saqlanadi; curriculum testlari ham, E2E qabul testi ham
// shu manbadan foydalanadi.

import type { DraftCode } from "../../src/types/progress";

// Namunaviy yechimlar: har biri tegishli manifest qoidalarini to'liq qondiradi.
export const REFERENCE_SOLUTIONS: Record<string, DraftCode> = {
  "intro-01": {
    html: "<h1>Salom, Web Ninja!</h1>\n<p>Bu mening birinchi sahifam.</p>\n",
    css: "h1 {\n  color: blue;\n}\n",
    javascript: "console.log('Tayyorman!');\n",
  },
  "html-01": {
    html:
      "<!doctype html>\n<html lang=\"uz\">\n  <head>\n" +
      '    <meta charset="UTF-8" />\n    <title>Salom</title>\n' +
      "  </head>\n  <body>\n    <h1>Salom</h1>\n  </body>\n</html>\n",
    css: "",
    javascript: "",
  },
  "html-02": {
    html:
      "<h1>Qishloq yangiliklari</h1>\n" +
      "<p>Bugun bozor ochildi.</p>\n" +
      "<p>Hamma xursand.</p>\n",
    css: "",
    javascript: "",
  },
  "html-03": {
    html:
      "<h1>Xarid ro‘yxati</h1>\n<p>Bozordan olinadigan narsalar:</p>\n" +
      "<ul>\n  <li>Non</li>\n  <li>Sut</li>\n  <li>Olma</li>\n</ul>\n",
    css: "",
    javascript: "",
  },
  "html-04": {
    html:
      "<h1>Qishloq e’loni</h1>\n" +
      '<img src="qishloq.png" alt="Qishloq manzarasi">\n' +
      '<a href="https://example.com">Bog‘</a>\n' +
      "<button>Bosing</button>\n",
    css: "",
    javascript: "",
  },
  "css-01": {
    html:
      '<h1 class="sarlavha">Salom, dunyo!</h1>\n' +
      '<p class="matn">Men CSS o‘rganyapman.</p>\n',
    css:
      "body {\n  background-color: #eeeeee;\n}\n" +
      "h1 {\n  color: blue;\n  font-size: 32px;\n}\n" +
      ".matn {\n  font-size: 20px;\n}\n",
    javascript: "",
  },
  "css-02": {
    html: '<div class="quti">Men bir qutiman</div>\n',
    css:
      ".quti {\n  background-color: lightblue;\n  padding: 20px;\n" +
      "  margin: 10px;\n  border: 2px solid black;\n  border-radius: 12px;\n}\n",
    javascript: "",
  },
  "css-03": {
    html:
      "<h1>Do‘kon</h1>\n" +
      '<div class="meva">Olma</div>\n' +
      '<div class="meva shirin">Banan</div>\n',
    css: ".meva {\n  color: green;\n}\n.shirin {\n  font-weight: bold;\n}\n",
    javascript: "",
  },
  "css-04": {
    html:
      '<div class="qator">\n  <div class="element">1</div>\n' +
      '  <div class="element">2</div>\n  <div class="element">3</div>\n</div>\n',
    css:
      ".qator {\n  display: flex;\n  justify-content: center;\n" +
      "  align-items: center;\n  gap: 10px;\n}\n",
    javascript: "",
  },
  "css-05": {
    html:
      '<div class="karta">\n  <h2 class="karta__nom">Web Ninja</h2>\n' +
      '  <p class="karta__izoh">Men kod yozishni o‘rganyapman.</p>\n</div>\n',
    css:
      ".karta {\n  background-color: #ffffff;\n  border: 2px solid #333333;\n" +
      "  border-radius: 16px;\n  padding: 20px;\n}\n" +
      ".karta__nom {\n  color: #1a3d7c;\n}\n",
    javascript: "",
  },
  "js-01": {
    html: '<h1 id="natija">?</h1>\n',
    css: "",
    javascript: 'const ism = "Web Ninja";\nconsole.log(ism);\n',
  },
  "js-02": {
    html: '<h1 id="sarlavha">Eski matn</h1>\n',
    css: "",
    javascript:
      'const sarlavha = document.querySelector("#sarlavha");\n' +
      "console.log(sarlavha.textContent);\n",
  },
  "js-03": {
    html: '<p id="xabar">Bu yerda eski xabar</p>\n',
    css: "",
    javascript:
      'const xabar = document.querySelector("#xabar");\n' +
      'xabar.textContent = "Salom, o‘quvchi!";\n' +
      "console.log(xabar.textContent);\n",
  },
  "js-04": {
    html: '<div id="karta" class="karta">Men kartaman</div>\n',
    css: ".karta {\n  background-color: #dddddd;\n}\n",
    javascript:
      'const karta = document.querySelector("#karta");\n' +
      'karta.classList.add("faol");\n' +
      "console.log(karta.className);\n",
  },
  "js-05": {
    html:
      '<h1 id="sarlavha">Salom!</h1>\n' + '<button id="tugma">Bosing</button>\n',
    css: "",
    javascript:
      'const tugma = document.querySelector("#tugma");\n' +
      'tugma.addEventListener("click", function () {\n' +
      '  tugma.textContent = "Bosildi!";\n' +
      "});\n",
  },
  "js-06": {
    html: '<button id="qosh">Hisob: 0</button>\n',
    css: "",
    javascript:
      "let hisob = 0;\n" +
      'const tugma = document.querySelector("#qosh");\n' +
      'tugma.addEventListener("click", function () {\n' +
      "  hisob = hisob + 1;\n" +
      "  if (hisob >= 3) {\n" +
      '    tugma.textContent = "Ajoyib!";\n' +
      "  } else {\n" +
      '    tugma.textContent = "Hisob: " + hisob;\n' +
      "  }\n});\n",
  },
  "project-01": {
    html:
      '<div class="karta">\n  <h1 class="karta__ism">Ismingiz</h1>\n' +
      '  <p class="karta__tavsif">Qisqa tavsif yozing.</p>\n' +
      '  <button id="sehr">Sehrni ko‘rsat</button>\n</div>\n',
    css:
      ".karta {\n  background-color: #ffffff;\n  border-radius: 16px;\n" +
      "  padding: 20px;\n}\n",
    javascript:
      'const tugma = document.querySelector("#sehr");\n' +
      'tugma.addEventListener("click", function () {\n' +
      '  if (tugma.textContent === "Sehrni ko‘rsat") {\n' +
      '    tugma.textContent = "Sehr ishga tushdi!";\n' +
      "  } else {\n" +
      '    tugma.textContent = "Sehrni ko‘rsat";\n' +
      "  }\n});\n",
  },
};

// Bu ikki missiyada boshlang'ich kod ataylab ishlaydigan "namuna" bo'ladi
// (intro-01 o'z preview-run qoidasiga ko'ra, html-01 esa to'liq shablon).
// Shu sababli ular uchun "ataylab xato kod" testi alohida o'tadi.
export const TEMPLATE_STARTERS: ReadonlySet<string> = new Set([
  "intro-01",
  "html-01",
]);

export const WRONG_CODE: DraftCode = {
  html: "<div></div>",
  css: "",
  javascript: "",
};
