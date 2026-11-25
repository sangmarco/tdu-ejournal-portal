// Internationalization Configuration
export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}

// Translation dictionary for easy access by locale
export const dict: Record<Locale, Record<string, any>> = {
  vi: {},
  en: {},
};

// Initialize dict with all translation keys
function initDict() {
  const keys = translationKeys as any;
  for (const locale of locales) {
    dict[locale] = {};
    flattenTranslations(keys, dict[locale], locale);
  }
}

function flattenTranslations(obj: any, target: any, locale: Locale, prefix = '') {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value) && value[locale] !== undefined) {
      target[newKey] = value[locale];
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenTranslations(value, target, locale, newKey);
    }
  }
}

// Initialize on module load
initDict();

// Helper to get nested translation
export function getTranslation(locale: Locale, path: string): string {
  const keys = path.split('.');
  let result: any = dict[locale];
  for (const key of keys) {
    result = result?.[key];
  }
  return result || path;
}

// Translation keys structure
export const translationKeys = {
  common: {
    home: { vi: 'Trang chủ', en: 'Home' },
    about: { vi: 'Giới thiệu', en: 'About' },
    currentIssue: { vi: 'Số hiện tại', en: 'Current Issue' },
    archives: { vi: 'Lưu trữ', en: 'Archives' },
    submissions: { vi: 'Nộp bài', en: 'Submissions' },
    authors: { vi: 'Tác giả', en: 'Authors' },
    reviewers: { vi: 'Người đánh giá', en: 'Reviewers' },
    editors: { vi: 'Biên tập viên', en: 'Editors' },
    contact: { vi: 'Liên hệ', en: 'Contact' },
    search: { vi: 'Tìm kiếm', en: 'Search' },
    language: { vi: 'Ngôn ngữ', en: 'Language' },
    readMore: { vi: 'Đọc thêm', en: 'Read More' },
    viewAll: { vi: 'Xem tất cả', en: 'View All' },
    loading: { vi: 'Đang tải...', en: 'Loading...' },
    error: { vi: 'Có lỗi xảy ra', en: 'An error occurred' },
    noResults: { vi: 'Không tìm thấy kết quả', en: 'No results found' },
    published: { vi: 'Đã xuất bản', en: 'Published' },
    volume: { vi: 'Khổ', en: 'Volume' },
    number: { vi: 'Số', en: 'Number' },
    year: { vi: 'Năm', en: 'Year' },
    pages: { vi: 'Trang', en: 'Pages' },
    doi: { vi: 'DOI', en: 'DOI' },
    abstract: { vi: 'Tóm tắt', en: 'Abstract' },
    keywords: { vi: 'Từ khóa', en: 'Keywords' },
    fullText: { vi: 'Văn bản đầy đủ', en: 'Full Text' },
    pdf: { vi: 'PDF', en: 'PDF' },
    html: { vi: 'HTML', en: 'HTML' },
    xml: { vi: 'XML', en: 'XML' },
    citation: { vi: 'Trích dẫn', en: 'Citation' },
    share: { vi: 'Chia sẻ', en: 'Share' },
    print: { vi: 'In', en: 'Print' },
    email: { vi: 'Email', en: 'Email' },
    submitArticle: { vi: 'Nộp bài viết', en: 'Submit Article' },
    authorGuidelines: { vi: 'Hướng dẫn tác giả', en: 'Author Guidelines' },
    editorialBoard: { vi: 'Hội đồng biên tập', en: 'Editorial Board' },
    peerReview: { vi: 'Đánh giá đồng hành', en: 'Peer Review' },
    openAccess: { vi: 'Truy cập mở', en: 'Open Access' },
    copyright: { vi: 'Bản quyền', en: 'Copyright' },
    privacy: { vi: 'Quyền riêng tư', en: 'Privacy' },
    terms: { vi: 'Điều khoản', en: 'Terms' },
  },
  home: {
    heroTitle: {
      vi: 'Tạp Chí Khoa Học Trường Đại Học Thành Đông',
      en: 'Thanh Dong University Scientific Journal'
    },
    heroSubtitle: {
      vi: 'Nơi công bố các nghiên cứu khoa học chất lượng cao đa ngành',
      en: 'Publishing high-quality multidisciplinary scientific research'
    },
    latestIssue: { vi: 'Số mới nhất', en: 'Latest Issue' },
    recentArticles: { vi: 'Bài viết gần đây', en: 'Recent Articles' },
    mostRead: { vi: 'Đọc nhiều nhất', en: 'Most Read' },
    announcements: { vi: 'Thông báo', en: 'Announcements' },
    callForPapers: { vi: 'Kêu gọi bài viết', en: 'Call for Papers' },
    viewJournal: { vi: 'Xem tạp chí', en: 'View Journal' },
    submitNow: { vi: 'Nộp bài ngay', en: 'Submit Now' },
  },
  article: {
    submitted: { vi: 'Ngày nộp', en: 'Submitted' },
    accepted: { vi: 'Ngày chấp nhận', en: 'Accepted' },
    publishedOnline: { vi: 'Xuất bản trực tuyến', en: 'Published Online' },
    issue: { vi: 'Số', en: 'Issue' },
    section: { vi: 'Chuyên mục', en: 'Section' },
    category: { vi: 'Danh mục', en: 'Category' },
    correspondingAuthor: { vi: 'Tác giả liên lạc', en: 'Corresponding Author' },
    affiliation: { vi: 'Cơ quan công tác', en: 'Affiliation' },
    orcid: { vi: 'ORCID', en: 'ORCID' },
    download: { vi: 'Tải xuống', en: 'Download' },
    views: { vi: 'Lượt xem', en: 'Views' },
    downloads: { vi: 'Lượt tải', en: 'Downloads' },
    citations: { vi: 'Lượt trích dẫn', en: 'Citations' },
    relatedArticles: { vi: 'Bài viết liên quan', en: 'Related Articles' },
  },
  submission: {
    loginToSubmit: { vi: 'Đăng nhập để nộp bài', en: 'Login to Submit' },
    register: { vi: 'Đăng ký', en: 'Register' },
    forgotPassword: { vi: 'Quên mật khẩu', en: 'Forgot Password' },
    submissionTitle: { vi: 'Nộp bài viết mới', en: 'Submit New Article' },
    step1: { vi: 'Bước 1: Bắt đầu', en: 'Step 1: Start' },
    step2: { vi: 'Bước 2: Tải lên', en: 'Step 2: Upload' },
    step3: { vi: 'Bước 3: Metadata', en: 'Step 3: Metadata' },
    step4: { vi: 'Bước 4: Xác nhận', en: 'Step 4: Confirm' },
    step5: { vi: 'Bước 5: Hoàn tất', en: 'Step 5: Complete' },
  },
} as const;

export type TranslationKeys = typeof translationKeys;

export function t<T extends keyof TranslationKeys>(
  keys: T,
  key: keyof TranslationKeys[T],
  locale: Locale
): string {
  const keyObj = translationKeys[keys][key] as Record<Locale, string>;
  return keyObj[locale] || keyObj[defaultLocale] || String(key);
}