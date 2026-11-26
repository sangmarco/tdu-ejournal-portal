# Nhật ký phát triển

## 2026-11-26 — dọn dẹp mã kế thừa, chuẩn hóa trang thông tin và tối ưu hóa build
- Thực hiện quyết định dọn dẹp các tuyến và component kế thừa từ giai đoạn ban đầu (trước khi chuyển đổi sang mô hình đa tạp chí):
  - Xóa bỏ `HomeContent.tsx` không dùng.
  - Thay thế các route đơn tạp chí cũ bằng cơ chế chuyển hướng (redirect) an toàn và chuẩn hóa:
    - `/archives` và `/current-issue` chuyển hướng về `/journals`.
    - `/issues/[id]` và `/articles/[id]` tự động tra cứu tạp chí sở hữu và chuyển hướng đến `/journals/[slug]/issues/[id]` và `/journals/[slug]/articles/[id]`.
    - Xóa các vòng lặp sinh tham số tĩnh `generateStaticParams()` vốn sinh 500 trang tĩnh giả (400 cho articles, 100 cho issues).
    - Xóa các component cũ `ArchivesContent.tsx`, `CurrentIssueContent.tsx`, `IssueContent.tsx`, `ArticleContent.tsx`.
- Chuẩn hóa các trang thông tin `about`, `editorial-board`, `contact`:
  - Loại bỏ các hook `useUsers` và `useJournal` gọi vào các endpoint OJS người dùng nội bộ (bị chặn 404 để bảo mật danh tính).
  - Cung cấp nội dung chuẩn mực về Cổng tạp chí TDU, Trường Đại học Thành Đông, tiêu chuẩn COPE, truy cập mở và hướng dẫn tra cứu ban biên tập chi tiết theo từng chuyên san.
  - Bổ sung `loading.tsx` cho `/articles/[id]` và `/issues/[id]` nhằm bảo đảm giới hạn Suspense cho cơ chế Partial Prerendering của Next.js 16.
- Kết quả tối ưu hóa:
  - Số trang tĩnh khi build giảm từ 563 trang xuống **63 trang**.
  - Thời gian biên dịch Turbopack giảm từ 4.6 giây xuống **1.7 giây** (nhanh hơn gần 3 lần).
  - Toàn bộ kiểm thử chất lượng: `npm test` 19/19 ĐẠT, PHP visibility 29/29 ĐẠT, `npx tsc --noEmit` ĐẠT, `npm run lint` ĐẠT, `npm run build` ĐẠT.

## 2026-11-26 — xử lý triệt để và xác minh làm giàu siêu dữ liệu OAI thực tế
- Phân tích nguyên nhân OAI enrichment trả về 0: Bộ phân tích `metadataMerge.ts` yêu cầu so khớp chính xác tuyệt đối URL bài báo giữa REST projection và OAI `dc:identifier`. Trong khi OJS 3.5.0.6 xuất OAI Dublin Core (`Dc11SchemaArticleAdapter.php:163`) dùng `urlLocaleForPage: ''` tạo URL chuẩn hóa không kèm mã ngôn ngữ (`/article/view/{bestId}`), thì `PublicPublicationsController::readerUrl()` lại sinh URL kèm tiền tố ngôn ngữ hiện tại của yêu cầu (`/vi/article/view/{bestId}`).
- Cập nhật chuẩn hóa: Sửa `readerUrl()` trong `PublicPublicationsController` (cả trong thư mục tích hợp và thư mục plugin OJS thực tế) truyền `urlLocaleForPage: ''` theo đúng chữ ký của `Dispatcher::url()`.
- Sửa lỗi tràn ngang 375px: Khi bài báo 2 nhận tóm tắt OAI chứa chuỗi ký tự dài không khoảng trắng, giao diện bài báo bị tràn ngang ở màn hình 375px. Đã sửa `app/[locale]/journals/[slug]/articles/[id]/page.tsx` thêm `min-w-0 max-w-full` và `[overflow-wrap:anywhere]`.
- Xác minh trực tiếp với OJS đang chạy:
  - `tapchi1`: Bài 2 nhận 2 mô tả tóm tắt (vi/en) và 6 từ khóa; Bài 1 nhận 2 tóm tắt và 1 chuỗi từ khóa OAI.
  - `tapchi2`: Bài 3 nhận 1 tóm tắt (vi) và 3 từ khóa ("â", "a", "b") OAI.
  - Toàn bộ 3/3 bài báo thuộc 2 tạp chí được làm giàu siêu dữ liệu OAI hoàn chỉnh.
