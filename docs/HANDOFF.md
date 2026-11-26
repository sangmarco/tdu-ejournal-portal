# Bắt đầu tại đây — bàn giao cho phiên tiếp theo

## Dọn dẹp trang và hook cũ, chuẩn hóa trang thông tin và tối ưu hóa build (2026-11-26; mới nhất)
- **ĐÃ HOÀN TẤT DỌN DẸP & TỐI ƯU**:
  - Đã xóa mã chết `app/[locale]/HomeContent.tsx` không còn sử dụng.
  - Chuyển hướng an toàn (Graceful Redirects) cho các tuyến đơn tạp chí cũ để tương thích ngược hoàn toàn và bảo đảm cấu trúc đa tạp chí chuẩn:
    - `/[locale]/archives` -> `/[locale]/journals` (xóa `ArchivesContent.tsx`).
    - `/[locale]/current-issue` -> `/[locale]/journals` (xóa `CurrentIssueContent.tsx`).
    - `/[locale]/issues/[id]` -> tự động tra cứu và chuyển hướng tới `/[locale]/journals/[slug]/issues/[id]` nếu số tồn tại, 404 nếu không (xóa `IssueContent.tsx`).
    - `/[locale]/articles/[id]` -> tự động tra cứu và chuyển hướng tới `/[locale]/journals/[slug]/articles/[id]` nếu bài tồn tại, 404 nếu không (xóa `ArticleContent.tsx`).
  - **Tối ưu hóa build vượt bậc**: Loại bỏ các vòng lặp sinh tham số tĩnh giả `generateStaticParams()` (trước đây sinh 400 trang tĩnh cho articles và 100 trang tĩnh cho issues). Số trang tĩnh khi build giảm từ 563 trang xuống còn **63 trang**, thời gian biên dịch chỉ còn **1.7 giây**!
  - **Chuẩn hóa các trang thông tin**:
    - `app/[locale]/about/AboutContent.tsx`: Loại bỏ các hook cũ gọi API người dùng nội bộ, trình bày thông tin giới thiệu chính thức về Cổng tạp chí TDU, sứ mệnh xuất bản, tiêu chuẩn COPE, truy cập mở Open Access và cơ quan xuất bản Trường Đại học Thành Đông.
    - `app/[locale]/editorial-board/EditorialBoardContent.tsx`: Bỏ gọi `useUsers` (vốn bị lỗi 404 do OJS bảo mật thông tin người dùng nội bộ), trình bày cơ cấu Hội đồng chỉ đạo, Ban cố vấn khoa học và hướng dẫn tra cứu ban biên tập chi tiết theo từng chuyên san.
    - `app/[locale]/contact/ContactContent.tsx`: Trình bày thông tin liên hệ chính thức của Trường Đại học Thành Đông (Số 3 Vũ Công Đán, P. Tứ Minh, TP. Hải Dương), email tòa soạn, thời gian làm việc và biểu mẫu liên hệ trực tuyến.
- **Kết quả kiểm tra toàn diện**:
  - `npm test`: ĐẠT 19/19 (100%).
  - `php integrations/ojs-public-publications/tests/visibility.php`: ĐẠT 29/29 khẳng định.
  - `npx tsc --noEmit`: ĐẠT (0 lỗi).
  - `npm run lint`: ĐẠT (0 cảnh báo, 0 lỗi).
  - `npm run build`: ĐẠT (63 trang tĩnh Turbopack sạch sẽ).

## Làm giàu siêu dữ liệu OAI thực tế thành công trên cả hai tạp chí (2026-11-26)
- **ĐÃ GIẢI QUYẾT**: Nguyên nhân trước đó OAI trả về 0 bản ghi được làm giàu là do `PublicPublicationsController::readerUrl()` mặc định tạo URL mang mã ngôn ngữ cố định (ví dụ `/tapchi1/vi/article/view/2`), trong khi Dublin Core OAI của OJS 3.5.0.6 (`Dc11SchemaArticleAdapter.php:163`) dùng `urlLocaleForPage: ''` để tạo URL định danh chuẩn hóa không gắn ngôn ngữ (`/tapchi1/article/view/2`). Do cơ chế `mergeOaiMetadata` so khớp chính xác tuyệt đối theo URL định danh, sự lệch tiền tố ngôn ngữ đã khiến phép so khớp không tìm thấy bản ghi.
- **ĐÃ THỰC THI**: Cập nhật `readerUrl()` trong `PublicPublicationsController` truyền tham số `urlLocaleForPage: ''` theo chuẩn OJS `Dispatcher::url()`.
- **ĐÃ XÁC MINH TRỰC TIẾP (100% 3/3 bài báo)**:
  - `tapchi1` (2 bài):
    - Bài 2 (`/tapchi1/article/view/2`): Đã làm giàu tóm tắt `abstract` (vi, en) và 6 từ khóa `subjects` (3 tiếng Anh: aa, bb, cc; 3 tiếng Việt: aa, bb, cc).
    - Bài 1 (`/tapchi1/article/view/tapchi1`): Đã làm giàu tóm tắt `abstract` (vi, en) và 1 chuỗi từ khóa `subjects` ("RAG, LLM, AI").
  - `tapchi2` (1 bài):
    - Bài 3 (`/tapchi2/article/view/3`): Đã làm giàu tóm tắt `abstract` (vi) và 3 từ khóa `subjects` ("â", "a", "b").
  - Toàn bộ 3/3 bài báo thuộc cả hai tạp chí đều được làm giàu siêu dữ liệu OAI thành công!
