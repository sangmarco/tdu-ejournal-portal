import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CopyrightPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CopyrightPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.copyrightTitle,
    description: t.copyrightDescription,
  };
}

export default async function CopyrightPage({ params }: CopyrightPageProps) {
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
          <li className="text-gray-900 font-medium">{t.copyright}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.copyrightTitle}</h1>
        <p className="text-lg text-gray-600">{t.copyrightDescription}</p>
      </header>

      {/* Author Rights */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.authorRights}</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.authorRetainCopyright}</h3>
            <p className="text-gray-600 mb-4">{t.authorRetainCopyrightDesc}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {t.authorRightsItems?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.authorGrantLicense}</h3>
            <p className="text-gray-600 mb-4">{t.authorGrantLicenseDesc}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {t.licenseGrantItems?.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Journal Rights */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.journalRights}</h2>
        <Card className="p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">{t.journalRightsTitle}</h3>
          <p className="text-gray-600 mb-4">{t.journalRightsDesc}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {t.journalRightsItems?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Creative Commons Licenses */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.creativeCommonsLicenses}</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{t.ccLicensesDesc}</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {t.ccLicenses?.map((license: { id: string; name: string; desc: string; permissions: string[] }) => (
            <Card key={license.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={license.id === 'CC BY 4.0' ? 'success' : 'outline'}>{license.name}</Badge>
              </div>
              <p className="text-gray-600 mb-4">{license.desc}</p>
              <ul className="space-y-2">
                {license.permissions.map((perm: string, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {perm}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Third Party Content */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.thirdPartyContent}</h2>
        <Card className="p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">{t.thirdPartyContentTitle}</h3>
          <p className="text-gray-600 mb-4">{t.thirdPartyContentDesc}</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {t.thirdPartyContentItems?.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Citation Requirement */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.citationRequirement}</h2>
        <Card className="p-6 max-w-3xl mx-auto">
          <h3 className="font-semibold text-gray-900 mb-4">{t.citationRequirementTitle}</h3>
          <p className="text-gray-600 mb-4">{t.citationRequirementDesc}</p>
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
            {t.citationExample}
          </div>
        </Card>
      </section>
    </div>
  );
}
