import { Customer, Product } from '../types/game';

export const CUSTOMER_NAMES = [
  'أحمد محمود',
  'سارة علي',
  'محمد حسن',
  'منى سمير',
  'د. طارق كامل',
  'الحاج مصطفى',
  'أم ياسمين',
  'كريم المهندس',
  'نورهان فتحي',
  'عمر الشريف',
  'مريم سامي',
  'يوسف إبراهيم',
  'هدى عبد الرحمن',
  'خالد عبد العال',
  'سلمى النجار'
];

export const CUSTOMER_AVATARS = [
  { id: 1, name: 'شاب أنيق', bg: '#dbeafe', hair: '#1e293b' },
  { id: 2, name: 'فتاة جامعية', bg: '#fce7f3', hair: '#831843' },
  { id: 3, name: 'رجل أعمال', bg: '#fef3c7', hair: '#334155' },
  { id: 4, name: 'سيدة وقورة', bg: '#dcfce7', hair: '#3f3f46' },
  { id: 5, name: 'طالب مدرسي', bg: '#ffedd5', hair: '#7c2d12' },
  { id: 6, name: 'جد حكيم', bg: '#ede9fe', hair: '#94a3b8' }
];

export function generateRandomCustomer(
  availableProducts: Product[],
  hasFridgeUpgrade: boolean,
  hasAcUpgrade: boolean
): Customer {
  const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
  const avatarSeed = Math.floor(Math.random() * CUSTOMER_AVATARS.length);

  // Filter products (exclude cold-chain if fridge not yet upgraded)
  const pool = availableProducts.filter(p => !p.isColdChain || hasFridgeUpgrade);

  // Choose 1 to 3 random medicines
  const itemCount = Math.random() > 0.65 ? 2 : (Math.random() > 0.85 ? 3 : 1);
  const selectedProducts: Product[] = [];

  for (let i = 0; i < itemCount; i++) {
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!selectedProducts.some(p => p.id === candidate.id)) {
      selectedProducts.push(candidate);
    }
  }

  const prescription = selectedProducts.map(prod => {
    // 80% quantity 1, 20% quantity 2
    const qty = Math.random() > 0.8 ? 2 : 1;
    return {
      productId: prod.id,
      quantity: qty,
      dispensedQuantity: 0
    };
  });

  const totalPrice = prescription.reduce((sum, item) => {
    const p = pool.find(prod => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  // Patience base 45s to 65s, extended if AC is installed (+50%)
  const basePatience = Math.floor(45 + Math.random() * 20);
  const finalPatience = hasAcUpgrade ? Math.round(basePatience * 1.5) : basePatience;

  return {
    id: 'cust_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    name,
    avatarSeed,
    prescription,
    totalPrice,
    patience: finalPatience,
    maxPatience: finalPatience,
    status: 'waiting',
    arrivedAt: Date.now(),
    isEmergency: Math.random() > 0.85
  };
}
