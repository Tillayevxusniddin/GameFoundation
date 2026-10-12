// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — tabiiy o'zbek lotin matnlari.
// Komponent ichiga qattiq matn yozilmaydi; shu lug'at ishlatiladi.
// Kod tokenlari (const, function, tag nomlari) tarjima qilinmaydi.

export const uz = {
  appTitle: "Web Ninja",
  appSubtitle: "Dasturlashni o‘yin orqali o‘rganamiz",
  alphabetCheck: "O‘zbek lotin harflari tekshiruvi: o‘, g‘, O‘, G‘",
  foundationRunning: "Foundation skeleton ishlamoqda",
  startMission: "Missiyani boshlash",
  runCode: "Ishga tushirish",
  checkCode: "Tekshirish",
  resetCode: "Qayta tiklash",
  missionLocked: "Qulfli: oldingi missiyani yakunlang",
  missionAvailable: "Mavjud missiya",
  missionCompleted: "Missiya bajarildi",
  xpLabel: "Tajriba balli",
  hintLevel1: "Maslahat 1-daraja",
  hintLevel2: "Maslahat 2-daraja",
  hintLevel3: "Maslahat 3-daraja",
  storageSaveFailed:
    "Qurilmada saqlab bo‘lmadi. Brauzer xotirasi to‘lgan yoki ruxsat berilmagan bo‘lishi mumkin.",
  storageUnavailable:
    "Bu brauzerda saqlash mavjud emas. Kod bajarishni davom ettirish mumkin, lekin progress saqlanmaydi.",
  progressCorrupted:
    "Saqlangan ma’lumot buzilgan bo‘lib chiqdi, shuning uchun boshlang‘ich holat tiklandi. Oldingi progressni tiklab bo‘lmadi.",
  progressImported: "Progress muvaffaqiyatli yuklandi",
  progressImportInvalid:
    "Yuklangan fayl yaroqsiz: progress tiklanmadi, joriy holat saqlanib qoldi",
  limitedDevice:
    "Bu qurilma ekranida o‘yin cheklangan ko‘rinishda ishlaydi, lekin kontent yo‘qolmaydi",
} as const;

export type UzKey = keyof typeof uz;

export function t(key: UzKey): string {
  return uz[key];
}
