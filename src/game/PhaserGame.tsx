import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { PharmacyScene } from './PharmacyScene';
import { useGame } from '../context/GameContext';

export const PhaserGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);
  const { settings } = useGame();

  useEffect(() => {
    if (!containerRef.current) return;

    // Calculate resolution based on graphics quality setting
    let pixelRatio = 2;
    if (settings.graphicsQuality === 'ultra') {
      pixelRatio = Math.min(window.devicePixelRatio || 2, 3);
    } else if (settings.graphicsQuality === 'high') {
      pixelRatio = Math.min(window.devicePixelRatio || 1.5, 2);
    } else {
      pixelRatio = 1.2;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: containerRef.current.clientWidth || window.innerWidth,
      height: containerRef.current.clientHeight || window.innerHeight,
      transparent: true,
      render: {
        antialias: true,
        antialiasGL: true,
        roundPixels: false,
        powerPreference: 'high-performance'
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: containerRef.current,
        width: '100%',
        height: '100%'
      },
      fps: {
        target: 60,
        min: 30,
        forceSetTimeOut: false
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }
        }
      },
      scene: [PharmacyScene]
    };

    (config as any).resolution = pixelRatio;

    const game = new Phaser.Game(config);
    gameInstanceRef.current = game;

    const handleResize = () => {
      if (gameInstanceRef.current && containerRef.current) {
        gameInstanceRef.current.scale.resize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      game.destroy(true);
      gameInstanceRef.current = null;
    };
  }, [settings.graphicsQuality]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none touch-none"
    />
  );
};
