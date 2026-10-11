export async function requestLandscapeMode(): Promise<boolean> {
  try {
    // 1. Fullscreen request (Standard and Webkit)
    const el = document.documentElement as any;
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (el.requestFullscreen) {
        await el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen().catch(() => {});
      }
    }

    // 2. Screen Orientation API lock
    const screenAny = window.screen as any;
    if (screenAny && screenAny.orientation && typeof screenAny.orientation.lock === 'function') {
      await screenAny.orientation.lock('landscape').catch(() => {});
      return true;
    } else if (screenAny && typeof screenAny.lockOrientation === 'function') {
      screenAny.lockOrientation('landscape');
      return true;
    } else if (screenAny && typeof screenAny.webkitLockOrientation === 'function') {
      screenAny.webkitLockOrientation('landscape');
      return true;
    } else if (screenAny && typeof screenAny.mozLockOrientation === 'function') {
      screenAny.mozLockOrientation('landscape');
      return true;
    }
  } catch (err) {
    console.log('Orientation lock not supported on this device/browser', err);
  }
  return false;
}

export function isDevicePortrait(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerHeight > window.innerWidth;
}

