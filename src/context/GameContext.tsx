import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  Customer,
  SupplierOrder,
  PharmacyUpgrade,
  Mission,
  DailyReport,
  GameSettings,
  ShelfStats
} from '../types/game';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_UPGRADES } from '../data/upgrades';
import { SUPPLIERS } from '../data/suppliers';
import { generateRandomCustomer } from '../data/customers';
import { sounds } from '../utils/sound';
import { gameBridge } from '../game/gameBridge';

interface GameContextType {
  coins: number;
  gems: number;
  level: number;
  xp: number;
  xpNeeded: number;
  levelTitle: string;
  products: Product[];
  upgrades: PharmacyUpgrade[];
  customers: Customer[];
  orders: SupplierOrder[];
  missions: Mission[];
  todayReport: DailyReport;
  settings: GameSettings;
  activeCustomer: Customer | null;
  selectedCategory: string | null;

  // Idle Tycoon Features
  idleIncomePerMin: number;
  servingProgress: number;
  boostActive: boolean;
  shelfStats: ShelfStats;
  offlineEarnings: number | null;
  currentFps: number;
  triggerTapBoost: () => void;
  claimOfflineEarnings: () => void;

  // Actions
  setActiveCustomer: (customer: Customer | null) => void;
  setSelectedCategory: (cat: string | null) => void;
  dispensePrescription: (customer: Customer) => { success: boolean; message?: string };
  rejectCustomer: (customer: Customer, reason: string) => void;
  orderFromSupplier: (supplierId: string, items: { productId: string; quantity: number }[]) => { success: boolean; message?: string };
  collectOrder: (orderId: string) => void;
  buyUpgrade: (upgradeId: string) => { success: boolean; message?: string };
  claimMissionReward: (missionId: string) => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetGame: () => void;
  getShortages: () => Product[];
}

const STORAGE_KEY = 'pharmacy24_save_v1';
const LAST_ACTIVE_KEY = 'pharmacy24_last_active';

const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'صرف 5 روشتات طبية',
    description: 'قم بخدمة وصرف الروشتات لـ 5 من رواد الصيدلية',
    progress: 0,
    target: 5,
    rewardCoins: 250,
    rewardGems: 2,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm2',
    title: 'طلب شحنة أدوية من ابن سينا',
    description: 'قم بطلب أدوية من موزع ابن سينا فارما لتأمين المخزون',
    progress: 0,
    target: 1,
    rewardCoins: 300,
    rewardGems: 3,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm3',
    title: 'تحقيق مبيعات 1000 جنيه',
    description: 'حقق إجمالي مبيعات بقيمة 1,000 ج.م من مبيعات الأدوية',
    progress: 0,
    target: 1000,
    rewardCoins: 400,
    rewardGems: 5,
    isCompleted: false,
    isClaimed: false
  },
  {
    id: 'm4',
    title: 'تطوير معدات الصيدلية',
    description: 'اشترِ أي تطوير جديد من قسم المعدات في الصيدلية',
    progress: 0,
    target: 1,
    rewardCoins: 500,
    rewardGems: 5,
    isCompleted: false,
    isClaimed: false
  }
];