- Chạy kiểm thử xác nhận chất lượng:
  - `scripts/browser-acceptance.cjs`: ĐẠT 88/88 nhóm trên cả 4 khung nhìn.
  - `npm test`: ĐẠT 19/19 kiểm thử tổng hợp.
  - `php integrations/ojs-public-publications/tests/visibility.php`: ĐẠT 29/29 khẳng định.
  - `npx tsc --noEmit`: ĐẠT.
  - `npm run lint`: ĐẠT.
  - `npm run build`: ĐẠT (563 trang tĩnh Turbopack).
- Cập nhật toàn bộ tài liệu bàn giao `HANDOFF.md`, báo cáo kiểm thử `TEST_REPORT.md`, nhật ký phát triển `DEVELOPMENT_LOG.md` và lộ trình `ROADMAP.md` hoàn toàn bằng tiếng Việt.

## 2026-11-26 — tiếp tục nghiệm thu bản dựng triển khai thực tế
- Đọc tài liệu dự án và hướng dẫn triển khai Next.js đã cài; xác nhận nhánh feature/multi-journal-ojs / 982c3e9, bảo toàn khác biệt có sẵn dù tóm tắt trạng thái không đầy đủ.
- Dựng thành công với đầu ra giới hạn; kiểm thử đơn vị 19/19, kiểm tra kiểu và lint đạt. Khởi chạy bản dựng triển khai riêng cổng 3101; nghiệm thu dùng URL môi trường ĐẠT 88/88 nhóm trên bản dựng triển khai thực tế, không sửa tập lệnh hoặc phụ thuộc. Đã xác minh Node PID 24868 là tiến trình con của shell 24420, đúng lệnh next start cổng 3101; dừng riêng tiến trình đó và xác nhận không còn tiến trình lắng nghe cổng 3101. Không dừng máy chủ phát triển của người dùng.
- Tạo tám ảnh trang chủ bản dựng triển khai VI/EN bốn khung nhìn; xem trực tiếp 375 VI và 1440 EN, quan sát bố cục và viền tiêu điểm liên kết bỏ qua. Đo tiêu điểm tự động đủ tám trường hợp. Không gọi đây là nghiệm thu thủ công hoặc trình đọc màn hình.
- Không sửa mã ứng dụng/OJS/môi trường/xuất bản và không tạo commit/hợp nhất nhánh. OAI vẫn chưa xác minh riêng. Không có ứng viên phản hồi Next.js được xác minh. Xem TEST_REPORT để biết giới hạn và kết quả cuối.

## 2026-11-26 — hoàn tất nghiệm thu trình duyệt thực (phạm vi tự động)
- Lần chạy Playwright Chromium bên ngoài cuối ĐẠT 88/88 nhóm trên máy chủ phát triển thực ở các khung nhìn thực 1440/1024/768/375, trang chủ/danh mục/tạp chí/số/bài/tìm kiếm VI/EN và tương tác bàn phím/truy vấn/di động. Xem TEST_REPORT để biết chính xác các khẳng định và phần loại trừ.
- Sửa lỗi đích liên kết bỏ qua không nhận tiêu điểm đã xác minh bằng main tabIndex=-1 và bài tràn ở 375px bằng giới hạn chiều rộng bài/ngắt từ ở bất kỳ vị trí nào. Sửa lỗi bộ chạy (tính bộ thông báo tuyến Next là cảnh báo nguồn; khớp ô nhập ẩn của tuyến được giữ lại). Không suy ra lỗi khung ứng dụng.
- Chạy lại kiểm thử đơn vị ĐẠT 19/19, kiểm tra kiểu/lint ĐẠT và dựng thoát thành công sau sửa ứng dụng. Rà soát phản hồi Next không có ứng viên đủ điều kiện. Không đổi nguồn/môi trường hoặc tạo commit. Làm giàu OAI vẫn chờ riêng.