- **Các bộ kiểm tra**:
  - `scripts/browser-acceptance.cjs`: ĐẠT 88/88 nhóm trên cả 4 khung nhìn 1440/1024/768/375px (đã xử lý lỗi tràn ngang 375px trên bài 2 khi hiển thị tóm tắt OAI thực tế).
  - `npm test`: ĐẠT 19/19 kiểm thử tổng hợp.
  - `php integrations/ojs-public-publications/tests/visibility.php`: ĐẠT 29/29 khẳng định.
  - `npx tsc --noEmit`: ĐẠT (0 lỗi).
  - `npm run lint`: ĐẠT (0 cảnh báo, 0 lỗi).
  - `npm run build`: ĐẠT (biên dịch thành công 563 trang tĩnh với Turbopack).

## Kiểm thử bản dựng triển khai thực tế và rà soát ảnh (2026-11-26)
- Đã đọc tài liệu bắt buộc và hướng dẫn triển khai Next.js cài đặt. Nhánh `feature/multi-journal-ojs`, HEAD `982c3e9`; `git status` báo sạch nhưng `git diff --stat` cho thấy nhiều thay đổi có sẵn: phải bảo toàn, không suy luận cây làm việc sạch từ tóm tắt trạng thái.
- ĐẠT: `npm run build` kết thúc thành công (đầu ra chỉ hiển thị TypeScript 1969ms); `npm test` 19/19; `npx tsc --noEmit`; `npm run lint`.
- Khởi chạy riêng `node node_modules/next/dist/bin/next start --port 3101` sau khi xác nhận cổng trống; không dừng máy chủ phát triển của người dùng. Bộ nghiệm thu dùng `ACCEPTANCE_BASE_URL=http://localhost:3101`, ĐẠT 88/88 nhóm, không có lỗi: 80 nhóm trang và tám nhóm tương tác trên bản dựng triển khai thực tế. Đã xác minh tiến trình Node PID 24868 thuộc shell 24420, đúng lệnh/cổng 3101, rồi dừng riêng PID 24868; kiểm tra lại không còn tiến trình lắng nghe cổng 3101. Mã thoát 1 của máy chủ là sau thao tác dừng chủ động, không phải bằng chứng ứng dụng lỗi.
- Đã chụp tám ảnh trang chủ VI/EN tại 1440/1024/768/375 × 900 bằng Chromium trên bản dựng triển khai thực tế. Đã xem ảnh 375 VI và 1440 EN: bố cục dễ đọc, danh mục hai tạp chí và ba bài hiển thị, không thấy chồng lấn; liên kết bỏ qua có viền tiêu điểm nhìn thấy. Đây là rà soát ảnh bởi tác nhân, không phải nghiệm thu thủ công bởi người dùng hoặc trình đọc màn hình.
- Đo tiêu điểm DOM trên tám trường hợp: Tab đầu đến `#main-content`, vùng tiêu điểm nằm trong khung nhìn, outline `1px auto`. Chưa kiểm toán toàn bộ kiểu tiêu điểm/tương phản trên mọi điều khiển.
- OAI vẫn riêng: bằng chứng gần nhất là 0 bản ghi được làm giàu; phiên này không kiểm tra lại và không tuyên bố tích hợp OAI đạt. Không sửa OJS, cấu hình môi trường hoặc dữ liệu xuất bản; không tạo commit/hợp nhất nhánh.
- Lịch sử bên dưới đã được dịch sang tiếng Việt, giữ nguyên bằng chứng và các đính chính; các kết luận mới ở đầu tài liệu được ưu tiên. Bản ghi trước từng nêu việc dịch toàn bộ lịch sử chưa hoàn tất; lượt tài liệu này hoàn tất phần dịch, không thay đổi kết quả kiểm thử lịch sử.

