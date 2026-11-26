// Main Layout Wrapper
'use client';

import { ReactNode, Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  locale: string;
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Suspense fallback={null}><Header locale={locale} /></Suspense>
      <main className="flex-1" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>
    </div>
  );
}
