import Phaser from 'phaser';
import { Customer, ShelfStats } from '../types/game';
import { gameBridge } from './gameBridge';
import masterpieceBgUrl from '../assets/images/pharmacy_masterpiece_3d_1791672148646.jpg';

interface CustomerSprite {
  customer: Customer;
  container: Phaser.GameObjects.Container;
  bubble: Phaser.GameObjects.Container;
  bodySprite: Phaser.GameObjects.Arc;
  headSprite: Phaser.GameObjects.Arc;
  moodText: Phaser.GameObjects.Text;
  targetX: number;
  targetY: number;
}

export class PharmacyScene extends Phaser.Scene {
  private bgImage?: Phaser.GameObjects.Image;
  private customerSprites: Map<string, CustomerSprite> = new Map();
  private coinEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkleEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private frostEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private dustEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  private worldContainer?: Phaser.GameObjects.Container;

  // Masterpiece 16:9 base coordinates (1280 x 720)
  private readonly BASE_WIDTH = 1280;
  private readonly BASE_HEIGHT = 720;

  // Shelf 3D badges
  private shelfOtcBadge?: Phaser.GameObjects.Container;
  private shelfChronicBadge?: Phaser.GameObjects.Container;
  private shelfSuppliesBadge?: Phaser.GameObjects.Container;
  private fridgeBadge?: Phaser.GameObjects.Container;
  private neonGlow?: Phaser.GameObjects.Arc;

  // Scanner laser line
  private scannerLaser?: Phaser.GameObjects.Rectangle;

  // Floating idle cash drop
  private floatingCashContainer?: Phaser.GameObjects.Container;
  private floatingCashTimer = 0;

  // Queue positions in front of the counter in masterpiece coordinates
  private queuePositions = [
    { x: 440, y: 650 }, // Spot 1 (In front of counter)
    { x: 520, y: 650 }, // Spot 2
    { x: 600, y: 650 }, // Spot 3
    { x: 680, y: 650 }, // Spot 4
    { x: 760, y: 630 }  // Spot 5 (Near aisle)
  ];

  // FPS ticker timer
  private fpsTimer = 0;

  constructor() {
    super('PharmacyScene');
  }

  preload() {
    this.load.image('pharmacy_masterpiece_bg', masterpieceBgUrl);
  }

