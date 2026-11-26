import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';

export default function AboutContent({ locale }: { locale: Locale }) {
  const vi = locale === 'vi';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-[#205778]">{vi ? 'Trang chủ' : 'Home'}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-medium text-gray-900">{vi ? 'Giới thiệu' : 'About'}</li>
        </ol>
      </nav>

      <header className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-bold text-[#205778] lg:text-4xl mb-3">
          {vi ? 'Giới thiệu Cổng tạp chí khoa học TDU' : 'About TDU eJournal Portal'}
        </h1>
        <p className="text-lg text-gray-600">
          {vi
            ? 'Hệ thống công bố học thuật và nghiên cứu khoa học trực tuyến của Trường Đại học Thành Đông.'
            : 'Online scholarly publishing and research dissemination system of Thanh Dong University.'}
        </p>
      </header>

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {vi ? 'Tôn chỉ và mục đích' : 'Mission & Scope'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {vi
              ? 'Cổng tạp chí khoa học Trường Đại học Thành Đông (TDU eJournal Portal) là diễn đàn khoa học công bố các kết quả nghiên cứu khoa học lý luận và thực tiễn có giá trị cao thuộc nhiều lĩnh vực: Kinh tế - Quản lý, Khoa học Kỹ thuật và Công nghệ, Y - Dược, Khoa học Xã hội và Nhân văn, Giáo dục và Pháp luật.'
              : 'The Thanh Dong University eJournal Portal (TDU eJournal Portal) is an academic forum publishing high-value theoretical and empirical research across diverse disciplines: Economics & Management, Engineering & Technology, Health & Pharmacy, Social Sciences & Humanities, Education, and Law.'}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {vi
              ? 'Cổng thông tin tích hợp và tổng hợp các tạp chí chuyên ngành trực thuộc trường, vận hành theo tiêu chuẩn xuất bản quốc tế trên nền tảng Open Journal Systems (OJS), hỗ trợ quy trình biên tập minh bạch, phản biện nghiêm ngặt và lưu trữ số hóa lâu dài.'
              : 'The portal aggregates specialized scholarly journals under the university, operating under international publishing standards powered by Open Journal Systems (OJS), ensuring transparent editorial workflows, rigorous peer review, and long-term digital preservation.'}
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-[#205778] mb-3">
              {vi ? 'Truy cập mở (Open Access)' : 'Open Access Policy'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {vi
                ? 'Các tạp chí trên cổng thông tin áp dụng chính sách truy cập mở hoàn toàn (Open Access). Độc giả có thể đọc, tải về và trích dẫn toàn văn các bài báo khoa học mà không phải trả phí, thúc đẩy chia sẻ tri thức phục vụ cộng đồng và xã hội.'
                : 'Journals on the portal adhere to an immediate Open Access policy. Readers can freely read, download, and cite the full text of all published scientific articles without subscription fees, promoting widespread knowledge sharing.'}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold text-[#205778] mb-3">
              {vi ? 'Đạo đức xuất bản & Phản biện' : 'Publishing Ethics & Peer Review'}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {vi
                ? 'Quy trình thẩm định và bình duyệt bài viết tuân thủ nghiêm ngặt chuẩn mực đạo đức của Ủy ban Đạo đức Xuất bản Quốc tế (COPE). Tất cả bản thảo được đánh giá thông qua quy trình bình duyệt kín hai chiều (double-blind peer review).'
                : 'Reviewing and editorial procedures adhere strictly to the Committee on Publication Ethics (COPE) core practices. All submitted manuscripts undergo rigorous double-blind peer review by qualified independent experts.'}
            </p>
          </Card>
        </section>

        <section className="rounded-lg border bg-slate-50 p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {vi ? 'Cơ quan xuất bản' : 'Publisher Information'}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">{vi ? 'Cơ quan chủ quản:' : 'Publisher:'}</p>
              <p>{vi ? 'Trường Đại học Thành Đông' : 'Thanh Dong University'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{vi ? 'Địa chỉ:' : 'Address:'}</p>
              <p>{vi ? 'Số 3 Vũ Công Đán, Phường Tứ Minh, TP. Hải Dương, Tỉnh Hải Dương' : 'No. 3 Vu Cong Dan, Tu Minh Ward, Hai Duong City, Vietnam'}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{vi ? 'Nền tảng xuất bản:' : 'Publishing Platform:'}</p>
              <p>Open Journal Systems (OJS 3.5)</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{vi ? 'Giao thức dữ liệu:' : 'Metadata Protocol:'}</p>
              <p>OAI-PMH (Dublin Core) & REST API</p>
            </div>
          </div>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link href={`/${locale}/journals`} className="text-[#205778] font-medium underline">
              {vi ? 'Xem danh mục các tạp chí →' : 'View journal directory →'}
            </Link>
            <Link href={`/${locale}/author-guidelines`} className="text-[#205778] font-medium underline">
              {vi ? 'Quy định và hướng dẫn tác giả →' : 'Author guidelines →'}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