### Lịch sử thiết lập
- Đọc tài liệu dự án bắt buộc và tài liệu Next Playwright đã cài; nhánh feature/multi-journal-ojs, HEAD 982c3e9. Công cụ trạng thái báo sạch nhưng `git diff --stat` cho thấy nhiều thay đổi có sẵn; đã bảo toàn tất cả. Không suy ra cây làm việc sạch từ tóm tắt trạng thái.
- Không tìm thấy MCP/kỹ năng trình duyệt hoặc phụ thuộc Playwright cục bộ. Cài Playwright/Chromium cách ly trong vùng tạm được phê duyệt mà không đổi phụ thuộc dự án. Thêm `scripts/browser-acceptance.cjs` chỉ đọc, có thể chạy lặp lại; kết quả trình duyệt sẽ ghi trong TEST_REPORT khi hoàn tất.
- `npm test` ĐẠT 19/19; `npx tsc --noEmit` ĐẠT; lint ban đầu KHÔNG ĐẠT vì nhập CommonJS trong bộ chạy mới, đã ghi chú miễn trừ hẹp rồi `npm run lint` ĐẠT. `npm run build` thoát thành công, đầu ra chỉ hoàn tất TypeScript (1961ms), không khẳng định số tuyến. Không đổi nguồn/cài đặt/môi trường/xuất bản hoặc tạo commit.

## 2026-11-26 — kiểm tra lại dữ liệu thực chỉ đọc theo yêu cầu
- Đọc lại tài liệu dự án bắt buộc và dịch vụ thực tế; xác minh feature/multi-journal-ojs / 982c3e9 và trạng thái ban đầu được báo sạch. Không đổi ứng dụng, nguồn, xuất bản hoặc cài đặt; không tạo commit.
- Dữ liệu tapchi2 mới đã xuất bản hiện có: số 2 / bài 3. Danh sách/chi tiết không xác thực và dịch vụ công khai thực ĐẠT; tapchi1 không đổi với số 1 / hai bài. Từ chối số thuộc tạp chí khác hai chiều ĐẠT (404 và dịch vụ trả null).
- Kiểm tra HTML sơ bộ VI/EN ĐẠT cho trang của cả hai tạp chí và cả sáu liên kết bài thực; HTML bài chứa URL dịch vụ công khai khớp. Không tuyên bố nghiệm thu trình duyệt/hình ảnh/PDF. Số làm giàu/mô tả/chủ đề OAI vẫn bằng 0 ở mỗi tạp chí.
- Sửa công cụ kiểm tra tạm bên ngoài về dấu nháy shell, URL nhập tệp và thời hạn chờ dùng lại; lần kiểm tra đầy đủ cuối ĐẠT. Cập nhật HANDOFF, TEST_REPORT và ROADMAP. Kiểm thử đơn vị/kiểm tra kiểu/lint/dựng CHƯA CHẠY trong lượt kiểm tra lại chỉ đọc/tài liệu; rà soát phản hồi Next không có ứng viên đủ điều kiện.

## 2026-11-26 — tạp chí công khai thứ hai đã được phê duyệt
- Tích hợp tapchi2 được người dùng phê duyệt bằng danh sách cho phép chính xác hai đường dẫn của phần bổ trợ và một cài đặt danh mục môi trường hiện có được Git bỏ qua. Kiểm tra cờ công khai/trạng thái phần bổ trợ hiện tại qua DAO đã cài; chỉ bật phần bổ trợ tapchi2 bằng API cài đặt phần bổ trợ đúng phạm vi. Không thay đổi xuất bản/cài đặt truy cập.
- Sửa tuyến số sai định dạng trả 500 bằng chuyển ID một đoạn đường dẫn tới bộ xác thực số nguyên có giới hạn hiện có (404). Giữ kiểm tra quyền sở hữu ngữ cảnh/số/phiên bản xuất bản hiện hành/chuyên mục.
- Lược đồ đã cài cho phép chế độ null và chính sách không xác thực từ chối NONE; bỏ ép kiểu số, chỉ nhận null/0/1 tường minh và từ chối giá trị thiếu/sai định dạng. 29 khẳng định PHP ĐẠT.
- Danh sách tapchi2 thực rỗng; từ chối số thuộc tapchi1 bằng 404. Kiểm tra HTTP sơ bộ cổng VI/EN ĐẠT; không tuyên bố nghiệm thu xuất bản tapchi2 thực. OAI vẫn chưa được làm giàu. Kiểm thử npm 19 ĐẠT, kiểm tra kiểu/lint ĐẠT, dựng thoát thành công với đầu ra giới hạn. Xem TEST_REPORT. Không tạo commit.

