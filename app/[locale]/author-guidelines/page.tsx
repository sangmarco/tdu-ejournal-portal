import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict, getTranslationList } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AuthorGuidelinesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: AuthorGuidelinesPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.authorGuidelinesTitle,
    description: t.authorGuidelinesDescription,
  };
}

const sections = [
  {
    id: 'general',
    titleKey: 'section1Title',
    contentKey: 'section1Content',
  },
  {
    id: 'manuscript-types',
    titleKey: 'section2Title',
    contentKey: 'section2Content',
  },
  {
    id: 'manuscript-preparation',
    titleKey: 'section3Title',
    contentKey: 'section3Content',
  },
  {
    id: 'structure',
    titleKey: 'section4Title',
    contentKey: 'section4Content',
  },
  {
    id: 'references',
    titleKey: 'section5Title',
    contentKey: 'section5Content',
  },
  {
    id: 'figures-tables',
    titleKey: 'section6Title',
    contentKey: 'section6Content',
  },
  {
    id: 'ethics',
    titleKey: 'section7Title',
    contentKey: 'section7Content',
  },
  {
    id: 'submission-process',
    titleKey: 'section8Title',
    contentKey: 'section8Content',
  },
  {
    id: 'copyright',
    titleKey: 'section9Title',
    contentKey: 'section9Content',
  },
];

function SectionCard({ section, locale }: { section: typeof sections[0]; locale: Locale }) {
  const t = dict[locale];
  return (
    <Card className="p-6" id={section.id}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
          {sections.indexOf(section) + 1}
        </span>
        {t[section.titleKey]}
      </h2>
      <div className="prose prose-gray max-w-none text-gray-700">
        {getTranslationList(locale, section.contentKey).map((paragraph: string, i: number) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}

function QuickReferenceCard({ locale }: { locale: Locale }) {
  const t = dict[locale];
  return (
    <Card className="p-6 sticky top-24">
      <h3 className="font-semibold text-gray-900 mb-4">{t.quickReference}</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <Link
            key={section.id}
            href={`#${section.id}`}
            className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
          >
            {t[section.titleKey]}
          </Link>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-medium text-gray-900 mb-3">{t.keyPoints}</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {t.keyPointsItems?.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export default async function AuthorGuidelinesPage({ params }: AuthorGuidelinesPageProps) {
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
          <li className="text-gray-900 font-medium">{t.authorGuidelines}</li>
        </ol>
      </nav>

      <header className="mb-12 max-w-3xl">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.authorGuidelinesTitle}</h1>
        <p className="text-lg text-gray-600">{t.authorGuidelinesDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge variant="outline">{t.openAccess}</Badge>
          <Badge variant="outline">{t.peerReview}</Badge>
          <Badge variant="outline">{t.ccByLicense}</Badge>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} locale={locale} />
          ))}
        </div>

        <aside className="lg:col-span-1">
          <QuickReferenceCard locale={locale} />
        </aside>
      </div>

      <div className="mt-12 text-center">
        <Link href={`/${locale}/submissions`}>
          <Button size="lg">{t.submitManuscript}</Button>
        </Link>
      </div>
    </div>
  );
}
