/** Images */
// import governate1 from "../../assets/images/products/img-2.png";

// Categories:
const ElectionCategoryOptions = [
  //   مجلس الأمة
  {
    id: 1,
    name: "مجلس الأمة",
    subCategory: [
      {
        id: 1,
        name: "الدائرة الأولى",
      },
      {
        id: 2,
        name: "الدائرة الثانية",
      },
      {
        id: 3,
        name: "الدائرة الثالثة",
      },
      {
        id: 4,
        name: "الدائرة الرابعة",
      },
      {
        id: 5,
        name: "الدائرة الخامسة",
      },
    ],
  },

  //   المجلس البلدي
  {
    id: 2,
    name: "المجلس البلدي",
    subCategory: [
      {
        id: 1,
        name: "الدائرة الأولى",
      },
      {
        id: 2,
        name: "الدائرة الثانية",
      },
      {
        id: 3,
        name: "الدائرة الثالثة",
      },
      {
        id: 4,
        name: "الدائرة الرابعة",
      },
      {
        id: 5,
        name: "الدائرة الخامسة",
      },
      {
        id: 6,
        name: "الدائرة السادسة",
      },
      {
        id: 7,
        name: "الدائرة السابعة",
      },
      {
        id: 8,
        name: "الدائرة الثامنة",
      },
      {
        id: 9,
        name: "الدائرة التاسعة",
      },
      {
        id: 10,
        name: "الدائرة العاشرة",
      },
    ],
  },

  //   الجمعيات التعاونية
  {
    id: 3,
    name: "الجمعيات التعاونية",
    subCategory: [
      // Al-Ahmadi Governate
      { id: 1, name: "الاحمدي و الصباحية", governate: 2 },
      { id: 3, name: "الظهر", governate: 2 },
      { id: 4, name: "الفحيحيل", governate: 2 },
      { id: 5, name: "الفنطاس", governate: 2 },
      { id: 6, name: "ضاحية جابر العلي", governate: 2 },
      { id: 7, name: "على صباح السالم", governate: 2 },
      { id: 8, name: "هديه", governate: 2 },

      // Al-Jahra Governate
      { id: 9, name: "الجهراء", governate: 4 },
      { id: 10, name: "الصليبية", governate: 4 },
      { id: 11, name: "النسيم", governate: 4 },

      // Al-Assima Governate
      { id: 12, name: "الخالدية", governate: 1 },
      { id: 13, name: "الروضة وحولي", governate: 1 },
      { id: 14, name: "الشامية والشويخ", governate: 1 },
      { id: 15, name: "الشرق", governate: 1 },
      { id: 16, name: "الصليبخات والدوحة", governate: 1 },
      { id: 17, name: "الصوابر", governate: 1 },
      { id: 18, name: "العبدلي الزراعية", governate: 1 },
      { id: 19, name: "النزهة", governate: 1 },
      { id: 20, name: "الدعية", governate: 1 },
      { id: 21, name: "الشويخ", governate: 1 },
      { id: 22, name: "العديلية", governate: 1 },
      { id: 23, name: "الفيحاء", governate: 1 },
      { id: 24, name: "القادسية", governate: 1 },
      { id: 25, name: "اليرموك", governate: 1 },
      { id: 26, name: "قرطبة", governate: 1 },

      // Al-Farwaniya Governate
      { id: 27, name: "العارضية", governate: 3 },
      { id: 28, name: "العمرية والرابية", governate: 3 },
      { id: 29, name: "الاندلس", governate: 3 },
      { id: 30, name: "الفروانية", governate: 3 },
      { id: 31, name: "جليب الشيوخ", governate: 3 },
      { id: 32, name: "خيطان", governate: 3 },

      // Hawalli Governate
      { id: 33, name: "الجابرية", governate: 5 },
      { id: 34, name: "الرميثية", governate: 5 },
      { id: 35, name: "السالمية", governate: 5 },
      { id: 36, name: "الشعب", governate: 5 },
      { id: 37, name: "بيان", governate: 5 },
      { id: 38, name: "سلوى", governate: 5 },
      { id: 39, name: "مشرف", governate: 5 },

      // Mubarak Al-Kaber Governate
      { id: 40, name: "صباح السالم", governate: 6 },
    ],
  },

  //   الأندية الرياضية
  {
    id: 4,
    name: "الأندية الرياضية",
    subCategory: [
      // Al-Assima Governate
      { id: 1, name: "الكويت", governate: 1, area: "كيفان", details: "" },
      { id: 2, name: "العربي", governate: 1, area: "المنصورية", details: "" },
      { id: 3, name: "كاظمة", governate: 1, area: "العديلية", details: "" },
      {
        id: 4,
        name: "الصليبيخات",
        governate: 1,
        area: "الصليبيخات",
        details: "",
      },

      // Hawalli Governate
      {
        id: 5,
        name: "القادسية",
        governate: 5,
        area: "حولي",
        details: "الاسم القديم الجزيرة - 1960",
      },
      {
        id: 6,
        name: "اليرموك",
        governate: 5,
        area: "مشرف",
        details: "كان في السابق في جزيرة فيلكا",
      },
      { id: 7, name: "السالمية", governate: 5, area: "السالمية", details: "" },

      // Al-Farwaniya Governate
      { id: 8, name: "التضامن", governate: 3, area: "الفروانية", details: "" },
      {
        id: 9,
        name: "النصر",
        governate: 3,
        area: "العارضية",
        details: "الصناعية",
      },
      {
        id: 10,
        name: "خيطان",
        governate: "ابرق الفروانية",
        area: "خيطان",
        details: "",
      },

      // Al-Ahmadi Governate
      {
        id: 11,
        name: "الشباب",
        governate: 2,
        area: "الأحمدي",
        details: "المنطقة الوسطى",
      },
      { id: 12, name: "الساحل", governate: 2, area: "أبو حليفة", details: "" },
      { id: 13, name: "الفحيحيل", governate: 2, area: "الفحيحيل", details: "" },

      // Al-Jahra Governate
      {
        id: 14,
        name: "الجهراء",
        governate: 4,
        area: "الجهراء",
        details: "منطقة القصر - الاسم القديم لل الشهداء",
      },

      // Mubarak Al Kabeer Governate
      {
        id: 15,
        name: "القرين",
        governate: 6,
        area: "العدان",
        details: "موقتا",
      },
      { id: 16, name: "برقان", governate: 6, area: "برقان", details: "" },
    ],
  },

  //   النقابات
  {
    id: 5,
    name: "النقابات",
    subCategory: [
      { id: 1, name: "وزارة الصحة" },
      { id: 2, name: "بلدية الكويت" },
      { id: 3, name: "وزارة التربية" },
      { id: 4, name: "وزارة الاشغال العامة" },
      { id: 5, name: "الإدارة العامة للجمارك" },
      { id: 6, name: "وزارة الكهرباء والماء" },
      { id: 7, name: "وزارة الاعلام" },
      { id: 8, name: "وزارة الشؤون الاجتماعية والعمل" },
      { id: 9, name: "وزارة المواصلات" },
      { id: 10, name: "شركة نفط الكويت" },
      { id: 11, name: "شركة البترول الوطنية الكويتية" },
      { id: 12, name: "عمال شركة صناعة الكيماويات البترولية" },
      { id: 13, name: "شركة إيكويت للبتروكيماويات" },
      { id: 14, name: "شركة ناقلات نفط الكويت" },
      { id: 15, name: "الشركة الكويتية لنفط الخليج" },
    ],
  },
];