  create() {
    this.worldContainer = this.add.container(0, 0);

    // 1. Crisp Background Image
    this.bgImage = this.add.image(this.BASE_WIDTH / 2, this.BASE_HEIGHT / 2, 'pharmacy_masterpiece_bg');
    this.bgImage.setDisplaySize(this.BASE_WIDTH, this.BASE_HEIGHT);
    this.worldContainer.add(this.bgImage);

    // 2. Neon Medical Cross Ambient Glow
    this.createNeonCrossEffect();

    // 3. Interactive 3D Idle Stations (Shelves, Fridge, Counter)
    this.createInteractiveStations();

    // 4. Barcode Scanner Laser on Counter
    this.createLaserScanner();

    // 5. High-FPS Particle Systems
    this.setupParticles();

    // 6. Camera Fitting (Dual Mode: Landscape & Phone Portrait)
    this.updateCameraFit();

    // 7. Event Bridge Listeners
    this.registerBridgeListeners();

    // 8. Tap on counter to boost cashier
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      // Counter area
      if (p.x > 250 && p.x < 550 && p.y > 520 && p.y < 710) {
        gameBridge.emit('counter_clicked');
      }
    });

    this.scale.on('resize', this.onResize, this);
  }

  update(_time: number, delta: number) {
    // 1. Real FPS calculation
    this.fpsTimer += delta;
    if (this.fpsTimer > 400) {
      this.fpsTimer = 0;
      const actualFps = Math.round(this.game.loop.actualFps) || 60;
      gameBridge.emit('fps_update', actualFps);
    }

    // 2. Idle Floating Cash Drops
    this.floatingCashTimer += delta;
    if (this.floatingCashTimer > 11000 && !this.floatingCashContainer) {
      this.floatingCashTimer = 0;
      this.spawnFloatingCashDrop();
    }
  }

  private updateCameraFit() {
    const { width, height } = this.scale;
    const isPortrait = height > width;

    if (isPortrait) {
      // Smart mobile portrait focus: zoom in on the counter, customer queue and central shelves
      const scaleX = width / 780;
      const scaleY = height / 880;
      const fitZoom = Math.max(scaleX, scaleY);

      this.cameras.main.setZoom(fitZoom);
      this.cameras.main.centerOn(530, 520);
    } else {
      // Widescreen landscape: fit entire pharmacy interior
      const scaleX = width / this.BASE_WIDTH;
      const scaleY = height / this.BASE_HEIGHT;
      const fitZoom = Math.min(scaleX, scaleY);

      this.cameras.main.setZoom(fitZoom);
      this.cameras.main.centerOn(this.BASE_WIDTH / 2, this.BASE_HEIGHT / 2);
    }
  }

  private onResize() {
    this.updateCameraFit();
  }

  private createNeonCrossEffect() {
    if (!this.worldContainer) return;
    // Glowing neon aura over the green cross sign on the wall (x: 180, y: 440)
    this.neonGlow = this.add.circle(180, 440, 55, 0x10b981, 0.22);
    this.neonGlow.setDepth(50);
    this.worldContainer.add(this.neonGlow);

    this.tweens.add({
      targets: this.neonGlow,
      alpha: 0.05,
      scale: 1.25,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createInteractiveStations() {
    if (!this.worldContainer) return;

    // 1. Refrigerator Station (Insulin & Cold-chain meds)
    this.fridgeBadge = this.create3DGameBadge(375, 270, '❄️ ثلاجة أدوية 4°C', 0x0284c7, () => {
      gameBridge.emit('open_fridge');
    });

    const zoneFridge = this.add.zone(375, 440, 150, 260).setRectangleDropZone(150, 260);
    zoneFridge.setInteractive({ useHandCursor: true });
    zoneFridge.on('pointerdown', () => gameBridge.emit('open_fridge'));

    // 2. Shelf Chronic Meds (Back Wall)
    this.shelfChronicBadge = this.create3DGameBadge(495, 155, '❤️ أدوية مزمنة وروشتات', 0x3b82f6, () => {
      gameBridge.emit('open_category', 'chronic');
    });

    const zoneChronic = this.add.zone(495, 310, 150, 180).setRectangleDropZone(150, 180);
    zoneChronic.setInteractive({ useHandCursor: true });
    zoneChronic.on('pointerdown', () => gameBridge.emit('open_category', 'chronic'));

    // 3. Shelf Vitamins & Cosmetics (Right Wall)
    this.shelfSuppliesBadge = this.create3DGameBadge(675, 195, '✨ فيتامينات ومستلزمات', 0xec4899, () => {
      gameBridge.emit('open_category', 'supplies');
    });

    const zoneSupplies = this.add.zone(675, 360, 150, 180).setRectangleDropZone(150, 180);
    zoneSupplies.setInteractive({ useHandCursor: true });
    zoneSupplies.on('pointerdown', () => gameBridge.emit('open_category', 'supplies'));

    // 4. Center Aisle Shelf (OTC Analgesics & Cold)
    this.shelfOtcBadge = this.create3DGameBadge(600, 450, '💊 OTC رف المسكنات', 0x10b981, () => {
      gameBridge.emit('open_category', 'analgesics');
    });

    const zoneOtc = this.add.zone(600, 600, 140, 180).setRectangleDropZone(140, 180);
    zoneOtc.setInteractive({ useHandCursor: true });
    zoneOtc.on('pointerdown', () => gameBridge.emit('open_category', 'analgesics'));

    // 5. Cashier Counter & POS
    const counterBadge = this.create3DGameBadge(370, 615, '⚡ نقطة البيع (اضغط للتسريع 🚀)', 0xf59e0b, () => {
      gameBridge.emit('counter_clicked');
    });

    const zoneCounter = this.add.zone(370, 750, 240, 180).setRectangleDropZone(240, 180);
    zoneCounter.setInteractive({ useHandCursor: true });
    zoneCounter.on('pointerdown', () => gameBridge.emit('counter_clicked'));

    this.worldContainer.add([
      this.fridgeBadge,
      this.shelfChronicBadge,
      this.shelfSuppliesBadge,
      this.shelfOtcBadge,
      counterBadge,
      zoneFridge,
      zoneChronic,
      zoneSupplies,
      zoneOtc,
      zoneCounter
    ]);
  }

  private create3DGameBadge(
    x: number,
    y: number,
    title: string,
    color: number,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    container.setDepth(150);

    // Beveled 3D game badge
    const shadow = this.add.rectangle(3, 4, 115, 28, 0x000000, 0.35).setOrigin(0.5);
    const bottomBevel = this.add.rectangle(0, 3, 115, 28, 0x0f172a, 0.4).setOrigin(0.5);
    const bg = this.add.rectangle(0, 0, 115, 28, color).setOrigin(0.5);
    bg.setStrokeStyle(2, 0xffffff);

    // Gloss shine
    const gloss = this.add.rectangle(0, -6, 111, 12, 0xffffff, 0.28).setOrigin(0.5);

    const text = this.add.text(0, 0, title, {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Live status pill underneath
    const statusBg = this.add.rectangle(0, 20, 72, 14, 0x0f172a, 0.88).setOrigin(0.5);
    statusBg.setStrokeStyle(1, 0x334155);
    const statusText = this.add.text(0, 20, '🟢 100% متوفر', {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '9px',
      color: '#34d399',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    statusText.setName('status_text');

    container.add([shadow, bottomBevel, bg, gloss, text, statusBg, statusText]);

    container.setSize(115, 36);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', onClick);

    // Bouncy idle float tween
    this.tweens.add({
      targets: container,
      y: y - 5,
      duration: 1400 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return container;
  }

  private updateShelfBadges(stats: ShelfStats) {
    const updateBadge = (c?: Phaser.GameObjects.Container, percent = 100, isLow = false) => {
      if (!c) return;
      const textObj = c.getByName('status_text') as Phaser.GameObjects.Text;
      if (textObj) {
        if (isLow) {
          textObj.setText('⚠️ نواقص!');
          textObj.setColor('#f87171');
        } else {
          textObj.setText(`🟢 ${percent}% متوفر`);
          textObj.setColor('#34d399');
        }
      }
    };

    updateBadge(this.shelfOtcBadge, stats.otcPercent, stats.otcLow);
    updateBadge(this.shelfChronicBadge, stats.chronicPercent, stats.chronicLow);
    updateBadge(this.shelfSuppliesBadge, stats.suppliesPercent, stats.suppliesLow);
    updateBadge(this.fridgeBadge, stats.fridgePercent, stats.fridgeLow);
  }

  private createLaserScanner() {
    if (!this.worldContainer) return;
    this.scannerLaser = this.add.rectangle(370, 740, 55, 2.5, 0xef4444, 0);
    this.scannerLaser.setDepth(200);
    this.worldContainer.add(this.scannerLaser);
  }

  private setupParticles() {
    if (!this.worldContainer) return;

    // Coin Texture
    if (!this.textures.exists('coin_gold_tex')) {
      const canvas = document.createElement('canvas');
      canvas.width = 24;
      canvas.height = 24;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(12, 12, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', 12, 12);
      this.textures.addCanvas('coin_gold_tex', canvas);
    }

    // Sparkle Texture
    if (!this.textures.exists('sparkle_gem_tex')) {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();
      this.textures.addCanvas('sparkle_gem_tex', canvas);
    }

    this.coinEmitter = this.add.particles(0, 0, 'coin_gold_tex', {
      lifespan: 1100,
      speedY: { min: -190, max: -80 },
      speedX: { min: -75, max: 75 },
      gravityY: 260,
      scale: { start: 1, end: 0.35 },
      emitting: false
    });
    this.coinEmitter.setDepth(300);

    this.sparkleEmitter = this.add.particles(0, 0, 'sparkle_gem_tex', {
      lifespan: 800,
      speed: { min: 40, max: 140 },
      scale: { start: 1, end: 0 },
      emitting: false
    });
    this.sparkleEmitter.setDepth(300);

    // Frost mist for fridge
    this.frostEmitter = this.add.particles(375, 420, 'sparkle_gem_tex', {
      lifespan: 1400,
      speedX: { min: -10, max: 10 },
      speedY: { min: 5, max: 25 },
      scale: { start: 0.45, end: 0.1 },
      alpha: { start: 0.45, end: 0 },
      frequency: 400
    });
    this.frostEmitter.setDepth(140);

    // Warm sunbeam dust particles
    this.dustEmitter = this.add.particles(640, 360, 'sparkle_gem_tex', {
      lifespan: 3000,
      speedX: { min: -15, max: 15 },
      speedY: { min: -10, max: 10 },
      scale: { start: 0.25, end: 0.05 },
      alpha: { start: 0.25, end: 0 },
      frequency: 900
    });
    this.dustEmitter.setDepth(60);

    this.worldContainer.add([this.coinEmitter, this.sparkleEmitter, this.frostEmitter, this.dustEmitter]);
  }

  private registerBridgeListeners() {
    gameBridge.on('sync_customers', (customers: Customer[]) => {
      this.syncCustomers(customers);
    });

    gameBridge.on('sync_shelf_stats', (stats: ShelfStats) => {
      this.updateShelfBadges(stats);
    });

    gameBridge.on('cashier_boost_fx', () => {
      this.playBoostEffect();
    });

    gameBridge.on('customer_served_success', (data: { customerId: string; coins: number; xp: number }) => {
      this.playServeAnimation(data.customerId, data.coins, data.xp);
    });

    gameBridge.on('order_received_fx', () => {
      this.playRestockAnimation();
    });
  }

  private syncCustomers(customers: Customer[]) {
    if (!this.worldContainer) return;
    const currentIds = new Set(customers.map(c => c.id));

    // Remove finished customers with smooth exit
    for (const [id, cSprite] of this.customerSprites.entries()) {
      if (!currentIds.has(id)) {
        this.tweens.add({
          targets: cSprite.container,
          x: 870,
          y: 480, // Walks out towards exit door
          alpha: 0,
          duration: 700,
          ease: 'Power2',
          onComplete: () => {
            cSprite.container.destroy();
            this.customerSprites.delete(id);
          }
        });
      }
    }

    // Add or move queue customers
    customers.forEach((cust, index) => {
      const targetPos = this.queuePositions[Math.min(index, this.queuePositions.length - 1)];

      if (!this.customerSprites.has(cust.id)) {
        const sprite = this.createCustomerSprite(cust, targetPos.x, targetPos.y, index);
        this.customerSprites.set(cust.id, sprite);
      } else {
        const existing = this.customerSprites.get(cust.id)!;
        existing.customer = cust;
        // Update mood emoticon based on patience
        if (existing.moodText) {
          const ratio = cust.patience / cust.maxPatience;
          if (ratio > 0.6) existing.moodText.setText('😊');
          else if (ratio > 0.3) existing.moodText.setText('🤔');
          else existing.moodText.setText('⏳');
        }
        if (existing.targetX !== targetPos.x || existing.targetY !== targetPos.y) {
          existing.targetX = targetPos.x;
          existing.targetY = targetPos.y;
          this.tweens.add({
            targets: existing.container,
            x: targetPos.x,
            y: targetPos.y,
            duration: 450,
            ease: 'Power1'
          });
        }
      }
    });
  }

  private createCustomerSprite(cust: Customer, targetX: number, targetY: number, queueIndex: number): CustomerSprite {
    // Spawn at the pharmacy entrance door (x: 870, y: 480)
    const startX = 870;
    const startY = 480;

    const container = this.add.container(startX, startY);
    container.setDepth(200 + targetY);

    // 3D Soft Shadow on tiled floor
    const shadow = this.add.ellipse(0, 18, 44, 18, 0x000000, 0.32);
    container.add(shadow);

    const colors = [0x3b82f6, 0xec4899, 0xf97316, 0x10b981, 0x8b5cf6, 0x06b6d4];
    const clothColor = colors[cust.avatarSeed % colors.length];

    // Character Body & Head
    const body = this.add.circle(0, 0, 19, clothColor);
    body.setStrokeStyle(2, 0xffffff);
    const head = this.add.circle(0, -25, 15, 0xfde047);
    head.setStrokeStyle(1.5, 0xca8a04);
    const hair = this.add.arc(0, -32, 15, Math.PI, 0, false, 0x374151);

    container.add([body, head, hair]);

    // Live Mood Emoticon
    const moodText = this.add.text(-22, -32, '😊', {
      fontSize: '12px'
    }).setOrigin(0.5);
    container.add(moodText);

    // 3D Game Speech bubble with medicine package count
    const bubble = this.add.container(0, -66);
    const bubbleShadow = this.add.rectangle(2, 2, 58, 32, 0x000000, 0.25).setOrigin(0.5);
    const bubbleBg = this.add.rectangle(0, 0, 58, 32, 0xffffff).setOrigin(0.5);
    bubbleBg.setStrokeStyle(2, 0x059669);

    const pillHalf1 = this.add.rectangle(-12, 0, 10, 14, 0xef4444).setOrigin(0.5);
    const pillHalf2 = this.add.rectangle(-2, 0, 10, 14, 0x3b82f6).setOrigin(0.5);
    const countText = this.add.text(14, 0, `x${cust.prescription.length}`, {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '13px',
      color: '#0f172a',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    bubble.add([bubbleShadow, bubbleBg, pillHalf1, pillHalf2, countText]);
    container.add(bubble);

    // Bouncy idle float
    this.tweens.add({
      targets: bubble,
      y: -70,
      duration: 850 + Math.random() * 300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    container.setSize(64, 84);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', () => {
      gameBridge.emit('customer_clicked', cust);
    });

    if (this.worldContainer) {
      this.worldContainer.add(container);
    }

    // Walk into position from entrance door
    this.tweens.add({
      targets: container,
      x: targetX,
      y: targetY,
      duration: 850 + queueIndex * 150,
      ease: 'Power2'
    });

    return {
      customer: cust,
      container,
      bubble,
      bodySprite: body,
      headSprite: head,
      moodText,
      targetX,
      targetY
    };
  }

  private playBoostEffect() {
    if (this.scannerLaser) {
      this.scannerLaser.setAlpha(1);
      this.tweens.add({
        targets: this.scannerLaser,
        alpha: 0,
        duration: 250,
        ease: 'Power2'
      });
    }

    // 3D Floating "⚡ تسريع الكاشير!" label
    const boostLabel = this.add.text(370, 680, '⚡ تسريع +35%!', {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '18px',
      color: '#fbbf24',
      stroke: '#451a03',
      strokeThickness: 4,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    boostLabel.setDepth(350);

    if (this.worldContainer) {
      this.worldContainer.add(boostLabel);
    }

    this.tweens.add({
      targets: boostLabel,
      y: 630,
      alpha: 0,
      duration: 550,
      ease: 'Power2',
      onComplete: () => boostLabel.destroy()
    });
  }

  private playServeAnimation(customerId: string, coins: number, xp: number) {
    const sprite = this.customerSprites.get(customerId);
    const posX = sprite ? sprite.container.x : 440;
    const posY = sprite ? sprite.container.y : 650;

    // Burst golden coins fountain from register
    if (this.coinEmitter) {
      this.coinEmitter.explode(16, 370, 740);
    }
    if (this.sparkleEmitter) {
      this.sparkleEmitter.explode(18, posX, posY - 40);
    }

    // Floating 3D EGP label
    const textCoin = this.add.text(posX, posY - 55, `+${coins} ج.م 💰`, {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '22px',
      color: '#facc15',
      stroke: '#000000',
      strokeThickness: 4.5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    textCoin.setDepth(350);

    const textXp = this.add.text(posX, posY - 28, `+${xp} XP ⭐`, {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '16px',
      color: '#38bdf8',
      stroke: '#000000',
      strokeThickness: 3.5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    textXp.setDepth(350);

    const textHeart = this.add.text(posX, posY - 85, '💚', {
      fontSize: '26px'
    }).setOrigin(0.5);
    textHeart.setDepth(350);

    if (this.worldContainer) {
      this.worldContainer.add([textCoin, textXp, textHeart]);
    }

    this.tweens.add({
      targets: [textCoin, textXp, textHeart],
      y: '-=65',
      alpha: 0,
      duration: 1250,
      ease: 'Power2',
      onComplete: () => {
        textCoin.destroy();
        textXp.destroy();
        textHeart.destroy();
      }
    });
  }

  private playRestockAnimation() {
    if (this.sparkleEmitter) {
      this.sparkleEmitter.explode(35, 600, 600);
      this.sparkleEmitter.explode(35, 495, 310);
      this.sparkleEmitter.explode(35, 675, 360);
    }

    const restockText = this.add.text(this.BASE_WIDTH / 2, 340, 'تعبئة رفوف الصيدلية بنجاح! 📦✨', {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '20px',
      color: '#10b981',
      stroke: '#ffffff',
      strokeThickness: 4.5,
      fontStyle: 'bold'
    }).setOrigin(0.5);
    restockText.setDepth(350);

    if (this.worldContainer) {
      this.worldContainer.add(restockText);
    }

    this.tweens.add({
      targets: restockText,
      y: '-=40',
      alpha: 0,
      duration: 1600,
      ease: 'Power2',
      onComplete: () => restockText.destroy()
    });
  }

  // Idle Tycoon Floating Cash Drop (bounces on floor, tap to collect)
  private spawnFloatingCashDrop() {
    if (!this.worldContainer) return;

    // Pick a spot near aisle or counter
    const spots = [
      { x: 520, y: 550 },
      { x: 670, y: 530 },
      { x: 440, y: 520 }
    ];
    const spot = spots[Math.floor(Math.random() * spots.length)];

    const cashContainer = this.add.container(spot.x, spot.y);
    cashContainer.setDepth(280);

    const shadow = this.add.ellipse(0, 16, 36, 14, 0x000000, 0.35);
    const bubbleBg = this.add.rectangle(0, 0, 76, 28, 0x10b981).setOrigin(0.5);
    bubbleBg.setStrokeStyle(2, 0xffffff);

    const text = this.add.text(0, 0, '💵 +75 ج.م', {
      fontFamily: 'Tajawal, sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    cashContainer.add([shadow, bubbleBg, text]);
    cashContainer.setSize(76, 32);
    cashContainer.setInteractive({ useHandCursor: true });

    // Bouncy animation
    this.tweens.add({
      targets: cashContainer,
      y: spot.y - 12,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    cashContainer.on('pointerdown', () => {
      if (this.coinEmitter) {
        this.coinEmitter.explode(10, cashContainer.x, cashContainer.y);
      }
      gameBridge.emit('collect_floating_cash', 75);
      cashContainer.destroy();
      this.floatingCashContainer = undefined;
    });

    this.floatingCashContainer = cashContainer;
    this.worldContainer.add(cashContainer);

    // Auto-despawn after 12s if not collected
    this.time.delayedCall(12000, () => {
      if (this.floatingCashContainer === cashContainer) {
        cashContainer.destroy();
        this.floatingCashContainer = undefined;
      }
    });
  }
}
