import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, locales, dict } from '@/lib/i18n';
import ContactContent from './ContactContent';

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.contactTitle,
    description: t.contactDescription,
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  return <ContactContent locale={locale} />;
}
