import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
    </div>
  </HomeLayout>;
}
