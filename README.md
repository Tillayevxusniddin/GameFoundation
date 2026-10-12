# Web Ninja

## Maqsad
Web Ninja 10–16 yoshdagi o‘quvchilarga HTML, CSS va JavaScriptni o‘zbekcha,
qisqa amaliy missiyalar va 2D sarguzasht orqali o‘rgatadigan MVP mahsulotidir.

## Qamrov
MVP 17 ta missiya, Phaser 3 xaritasi, React interfeysi, CodeMirror 6 muharriri,
sandboxed iframe previewi, avtomatik validator, maslahatlar va lokal progressni
qamraydi. Server profili, multiplayer, reklama va mobil native ilova qamrovdan
tashqarida.

## Asosiy qarorlar
- Texnologiya: TypeScript, Vite, Phaser 3, React va CodeMirror 6.
- O‘quvchi kodi faqat `sandbox="allow-scripts"` iframe ichida bajariladi.
- Kontent manifestlarda, o‘yin sahnasi Phaserda, overlay UI Reactda bo‘ladi.
- Progress lokal repository orqali saqlanadi.

## Talablar
Node.js versiyasi loyiha konfiguratsiyasida pin qilinadi. Ishga tushirish:

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

## Misollar
O‘quvchi `h1` qo‘shadi, previewni ishga tushiradi, validator natijasini oladi,
maslahatdan foydalanadi va muvaffaqiyatdan keyin keyingi missiyani ochadi.

## Cheklovlar
MVP backend talab qilmaydi; foydalanuvchi kodi qurilmadan tashqariga yuborilmaydi.
768 px dan kichik ekranlarda cheklangan qurilma xabari ko‘rsatilishi mumkin.

## Bog‘liq hujjatlar
To‘liq hujjatlar `docs/README.md` orqali tartiblangan. Asosiy manba:
`prompt.md`; xavfsizlik `docs/07_CODE_EXECUTION_SECURITY.md`da bayon qilingan.
