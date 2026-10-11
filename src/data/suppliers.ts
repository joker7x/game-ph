import { Supplier } from '../types/game';

export const SUPPLIERS: Supplier[] = [
  {
    id: 'ibnsina',
    name: 'ابن سينا فارما',
    nameEn: 'Ibnsina Pharma',
    description: 'أكبر موزع للأدوية في مصر مع شبكة تغطية شاملة وخصومات تجارية متميزة',
    deliveryTimeSeconds: 22,
    discountPercentage: 10,
    badgeText: 'أفضل أسعار',
    logoBg: 'bg-emerald-600'
  },
  {
    id: 'eva',
    name: 'إيفا فارما',
    nameEn: 'EVA Pharma',
    description: 'توصيل فوري طارئ وسريع جداً للأصناف الحيوية والنواقص المستعجلة',
    deliveryTimeSeconds: 10,
    discountPercentage: 5,
    badgeText: 'شحن فوري سريع',
    logoBg: 'bg-blue-600'
  },
  {
    id: 'adwia',
    name: 'أدويا للتوزيع',
    nameEn: 'Adwia Distribution',
    description: 'تخصص أدوية الأمراض المزمنة والمضادات الحيوية مع نسبة وفر جيدة',
    deliveryTimeSeconds: 18,
    discountPercentage: 8,
    badgeText: 'أدوية مزمنة',
    logoBg: 'bg-teal-600'
  },
  {
    id: 'ucp',
    name: 'المتحدة للصيادلة (UCP)',
    nameEn: 'United Company of Pharmacists',
    description: 'مورد الطلبيات الكبيرة والمستلزمات الطبية مع هدايا وعروض ترويجية',
    deliveryTimeSeconds: 28,
    discountPercentage: 14,
    badgeText: 'طلبيات الجملة',
    logoBg: 'bg-indigo-600'
  }
];
