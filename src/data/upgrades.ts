import { PharmacyUpgrade } from '../types/game';

export const INITIAL_UPGRADES: PharmacyUpgrade[] = [
  {
    id: 'extra_shelves',
    name: 'أرفف إضافية حديثة',
    description: 'زيادة سعة استيعاب الأدوية في المخزون بنسبة +50% لتخزين كميات أكبر',
    category: 'equipment',
    cost: 2500,
    gemCost: 0,
    levelRequired: 1,
    isUnlocked: false,
    iconName: 'Boxes',
    effectDescription: 'زيادة الحد الأقصى لمخزون جميع الأصناف'
  },
  {
    id: 'medicine_fridge',
    name: 'ثلاجة أدوية مبردة',
    description: 'ثلاجة طبية بدرجة حرارة 2-8 درجات لحفظ الأنسولين والأمصال الحساسة',
    category: 'equipment',
    cost: 5800,
    gemCost: 10,
    levelRequired: 2,
    isUnlocked: false,
    iconName: 'Snowflake',
    effectDescription: 'فتح بيع الأدوية الحساسة للحرارة (الأنسولين والتطعيمات)'
  },
  {
    id: 'pos_computer',
    name: 'نظام كمبيوتر وكاشير ذكي',
    description: 'قارئ باركود وشاشة لمس متطورة لتسريع عملية فحص الروشتة والحساب',
    category: 'equipment',
    cost: 4200,
    gemCost: 5,
    levelRequired: 2,
    isUnlocked: false,
    iconName: 'Monitor',
    effectDescription: 'تسريع صرف الروشتات وزيادة خبرة XP بنسبة 30%'
  },
  {
    id: 'electronic_payment',
    name: 'ماكينة دفع فيزا ومحافظ إلكترونية',
    description: 'قبول البطاقات البنكية وفوري وإنستاباي لراحة العملاء',
    category: 'equipment',
    cost: 3200,
    gemCost: 0,
    levelRequired: 3,
    isUnlocked: false,
    iconName: 'CreditCard',
    effectDescription: 'مكافأة نقدية إضافية +10% عند إتمام كل روشتة'
  },
  {
    id: 'assistant_pharmacist',
    name: 'تعيين دكتور صيدلي مساعد',
    description: 'صيدلي شاب يساعدك في خدمة العملاء وصرف الروشتات تلقائياً',
    category: 'staff',
    cost: 8500,
    gemCost: 20,
    levelRequired: 4,
    isUnlocked: false,
    iconName: 'UserCheck',
    effectDescription: 'خدمة عميل تلقائياً في الخلفية كل 15 ثانية'
  },
  {
    id: 'air_conditioning',
    name: 'تكييف هواء كونسيلد بارد',
    description: 'جو لطيف ومنعش داخل الصيدلية يجعل العملاء ينتظرون براحة دون تذمر',
    category: 'staff',
    cost: 4500,
    gemCost: 5,
    levelRequired: 2,
    isUnlocked: false,
    iconName: 'Wind',
    effectDescription: 'مضاعفة صبر العملاء في الطابور بنسبة +50%'
  },
  {
    id: 'neon_sign_24',
    name: 'لافتة نيون خضراء صيدلية 24',
    description: 'لافتة مضيئة ملفتة في الشارع تجذب المزيد من المارة والزبائن ليلاً ونهاراً',
    category: 'staff',
    cost: 3600,
    gemCost: 0,
    levelRequired: 1,
    isUnlocked: false,
    iconName: 'Lightbulb',
    effectDescription: 'تسريع تدفق الزبائن بنسبة +35%'
  },
  {
    id: 'lobby_expansion',
    name: 'توسعة صالة الاستقبال',
    description: 'إضافة مقاعد مريحة وتوسيع المساحة لاستقبال حتى 5 عملاء في نفس الوقت',
    category: 'expansion',
    cost: 11000,
    gemCost: 25,
    levelRequired: 5,
    isUnlocked: false,
    iconName: 'Maximize2',
    effectDescription: 'زيادة الحد الأقصى للعملاء في الطابور إلى 5 عملاء'
  }
];