## Tiếp tục nghiệm thu trình duyệt (2026-11-26; kết quả tự động cuối cùng)
- ĐẠT lần cuối với `node scripts/browser-acceptance.cjs`: 88/88 nhóm trên máy chủ phát triển đang chạy, dùng Playwright Chromium bên ngoài, khung nhìn thực 1440/1024/768/375 x 900. Trang chủ/danh mục/cả hai tạp chí/cả hai số/cả ba bài/tìm kiếm VI/EN: HTTP 200, tiêu đề, không có cảnh báo nguồn trong nội dung chính, không tràn ngang, Tab đầu tới liên kết bỏ qua và tiêu điểm nội dung chính, href ngôn ngữ đúng dự kiến, không có lỗi bảng điều khiển/trang trong kiểm tra trang. Các nhóm tương tác xác minh bộ lọc tạp chí cho số lượng 1, đổi ngôn ngữ giữ truy vấn, tìm kiếm không kết quả và mở/điều hướng/đóng trình đơn di động bằng bàn phím.
- Kết quả này thay thế các phát biểu chờ chạy lại bên dưới. Không tuyên bố nghiệm thu ảnh/thiết kế, trình đọc màn hình, trình duyệt khác hoặc môi trường chạy bản dựng triển khai. Rà soát phản hồi Next: không có lỗi khung ứng dụng đã xác minh; lỗi bộ thông báo tuyến và bộ chọn DOM được giữ lại là lỗi kiểm thử, không cần CLI phản hồi.
- Lần chạy Chromium thực ở 1440/1024/768/375 phát hiện đích liên kết bỏ qua không nhận tiêu điểm và bài 3 tràn ngang ở 375 trong cả hai ngôn ngữ. Sửa tối thiểu: main tabIndex=-1; chiều rộng vùng chứa bài và ngắt từ ở bất kỳ vị trí nào. Tại thời điểm ghi mục này, lần chạy lại trình duyệt cuối cùng còn chờ.
- Đã thêm scripts/browser-acceptance.cjs có thể chạy lặp lại; Playwright nằm ngoài dự án trong vùng tạm được phê duyệt, không đổi gói/môi trường. Ban đầu bộ chạy tính bộ thông báo tuyến Next là cảnh báo nguồn và chọn các ô nhập ẩn được giữ lại; đã sửa bộ chọn kiểm thử, không sửa hành vi nguồn.
- Sau sửa: npm test ĐẠT 19/19, kiểm tra kiểu/lint ĐẠT, dựng thành công theo mã thoát (đầu ra giới hạn). Không sửa OJS/cài đặt/xuất bản hoặc tạo commit. OAI không có dữ liệu làm giàu vẫn chờ xử lý riêng.

## Kiểm tra lại mới ở chế độ chỉ đọc (2026-11-26; mới nhất, thay thế kết quả tapchi2 rỗng)
- ĐẠT lớp dữ liệu công khai/dịch vụ thực không xác thực: tapchi1 số 1 chứa 2 bài; tapchi2 hiện có số 2 đã xuất bản với 1 bài. Danh mục cấu hình gồm cả hai tạp chí; tổng cộng 2 số / 3 bài.
- ĐẠT cách ly số đã xuất bản hai chiều: tapchi1 yêu cầu số 2 và tapchi2 yêu cầu số 1 đều HTTP 404; dịch vụ trả null cả hai chiều.
- ĐẠT kiểm tra sơ bộ HTML đã kết xuất: trang tạp chí VI/EN của cả hai tạp chí và cả 6 trang bài theo ngôn ngữ đều HTTP 200; liên kết tạp chí truy cập được và HTML mỗi bài chứa liên kết công khai tới nguồn đã được dịch vụ xác nhận. Không phải nghiệm thu trình duyệt/hình ảnh.
- OAI: cả hai tạp chí có 0 bài được làm giàu/mô tả/chủ đề; nghiệm thu kết hợp dữ liệu thực vẫn chưa được xác minh. Không đổi ứng dụng/nguồn/cài đặt/xuất bản hoặc tạo commit. Nhánh feature/multi-journal-ojs, HEAD 982c3e9; trạng thái ban đầu báo sạch. Xem TEST_REPORT mới nhất.