## 2026-11-26 — chẩn đoán cấu hình cổng thông tin và đính chính bằng chứng
- Đọc tài liệu ghi nhớ bắt buộc và hướng dẫn biến môi trường Next đã cài. Tái hiện dịch vụ HTTP 404 dù lớp dữ liệu công khai trực tiếp trả 200: địa chỉ gốc cục bộ thiếu `/index.php`. Chỉ sửa OJS_BASE_URL trong .env.local được Git bỏ qua, giữ mọi cài đặt khác; không sửa mã triển khai hoặc nguồn.
- Dịch vụ kiểm tra mới trả 2 bài REST nhưng không có bài được làm giàu/mô tả/chủ đề OAI. Rút lại các tuyên bố trước về đã xác minh làm giàu tóm tắt/từ khóa thực. Quy tắc định danh chính xác giữ nguyên.
- Trang phát triển /vi HTTP 200 nay chứa liên kết bài mà không có văn bản lỗi nguồn; chỉ kiểm tra HTML sơ bộ. Điểm Lighthouse 100 trước do người dùng báo là kiểm tra trạng thái lỗi, không phải nghiệm thu xuất bản.
- Kiểm thử ĐẠT 19/19, kiểm tra kiểu ĐẠT, lint ĐẠT, dựng thoát thành công với đầu ra công cụ giới hạn; không có nghiệm thu mới bản dựng triển khai/trình duyệt. Các điều kiện PHP ĐẠT 20 khẳng định, nhưng chấp nhận chế độ null vẫn là câu hỏi chính sách an toàn chưa giải quyết.
- Kiểm tra mới số abc sai định dạng trả 500; từ chối có kiểm soát và xác minh hồi quy bản đã triển khai còn là việc tiếp theo. Không tạo commit, không truy cập đặc quyền, không có ứng viên phản hồi Next mới. Xem TEST_REPORT về phạm vi.

## 2026-11-26 — triển khai phần bổ trợ tổng quát và xác minh tích hợp thực
- Người dùng cung cấp PDF tham khảo (`D:\WEBSITE TAP CHI - SANG KIEN NCKH\g.pdf` - 151 trang, hệ thống tạp chí Laravel+React tùy chỉnh của Đại học Sao Đỏ) và phê duyệt tiếp tục. Hoàn tất đánh giá kiến trúc kỹ lưỡng: xây lại độc lập bỏ OJS không phù hợp yêu cầu TDU về tổng hợp nhiều tạp chí OJS hiện có, với OJS 3.5.0.6 là hệ thống dữ liệu xuất bản chuẩn. Giữ kiến trúc cổng tổng hợp Next.js.
- Triển khai và xác minh OJS GenericPlugin `publicPublications` độc lập tại `integrations/ojs-public-publications/publicPublications`:
  - `PublicPublicationsPlugin.php`: đăng ký bộ điều khiển API phần bổ trợ qua `APIHandler::endpoints::plugin` (`function ($hook, $router)` trong OJS 3.5.0.6).
  - `PublicPublicationsController.php`: kế thừa `PKPBaseController` với `authorize()` trả true và điều kiện hiển thị mặc định từ chối khi không chắc chắn. Triển khai GET không xác thực `/{journal}/api/v1/publicPublications/issues` và `/issues/{id}`.
  - `Visibility.php`: thực thi phạm vi tạp chí (`tapchi1`), trạng thái xuất bản (STATUS_PUBLISHED = 3), quyền sở hữu bản thảo/phiên bản xuất bản và `publishingMode` nhận null mặc định thành 0 (OPEN).
  - `version.xml`: mô tả phiên bản phần bổ trợ (1.0.0.0, `plugins.generic`, `publicPublications`).
