import { useEffect } from 'react';
import { clientConfig } from '../config/client.config';

export function useClientConfig() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', clientConfig.colors.primary);
    root.style.setProperty('--color-secondary', clientConfig.colors.secondary);
    root.style.setProperty('--color-bg', clientConfig.colors.bg);
  }, []);

  return clientConfig;
}

export type { ClientConfig } from '../types/config.types';
