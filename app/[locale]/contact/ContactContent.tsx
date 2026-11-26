'use client';

import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ContactContent({ locale }: { locale: Locale }) {
  const vi = locale === 'vi';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-[#205778]">{vi ? 'Trang chủ' : 'Home'}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-medium text-gray-900">{vi ? 'Liên hệ' : 'Contact'}</li>
        </ol>
      </nav>

      <header className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-[#205778] mb-3">
          {vi ? 'Liên hệ Tòa soạn & Ban Quản trị' : 'Contact Editorial Office & Administration'}
        </h1>
        <p className="text-lg text-gray-600">
          {vi
            ? 'Thông tin kết nối và tiếp nhận thông tin học thuật từ tác giả, độc giả và các nhà khoa học.'
            : 'Connecting and receiving academic communications from authors, readers, and researchers.'}
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {vi ? 'Gửi tin nhắn / Ý kiến đóng góp' : 'Send a Message / Inquiries'}
          </h2>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                {vi ? 'Họ và tên' : 'Full Name'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205778] focus:border-[#205778]"
                placeholder={vi ? 'Nguyễn Văn A' : 'John Doe'}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                {vi ? 'Địa chỉ Email' : 'Email Address'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205778] focus:border-[#205778]"
                placeholder="author@example.com"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                {vi ? 'Chủ đề' : 'Subject'} <span className="text-red-500">*</span>
              </label>
              <select
                id="contact-subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205778] focus:border-[#205778]"
              >
                <option value="">{vi ? '-- Chọn chủ đề --' : '-- Select subject --'}</option>
                <option value="editorial">{vi ? 'Công tác biên tập & phản biện' : 'Editorial & Review Inquiries'}</option>
                <option value="submission">{vi ? 'Gửi bài và quy trình xuất bản' : 'Submissions & Publication Workflow'}</option>
                <option value="technical">{vi ? 'Hỗ trợ kỹ thuật hệ thống OJS' : 'OJS System Technical Support'}</option>
                <option value="other">{vi ? 'Vấn đề khác' : 'Other inquiries'}</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                {vi ? 'Nội dung tin nhắn' : 'Message Content'} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#205778] focus:border-[#205778] resize-y"
                placeholder={vi ? 'Nhập nội dung cần trao đổi...' : 'Enter your message details...'}
              ></textarea>
            </div>
            <Button type="submit" className="w-full bg-[#205778] hover:bg-[#18445e] text-white py-2.5">
              {vi ? 'Gửi tin nhắn' : 'Send Message'}
            </Button>
          </form>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {vi ? 'Thông tin Tòa soạn & Nhà xuất bản' : 'Publishing Office Details'}
            </h2>
            <dl className="space-y-4 text-sm text-gray-700">
              <div>
                <dt className="text-gray-500">{vi ? 'Cơ quan xuất bản' : 'Publisher'}</dt>
                <dd className="font-semibold text-gray-900">{vi ? 'Trường Đại học Thành Đông' : 'Thanh Dong University'}</dd>
              </div>
              <div>
                <dt className="text-gray-500">{vi ? 'Địa chỉ tòa soạn' : 'Office Address'}</dt>
                <dd className="font-medium">
                  {vi
                    ? 'Số 3 Vũ Công Đán, Phường Tứ Minh, TP. Hải Dương, Tỉnh Hải Dương'
                    : 'No. 3 Vu Cong Dan, Tu Minh Ward, Hai Duong City, Hai Duong Province, Vietnam'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{vi ? 'Email tiếp nhận bản thảo & hỗ trợ' : 'Editorial Email'}</dt>
                <dd className="font-medium text-[#205778]">
                  tapchikhoahoc@thanhdong.edu.vn
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">{vi ? 'Website cổng thông tin' : 'Portal Website'}</dt>
                <dd className="font-medium">
                  https://thanhdong.edu.vn
                </dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {vi ? 'Thời gian làm việc' : 'Working Hours'}
            </h2>
            <dl className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>{vi ? 'Thứ Hai - Thứ Sáu' : 'Monday - Friday'}</span>
                <span className="font-medium">07:30 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>{vi ? 'Thứ Bảy' : 'Saturday'}</span>
                <span className="font-medium">08:00 - 11:30</span>
              </div>
              <div className="flex justify-between">
                <span>{vi ? 'Chủ Nhật & Ngày lễ' : 'Sunday & Public Holidays'}</span>
                <span className="font-medium text-gray-500">{vi ? 'Nghỉ' : 'Closed'}</span>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