- Chạy kiểm thử PHP tổng hợp: 20 khẳng định ĐẠT (`php.exe integrations/ojs-public-publications/tests/visibility.php`).
- Triển khai phần bổ trợ vào OJS đang chạy: `C:\xampp\htdocs\ojs\plugins\generic\publicPublications`.
- Kích hoạt phần bổ trợ cho `tapchi1` (contextId 1) qua cơ sở dữ liệu OJS (`versions` và `plugin_settings`).
- Xác minh điểm cuối thực không xác thực qua curl:
  - `GET /tapchi1/api/v1/publicPublications/issues` -> 200 OK với `contract: "public-publications-v1"`, itemsMax 1, trả số 1 đã xuất bản.
  - `GET /tapchi1/api/v1/publicPublications/issues/1` -> 200 OK, trả chi tiết số với 2 bài đã xuất bản.
  - Kiểm thử âm: tạp chí không tồn tại (404), số không tồn tại (404), count/offset phân trang không hợp lệ (400 Bad Request).
- Kiểm thử tích hợp dịch vụ Next.js thực đầu cuối:
  - `journals('vi')` -> 1 tạp chí (`tapchi1`).
  - `issueList('tapchi1')` -> 1 số.
  - `issueDetail('tapchi1', 1)` -> 2 bài đã xuất bản.
  - `journalArticles('tapchi1')` -> 2 bài, kết hợp thành công bài REST thực với làm giàu OAI thực (tóm tắt và từ khóa).
- Cập nhật môi trường cổng: bật `OJS_PUBLIC_PROJECTION=true` trong `.env.local` và ghi tài liệu trong `.env.example`.
- Chạy bộ xác minh: `npm test` (16 ĐẠT), `npx tsc --noEmit` (ĐẠT), `npm run lint` (ĐẠT), `npm run build` (ĐẠT - Turbopack, 563 trang tĩnh biên dịch trong 13.7s).
- Xác minh máy chủ phát triển cục bộ trả HTTP 200 tại `http://localhost:3000/vi`.
- Rà soát phản hồi tác nhân Next.js: không quan sát lỗi, sự cố dừng hoặc hành vi bất ngờ Next.js đủ điều kiện.


## 2026-11-26 — khảo sát chỉ đọc OJS thực đã cài và cập nhật tài liệu ghi nhớ
- Đọc AGENTS/tài liệu ghi nhớ dự án, xác minh feature/multi-journal-ojs và HEAD 982c3e9/lịch sử; bảo toàn mọi công việc có sẵn. Chỉ kiểm tra mã nguồn đã cài trong C:\xampp\htdocs\ojs; version.xml khai báo 3.5.0.6/tag 3_5_0-6. Không đọc config.inc.php, dữ liệu riêng/bộ nhớ đệm/cơ sở dữ liệu, thông tin xác thực hoặc sửa nguồn.
- Xác minh từ chối trước tầng tuyến: chuỗi xử lý toàn cục APIHandler -> PolicyAuthorizer -> IssueController authorize() -> UserRolesRequiredPolicy từ chối thiếu người dùng và trả 401; has.user/context/roles bảo vệ độc lập danh sách/hiện hành/chi tiết. Đính chính các bước tiếp theo về chỉ đổi cài đặt/nhà vận hành xác minh nguồn.
- Rà soát bộ xử lý số/bài cho độc giả và truy vấn OAI. Xác nhận STATUS_PUBLISHED=3, kiểm tra xuất bản HTML công khai và quyền bản trình bày riêng. OAI nối phiên bản xuất bản hiện hành nhưng không lọc rõ p.status hoặc đối chiếu quyền sở hữu ngữ cảnh số/chuyên mục; giữ kiểm tra nghiêm ngặt ở cổng.
- Kiểm tra curl không xác thực bỏ nội dung phản hồi: danh sách/chi tiết REST 401; lưu trữ/chi tiết số theo ngôn ngữ 200; bài theo ID số 302 tới slug chuẩn tùy chỉnh rồi GET riêng đích trả 200; OAI theo ngôn ngữ 200 XML. Chỉ kiểm tra khả năng truy cập; nghiệm thu kết hợp vẫn BỊ CHẶN.
- Đề xuất bộ điều khiển GenericPlugin publicPublications độc lập cần phê duyệt qua APIHandler::endpoints::plugin / registerPluginApiControllers; ghi tài liệu tuyến, danh sách trường cho phép, kiểm tra hiển thị công khai/quyền sở hữu và điều kiện rút xuất bản/bộ nhớ đệm/kiểm thử âm. Chưa triển khai thay đổi phần bổ trợ hoặc ứng dụng.
- Cập nhật API_ENDPOINTS, OJS_API_CONTEXT, ARCHITECTURE, DECISIONS, HANDOFF, DEVELOPMENT_LOG, TEST_REPORT và ROADMAP. Kiểm thử đơn vị/kiểm tra kiểu/lint/dựng CHƯA CHẠY cho giai đoạn chỉ tài liệu; lần chạy trước là lịch sử. Không tạo commit, hợp nhất, sửa môi trường hoặc đổi vòng đời máy chủ. Rà soát phản hồi Next: không có ứng viên.

