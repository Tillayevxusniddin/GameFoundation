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
  saveDraft: "Draftni saqlash",
  runRequestsHint: "Ishga tushirish: Ctrl/Cmd+Enter",
  saveRequestsHint: "Draftni saqlash: Ctrl/Cmd+S",
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
  hintsUsedLabel: "Ishlatilgan maslahatlar",
  editorPaneLabel: "Muharrir",
  editorPlaceholder: "Kodni shu yerga yozing.",
  editorLanguageLabel: "Til",
  combinedEditorsLabel: "Barcha tillar",
  previewPaneLabel: "Natija va tekshiruv",
  previewTitle: "Preview",
  previewPlaceholder: "Preview natijasi shu yerda ko‘rinadi.",
  previewEmpty: "Kodni ishga tushirganingizdan so‘ng preview shu yerda ochiladi.",
  previewLoading: "Preview yuklanmoqda…",
  validatorPlaceholder: "Validator natijasi shu yerda ko‘rinadi.",
  validatorReportLabel: "Validator natijasi",
  validatorSuccess: "Barcha tekshiruvlar o‘tdi!",
  validatorFailedTitle: "Tekshiruv o‘tmadi",
  validatorIssuesLabel: "Xatolar",
  issueWhatLabel: "Nima bo‘ldi",
  issueWhyLabel: "Sabab",
  issueNextStepLabel: "Keyingi qadam",
  consoleLabel: "Console chiqishi",
  noConsoleOutput: "Console chiqishi yo‘q.",
  runtimeErrorsLabel: "Bajarilish xatolari",
  noRuntimeErrors: "Bajarilish xatosiz yakunlandi.",
  tabMission: "Shart",
  tabEditor: "Muharrir",
  tabPreview: "Natija",
  missionTabsLabel: "Missiya paneli bo‘limlari",

  // Muvaffaqiyat va refleksiya.
  successTitle: "Missiya muvaffaqiyatli bajarildi!",
  successXpMessage: "Tajriba balli",
  badgeEarned: "Yangi nishon qo‘lga kiritildi!",
  reflectionQuestionLabel: "Refleksiya savoli",
  reflectionPlaceholder: "Natijani o‘z so‘zlaring bilan izohlab yozing.",
  completionInfo:
    "Ishni bajarildi. Xaritaga qaytib keyingi missiyani ochishingiz mumkin.",
  nextMission: "Keyingi missiya:",
  runPending: "Ishga tushirilmoqda…",
  closeDialog: "Oynani yopish",

  // Qayta tiklash tasdiqi (modal).
  resetConfirmTitle: "Kodni qayta tiklash?",
  resetConfirmBody:
    "Muharrirdagi barcha o‘zgarishlar boshlang‘ich kod bilan almashtiriladi. Amalni bekor qilishingiz mumkin.",
  confirmReset: "Ha, qayta tiklash",
  cancel: "Bekor qilish",

  // Validator uch bosqichli xabarlari (what/why/nextStep).
  issueWhyStructural:
    "Sahifa tuzilmasida kerakli element mavjud emas yoki noto‘g‘ri joyda.",
  issueWhyValue:
    "Elementning matni yoki qiymati kutilgan shartga mos kelmadi.",
  issueWhyVisual:
    "Elementning ko‘rinishi (stili) kutilgan shartga mos kelmadi.",
  issueWhyBehavioral:
    "Amal bajarilgach bashorat qilingan o‘zgarish sodir bo‘lmadi.",
  issueWhyEducational:
    "O‘quvchi uchun kerakli tushuncha to‘liq ifodalanganini ko‘ra olmadik.",
  issueWhySandbox:
    "Kod xavfsizlik qoidalarini buzdi yoki sandbox chegarasidan oshib ketdi.",
  issueNextStructural:
    "Qadamlar ro‘yxatini qayta ko‘rib chiq, kerakli tegni qo‘sh va „Ishga tushirish“ni bos.",
  issueNextValue:
    "Elementning matni/atributini tekshirib, aynan kutilgan qiymatni qo‘y va qayta ishga tushir.",
  issueNextVisual:
    "CSS qoidasini o‘zgartirib, kutilgan ko‘rinishni ta’minla va qayta ishga tushir.",
  issueNextBehavioral:
    "Bosish/amal uchun kerakli JS tinglovchini bog‘la va qayta ishga tushir.",
  issueNextEducational:
    "Refleksiya savoliga javob yozib, o‘z so‘zlaring bilan izohla.",
  issueNextSandbox:
    "Kodni soddalashtirib, taqiqlangan amallardan foydalanmaslikka harakat qil va qayta ishga tushir.",

  // Xavfsizlik (sandbox runtime) xabarlari.
  sandboxBlockedEval:
    "Xavfsizlik: eval va Function konstruktori bu sandboxda taqiqlangan.",
  sandboxBlockedNetwork:
    "Xavfsizlik: tarmoq so‘rovlari (fetch/XHR/WebSocket) bu sandboxda taqiqlangan.",
  sandboxBlockedWorker:
    "Xavfsizlik: Worker yaratish bu sandboxda taqiqlangan.",
  sandboxBlockedStorage:
    "Xavfsizlik: localStorage/sessionStorage bu sandboxda taqiqlangan.",
  sandboxBlockedParent:
    "Xavfsizlik: ota-oyna (parent/top) bilan bog‘lanish bu sandboxda taqiqlangan.",
  sandboxBlockedOpen:
    "Xavfsizlik: yangi oyna ochish (window.open) bu sandboxda taqiqlangan.",

  // Limitlar.
  limitCodeTooLarge:
    "Kod juda katta. Jami kod 100 KB dan oshmasligi kerak.",
  limitTooManyRuns:
    "Juda tez ishga tushirding. Bir daqiqada ko‘pi bilan 20 marta ishga tushirish mumkin.",
  limitTimeout:
    "Bajarilish 2 soniyadan oshib ketdi: kod cheksiz tsikl yoki juda og‘ir amalni o‘z ichiga olgan bo‘lishi mumkin.",
  limitDomFlood:
    "DOM elementlar soni chegaradan oshdi — natija kesildi.",
  limitConsoleFlood: "Console chiqishi chegaradan oshdi — natija kesildi.",
  limitSandboxFlood:
    "Natija kesildi: DOM yoki console chiqishi juda katta bo‘ldi.",
  previewNotReady:
    "Preview hali chizilmagan. Qayta ishga tushirib ko‘ring.",

  // Sozlamalar paneli.
  settingsTitle: "Sozlamalar va progress",
  exportDescription:
    "Progressni JSON fayl qilib saqlab qo‘ying; faylni keyin qayta yuklash mumkin.",
  importDescription:
    "Avval eksport qilingan JSON faylni tanlab yoki nusxasini shu yerga qo‘yib, progressni tiklang.",
  progressJsonLabel: "Progress JSON nusxasi",
  exportButton: "JSON faylni yuklab olish",
  importButton: "JSON dan tiklash",
  importTextLabel: "Tiklanadigan JSON matni",
  importFileButton: "JSON faylni tanlash",
  importSuccess: "Progress muvaffaqiyatli tiklandi.",
  importErrorTitle: "Progressni tiklab bo‘lmadi",
  importErrorWhat:
    "Kiritilgan JSON matni o‘qilmadi yoki progress sxemasiga mos kelmadi.",
  importErrorWhy:
    "Fayl buzilgan yoki bo‘sh bo‘lishi, yoxud kutilgan maydonlar (schemaVersion, lessons) yetishmasligi mumkin.",
  importErrorNextStep:
    "To‘g‘ri eksport qilingan JSON faylni qayta tanlang yoki uning nusxasini to‘liq joylashtiring.",

  // Sozlamalar: ism, audio, harakat, tozalash.
  playerNameLabel: "Ismingiz (majburiy emas)",
  playerNamePlaceholder: "Ismingizni yozing",
  playerNameSave: "Ismni saqlash",
  playerNameSkip: "Keyinroq",
  welcomeTitle: "Web Ninja lageriga xush kelibsiz!",
  welcomeBody:
    "Xohlasangiz ismingizni kiritasiz. Ism faqat shu qurilmada saqlanadi va hech qayerga yuborilmaydi.",
  settingsNameSection: "Profil",
  settingsAccessibilitySection: "Qulaylik",
  audioToggleLabel: "Audio signallarni yoqish",
  audioToggleDescription:
    "Ovoz yoqilmagan. Yoqilsa, natija signallari qisqa tovush bilan beriladi va ekranda matn bilan takrorlanadi.",
  reducedMotionToggleLabel: "Harakatni kamaytirish",
  reducedMotionToggleDescription:
    "Bezak animatsiyalarini o‘chiradi. Brauzer sozlamasi (prefers-reduced-motion) bilan birga ishlaydi.",
  resetAllLabel: "Barcha progressni tozalash",
  resetAllDescription:
    "Barcha missiyalar, XP va nishonlar o‘chiriladi. Ism ham tozalanadi.",
  resetAllTitle: "Barcha progressni tozalash?",
  resetAllBody:
    "Barcha missiya natijalari, XP va nishonlar butunlay o‘chiriladi. Bu amalni ortga qaytarib bo‘lmaydi.",
  confirmResetAll: "Ha, hammasini tozalash",
  progressResetDone: "Barcha progress tozalandi.",

  // Kichik ekran ogohlantirishi.
  smallScreenNoticeTitle: "Kattaroq ekran tavsiya etiladi",
  smallScreenNoticeBody:
    "Eng qulay tajriba uchun tablet yoki kompyuterdan foydalaning. Kichik ekranda ham barcha kontent saqlanadi.",
  smallScreenNoticeDismiss: "Tushundim, yopish",

  // Audio signal matnlari (aria-live takrori).
  soundMissionSuccess: "Missiya bajarildi.",
  soundValidationError: "Tekshiruvda xato aniqlandi.",
  soundHintUsed: "Maslahat ochildi.",
  soundBadgeUnlocked: "Yangi nishon qo‘lga kiritildi.",

  // Resurs (asset) fallback.
  assetFallback:
    "Resurs yuklanmadi. Vaqtinchalik o‘rinbosar ko‘rsatildi, kontent yo‘qolmaydi.",
  assetUnknown: "Noma’lum resurs identifikatori.",

  // Nishonlar nomlari.
  badgeLagerTanishuv: "Lager bilan tanishuv",
  badgeHtmlBoshlovchi: "HTML boshlovchi",
  badgeCssBogbon: "CSS bog‘bon",
  badgeJsNinja: "JavaScript ninja",
  badgeWebNinja: "Web Ninja",
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
  resetConfirmMessage: (missionTitle: string): string =>
    `„${missionTitle}“ missiyasining boshlang‘ich kodiga qaytishni tasdiqlaysizmi?`,
  nextMissionButton: (title: string): string => `Keyingi missiya: ${title}`,
} as const;