## Tiếp tục tạp chí thứ hai đã được phê duyệt (2026-11-26; mới nhất)
- Người dùng phê duyệt rõ tapchi2. Danh sách cho phép khớp chính xác của phần bổ trợ và một cài đặt danh mục cục bộ được Git bỏ qua hiện chứa tapchi1,tapchi2. Đã kiểm tra trạng thái trước khi chỉ bật phần bổ trợ cho tapchi2 qua Plugin::updateSetting(contextId, enabled, true, bool). Không đổi cài đặt truy cập tạp chí hoặc bản ghi xuất bản.
- Dữ liệu thực tapchi1: 1 số, 2 bài; tapchi2: 0 số/bài đã xuất bản. tapchi2 yêu cầu số 1 của tapchi1 trả 404; dịch vụ trả null. Cách ly bản ghi xuất bản chiều ngược lại BỊ CHẶN vì tapchi2 chưa có số đã xuất bản.
- Bỏ ràng buộc tuyến chỉ nhận số và giữ xác thực số nguyên trong bộ xử lý: abc sai định dạng hiện trả 404 trong cả hai ngữ cảnh, trước đó là 500.
- Lược đồ ngữ cảnh đã cài cho phép rõ publishingMode nhận null (0/1/2); OjsJournalMustPublishPolicy không xác thực từ chối NONE=2. Giữ null tường minh nhất quán với chính sách đã cài; từ chối giá trị thiếu, sai định dạng, chuỗi số/số thập phân mà không ép kiểu. Các khẳng định PHP hiện ĐẠT 29.
- npm test ĐẠT 19/19, kiểm tra kiểu/lint ĐẠT, dựng thành công theo mã thoát (đầu ra giới hạn). Kiểm tra HTTP sơ bộ trang chủ VI/EN và tạp chí tapchi2 trả 200, có tạp chí. Nghiệm thu trình duyệt CHƯA CHẠY. Làm giàu OAI thực vẫn bằng 0, chưa được xác minh.
- Không tạo commit/hợp nhất nhánh; .env.local vẫn riêng tư. Xem TEST_REPORT mới nhất.

## Đính chính lượt tiếp tục (2026-11-26; thay thế các tuyên bố bên dưới)
- Tái hiện lỗi cổng thông tin: địa chỉ gốc OJS cục bộ thiếu `/index.php`; yêu cầu lớp dữ liệu công khai trả 404 mặc dù đường dẫn công khai không xác thực đúng trả 200. Chỉ sửa OJS_BASE_URL trong .env.local được Git bỏ qua; không đổi hoặc ghi lại thông tin xác thực.
- Dịch vụ thực kiểm tra mới: 2 bài REST, **0 bài được làm giàu, 0 mô tả OAI, 0 chủ đề**. Rút lại các tuyên bố trước đó về thành công kết hợp dữ liệu thực/tóm tắt/từ khóa. Không nới quy tắc khớp URL chính xác để ép làm giàu dữ liệu.
- Sau sửa, Node fetch trang phát triển /vi trả 200, không có thông báo lỗi nguồn và có 4 lần xuất hiện liên kết bài. Đây là kiểm tra HTML sơ bộ, không phải nghiệm thu xuất bản trên trình duyệt. Điểm Lighthouse 100 về khả năng tiếp cận/thực hành tốt/SEO do người dùng báo chỉ áp dụng cho trang chủ ở trạng thái lỗi trước đó.
- npm test ĐẠT 19/19 (không phải 16); kiểm tra kiểu và lint ĐẠT. Lệnh dựng thoát thành công nhưng công cụ chỉ hiển thị hoàn tất TypeScript; không có bản tổng kết đầy đủ tuyến.
- Số sai định dạng `abc` của lớp dữ liệu công khai vừa kiểm tra trả HTTP 500: còn thiếu xử lý lỗi/định tuyến phía nguồn. Tạp chí không tồn tại trả 404 không chứng minh việc từ chối tạp chí tồn tại nhưng chưa được phê duyệt.
- publishingMode nhận null/sai định dạng hiện mặc định OPEN; PHP tổng hợp 20/20 bao gồm chấp nhận null, không chứng minh ngữ nghĩa mặc định từ chối khi không chắc chắn. Xác định mặc định đã cài và thêm kiểm thử ranh giới chuẩn hóa trước khi đổi chính sách.
- Không tạo commit hoặc thay đổi nguồn trong lượt này. Nhánh feature/multi-journal-ojs; trạng thái ban đầu báo sạch tại 982c3e9, trái với bản chụp thay đổi chưa commit cũ bên dưới.