const LEVEL_TITLES = [
  'صيدلي متدرب',
  'مساعد صيدلي نشط',
  'صيدلي أول متميز',
  'نائب مدير صيدلية',
  'مدير صيدلية محترف',
  'خبير دوائي استشاري',
  'شريك مؤسس صيدلية 24',
  'مالك سلسلة صيدليات 24'
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(12450);
  const [gems, setGems] = useState<number>(25);
  const [level, setLevel] = useState<number>(5);
  const [xp, setXp] = useState<number>(340);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [upgrades, setUpgrades] = useState<PharmacyUpgrade[]>(INITIAL_UPGRADES);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [todayReport, setTodayReport] = useState<DailyReport>({
    dayNumber: 1,
    totalRevenue: 3420,
    totalExpenses: 1850,
    netProfit: 1570,
    customersServed: 14,
    customersLost: 1,
    prescriptionsFilled: 14
  });
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    gameSpeed: 1,
    graphicsQuality: 'ultra',
    showFps: true
  });
  const [currentFps, setCurrentFps] = useState<number>(60);

  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Idle mechanics state
  const [servingProgress, setServingProgress] = useState<number>(0);
  const [boostActive, setBoostActive] = useState<boolean>(false);
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);

  const triggerTapBoostRef = useRef<() => void>(() => {});

  const productsRef = useRef(products);
  productsRef.current = products;
  const customersRef = useRef(customers);
  customersRef.current = customers;
  const upgradesRef = useRef(upgrades);
  upgradesRef.current = upgrades;
  const servingProgressRef = useRef(servingProgress);
  servingProgressRef.current = servingProgress;

  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  const hasUpgrade = useCallback((id: string) => {
    return upgradesRef.current.some(u => u.id === id && u.isUnlocked);
  }, []);

  // Calculate live idle income per minute
  const idleIncomePerMin = Math.round(
    level * 160 +
      (hasUpgrade('pos_computer') ? 140 : 0) +
      (hasUpgrade('electronic_payment') ? 100 : 0) +
      (hasUpgrade('assistant_pharmacist') ? 280 : 0) +
      (hasUpgrade('neon_sign_24') ? 120 : 0)
  );

  // Calculate live shelf stocks by category
  const calculateShelfStats = useCallback((): ShelfStats => {
    const otcProds = products.filter(p => p.category === 'analgesics' || p.category === 'digestive');
    const chronicProds = products.filter(p => p.category === 'chronic');
    const suppliesProds = products.filter(p => p.category === 'supplies' || p.category === 'vitamins');
    const fridgeProds = products.filter(p => p.isColdChain);

    const calcGroup = (group: Product[]) => {
      if (group.length === 0) return { percent: 100, isLow: false };
      const current = group.reduce((s, p) => s + p.stock, 0);
      const max = group.reduce((s, p) => s + p.maxStock, 0);
      const isLow = group.some(p => p.stock <= p.minThreshold);
      return {
        percent: max > 0 ? Math.round((current / max) * 100) : 100,
        isLow
      };
    };

    const otc = calcGroup(otcProds);
    const chronic = calcGroup(chronicProds);
    const supplies = calcGroup(suppliesProds);
    const fridge = calcGroup(fridgeProds);

    return {
      otcPercent: otc.percent,
      otcLow: otc.isLow,
      chronicPercent: chronic.percent,
      chronicLow: chronic.isLow,
      suppliesPercent: supplies.percent,
      suppliesLow: supplies.isLow,
      fridgePercent: fridge.percent,
      fridgeLow: fridge.isLow
    };
  }, [products]);

  const shelfStats = calculateShelfStats();

  // Load from localStorage & compute offline earnings
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.coins !== undefined) setCoins(data.coins);
        if (data.gems !== undefined) setGems(data.gems);
        if (data.level !== undefined) setLevel(data.level);
        if (data.xp !== undefined) setXp(data.xp);
        if (data.products) setProducts(data.products);
        if (data.upgrades) setUpgrades(data.upgrades);
        if (data.missions) setMissions(data.missions);
        if (data.todayReport) setTodayReport(data.todayReport);
        if (data.settings) setSettings(data.settings);
      }

      // Check last active time for idle earnings
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const elapsedSeconds = Math.floor((Date.now() - parseInt(lastActive, 10)) / 1000);
        if (elapsedSeconds > 30) {
          // Grant idle coins for elapsed time (up to 4 hours)
          const cappedMinutes = Math.min(240, Math.floor(elapsedSeconds / 60));
          const earned = Math.max(150, Math.round(cappedMinutes * 45));
          setOfflineEarnings(earned);
        }
      }
    } catch (e) {
      console.warn('Could not load saved game state', e);
    }
  }, []);

  // Save state & last active timestamp
  useEffect(() => {
    try {
      const dataToSave = {
        coins,
        gems,
        level,
        xp,
        products,
        upgrades,
        missions,
        todayReport,
        settings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    } catch {
      // Ignore
    }
  }, [coins, gems, level, xp, products, upgrades, missions, todayReport, settings]);

  const xpNeeded = level * 300;
  const levelTitle = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  const gainXp = useCallback((amount: number) => {
    setXp(prev => {
      let nextXp = prev + amount;
      let curLevel = level;
      const needed = curLevel * 300;

      if (nextXp >= needed) {
        nextXp -= needed;
        setLevel(l => l + 1);
        setGems(g => g + 5);
        sounds.playUpgradeSound();
      }
      return nextXp;
    });
  }, [level]);

  // Initial customer spawn
  useEffect(() => {
    if (customers.length === 0) {
      const hasFridge = hasUpgrade('medicine_fridge');
      const hasAc = hasUpgrade('air_conditioning');
      const c1 = generateRandomCustomer(productsRef.current, hasFridge, hasAc);
      const c2 = generateRandomCustomer(productsRef.current, hasFridge, hasAc);
      setCustomers([c1, c2]);
    }
  }, [hasUpgrade, customers.length]);

  // Sync customers & shelf stats with Phaser scene
  useEffect(() => {
    gameBridge.emit('sync_customers', customers);
    gameBridge.emit('sync_shelf_stats', shelfStats);
  }, [customers, shelfStats]);

  // Bridge listeners from Phaser
  useEffect(() => {
    const unsubCustomer = gameBridge.on('customer_clicked', (cust: Customer) => {
      setActiveCustomer(cust);
      sounds.playPopSound();
    });

    const unsubCounter = gameBridge.on('counter_clicked', () => {
      triggerTapBoostRef.current();
    });

    const unsubCategory = gameBridge.on('open_category', (cat: string) => {
      setSelectedCategory(cat);
      sounds.playPopSound();
    });

    const unsubFridge = gameBridge.on('open_fridge', () => {
      setSelectedCategory('chronic');
      sounds.playPopSound();
    });

    const unsubFps = gameBridge.on('fps_update', (fps: number) => {
      if (typeof fps === 'number' && !isNaN(fps)) {
        setCurrentFps(fps);
      }
    });

    const unsubFloatingCash = gameBridge.on('collect_floating_cash', (amount: number) => {
      setCoins(c => c + amount);
      sounds.playCashSound();
    });

    return () => {
      unsubCustomer();
      unsubCounter();
      unsubCategory();
      unsubFridge();
      unsubFps();
      unsubFloatingCash();
    };
  }, []);

  // Update mission helper
  const updateMissionProgress = useCallback((id: string, amount: number) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === id && !m.isCompleted) {
          const nextVal = m.progress + amount;
          const isDone = nextVal >= m.target;
          return {
            ...m,
            progress: Math.min(nextVal, m.target),
            isCompleted: isDone
          };
        }
        return m;
      })
    );
  }, []);

  // Dispense prescription
  const dispensePrescription = useCallback(
    (customer: Customer) => {
      for (const item of customer.prescription) {
        const product = productsRef.current.find(p => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
          sounds.playAlertSound();
          return {
            success: false,
            message: `عذراً! صنف (${product?.name || 'الدواء'}) غير متوفر بالكمية المطلوبة في المخزون.`
          };
        }
      }

      setProducts(prev =>
        prev.map(p => {
          const orderedItem = customer.prescription.find(item => item.productId === p.id);
          if (orderedItem) {
            return { ...p, stock: p.stock - orderedItem.quantity };
          }
          return p;
        })
      );

      let revenue = customer.totalPrice;
      if (hasUpgrade('electronic_payment')) {
        revenue = Math.round(revenue * 1.1);
      }

      let xpReward = Math.round(revenue * 0.4) + 15;
      if (hasUpgrade('pos_computer')) {
        xpReward = Math.round(xpReward * 1.3);
      }

      setCoins(c => c + revenue);
      gainXp(xpReward);

      sounds.playCashSound();
      gameBridge.emit('customer_served_success', {
        customerId: customer.id,
        coins: revenue,
        xp: xpReward
      });

      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      if (activeCustomer?.id === customer.id) {
        setActiveCustomer(null);
      }

      setTodayReport(r => ({
        ...r,
        totalRevenue: r.totalRevenue + revenue,
        netProfit: r.netProfit + revenue,
        customersServed: r.customersServed + 1,
        prescriptionsFilled: r.prescriptionsFilled + 1
      }));

      updateMissionProgress('m1', 1);
      updateMissionProgress('m3', revenue);

      setServingProgress(0);

      return { success: true };
    },
    [activeCustomer, gainXp, hasUpgrade, updateMissionProgress]
  );

  // Tap-To-Boost Idle Mechanic: Accelerates cashier checkout
  const triggerTapBoost = useCallback(() => {
    sounds.playPopSound();
    setBoostActive(true);
    setTimeout(() => setBoostActive(false), 400);

    // Boost checkout progress by +35% immediately!
    setServingProgress(prev => {
      const next = prev + 35;
      if (next >= 100 && customersRef.current.length > 0) {
        const firstCust = customersRef.current[0];
        dispensePrescription(firstCust);
        return 0;
      }
      return next;
    });

    gameBridge.emit('cashier_boost_fx');
  }, [dispensePrescription]);
  triggerTapBoostRef.current = triggerTapBoost;

  // IDLE TYCOON GAME LOOP: Automated serving progress & customer spawning
  useEffect(() => {
    const tickRate = 250 / settings.gameSpeed; // 4 ticks per second
    let spawnTimer = 0;

    const timer = setInterval(() => {
      const currentCustomers = customersRef.current;

      // 1. If customer at counter, advance serving progress
      if (currentCustomers.length > 0) {
        const activeCust = currentCustomers[0];

        // Check if all requested items are in stock
        const hasAllItems = activeCust.prescription.every(item => {
          const p = productsRef.current.find(prod => prod.id === item.productId);
          return p && p.stock >= item.quantity;
        });

        if (hasAllItems) {
          setServingProgress(prev => {
            const speedBase = hasUpgrade('pos_computer') ? 8 : 6;
            const assistantBonus = hasUpgrade('assistant_pharmacist') ? 4 : 0;
            const increment = speedBase + assistantBonus;
            const nextVal = prev + increment;

            if (nextVal >= 100) {
              dispensePrescription(activeCust);
              return 0;
            }
            return nextVal;
          });
        }
      }

      // 2. Patience timer
      setCustomers(prev => {
        let hasLost = false;
        const updated = prev.map(c => {
          if (c.status === 'waiting') {
            const newPatience = c.patience - 0.25;
            if (newPatience <= 0) {
              hasLost = true;
              return { ...c, patience: 0, status: 'left_unhappy' as const };
            }
            return { ...c, patience: newPatience };
          }
          return c;
        });

        if (hasLost) {
          sounds.playAlertSound();
          setTodayReport(r => ({ ...r, customersLost: r.customersLost + 1 }));
          return updated.filter(c => c.status !== 'left_unhappy');
        }
        return updated;
      });

      // 3. Spawner
      const maxQueue = hasUpgrade('lobby_expansion') ? 5 : 3;
      const hasNeon = hasUpgrade('neon_sign_24');
      const spawnIntervalTicks = (hasNeon ? 6 : 9) * 4;

      spawnTimer += 1;
      if (spawnTimer >= spawnIntervalTicks && currentCustomers.length < maxQueue) {
        spawnTimer = 0;
        const hasFridge = hasUpgrade('medicine_fridge');
        const hasAc = hasUpgrade('air_conditioning');
        const newCust = generateRandomCustomer(productsRef.current, hasFridge, hasAc);
        setCustomers(prev => [...prev, newCust]);
      }
    }, tickRate);

    return () => clearInterval(timer);
  }, [settings.gameSpeed, hasUpgrade, dispensePrescription]);

  // Active Orders Countdown Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => {
        let changed = false;
        const updated = prev.map(order => {
          if (order.status === 'in_transit') {
            const now = Date.now();
            if (now >= order.deliveredAt) {
              changed = true;
              sounds.playSuccessChime();
              return { ...order, status: 'delivered' as const };
            }
          }
          return order;
        });
        return changed ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const rejectCustomer = useCallback((customer: Customer, _reason: string) => {
    sounds.playAlertSound();
    setCustomers(prev => prev.filter(c => c.id !== customer.id));
    setTodayReport(r => ({ ...r, customersLost: r.customersLost + 1 }));
    setServingProgress(0);
    if (activeCustomer?.id === customer.id) {
      setActiveCustomer(null);
    }
  }, [activeCustomer]);

  const orderFromSupplier = useCallback(
    (supplierId: string, items: { productId: string; quantity: number }[]) => {
      const supplier = SUPPLIERS.find(s => s.id === supplierId);
      if (!supplier) return { success: false, message: 'المورد غير موجود' };

      const rawCost = items.reduce((sum, item) => {
        const p = productsRef.current.find(prod => prod.id === item.productId);
        return sum + (p ? p.cost * item.quantity : 0);
      }, 0);

      const discountAmount = Math.round((rawCost * supplier.discountPercentage) / 100);
      const finalCost = Math.max(1, rawCost - discountAmount);

      if (coins < finalCost) {
        sounds.playAlertSound();
        return {
          success: false,
          message: `رصيد الخزينة غير كافٍ! التكلفة المطلوبة ${finalCost} ج.م ورصيدك ${coins} ج.م`
        };
      }

      setCoins(c => c - finalCost);
      sounds.playCashSound();

      const newOrder: SupplierOrder = {
        id: 'ord_' + Date.now(),
        supplierId: supplier.id,
        supplierName: supplier.name,
        items: items.map(it => {
          const p = productsRef.current.find(prod => prod.id === it.productId);
          return {
            productId: it.productId,
            quantity: it.quantity,
            unitCost: p ? p.cost : 0
          };
        }),
        totalCost: finalCost,
        orderTime: Date.now(),
        deliveryDuration: supplier.deliveryTimeSeconds,
        deliveredAt: Date.now() + supplier.deliveryTimeSeconds * 1000,
        status: 'in_transit'
      };

      setOrders(prev => [newOrder, ...prev]);

      setTodayReport(r => ({
        ...r,
        totalExpenses: r.totalExpenses + finalCost,
        netProfit: r.netProfit - finalCost
      }));

      if (supplier.id === 'ibnsina') {
        updateMissionProgress('m2', 1);
      }

      return { success: true };
    },
    [coins, updateMissionProgress]
  );

  const collectOrder = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.status !== 'delivered') return;

    setProducts(prev =>
      prev.map(p => {
        const orderItem = order.items.find(it => it.productId === p.id);
        if (orderItem) {
          const newStock = Math.min(p.stock + orderItem.quantity, p.maxStock);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'collected' as const } : o))
    );

    sounds.playSuccessChime();
    gameBridge.emit('order_received_fx');
  }, [orders]);

  const buyUpgrade = useCallback(
    (upgradeId: string) => {
      const upgrade = upgrades.find(u => u.id === upgradeId);
      if (!upgrade) return { success: false, message: 'التطوير غير موجود' };
      if (upgrade.isUnlocked) return { success: false, message: 'تم شراء هذا التطوير بالفعل' };
      if (level < upgrade.levelRequired) {
        return { success: false, message: `يتطلب الوصول إلى المستوى ${upgrade.levelRequired}` };
      }
      if (coins < upgrade.cost) {
        return { success: false, message: `تحتاج إلى ${upgrade.cost} ج.م لإتمام الشراء` };
      }
      if (upgrade.gemCost && gems < upgrade.gemCost) {
        return { success: false, message: `تحتاج إلى ${upgrade.gemCost} جوهرة لإتمام الشراء` };
      }

      setCoins(c => c - upgrade.cost);
      if (upgrade.gemCost) {
        setGems(g => g - upgrade.gemCost!);
      }

      setUpgrades(prev =>
        prev.map(u => (u.id === upgradeId ? { ...u, isUnlocked: true } : u))
      );

      if (upgrade.id === 'extra_shelves') {
        setProducts(prev => prev.map(p => ({ ...p, maxStock: p.maxStock + 20 })));
      }

      sounds.playUpgradeSound();
      updateMissionProgress('m4', 1);

      return { success: true };
    },
    [coins, gems, level, upgrades, updateMissionProgress]
  );

  const claimMissionReward = useCallback((missionId: string) => {
    setMissions(prev =>
      prev.map(m => {
        if (m.id === missionId && m.isCompleted && !m.isClaimed) {
          setCoins(c => c + m.rewardCoins);
          setGems(g => g + m.rewardGems);
          sounds.playCoinSound();
          return { ...m, isClaimed: true };
        }
        return m;
      })
    );
  }, []);

  const claimOfflineEarnings = useCallback(() => {
    if (offlineEarnings) {
      setCoins(c => c + offlineEarnings);
      sounds.playCashSound();
      setOfflineEarnings(null);
    }
  }, [offlineEarnings]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_ACTIVE_KEY);
    setCoins(12450);
    setGems(25);
    setLevel(5);
    setXp(340);
    setProducts(INITIAL_PRODUCTS);
    setUpgrades(INITIAL_UPGRADES);
    setOrders([]);
    setMissions(INITIAL_MISSIONS);
    setTodayReport({
      dayNumber: 1,
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      customersServed: 0,
      customersLost: 0,
      prescriptionsFilled: 0
    });
    setCustomers([]);
  }, []);

  const getShortages = useCallback(() => {
    return products.filter(p => p.stock <= p.minThreshold);
  }, [products]);

  return (
    <GameContext.Provider
      value={{
        coins,
        gems,
        level,
        xp,
        xpNeeded,
        levelTitle,
        products,
        upgrades,
        customers,
        orders,
        missions,
        todayReport,
        settings,
        activeCustomer,
        selectedCategory,
        idleIncomePerMin,
        servingProgress,
        boostActive,
        shelfStats,
        offlineEarnings,
        currentFps,
        triggerTapBoost,
        claimOfflineEarnings,
        setActiveCustomer,
        setSelectedCategory,
        dispensePrescription,
        rejectCustomer,
        orderFromSupplier,
        collectOrder,
        buyUpgrade,
        claimMissionReward,
        updateSettings,
        resetGame,
        getShortages
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
