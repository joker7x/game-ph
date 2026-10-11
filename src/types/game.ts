export type MedicineCategory = 'analgesics' | 'chronic' | 'antibiotics' | 'vitamins' | 'digestive' | 'supplies';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: MedicineCategory;
  price: number;
  cost: number;
  stock: number;
  maxStock: number;
  minThreshold: number;
  description: string;
  dosage: string;
  requiresPrescription: boolean;
  boxColor: string;
  boxSecondaryColor: string;
  isColdChain?: boolean;
}

export interface PrescriptionItem {
  productId: string;
  quantity: number;
  dispensedQuantity: number;
}

export interface Customer {
  id: string;
  name: string;
  avatarSeed: number;
  prescription: PrescriptionItem[];
  totalPrice: number;
  patience: number;
  maxPatience: number;
  status: 'waiting' | 'being_served' | 'served' | 'left_unhappy';
  arrivedAt: number;
  isEmergency?: boolean;
}

export interface SupplierOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: {
    productId: string;
    quantity: number;
    unitCost: number;
  }[];
  totalCost: number;
  orderTime: number;
  deliveryDuration: number;
  deliveredAt: number;
  status: 'in_transit' | 'delivered' | 'collected';
}

export interface Supplier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  deliveryTimeSeconds: number;
  discountPercentage: number;
  badgeText: string;
  logoBg: string;
}

export interface PharmacyUpgrade {
  id: string;
  name: string;
  description: string;
  category: 'equipment' | 'staff' | 'expansion';
  cost: number;
  gemCost?: number;
  levelRequired: number;
  isUnlocked: boolean;
  iconName: string;
  effectDescription: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  rewardCoins: number;
  rewardGems: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface DailyReport {
  dayNumber: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  customersServed: number;
  customersLost: number;
  prescriptionsFilled: number;
  topSellerId?: string;
}

export type GraphicsQuality = 'ultra' | 'high' | 'balanced';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  gameSpeed: 1 | 2 | 3;
  graphicsQuality: GraphicsQuality;
  showFps: boolean;
}

export interface ShelfStats {
  otcPercent: number;
  otcLow: boolean;
  chronicPercent: number;
  chronicLow: boolean;
  suppliesPercent: number;
  suppliesLow: boolean;
  fridgePercent: number;
  fridgeLow: boolean;
}
