import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { blogSource } from '@/lib/blog-source';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

const baseOptions: BaseLayoutProps = {
  nav: {
    enabled: false,
  },
}

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={blogSource.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
} 