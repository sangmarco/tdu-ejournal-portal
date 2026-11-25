import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface SubmissionsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: SubmissionsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = dict[locale];
  return {
    title: t.submissionsTitle,
    description: t.submissionsDescription,
  };
}

const steps = [
  {
    number: 1,
    titleKey: 'step1Title',
    descKey: 'step1Desc',
    icon: '📝',
  },
  {
    number: 2,
    titleKey: 'step2Title',
    descKey: 'step2Desc',
    icon: '👥',
  },
  {
    number: 3,
    titleKey: 'step3Title',
    descKey: 'step3Desc',
    icon: '🔍',
  },
  {
    number: 4,
    titleKey: 'step4Title',
    descKey: 'step4Desc',
    icon: '✍️',
  },
  {
    number: 5,
    titleKey: 'step5Title',
    descKey: 'step5Desc',
    icon: '📚',
  },
];

function StepCard({ step, locale, index }: { step: typeof steps[0]; locale: Locale; index: number }) {
  const t = dict[locale];
  return (
    <Card className="p-6 relative">
      <div className="absolute -top-4 left-6 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
        {step.icon}
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl font-bold text-primary-600">{step.number}</span>
          <h3 className="text-lg font-semibold text-gray-900">{t[step.titleKey]}</h3>
        </div>
        <p className="text-gray-600 ml-10">{t[step.descKey]}</p>
      </div>
      {index < steps.length - 1 && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gray-200 hidden lg:block" />
      )}
    </Card>
  );
}

function RequirementCard({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-700">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
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
          <li className="text-gray-900 font-medium">{t.submissions}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.submissionsTitle}</h1>
        <p className="text-lg text-gray-600">{t.submissionsDescription}</p>
      </header>

      {/* Submission Process Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.submissionProcess}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 relative">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} locale={locale} index={index} />
          ))}
        </div>
      </section>

      {/* Requirements */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.submissionRequirements}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <RequirementCard
            title={t.beforeSubmitting}
            items={t.beforeSubmittingItems}
          />
          <RequirementCard
            title={t.manuscriptRequirements}
            items={t.manuscriptRequirementsItems}
          />
          <RequirementCard
            title={t.ethicalRequirements}
            items={t.ethicalRequirementsItems}
          />
        </div>
      </section>

      {/* Submission Checklist */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.submissionChecklist}</h2>
        <Card className="max-w-3xl mx-auto p-6">
          <ul className="space-y-3">
            {t.checklistItems.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
                />
                <label className="text-gray-700 cursor-pointer flex-1">{item}</label>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.readyToSubmit}</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">{t.readyToSubmitDesc}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/${locale}/author-guidelines`}>
            <Button variant="outline" size="lg">
              {t.authorGuidelines}
            </Button>
          </Link>
          <Link href="https://localhost/ojs/index.php/journal/user/register" target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              {t.registerSubmit}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}