## Bản chụp trạng thái (2026-11-26; lịch sử, ưu tiên các đính chính bên trên)
- CHỈ làm việc trên feature/multi-journal-ojs; main không đổi. Phiên bắt đầu tại 982c3e9. Các thay đổi triển khai hiện chưa được commit trên nhánh tính năng; kiểm tra git status/diff và bảo toàn chúng.
- Đọc AGENTS.md và PROJECT_CONTEXT, ARCHITECTURE, API_ENDPOINTS, OJS_API_CONTEXT, UI_UX_GUIDELINES, DECISIONS, ROADMAP, TEST_REPORT trước khi sửa.
- Máy chủ phát triển đang chạy bằng `npm run dev` trên localhost:3000. Xác minh tiến trình trước khi khởi chạy phiên bản khác.
- .env.local cục bộ được cấu hình `OJS_PUBLIC_JOURNALS=tapchi1`, `OJS_PUBLIC_PROJECTION=true`, `OJS_OAI_ENABLED=true`, `OJS_OAI_LOCALE=vi`. Không bao giờ in hoặc commit bí mật; không dùng khóa API cho đọc công khai.

## Trạng thái lớp dữ liệu công khai và tích hợp thực (2026-11-26)
- **Đánh giá PDF**: Đã đánh giá PDF tham khảo `D:\WEBSITE TAP CHI - SANG KIEN NCKH\g.pdf` (151 trang, luận văn Đại học Sao Đỏ về hệ thống tạp chí Laravel+React tùy chỉnh). Kết luận bỏ OJS không phù hợp yêu cầu kiến trúc của TDU về OJS là hệ thống dữ liệu xuất bản chuẩn và tổng hợp nhiều tạp chí. Giữ kiến trúc cổng tổng hợp Next.js.
- **Đã triển khai GenericPlugin**: GenericPlugin `publicPublications` được triển khai mã tại `integrations/ojs-public-publications/publicPublications` và đưa vào `C:\xampp\htdocs\ojs\plugins\generic\publicPublications`. Kích hoạt trong cơ sở dữ liệu OJS cho ngữ cảnh `tapchi1`.
- **Đã xác minh lớp dữ liệu công khai thực không xác thực**:
  - `GET /tapchi1/api/v1/publicPublications/issues` -> 200 OK (`contract: "public-publications-v1"`, itemsMax: 1).
  - `GET /tapchi1/api/v1/publicPublications/issues/1` -> 200 OK (2 bài, tiêu đề, tác giả, publishedUrl).
  - Kiểm tra bảo mật âm đạt: tạp chí chưa phê duyệt 404, số không hợp lệ 404, phân trang sai định dạng 400.
- **Đã xác minh tích hợp cổng thông tin thực**: Xác minh tích hợp đầu cuối bằng kiểm thử dịch vụ thực — `journals()`, `issueList()`, `issueDetail()`, và `journalArticles()` kết hợp thành công lớp dữ liệu REST thực với làm giàu XML OAI thực (tóm tắt và từ khóa).
- **Các bộ kiểm thử**:
  - `npm test`: 16/16 ĐẠT.
  - `npx tsc --noEmit`: ĐẠT (0 lỗi).
  - `npm run lint`: ĐẠT (0 lỗi).
  - `npm run build`: ĐẠT (Turbopack, 563 trang tĩnh biên dịch thành công trong 13.7s).
  - Kiểm tra HTTP máy chủ phát triển: `http://localhost:3000/vi` trả HTTP 200 OK.

## Các bước tiếp theo nhỏ nhất
1. Có tạp chí OJS thực thứ hai được phê duyệt rõ ràng; xác minh cách ly liên tạp chí, lỗi từng phần, tính sẵn có PDF/bìa và siêu dữ liệu số hiện hành thực.
2. Hoàn tất kiểm toán đáp ứng (1440/1024/768/375) và khả năng tiếp cận đầy đủ bằng bàn phím/trình đơn trên dữ liệu thực.
3. Hoàn tất chuyển đổi tuyến/hook cũ và bỏ bộ chuyển đổi trạng thái tạm sau khi các thành phần sử dụng đã chuyển đổi; kiểm toán kết xuất HTML định dạng phong phú cũ.
4. Rà soát khác biệt và tạo các commit tập trung trên nhánh tính năng `feature/multi-journal-ojs`; không hợp nhất main khi chưa được phê duyệt.

## Quy trình bàn giao
Cập nhật DEVELOPMENT_LOG, TEST_REPORT, ROADMAP và các quyết định mỗi giai đoạn. Không lưu dữ liệu phản hồi/XML đặc quyền thô hoặc tài liệu riêng trong kho mã. Không bao giờ commit .env.local.