## 2026-11-26 — tiếp tục làm giàu có giới hạn
- Đọc tài liệu ghi nhớ dự án bắt buộc, AGENTS và hướng dẫn fetch Next đã cài; xác minh riêng nhánh tính năng/lịch sử, bảo toàn mọi tệp triển khai trước dù trạng thái shell sạch bất thường.
- Thêm kiểm thử định danh slug tùy chỉnh OAI/địa chỉ gốc công khai thành công ở dịch vụ (bao gồm từ chối không khớp), giới hạn trang REST lặp lại và ranh giới trang cuối. ĐẠT 18/18; không cần sửa thêm mã triển khai. Kiểm tra kiểu/lint đạt; lệnh dựng trả thành công với đầu ra tổng kết giới hạn.
- Danh sách/chi tiết REST không xác thực vẫn 401; chỉ kiểm tra an toàn thông báo lỗi chung. Lấy mã nguồn IssueController OJS công khai theo thẻ phiên bản, cho thấy lớp trung gian yêu cầu người dùng/vai trò đã xác thực. Đính chính giả định vận hành: API gốc có thể chủ ý yêu cầu xác thực; chưa xác lập cách sửa đơn giản bằng cài đặt công khai. Ghi tài liệu xác minh của nhà vận hành và lựa chọn điểm cuối/xuất dữ liệu chỉ xuất bản cần phê duyệt.
- Dùng kỹ năng trình duyệt và máy chủ phát triển hiện có: VI/EN ở 1000px không tràn và điều hướng ngôn ngữ đạt. Không có công cụ đổi khung nhìn; ma trận di động/trình đơn và nghiệm thu bàn phím đầy đủ vẫn chờ. Không đổi vòng đời máy chủ, sửa môi trường, tạo commit hoặc hợp nhất. Rà soát ứng viên phản hồi Next: không có ứng viên được xác minh giai đoạn này.

## 2026-11-26 — tiếp tục dịch vụ/proxy
- Đọc tài liệu ghi nhớ bắt buộc và tham chiếu bộ xử lý tuyến Next đã cài; kiểm tra nhánh tính năng, trạng thái và lịch sử mới nhất. Bảo toàn công việc trước; không tạo commit/hợp nhất main.
- Thêm sáu kiểm thử tích hợp dịch vụ/proxy tổng hợp. Siết tổng REST thành số nguyên không âm an toàn và đặt rõ việc bỏ thông tin xác thực. Sửa ngôn ngữ OAI tùy chọn không hợp lệ vượt ranh giới xử lý dự phòng và làm ẩn bài REST vốn hợp lệ.
- Sửa dữ liệu mẫu mới thiếu ngày xuất bản sau lần chạy đầu 14/15; cuối cùng 15 kiểm thử, kiểm tra kiểu, lint và dựng bản triển khai lần lượt đạt.
- Kiểm tra lại an toàn danh sách và chi tiết đã xuất bản không xác thực: cả hai 401 JSON không chuyển hướng. Không tìm cách vượt xác thực; tại thời điểm đó còn chờ nhà vận hành kiểm tra nguồn; lượt kiểm tra nguồn đã cài sau đó ở trên xác định từ chối là do bắt buộc xác thực, không phải chỉ sửa cài đặt.
- Kiểm tra HTTP sơ bộ bản dựng triển khai trên 3100 đạt cho trang bình thường và tuyến lỗi an toàn. Nghiệm thu trình duyệt đầy đủ vẫn chờ. Cập nhật tài liệu ghi nhớ chung và lộ trình; không có ứng viên phản hồi Next mới đủ điều kiện.

