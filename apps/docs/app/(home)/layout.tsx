import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/app/layout.config';
import { Navbar } from '@/components/navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions}>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  </HomeLayout>;
}
