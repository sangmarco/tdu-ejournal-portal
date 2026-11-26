import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface OpenAccessPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: OpenAccessPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.openAccessTitle,
    description: t.openAccessDescription,
  };
}

export default async function OpenAccessPage({ params }: OpenAccessPageProps) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const t = dict[locale];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.openAccess}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.openAccessTitle}</h1>
        <p className="text-lg text-gray-600">{t.openAccessDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Badge variant="success">{t.ccBy40}</Badge>
          <Badge variant="outline">{t.immediateAccess}</Badge>
          <Badge variant="outline">{t.noApc}</Badge>
        </div>
      </header>

      {/* Policy Overview */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.policyOverview}</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.freeAccess}</h3>
            <p className="text-gray-600">{t.freeAccessDesc}</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.reuseRights}</h3>
            <p className="text-gray-600">{t.reuseRightsDesc}</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.authorCopyright}</h3>
            <p className="text-gray-600">{t.authorCopyrightDesc}</p>
          </Card>
        </div>
      </section>

      {/* License Details */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.licenseDetails}</h2>
        <Card className="p-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 rounded-lg">
            <div className="text-3xl">📄</div>
            <div>
              <h3 className="font-semibold text-gray-900">{t.ccBy40License}</h3>
              <p className="text-sm text-gray-600">{t.ccBy40Desc}</p>
            </div>
          </div>
          <div className="prose prose-gray max-w-none">
            <h4 className="font-semibold text-gray-900 mb-3">{t.licensePermissions}</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {t.licensePermissionsItems?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <h4 className="font-semibold text-gray-900 mt-6 mb-3">{t.licenseRequirements}</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {t.licenseRequirementsItems?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      {/* Author Benefits */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.authorBenefits}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {t.authorBenefitsItems?.map((item: string, i: number) => (
            <Card key={i} className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center text-2xl mb-4">
                {['📈', '🌍', '🔗', '📚'][i]}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item}</h3>
              <p className="text-sm text-gray-600">{t.authorBenefitsDescs[i]}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Archiving */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.archivingPolicy}</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.lockss}</h3>
            <p className="text-gray-600">{t.lockssDesc}</p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.portico}</h3>
            <p className="text-gray-600">{t.porticoDesc}</p>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.faq}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {t.faqItems?.map((item: { q: string; a: string }, i: number) => (
            <Card key={i} className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-gray-600">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
