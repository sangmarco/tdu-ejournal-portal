import { redirect, RedirectType, notFound } from 'next/navigation';
import { Locale, locales } from '@/lib/i18n';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function ArchivesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  redirect(`/${locale}/journals`, RedirectType.replace);
}
