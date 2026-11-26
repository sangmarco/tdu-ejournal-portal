import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';

export default function EditorialBoardContent({ locale }: { locale: Locale }) {
  const vi = locale === 'vi';

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href={`/${locale}`} className="hover:text-[#205778]">{vi ? 'Trang chủ' : 'Home'}</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-medium text-gray-900">{vi ? 'Hội đồng biên tập' : 'Editorial Board'}</li>
        </ol>
      </nav>

      <header className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-bold text-[#205778] lg:text-4xl mb-3">
          {vi ? 'Hội đồng Biên tập & Ban Cố vấn Khoa học' : 'Editorial Board & Scientific Advisory Committee'}
        </h1>
        <p className="text-lg text-gray-600">
          {vi
            ? 'Cơ cấu tổ chức học thuật bảo đảm chất lượng chuyên môn và tính liêm chính khoa học của các ấn phẩm.'
            : 'Academic governance ensuring scholarly quality and research integrity across all publications.'}
        </p>
      </header>

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {vi ? 'Hội đồng Chỉ đạo Xuất bản TDU' : 'TDU Publishing Steering Board'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {vi
              ? 'Hội đồng Chỉ đạo Xuất bản chịu trách nhiệm định hướng chiến lược học thuật, ban hành các quy chế quản lý và bảo đảm nguồn lực cho hoạt động của hệ thống Cổng tạp chí khoa học Trường Đại học Thành Đông.'
              : 'The Publishing Steering Board oversees academic strategy, enacts governance policies, and ensures resource allocation for the Thanh Dong University eJournal Portal.'}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-[#205778] mb-1">
                {vi ? 'Hội đồng Cố vấn Chiến lược' : 'Strategic Advisory Board'}
              </h3>
              <p className="text-sm text-gray-600">
                {vi
                  ? 'Ban Giám hiệu Trường Đại học Thành Đông cùng các nhà khoa học, chuyên gia đầu ngành trong và ngoài nước định hướng sự phát triển của hệ thống xuất bản.'
                  : 'The Board of Trustees and Rectorate of Thanh Dong University alongside leading domestic and international scholars directing publishing development.'}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg text-[#205778] mb-1">
                {vi ? 'Ban Quản trị Kỹ thuật & Chuẩn hóa Dữ liệu' : 'Technical & Data Management'}
              </h3>
              <p className="text-sm text-gray-600">
                {vi
                  ? 'Bộ phận chuyên trách quản trị hệ thống OJS 3.5, triển khai chuẩn siêu dữ liệu OAI-PMH, định danh DOI và bảo mật thông tin theo tiêu chuẩn quốc tế.'
                  : 'Specialized team managing the OJS 3.5 platform, implementing OAI-PMH metadata standards, DOI registration, and digital security compliance.'}
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {vi ? 'Ban Biên tập theo từng Tạp chí Chuyên ngành' : 'Journal Editorial Boards'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {vi
              ? 'Mỗi tạp chí trực thuộc Cổng thông tin TDU có Hội đồng Biên tập và Ban Thư ký chuyên môn độc lập, bao gồm các Tổng biên tập, Phó Tổng biên tập, Trưởng tiểu ban chuyên ngành và các ủy viên phản biện uy tín. Danh sách thành viên, học hàm, học vị, cơ quan công tác và mã định danh ORCID được công bố công khai trên trang thông tin riêng của từng tạp chí.'
              : 'Each journal aggregated within the TDU Portal maintains an independent Editorial Board and Editorial Secretariat, comprising Editors-in-Chief, Associate Editors, Section Editors, and distinguished peer reviewers. Detailed rosters with academic titles, affiliations, and ORCID identifiers are published transparently on each journal\'s page.'}
          </p>

          <div className="rounded-lg border bg-slate-50 p-6 space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {vi ? 'Xem Ban Biên tập chi tiết tại các Tạp chí trực thuộc:' : 'View detailed editorial boards by journal:'}
            </h3>
            <p className="text-sm text-gray-600">
              {vi
                ? 'Để tra cứu danh sách Ban biên tập đầy đủ kèm hồ sơ nghiên cứu của từng chuyên san, vui lòng truy cập danh mục tạp chí:'
                : 'To consult the complete editorial board roster and researcher profiles for specific journals, please visit the journal directory:'}
            </p>
            <div>
              <Link href={`/${locale}/journals`} className="inline-block rounded bg-[#205778] px-5 py-2.5 text-white font-medium hover:bg-[#18445e] transition-colors">
                {vi ? 'Truy cập Danh mục Tạp chí →' : 'Access Journal Directory →'}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
