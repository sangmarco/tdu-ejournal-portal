'use client';

import Link from 'next/link';
import { Locale, dict } from '@/lib/i18n';
import { useJournal } from '@/hooks/useOJS';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ContactContent({ locale }: { locale: Locale }) {
  const { journal } = useJournal();
  const t = dict[locale];

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-primary-600">{t.home}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-900 font-medium">{t.contact}</li>
        </ol>
      </nav>

      <header className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.contactTitle}</h1>
        <p className="text-lg text-gray-600">{t.contactDescription}</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.sendMessage}</h2>
          <form className="space-y-4" action={`/${locale}/contact`} method="POST">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.email} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                {t.subject} <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{t.selectSubject}</option>
                <option value="editorial">{t.subjectEditorial}</option>
                <option value="technical">{t.subjectTechnical}</option>
                <option value="submission">{t.subjectSubmission}</option>
                <option value="permissions">{t.subjectPermissions}</option>
                <option value="other">{t.subjectOther}</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                {t.message} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
              ></textarea>
            </div>
            <Button type="submit" className="w-full">{t.sendMessage}</Button>
          </form>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.journalContactInfo}</h2>
            <dl className="space-y-4">
              {journal?.contactName && (
                <div>
                  <dt className="text-sm text-gray-500">{t.contactPerson}</dt>
                  <dd className="font-medium">{journal.contactName}</dd>
                </div>
              )}
              {journal?.contactEmail && (
                <div>
                  <dt className="text-sm text-gray-500">{t.email}</dt>
                  <dd className="font-medium">
                    <a href={`mailto:${journal.contactEmail}`} className="text-primary-600 hover:underline">
                      {journal.contactEmail}
                    </a>
                  </dd>
                </div>
              )}
              {journal?.contactPhone && (
                <div>
                  <dt className="text-sm text-gray-500">{t.phone}</dt>
                  <dd className="font-medium">{journal.contactPhone}</dd>
                </div>
              )}
              {journal?.contactMailingAddress && (
                <div>
                  <dt className="text-sm text-gray-500">{t.address}</dt>
                  <dd className="font-medium whitespace-pre-line">{journal.contactMailingAddress}</dd>
                </div>
              )}
              {journal?.website && (
                <div>
                  <dt className="text-sm text-gray-500">{t.website}</dt>
                  <dd className="font-medium">
                    <a href={journal.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      {journal.website}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.officeHours}</h2>
            <dl className="space-y-2 text-gray-700">
              {t.officeHoursItems?.map((item: string, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{item.split(':')[0]}</span>
                  <span className="font-medium">{item.split(':')[1]}</span>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.socialMedia}</h2>
            <div className="flex gap-4">
              {t.socialLinks?.map((link: { name: string; url: string; icon: string }, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-100 hover:text-primary-600 transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Map Placeholder */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{t.ourLocation}</h2>
        <Card className="p-0 overflow-hidden">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🗺️</div>
              <p>{t.mapPlaceholder}</p>
              <p className="text-sm">{journal?.contactMailingAddress || 'Thanh Dong University'}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
