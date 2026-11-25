// Main Layout Wrapper
'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  locale: string;
}

export function MainLayout({ children, locale }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <Header locale={locale} />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer locale={locale} />
    </div>
  );
}