export interface HostAdapter {
  isDesktop(): boolean;
  isTablet(): boolean;
  isBrowser(): boolean;
  getPlatform(): string;
}

export function createHostAdapter(): HostAdapter {
  return {
    isDesktop() {
      return false;
    },
    isTablet() {
      return false;
    },
    isBrowser() {
      return true;
    },
    getPlatform() {
      return 'browser';
    },
  };
}
