# Agent uchun loyiha yo‘riqnomasi

## Maqsad
Web Ninja hujjatlari va keyingi kod ishlari prompt.md talablariga qat’iy mos
bo‘lishini ta’minlash.

## Qamrov
Ushbu yo‘riqnoma agentning rejalash, o‘zgartirish, tekshirish va hisobot berish
usulini belgilaydi; u mahsulot funksiyalarini kengaytirmaydi.

## Asosiy qarorlar
- Hujjat va foydalanuvchi matni o‘zbek lotin yozuvida bo‘ladi.
- `prompt.md` o‘zgartirilmaydi va talablar uchun asosiy manbadir.
- O‘quvchi kodi ishonchsiz input; preview xavfsizlik modelidan chetga chiqilmaydi.
- Kod yozilsa, TypeScript strict, typed protocol va manifestga asoslangan
  arxitektura saqlanadi.

## Talablar
Har bir yangi hujjat `Maqsad`, `Qamrov`, `Asosiy qarorlar`, `Talablar`,
`Misollar`, `Cheklovlar`, `Bog‘liq hujjatlar` bo‘limlariga ega bo‘ladi.
O‘zgarishdan keyin nomlar, 17 missiya, texnologiyalar, test va qabul mezonlari
bo‘yicha izchillik tekshiriladi.

## Misollar
Yangi feature avval tegishli `docs/` hujjatida qaror sifatida yoziladi, so‘ng
implementatsiya va test rejasi aniqlanadi. Noaniq talab “prompt.mdda mavjud
emas” deb belgilanadi, o‘zboshimchalik bilan MVPga qo‘shilmaydi.

## Cheklovlar
API kaliti, maxfiy ma’lumot, serverda `eval` yoki sandboxni zaiflashtiruvchi
`allow-same-origin` qo‘shilmaydi. Hujjat uchun application/game source code
yaratilmaydi.

## Bog‘liq hujjatlar
`docs/15_AI_DEVELOPMENT_RULES.md`, `docs/07_CODE_EXECUTION_SECURITY.md`,
`docs/13_ACCEPTANCE_CRITERIA.md` va `prompt.md`.
