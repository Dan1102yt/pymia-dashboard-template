import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useClientConfig } from '../../hooks/useClientConfig';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const config = useClientConfig();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar config={config} />
      <BottomNav config={config} />

      <main className="lg:pl-60 pb-20 lg:pb-0 min-h-screen">
        <div className="px-4 py-5 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
