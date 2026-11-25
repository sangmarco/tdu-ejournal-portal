import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';

interface TermsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = dict[locale];
  return {
    title: t.termsTitle,
    description: t.termsDescription,
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const t = dict[locale];
  const lastUpdated = new Date().toLocaleDateString(locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.termsOfUse}</li>
        </ol>
      </nav>

      <header className="mb-12 max-w-3xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.termsTitle}</h1>
        <p className="text-sm text-gray-500 mb-6">{t.lastUpdated} {lastUpdated}</p>
        <p className="text-lg text-gray-600">{t.termsIntro}</p>
      </header>

      <div className="max-w-3xl space-y-10">
        {t.termsSections.map((section: { title: string; content: string[] }, i: number) => (
          <section key={i} className="prose prose-gray max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.content.map((paragraph: string, j: number) => (
                <p key={j} className="text-gray-700">{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <Card className="p-6 bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-gray-900 mb-3">{t.acceptance}</h3>
          <p className="text-gray-700">{t.acceptanceDesc}</p>
        </Card>
      </div>
    </div>
  );
}