const kuwaitGovernates = [
  {
    id: 1,
    name: "محافظة العاصمة",
  },
  {
    id: 2,
    name: "محافظة الأحمدي",
  },
  {
    id: 3,
    name: "محافظة الفروانية",
  },
  {
    id: 4,
    name: "محافظة الجهراء",
  },

  {
    id: 5,
    name: "محافظة حولي",
  },

  {
    id: 6,
    name: "محافظة مبارك الكبير",
  },
];
// kuwaitGovernates.sort((a, b) => a.name.localeCompare(b.name, "ar"));
// kuwaitGovernates.forEach((governate) => {
//   governate.subCategory = subCategory.filter(
//     (subCategory) => subCategory.governate === governate.id
//   );
// });

// You can now access the subCategory for each governate in the kuwaitGovernates array
const kuwaitAreas = [
  // Assima  Governorate
  { id: 1, name: "مدينة الكويت", parent_id: 1, Disabled: 0 },
  { id: 2, name: "دسمان", parent_id: 1, Disabled: 0 },
  { id: 3, name: "الشرق", parent_id: 1, Disabled: 0 },
  { id: 4, name: "الصوابر", parent_id: 1, Disabled: 0 },
  { id: 5, name: "المرقاب", parent_id: 1, Disabled: 0 },
  { id: 6, name: "القبلة", parent_id: 1, Disabled: 0 },
  { id: 7, name: "الصالحية", parent_id: 1, Disabled: 0 },
  { id: 8, name: "الوطية", parent_id: 1, Disabled: 0 },
  { id: 9, name: "بنيد القار", parent_id: 1, Disabled: 0 },
  { id: 10, name: "كيفان", parent_id: 1, Disabled: 0 },
  { id: 11, name: "الدوحة", parent_id: 1, Disabled: 0 },
  { id: 12, name: "الدسمة", parent_id: 1, Disabled: 0 },
  { id: 13, name: "الدعية", parent_id: 1, Disabled: 0 },
  { id: 14, name: "المنصورية", parent_id: 1, Disabled: 0 },
  {
    id: 15,
    name: "ضاحية عبد الله السالم",
    parent_id: 1,
    Circle: 1,
    Disabled: 0,
  },
  { id: 16, name: "النزهة", parent_id: 1, Disabled: 0 },
  { id: 17, name: "الفيحاء", parent_id: 1, Disabled: 0 },
  { id: 18, name: "الشامية", parent_id: 1, Disabled: 0 },
  { id: 19, name: "الروضة", parent_id: 1, Disabled: 0 },
  { id: 20, name: "العديلية", parent_id: 1, Disabled: 0 },
  { id: 21, name: "الخالدية", parent_id: 1, Disabled: 0 },
  { id: 22, name: "القادسية", parent_id: 1, Disabled: 0 },
  { id: 23, name: "قرطبة", parent_id: 1, Disabled: 0 },
  { id: 24, name: "السرة", parent_id: 1, Disabled: 0 },
  { id: 25, name: "اليرموك", parent_id: 1, Disabled: 0 },
  { id: 26, name: "الشويخ", parent_id: 1, Disabled: 0 },
  { id: 27, name: "الري", parent_id: 1, Disabled: 0 },
  { id: 28, name: "غرناطة", parent_id: 1, Disabled: 0 },
  {
    id: 29,
    name: "الصليبيخات والدوحة",
    parent_id: 1,
    Circle: 1,
    Disabled: 0,
  },
  { id: 30, name: "النهضة", parent_id: 1, Disabled: 0 },
  {
    id: 31,
    name: "مدينة جابر الأحمد",
    parent_id: 1,
    Circle: 1,
    Disabled: 0,
  },
  { id: 32, name: "القيروان", parent_id: 1, Disabled: 0 },
  {
    id: 33,
    name: "شمال غرب الصليبيخات",
    parent_id: 1,
    Circle: 1,
    Disabled: 0,
  },
  { id: 34, name: "جزيرة فيلكا", parent_id: 1, Disabled: 0 },
  { id: 35, name: "جزيرة كبر", parent_id: 1, Disabled: 0 },
  { id: 36, name: "جزيرة عوهة", parent_id: 1, Disabled: 0 },
  { id: 37, name: "جزيرة أم المرادم", parent_id: 1, Disabled: 0 },
  { id: 38, name: "جزيرة مسكان", parent_id: 1, Disabled: 0 },
  { id: 39, name: "جزيرة قاروه", parent_id: 1, Disabled: 0 },
  { id: 40, name: "جزيرة أم النمل", parent_id: 1, Disabled: 0 },
  {
    id: 41,
    name: "جزيرة الشويخ (عكاز أو القرين سابقًا)",
    parent_id: 1,
    Circle: 1,
    Disabled: 0,
  },

  // Ahmadi Governorate
  { id: 50, name: "أبو حليفة", parent_id: 2, Disabled: 0 },
  { id: 51, name: "الأحمدي", parent_id: 2, Disabled: 0 },
  { id: 52, name: "العقيلة", parent_id: 2, Disabled: 0 },
  { id: 53, name: "الفحيحيل", parent_id: 2, Disabled: 0 },
  { id: 54, name: "الفنطاس", parent_id: 2, Disabled: 0 },
  { id: 55, name: "المقوع", parent_id: 2, Disabled: 0 },
  { id: 56, name: "المهبولة", parent_id: 2, Disabled: 0 },
  { id: 57, name: "المنقف", parent_id: 2, Disabled: 0 },
  { id: 58, name: "النويصيب", parent_id: 2, Disabled: 0 },
  { id: 59, name: "الهدية", parent_id: 2, Disabled: 0 },
  { id: 60, name: "الوفرة", parent_id: 2, Disabled: 0 },
  { id: 61, name: "الوفرة الزراعية", parent_id: 2, Disabled: 0 },
  { id: 62, name: "الرقة", parent_id: 2, Disabled: 0 },
  { id: 63, name: "الزور", parent_id: 2, Disabled: 0 },
  { id: 64, name: "الضباعية", parent_id: 2, Disabled: 0 },
  { id: 65, name: "الصباحية", parent_id: 2, Disabled: 0 },
  { id: 66, name: "الشعيبة", parent_id: 2, Disabled: 0 },
  { id: 67, name: "الظهر", parent_id: 2, Disabled: 0 },
  { id: 68, name: "الخيران", parent_id: 2, Disabled: 0 },
  { id: 69, name: "الجليعة", parent_id: 2, Disabled: 0 },
  { id: 70, name: "بنيدر", parent_id: 2, Disabled: 0 },
  { id: 71, name: "ضاحية جابر العلي", parent_id: 2, Disabled: 0 },
  { id: 72, name: "ضاحية فهد الأحمد", parent_id: 2, Disabled: 0 },
  {
    id: 73,
    name: "ضاحية علي صباح السالم أم الهيمان سابقاً",
    parent_id: 2,
    Circle: 2,
    Disabled: 0,
  },
  {
    id: 74,
    name: "مدينة صباح الأحمد",
    parent_id: 2,
    Circle: 2,
    Disabled: 0,
  },
  { id: 75, name: "مدينة الخيران", parent_id: 2, Disabled: 0 },
  {
    id: 76,
    name: "مدينة صباح الأحمد البحرية",
    parent_id: 2,
    Circle: 2,
    Disabled: 0,
  },
  { id: 77, name: "ميناء عبد الله", parent_id: 2, Disabled: 0 },
  { id: 78, name: "واره", parent_id: 2, Disabled: 0 },

  // Faewaniya Governorate
  { id: 100, name: "أبرق خيطان", parent_id: 3, Disabled: 0 },
  { id: 101, name: "الأندلس", parent_id: 3, Disabled: 0 },
  { id: 102, name: "اشبيلية", parent_id: 3, Disabled: 0 },
  { id: 103, name: "العارضية", parent_id: 3, Disabled: 0 },
  {
    id: 104,
    name: "العارضية الصناعية",
    parent_id: 3,
    Circle: 3,
    Disabled: 0,
  },
  { id: 105, name: "العباسية", parent_id: 3, Disabled: 0 },
  { id: 106, name: "العمرية", parent_id: 3, Disabled: 0 },
  { id: 107, name: "الفردوس", parent_id: 3, Disabled: 0 },
  { id: 108, name: "الفروانية", parent_id: 3, Disabled: 0 },
  { id: 109, name: "الحساوي", parent_id: 3, Disabled: 0 },
  { id: 110, name: "الرابية", parent_id: 3, Disabled: 0 },
  { id: 111, name: "الرحاب", parent_id: 3, Disabled: 0 },
  { id: 112, name: "الرقعي", parent_id: 3, Disabled: 0 },
  { id: 113, name: "الري الصناعية", parent_id: 3, Disabled: 0 },
  { id: 114, name: "الشدادية", parent_id: 3, Disabled: 0 },
  { id: 115, name: "جليب الشيوخ", parent_id: 3, Disabled: 0 },
  { id: 116, name: "خيطان", parent_id: 3, Disabled: 0 },
  { id: 117, name: "خيطان الجديدة", parent_id: 3, Disabled: 0 },
  { id: 118, name: "الضجيج", parent_id: 3, Disabled: 0 },
  {
    id: 119,
    name: "ضاحية عبد الله المبارك",
    parent_id: 3,
    Circle: 3,
    Disabled: 0,
  },
  {
    id: 120,
    name: "ضاحية صباح الناصر",
    parent_id: 3,
    Circle: 3,
    Disabled: 0,
  },

  // Jahra Governorate
  { id: 150, name: "الصليبية", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 151, name: "أمغرة", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 152, name: "النعيم", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 153, name: "القصر", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 154, name: "الواحة", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 155, name: "تيماء", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 156, name: "النسيم", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 157, name: "العيون", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 158, name: "القيصرية", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 1 % 9, name: "العبدلي", parent_id: 4, circle_id: 3, disabled: 0 },
  {
    id: 160,
    name: "الجهراء القديمة",
    parent_id: 4,
    circle_id: 3,
    disabled: 0,
  },
  {
    id: 161,
    name: "الجهراء الجديدة",
    parent_id: 4,
    circle_id: 3,
    disabled: 0,
  },
  { id: 162, name: "كاظمة", parent_id: 4, circle_id: 3, disabled: 0 },
  {
    id: 163,
    name: "مدينة سعد العبد الله",
    parent_id: 4,
    circle_id: 3,
    disabled: 0,
  },
  { id: 164, name: "السالمي", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 165, name: "المطلاع", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 166, name: "مدينة الحرير", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 167, name: "كبد", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 168, name: "الروضتين", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 169, name: "الصبية", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 170, name: "جزيرة بوبيان", parent_id: 4, circle_id: 3, disabled: 0 },
  { id: 171, name: "جزيرة وربة", parent_id: 4, circle_id: 3, disabled: 0 },

  // Hawalli Governorate Areas
  { id: 200, name: "حولي", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 201, name: "الشعب", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 202, name: "السالمية", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 203, name: "الرميثية", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 204, name: "الجابرية", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 205, name: "مشرف", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 206, name: "بيان", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 207, name: "آلبدع", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 208, name: "النقرة", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 209, name: "ميدان حولي", parent_id: 5, circle_id: 3, disabled: 0 },
  {
    id: 210,
    name: "ضاحية مبارك العبد الله الجابر",
    parent_id: 5,
    circle_id: 3,
    disabled: 0,
  },
  { id: 211, name: "سلوى", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 212, name: "جنوب السرة", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 213, name: "الزهراء", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 214, name: "الصديق", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 215, name: "حطين", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 216, name: "السلام", parent_id: 5, circle_id: 3, disabled: 0 },
  { id: 217, name: "الشهداء", parent_id: 5, circle_id: 3, disabled: 0 },

  // Mubarak Al Kabeer Governorate 6 Areas
  { id: 250, name: "العدان", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 251, name: "القصور", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 252, name: "القرين", parent_id: 6, circle_id: 5, disabled: 0 },
  {
    id: 253,
    name: "ضاحية صباح السالم",
    parent_id: 6,
    circle_id: 5,
    disabled: 0,
  },
  { id: 254, name: "المسيلة", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 255, name: "المسايل", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 256, name: "أبو فطيرة", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 257, name: "أبو الحصانية", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 258, name: "صبحان", parent_id: 6, circle_id: 5, disabled: 0 },
  { id: 259, name: "الفنيطيس", parent_id: 6, circle_id: 5, disabled: 0 },
  {
    id: 260,
    name: "ضاحية مبارك الكبير",
    parent_id: 6,
    circle_id: 5,
    disabled: 0,
  },
];

export { ElectionCategoryOptions };
