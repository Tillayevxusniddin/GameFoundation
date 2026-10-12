// docs/11_ACCESSIBILITY_AND_LOCALIZATION.md — tabiiy o'zbek lotin matnlari.
// Komponent ichiga qattiq matn yozilmaydi; shu lug'at ishlatiladi.
// Kod tokenlari (const, function, tag nomlari) tarjima qilinmaydi.

export const uz = {
  appTitle: "Web Ninja",
  appSubtitle: "Dasturlashni o‘yin orqali o‘rganamiz",
  alphabetCheck: "O‘zbek lotin harflari tekshiruvi: o‘, g‘, O‘, G‘",
  foundationRunning: "Foundation skeleton ishlamoqda",
  startMission: "Missiyani boshlash",
  startCoding: "Kodlashni boshlash",
  runCode: "Ishga tushirish",
  checkCode: "Tekshirish",
  resetCode: "Qayta tiklash",
  missionLocked: "Qulfli: oldingi missiyani yakunlang",
  missionAvailable: "Mavjud missiya",
  missionCompleted: "Missiya bajarildi",
  xpLabel: "Tajriba balli",
  xpShort: "XP",
  badgeLabel: "Nishonlar",
  badgeShort: "nishon",
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

  // Yuqori navigatsiya.
  navPrimaryLabel: "Asosiy navigatsiya",
  backToMap: "Xaritaga qaytish",
  openSettings: "Sozlamalar",
  exportProgress: "Progressni eksport qilish",
  importProgress: "Progressni import qilish",
  importFileLabel: "Progress JSON faylini tanlash",
  closeSettings: "Sozlamalarni yopish",

  // Xarita rejimi.
  mapViewLabel: "Web Ninja xaritasi",
  mapCanvasLabel: "O‘yin xaritasi",
  mapLoading: "Xarita yuklanmoqda…",
  mapUnavailable:
    "Xaritani chizib bo‘lmadi, shuning uchun missiya ro‘yxatidan tanlang.",
  onScreenControlsLabel: "Ekrandagi harakat tugmalari",
  moveUp: "Yuqoriga yur",
  moveDown: "Pastga yur",
  moveLeft: "Chapga yur",
  moveRight: "O‘ngga yur",
  missionListLabel: "Missiya nuqtalari ro‘yxati",
  regionLabel: "Hudud",
  selectedMissionLabel: "Tanlangan missiya",
  noMissionSelected:
    "Hali missiya tanlanmagan. Xaritada nuqtaga yaqinlashing yoki ro‘yxatdan tanlang.",
  missionPointPrefix: "Missiya nuqtasi",
  prerequisiteLabel: "Old shart",
  noPrerequisite: "Old shart yo‘q",

  // Missiya rejimi.
  missionBriefLabel: "Missiya sharti",
  missionStoryLabel: "Hikoya",
  missionObjectiveLabel: "O‘quv maqsadi",
  missionExplanationLabel: "Tushuntirish",
  missionStepsLabel: "Qadamlar",
  missionHintsLabel: "Uch darajali maslahat",
  hintReveal: "Maslahatni ko‘rsatish",
  hintHide: "Maslahatni yopish",
  hintCostNote:
    "Maslahatdan foydalansang, mukofot 100 XP o‘rniga 80 XP bo‘ladi.",
  editorPaneLabel: "Muharrir",
  editorPlaceholder:
    "Kod muharriri 3-bosqichda CodeMirror bilan ulanadi. Hozircha bu yerda mashq qilishingiz mumkin.",
  previewPaneLabel: "Natija va tekshiruv",
  previewPlaceholder: "Preview natijasi shu yerda ko‘rinadi.",
  validatorPlaceholder: "Validator natijasi shu yerda ko‘rinadi.",
  tabMission: "Shart",
  tabEditor: "Muharrir",
  tabPreview: "Natija",
  missionTabsLabel: "Missiya paneli bo‘limlari",

  // Sozlamalar paneli.
  settingsTitle: "Sozlamalar",
  exportDescription:
    "Progressni JSON fayl qilib saqlab qo‘ying; faylni keyin qayta yuklash mumkin.",
  importDescription:
    "Avval eksport qilingan JSON faylni tanlab, progressni tiklang.",
  progressJsonLabel: "Progress JSON nusxasi",
} as const;

export type UzKey = keyof typeof uz;

export function t(key: UzKey): string {
  return uz[key];
}

// Parametrli (dinamik) xabarlar: fayl va maydon nomini o‘qiladigan matnga aylantiradi.
export const uzMessages = {
  lockedMission: (prerequisiteTitle: string): string =>
    `Qulfli: avval ${prerequisiteTitle} missiyasini yakunlang`,
  lockedMissionNoTitle: (prerequisiteId: string): string =>
    `Qulfli: avval ${prerequisiteId} missiyasini yakunlang`,
  statusLabel: (
    status: "locked" | "available" | "in_progress" | "completed",
  ): string => {
    switch (status) {
      case "locked":
        return "Qulfli";
      case "available":
        return "Mavjud";
      case "in_progress":
        return "Davom etmoqda";
      case "completed":
        return "Bajarildi";
    }
  },
  missionButtonLabel: (
    title: string,
    statusLabel: string,
    order: number,
  ): string => `${order}-missiya: ${title}. Holati: ${statusLabel}`,
  missionRegionHeading: (regionTitle: string): string =>
    `Hudud: ${regionTitle}`,
} as const;
