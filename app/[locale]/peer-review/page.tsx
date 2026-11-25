import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale, locales, dict } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PeerReviewPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PeerReviewPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const t = dict[locale];
  return {
    title: t.peerReviewTitle,
    description: t.peerReviewDescription,
  };
}

const reviewSteps = [
  { number: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
  { number: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
  { number: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
  { number: 4, titleKey: 'step4Title', descKey: 'step4Desc' },
  { number: 5, titleKey: 'step5Title', descKey: 'step5Desc' },
  { number: 6, titleKey: 'step6Title', descKey: 'step6Desc' },
];

const reviewModels = [
  {
    id: 'double-blind',
    titleKey: 'model1Title',
    descKey: 'model1Desc',
    featuresKey: 'model1Features',
    default: true,
  },
  {
    id: 'open',
    titleKey: 'model2Title',
    descKey: 'model2Desc',
    featuresKey: 'model2Features',
    default: false,
  },
];

function StepCard({ step, locale }: { step: typeof reviewSteps[0]; locale: Locale }) {
  const t = dict[locale];
  return (
    <Card className="p-6 relative">
      <div className="absolute -top-3 left-6 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
        {step.number}
      </div>
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t[step.titleKey]}</h3>
        <p className="text-gray-600">{t[step.descKey]}</p>
      </div>
    </Card>
  );
}

function ModelCard({ model, locale }: { model: typeof reviewModels[0]; locale: Locale }) {
  const t = dict[locale];
  return (
    <Card className={`p-6 ${model.default ? 'ring-2 ring-primary-500' : ''}`}>
      <div className="flex items-start gap-3 mb-4">
        <input
          type="radio"
          name="review-model"
          value={model.id}
          defaultChecked={model.default}
          className="mt-1 w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t[model.titleKey]}</h3>
          {model.default && <Badge variant="success" className="ml-2">{t.defaultModel}</Badge>}
        </div>
      </div>
      <p className="text-gray-600 mb-4">{t[model.descKey]}</p>
      <ul className="space-y-2">
        {t[model.featuresKey]?.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TimelineCard({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const timeline = [
    { phase: t.timeline1Phase, duration: t.timeline1Duration, desc: t.timeline1Desc },
    { phase: t.timeline2Phase, duration: t.timeline2Duration, desc: t.timeline2Desc },
    { phase: t.timeline3Phase, duration: t.timeline3Duration, desc: t.timeline3Desc },
    { phase: t.timeline4Phase, duration: t.timeline4Duration, desc: t.timeline4Desc },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{t.reviewTimeline}</h3>
      <div className="space-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary-600" />
              {index < timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{item.phase}</span>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">{item.duration}</span>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default async function PeerReviewPage({ params }: PeerReviewPageProps) {
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
          <li className="text-gray-900 font-medium">{t.peerReview}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.peerReviewTitle}</h1>
        <p className="text-lg text-gray-600">{t.peerReviewDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          <Badge variant="success">{t.doubleBlindDefault}</Badge>
          <Badge variant="outline">{t.openReviewOption}</Badge>
          <Badge variant="outline">{t.editorialDiscretion}</Badge>
        </div>
      </header>

      {/* Review Process Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.reviewProcess}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {reviewSteps.map((step) => (
            <StepCard key={step.number} step={step} locale={locale} />
          ))}
        </div>
      </section>

      {/* Review Models */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.reviewModels}</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{t.reviewModelsDescription}</p>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {reviewModels.map((model) => (
            <ModelCard key={model.id} model={model} locale={locale} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.reviewTimelineTitle}</h2>
        <div className="max-w-2xl mx-auto">
          <TimelineCard locale={locale} />
        </div>
      </section>

      {/* Reviewer Guidelines */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.reviewerGuidelines}</h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.reviewCriteria}</h3>
            <ul className="space-y-3">
              {t.reviewCriteriaItems?.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-primary-600">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">{t.recommendationOptions}</h3>
            <ul className="space-y-3">
              {t.recommendationItems?.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="text-primary-600">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Ethics */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{t.reviewEthics}</h2>
        <Card className="p-6 max-w-3xl mx-auto">
          <ul className="space-y-4">
            {t.ethicsItems?.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
