import { Customer } from '../types/game';

type BridgeCallback = (...args: any[]) => void;

class GameBridge {
  private listeners: Map<string, BridgeCallback[]> = new Map();

  public on(event: string, callback: BridgeCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: BridgeCallback) {
    const list = this.listeners.get(event);
    if (!list) return;
    this.listeners.set(
      event,
      list.filter(cb => cb !== callback)
    );
  }

  public emit(event: string, ...args: any[]) {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach(cb => {
        try {
          cb(...args);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

export const gameBridge = new GameBridge();