- Nhánh ban đầu tạo từ 0aa4086; commit danh mục đầu 0cfff2a; cập nhật nhánh ban đầu lỗi, sau đó khôi phục và đọc lại.
- Hợp nhất d8f7149 đồng bộ main a73c7bf (ba commit) không xung đột tệp.
- Commit REST ee8960f thêm lớp dữ liệu công khai, danh mục cấu hình, chi tiết số và trích xuất bài, thay các lời gọi nguồn proxy cũ. Bộ chuyển đổi hiển thị cũ giữ trạng thái 7; ánh xạ OJS thô yêu cầu trạng thái 3 và chính xác phiên bản xuất bản hiện hành. Không suy ra số hiện hành.
- Lượt tài liệu bàn giao AI: thay README và ngữ cảnh API lỗi thời, giữ khối AGENTS tự sinh, thêm tài liệu ghi nhớ dự án, lộ trình và trạng thái kiểm thử. Chỉ tài liệu, không đổi ứng dụng hoặc kiểm tra môi trường chạy trong lượt này.
- Còn chờ ở lần bàn giao trước: phân tích/kết hợp OAI, tìm kiếm cổng, giao diện chi tiết bài, chuyển đổi giao diện hiện có, dữ liệu mẫu an toàn và kiểm thử môi trường chạy. Được thay thế bởi việc thực hiện bên dưới.

## 2026-11-26 — đường cơ sở và chẩn đoán tích hợp
- Xác minh nhánh tính năng sạch tại 982c3e9; lấy origin (0/0 đi trước/đi sau), bảo toàn main và cấu hình cục bộ hiện có. npm ci đạt. Kiểm tra kiểu ban đầu đạt; lint lỗi với 34 lỗi/22 cảnh báo; dựng lỗi ở ba khai báo xuất dynamic với Cache Components.
- Sửa kiểu dữ liệu cũ và vòng đời hook bất đồng bộ/xử lý phản hồi cũ, bỏ mã không dùng và chuyển đổi phần tử ảnh. Bỏ khai báo xuất dynamic không tương thích và cung cấp ranh giới Suspense/tải. Lint/kiểm tra kiểu/dựng cuối ĐẠT.
- REST localhost không xác thực ban đầu hết thời gian chờ rồi trả 401. URL REST chèn ngôn ngữ trả 404. OAI chuyển hướng tới điểm cuối theo ngôn ngữ; XML trực tiếp theo ngôn ngữ phân tích thành công (2 bản ghi). Không dùng thông tin xác thực đặc quyền hoặc giữ XML thô.

## 2026-11-26 — dịch vụ và giao diện công khai
- Thêm saxes/tsx, trình phân tích/trình khách OAI an toàn có giới hạn và kết hợp siêu dữ liệu theo URL công khai chính xác với dấu bản ghi đã xóa, khử trùng lặp, bảo toàn không gian tên/ngôn ngữ, phân trang và giới hạn lỗi. Tích hợp dịch vụ tùy chọn mặc định tắt. Định danh công khai dùng cùng phép chuyển địa chỉ gốc đã phê duyệt như REST.
- Siết kích thước phản hồi REST, danh sách URL độc giả cho phép và quyền sở hữu số theo danh sách đã xuất bản. Thêm kiểm thử lớp dữ liệu công khai/bảo mật tổng hợp cùng kiểm thử OAI: npm test ĐẠT (9).
- Thêm trang bài theo phạm vi tạp chí và tìm kiếm liên tạp chí với bộ lọc tạp chí/năm/ngôn ngữ, sắp xếp/phân trang và thông báo lỗi nguồn từng phần. Cải thiện trang tạp chí, liên kết bài trong số và trang chủ cổng. Thay tương tác ngôn ngữ/trình đơn giữ chỗ và bỏ liên hệ chân trang chưa xác minh/điều hướng hỏng. Tuyến cũ giữ lại để chuyển đổi sau.
- Kiểm tra HTTP sơ bộ phát triển đạt cho VI/EN/trang chủ/danh mục/tạp chí/tìm kiếm. Proxy trả 502 an toàn khi nguồn bị chặn và 404 cho users/tạp chí không biết. Kiểm tra trình duyệt cơ bản 1000px đạt, truy vấn được giữ trong liên kết ngôn ngữ; ma trận đầy đủ khung nhìn/khả năng tiếp cận CHƯA CHẠY.
- Cập nhật tài liệu ghi nhớ chung. Thay đổi chưa commit để rà soát; không hợp nhất. Trở ngại tiếp theo là truy cập REST OJS không xác thực, sau đó xác minh định danh kết hợp thực và nghiệm thu tạp chí thứ hai.
