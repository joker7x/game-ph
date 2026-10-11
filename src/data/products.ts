import { Product, MedicineCategory } from '../types/game';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'panadol_extra',
    name: 'بانادول إكسترا 500 ملجم',
    nameEn: 'Panadol Extra 500 mg',
    category: 'analgesics',
    price: 38,
    cost: 26,
    stock: 24,
    maxStock: 50,
    minThreshold: 6,
    description: 'باراسيتامول مع كافيين لتسكين الآلام الحادة والصداع النصفي',
    dosage: 'قرصان كل 6 ساعات',
    requiresPrescription: false,
    boxColor: '#dc2626', // Red
    boxSecondaryColor: '#ffffff'
  },
  {
    id: 'panadol_advance',
    name: 'بانادول أدفانس 500 ملجم',
    nameEn: 'Panadol Advance 500 mg',
    category: 'analgesics',
    price: 32,
    cost: 22,
    stock: 18,
    maxStock: 50,
    minThreshold: 5,
    description: 'مسكن للحرارة والصداع خفيف على المعدة وسريع الامتصاص',
    dosage: 'قرص كل 8 ساعات',
    requiresPrescription: false,
    boxColor: '#2563eb', // Blue
    boxSecondaryColor: '#e0e7ff'
  },
  {
    id: 'catafast',
    name: 'كتافاست فوار 50 ملجم',
    nameEn: 'Catafast 50 mg Sachets',
    category: 'analgesics',
    price: 48,
    cost: 34,
    stock: 14,
    maxStock: 40,
    minThreshold: 4,
    description: 'ديكلوفيناك بوتاسيوم سريع المفعول لآلام الأسنان والمفاصل',
    dosage: 'كيس فوار على نصف كوب ماء',
    requiresPrescription: false,
    boxColor: '#f97316', // Orange
    boxSecondaryColor: '#ffedd5'
  },
  {
    id: 'concor_5',
    name: 'كونكور 5 ملجم',
    nameEn: 'Concor 5 mg',
    category: 'chronic',
    price: 76,
    cost: 55,
    stock: 12,
    maxStock: 35,
    minThreshold: 4,
    description: 'بيسوبرولول لعلاج ارتفاع ضغط الدم وانتظام ضربات القلب',
    dosage: 'قرص صباحاً قبل الإفطار',
    requiresPrescription: true,
    boxColor: '#0284c7', // Sky blue
    boxSecondaryColor: '#f0f9ff'
  },
  {
    id: 'flagyl_500',
    name: 'فلاجيل 500 ملجم',
    nameEn: 'Flagyl 500 mg',
    category: 'digestive',
    price: 30,
    cost: 20,
    stock: 0, // initially out of stock to showcase shortages!
    maxStock: 30,
    minThreshold: 5,
    description: 'ميترونيدازول مطهر معوي ومضاد للبكتيريا اللاهوائية والطفيليات',
    dosage: 'قرص ثلاث مرات يومياً بعد الأكل',
    requiresPrescription: false,
    boxColor: '#ec4899', // Pink
    boxSecondaryColor: '#fdf2f8'
  },
  {
    id: 'augmentin_1g',
    name: 'أوجمنتين 1 جم',
    nameEn: 'Augmentin 1 g',
    category: 'antibiotics',
    price: 102,
    cost: 78,
    stock: 9,
    maxStock: 30,
    minThreshold: 3,
    description: 'أموكسيسيلين وحمض الكلافولانيك لعلاج التهابات الجهاز التنفسي',
    dosage: 'قرص كل 12 ساعة لمدة أسبوع',
    requiresPrescription: true,
    boxColor: '#7c3aed', // Purple
    boxSecondaryColor: '#f5f3ff'
  },
  {
    id: 'glucophage_850',
    name: 'جلوكوفاج 850 ملجم',
    nameEn: 'Glucophage 850 mg',
    category: 'chronic',
    price: 45,
    cost: 32,
    stock: 10,
    maxStock: 40,
    minThreshold: 5,
    description: 'ميتفورمين لتنظيم مستويات السكر في الدم لمرضى السكري من النوع الثاني',
    dosage: 'قرص مع وجبة الغداء',
    requiresPrescription: true,
    boxColor: '#b91c1c', // Maroon
    boxSecondaryColor: '#fef2f2'
  },
  {
    id: 'xanax_05',
    name: 'زانكس 0.5 ملجم',
    nameEn: 'Xanax 0.5 mg',
    category: 'chronic',
    price: 65,
    cost: 48,
    stock: 8,
    maxStock: 25,
    minThreshold: 3,
    description: 'ألبرازولام لعلاج حالات القلق والتوتر العصبي الشديد بروشتة خاصة',
    dosage: 'حسب إرشادات الطبيب بدقة',
    requiresPrescription: true,
    boxColor: '#0d9488', // Teal
    boxSecondaryColor: '#f0fdfa'
  },
  {
    id: 'vitamin_d3',
    name: 'فيتامين د3 50,000 وحدة',
    nameEn: 'Vitamin D3 50,000 IU',
    category: 'vitamins',
    price: 85,
    cost: 60,
    stock: 0, // initially out of stock
    maxStock: 30,
    minThreshold: 4,
    description: 'كبسولات تركيز عالي لعلاج نقص فيتامين د وهشاشة العظام',
    dosage: 'كبسولة أسبوعياً بعد وجبة دسمة',
    requiresPrescription: false,
    boxColor: '#eab308', // Gold yellow
    boxSecondaryColor: '#fefce8'
  },
  {
    id: 'antinal',
    name: 'أنتينال 200 ملجم',
    nameEn: 'Antinal 200 mg',
    category: 'digestive',
    price: 28,
    cost: 19,
    stock: 15,
    maxStock: 40,
    minThreshold: 6,
    description: 'نيفوروكسازيد مطهر معوي لعلاج الإسهال والنزلات المعوية الحادة',
    dosage: 'كبسولة 4 مرات يومياً',
    requiresPrescription: false,
    boxColor: '#ea580c', // Bright orange
    boxSecondaryColor: '#fff7ed'
  },
  {
    id: 'congestal',
    name: 'كونجستال أقراص',
    nameEn: 'Congestal Tablets',
    category: 'analgesics',
    price: 31,
    cost: 21,
    stock: 22,
    maxStock: 50,
    minThreshold: 6,
    description: 'علاج فعال لنزلات البرد والرشح واحتقان الجيوب الأنفية والحرارة',
    dosage: 'قرص كل 8 ساعات',
    requiresPrescription: false,
    boxColor: '#059669', // Emerald
    boxSecondaryColor: '#ecfdf5'
  },
  {
    id: 'brufen_400',
    name: 'بروفين 400 ملجم',
    nameEn: 'Brufen 400 mg',
    category: 'analgesics',
    price: 36,
    cost: 25,
    stock: 16,
    maxStock: 40,
    minThreshold: 5,
    description: 'إيبوبروفين مضاد للالتهاب ومسكن لآلام العضلات والمفاصل',
    dosage: 'قرص بعد الأكل كل 8 ساعات',
    requiresPrescription: false,
    boxColor: '#e11d48', // Rose
    boxSecondaryColor: '#fff1f2'
  },
  {
    id: 'otrivin_adults',
    name: 'بخاخ أوتريفين للبالغين',
    nameEn: 'Otrivin Nasal Spray',
    category: 'supplies',
    price: 24,
    cost: 16,
    stock: 11,
    maxStock: 35,
    minThreshold: 4,
    description: 'زيلوميتازولين لإزالة احتقان الأنف وتسهيل التنفس سريعاً',
    dosage: 'بخة في كل فتحة أنف مرتين يومياً',
    requiresPrescription: false,
    boxColor: '#0891b2', // Cyan
    boxSecondaryColor: '#ecfeff'
  },
  {
    id: 'c_retard',
    name: 'سي ريتارد 500 ملجم',
    nameEn: 'C-Retard 500 mg',
    category: 'vitamins',
    price: 35,
    cost: 24,
    stock: 20,
    maxStock: 40,
    minThreshold: 5,
    description: 'فيتامين ج ممتد المفعول لتعزيز المناعة والوقاية من البرد',
    dosage: 'كبسولة يومياً صباحاً',
    requiresPrescription: false,
    boxColor: '#f59e0b', // Amber
    boxSecondaryColor: '#fffbeb'
  },
  {
    id: 'lipitor_20',
    name: 'ليبيتور 20 ملجم',
    nameEn: 'Lipitor 20 mg',
    category: 'chronic',
    price: 110,
    cost: 82,
    stock: 7,
    maxStock: 25,
    minThreshold: 3,
    description: 'أتورفاستاتين لخفض الكوليسترول الضار والدهون الثلاثية في الدم',
    dosage: 'قرص مساءً قبل النوم',
    requiresPrescription: true,
    boxColor: '#1d4ed8', // Dark Blue
    boxSecondaryColor: '#eff6ff'
  },
  {
    id: 'nexium_40',
    name: 'نيكسيوم 40 ملجم',
    nameEn: 'Nexium 40 mg',
    category: 'digestive',
    price: 98,
    cost: 72,
    stock: 14,
    maxStock: 30,
    minThreshold: 4,
    description: 'إيزوميبرازول لعلاج قرحة المعدة والارتجاع المريئي وحموضة المعدة',
    dosage: 'قرص قبل الإفطار بنصف ساعة',
    requiresPrescription: false,
    boxColor: '#7e22ce', // Purple
    boxSecondaryColor: '#faf5ff'
  },
  {
    id: 'voltaren_emulgel',
    name: 'فولتارين جل 50 جم',
    nameEn: 'Voltaren Emulgel 50 g',
    category: 'analgesics',
    price: 44,
    cost: 31,
    stock: 13,
    maxStock: 35,
    minThreshold: 4,
    description: 'جل مسكن ومضاد للالتهاب لآلام الظهر والرقبة والمفاصل والكدمات',
    dosage: 'دهان موضعي مرتين إلى ثلاث مرات يومياً',
    requiresPrescription: false,
    boxColor: '#f97316', // Orange
    boxSecondaryColor: '#fff7ed'
  },
  {
    id: 'alphintern',
    name: 'ألفانترن أقراص',
    nameEn: 'Alphintern Tablets',
    category: 'analgesics',
    price: 40,
    cost: 28,
    stock: 19,
    maxStock: 45,
    minThreshold: 5,
    description: 'كيموتربسين وتريبسين مضاد فعال للتورم والالتهابات والكدمات',
    dosage: 'قرصان قبل الأكل بساعة ثلاث مرات يومياً',
    requiresPrescription: false,
    boxColor: '#059669', // Mint
    boxSecondaryColor: '#f0fdf4'
  },
  {
    id: 'betadine_solution',
    name: 'بيتادين مطهر 120 مل',
    nameEn: 'Betadine Antiseptic 120 ml',
    category: 'supplies',
    price: 38,
    cost: 26,
    stock: 16,
    maxStock: 30,
    minThreshold: 4,
    description: 'محلول بوفيدون أيودين لتطهير الجروح والخدوش والعمليات الجراحية',
    dosage: 'مسح موضعي بقطنة معقمة',
    requiresPrescription: false,
    boxColor: '#991b1b', // Dark Red
    boxSecondaryColor: '#fef2f2'
  },
  {
    id: 'strepsils_honey',
    name: 'استربسلز عسل وليمون',
    nameEn: 'Strepsils Honey & Lemon',
    category: 'supplies',
    price: 42,
    cost: 29,
    stock: 25,
    maxStock: 50,
    minThreshold: 6,
    description: 'استحلاب مهدئ لالتهابات الحلق والحنجرة ومطهر للفم',
    dosage: 'قرص استحلاب كل 3 ساعات',
    requiresPrescription: false,
    boxColor: '#ca8a04', // Honey Gold
    boxSecondaryColor: '#fefce8'
  },
  {
    id: 'gaviscon_liquid',
    name: 'جافيسكون شراب 150 مل',
    nameEn: 'Gaviscon Liquid 150 ml',
    category: 'digestive',
    price: 58,
    cost: 41,
    stock: 8,
    maxStock: 25,
    minThreshold: 3,
    description: 'حاجز حماية سريع المفعول لحرقة المعدة وعسر الهضم والارتجاع',
    dosage: '10 مل بعد الوجبات وقبل النوم',
    requiresPrescription: false,
    boxColor: '#0d9488', // Teal
    boxSecondaryColor: '#f0fdfa'
  },
  {
    id: 'omega_3_plus',
    name: 'أوميجا 3 بلس كبسولات',
    nameEn: 'Omega 3 Plus',
    category: 'vitamins',
    price: 62,
    cost: 44,
    stock: 14,
    maxStock: 35,
    minThreshold: 4,
    description: 'زيت السمك وزيت جنين القمح لصحة القلب والدماغ والنشاط الذهني',
    dosage: 'كبسولة يومياً بعد الأكل',
    requiresPrescription: false,
    boxColor: '#d97706', // Amber gold
    boxSecondaryColor: '#fffbeb'
  },
  {
    id: 'zinc_origins',
    name: 'زنك أوريجينز 50 ملجم',
    nameEn: 'Zinc Origins 50 mg',
    category: 'vitamins',
    price: 46,
    cost: 32,
    stock: 12,
    maxStock: 30,
    minThreshold: 4,
    description: 'مكمل غذائي لدعم الجهاز المناعي وصحة الشعر والبشرة',
    dosage: 'قرص يومياً بعد الغداء',
    requiresPrescription: false,
    boxColor: '#6b7280', // Slate gray
    boxSecondaryColor: '#f9fafb'
  },
  {
    id: 'telfast_120',
    name: 'تلفاست 120 ملجم',
    nameEn: 'Telfast 120 mg',
    category: 'chronic',
    price: 54,
    cost: 38,
    stock: 10,
    maxStock: 30,
    minThreshold: 4,
    description: 'فيكسوفينادين مضاد للهستامين لا يسبب النعاس لحساسية الأنف والجلد',
    dosage: 'قرص مرة واحدة يومياً',
    requiresPrescription: false,
    boxColor: '#4338ca', // Indigo
    boxSecondaryColor: '#eef2ff'
  },
  {
    id: 'motilium_10',
    name: 'موتيليوم 10 ملجم',
    nameEn: 'Motilium 10 mg',
    category: 'digestive',
    price: 33,
    cost: 23,
    stock: 15,
    maxStock: 35,
    minThreshold: 4,
    description: 'دومبيريدون لعلاج الغثيان والقيء وانتفاخ المعدة وتأخر الهضم',
    dosage: 'قرص قبل الأكل بربع ساعة',
    requiresPrescription: false,
    boxColor: '#15803d', // Green
    boxSecondaryColor: '#f0fdf4'
  },
  {
    id: 'neurobion',
    name: 'نيوروبيون أمبولات عضل',
    nameEn: 'Neurobion Ampoules',
    category: 'vitamins',
    price: 45,
    cost: 32,
    stock: 9,
    maxStock: 30,
    minThreshold: 3,
    description: 'فيتامينات ب1 وب6 وب12 المقوية للأعصاب وعلاج التنميل والإرهاق',
    dosage: 'حقنة عضلية كل ثلاثة أيام',
    requiresPrescription: true,
    boxColor: '#b45309', // Dark bronze
    boxSecondaryColor: '#fffbeb'
  },
  {
    id: 'daktarin_gel',
    name: 'دكتارين جل فموي',
    nameEn: 'Daktarin Oral Gel',
    category: 'supplies',
    price: 39,
    cost: 27,
    stock: 11,
    maxStock: 30,
    minThreshold: 3,
    description: 'ميكونازول مضاد لفطريات الفم واللسان واللثة للأطفال والبالغين',
    dosage: 'مسح موضعي بالفم 4 مرات يومياً',
    requiresPrescription: false,
    boxColor: '#0f766e', // Deep Teal
    boxSecondaryColor: '#f0fdfa'
  },
  {
    id: 'pantogar',
    name: 'بانتوجار كبسولات للشعر',
    nameEn: 'Pantogar Hair Capsules',
    category: 'supplies',
    price: 125,
    cost: 92,
    stock: 5,
    maxStock: 25,
    minThreshold: 3,
    description: 'تركيبة غنية بالكيراتين والأحماض الأمينية لعلاج تساقط الشعر والأظافر',
    dosage: 'كبسولة 3 مرات يومياً مع قليل من السائل',
    requiresPrescription: false,
    boxColor: '#be185d', // Deep pink
    boxSecondaryColor: '#fdf2f8'
  },
  {
    id: 'eucarbon',
    name: 'أوكاربون أقراص فحم',
    nameEn: 'Eucarbon Tablets',
    category: 'digestive',
    price: 29,
    cost: 19,
    stock: 14,
    maxStock: 35,
    minThreshold: 4,
    description: 'فحم نباتي مع مستخلصات طبيعية لامتصاص الغازات والانتفاخ وتليين الهضم',
    dosage: 'قرصان مع الأكل أو بعده',
    requiresPrescription: false,
    boxColor: '#334155', // Charcoal
    boxSecondaryColor: '#f8fafc'
  },
  {
    id: 'baby_drink',
    name: 'بيبي درينك أكياس للأطفال',
    nameEn: 'Baby Drink Sachets',
    category: 'supplies',
    price: 25,
    cost: 17,
    stock: 16,
    maxStock: 40,
    minThreshold: 5,
    description: 'أعشاب طبيعية مهدئة للمغص والانتفاخ ومساعدة لنوم هادئ للرضع',
    dosage: 'كيس مذاب في ماء دافئ مرتين يومياً',
    requiresPrescription: false,
    boxColor: '#38bdf8', // Baby Blue
    boxSecondaryColor: '#f0f9ff'
  },
  {
    id: 'insulin_lantus',
    name: 'لانتوس سولستار أنسولين',
    nameEn: 'Lantus SoloStar Insulin',
    category: 'chronic',
    price: 260,
    cost: 195,
    stock: 4,
    maxStock: 20,
    minThreshold: 2,
    description: 'أنسولين جلارجين طويل المفعول يحفظ مبرداً في الثلاجة (2-8 درجات)',
    dosage: 'حقنة تحت الجلد مرة واحدة يومياً بنفس الموعد',
    requiresPrescription: true,
    boxColor: '#4f46e5', // Royal Indigo
    boxSecondaryColor: '#eef2ff',
    isColdChain: true // Needs Refrigerator upgrade!
  },
  {
    id: 'curam_1g',
    name: 'كيورام 1 جم أقراص',
    nameEn: 'Curam 1 g Tablets',
    category: 'antibiotics',
    price: 95,
    cost: 70,
    stock: 8,
    maxStock: 30,
    minThreshold: 3,
    description: 'مضاد حيوي واسع المجال لعلاج التهابات الأذن والجيوب الأنفية والمسالك',
    dosage: 'قرص كل 12 ساعة بعد الوجبات',
    requiresPrescription: true,
    boxColor: '#6366f1', // Indigo
    boxSecondaryColor: '#e0e7ff'
  }
];

export const CATEGORY_LABELS: Record<MedicineCategory, { label: string; icon: string }> = {
  analgesics: { label: 'مسكنات وبرد', icon: 'Pill' },
  chronic: { label: 'أدوية مزمنة', icon: 'HeartPulse' },
  antibiotics: { label: 'مضادات حيوية', icon: 'ShieldCheck' },
  vitamins: { label: 'فيتامينات ومكملات', icon: 'Sparkles' },
  digestive: { label: 'الجهاز الهضمي', icon: 'Apple' },
  supplies: { label: 'مستلزمات وعناية', icon: 'Stethoscope' }
};
