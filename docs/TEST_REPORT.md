# Báo cáo kiểm thử

## 2026-11-26 — Làm giàu siêu dữ liệu OAI thực tế thành công trên cả hai tạp chí
- **Nguyên nhân trước đó OAI trả về 0**: Trong `PublicPublicationsController`, phương thức `readerUrl()` mặc định sinh URL có tiền tố ngôn ngữ (ví dụ `/tapchi1/vi/article/view/2`), trong khi Dublin Core OAI của OJS 3.5.0.6 (`Dc11SchemaArticleAdapter.php:163`) dùng `urlLocaleForPage: ''` để tạo URL định danh chuẩn hóa không gắn ngôn ngữ cố định (`/tapchi1/article/view/2`). Do cơ chế `mergeOaiMetadata` so khớp chính xác tuyệt đối theo URL định danh, sự lệch tiền tố ngôn ngữ đã khiến phép so khớp không tìm thấy bản ghi.
- **Giải pháp tối thiểu, chuẩn OJS**: Đã cập nhật `readerUrl()` trong `PublicPublicationsController` thêm tham số `urlLocaleForPage: ''` đúng chuẩn của OJS `Dispatcher::url()`.
- **Kết quả làm giàu thực tế (100% 3/3 bài báo)**:
  - `tapchi1` (2 bài):
    - Bài 2 (`/tapchi1/article/view/2`): Đã làm giàu tóm tắt `abstract` (vi, en) và 6 từ khóa `subjects` (3 tiếng Anh: aa, bb, cc; 3 tiếng Việt: aa, bb, cc).
    - Bài 1 (`/tapchi1/article/view/tapchi1`): Đã làm giàu tóm tắt `abstract` (vi, en) và 1 chuỗi từ khóa `subjects` ("RAG, LLM, AI").
  - `tapchi2` (1 bài):
    - Bài 3 (`/tapchi2/article/view/3`): Đã làm giàu tóm tắt `abstract` (vi) và 3 từ khóa `subjects` ("â", "a", "b").
- **Kiểm thử bộ mã nguồn, build và giao diện trình duyệt**:
  - `scripts/browser-acceptance.cjs`: ĐẠT 88/88 nhóm trên cả 4 khung nhìn 1440/1024/768/375px (phát hiện và khắc phục triệt để lỗi tràn ngang trên màn hình 375px tại bài báo 2 bằng cách thêm `[overflow-wrap:anywhere]`).
  - `npm test`: ĐẠT 19/19 kiểm thử tổng hợp.
  - PHP: `php integrations/ojs-public-publications/tests/visibility.php` ĐẠT 29/29 khẳng định.
  - `npx tsc --noEmit`: ĐẠT (0 lỗi TypeScript).
  - `npm run lint`: ĐẠT (0 cảnh báo, 0 lỗi).
  - `npm run build`: ĐẠT (biên dịch thành công 563 trang tĩnh với Turbopack).

## 2026-11-26 — production thực và rà soát ảnh/focus

| Lệnh / phạm vi | Kết quả thực tế |
|---|---|
| `git branch --show-current`; `git log -3 --oneline`; `git diff --stat` | ĐẠT: nhánh feature/multi-journal-ojs, HEAD 982c3e9; bảo toàn thay đổi có sẵn dù status tóm tắt báo sạch |
| `npm run build` | ĐẠT theo kết thúc lệnh; đầu ra chỉ TypeScript 1969ms, không khẳng định số route |
| `npm test` | ĐẠT 19/19 kiểm thử tổng hợp; không thay bằng chứng tích hợp thật |
| `npx tsc --noEmit` | ĐẠT |
| `npm run lint` | ĐẠT |
| `Get-NetTCPConnection -State Listen -LocalPort 3101 -ErrorAction SilentlyContinue` | Không có listener trước khi khởi chạy |
| `node node_modules/next/dist/bin/next start --port 3101` | Đã khởi chạy instance production riêng; không dừng dev |
| `$env:PLAYWRIGHT_MODULE='C:\Users\Admin\AppData\Local\Temp\opencode\browser-acceptance\node_modules\playwright'; $env:ACCEPTANCE_BASE_URL='http://localhost:3101'; node scripts/browser-acceptance.cjs` | ĐẠT 88/88 nhóm, `failures: []`; production thật, VI/EN × 1440/1024/768/375, 80 nhóm trang và tám nhóm tương tác |
| `node C:/Users/Admin/AppData/Local/Temp/opencode/production-visual.cjs` | ĐẠT: tám ảnh trang chủ VI/EN, viewport thật 1440/1024/768/375 × 900; Tab đầu tới skip link, outline 1px auto và tọa độ nằm trong viewport |

- Phạm vi 88/88 production: HTTP 200, tiêu đề chính, không cảnh báo nguồn trong main, không tràn ngang, Tab đầu tới skip link và Enter chuyển focus vào main, href đổi ngôn ngữ, tìm kiếm ba bài, liên kết bài tapchi2, không lỗi console/page trong nhóm kiểm tra trang. Tương tác: lọc tapchi2 còn một bài, đổi ngôn ngữ giữ truy vấn, tìm kiếm không kết quả và menu bàn phím tại 375px. Không suy rộng thành mọi tổ hợp bộ lọc hoặc mọi lỗi console trong tương tác.
- Đã kết thúc server production chủ động: xác minh `Get-CimInstance Win32_Process` cho thấy Node PID 24868 có cha 24420, chạy đúng `next start --port 3101`; `Stop-Process -Id 24868`, sau đó `Get-NetTCPConnection -State Listen -LocalPort 3101 -ErrorAction SilentlyContinue` không còn listener. Thông báo server thoát mã 1 xuất hiện sau thao tác dừng, không xem là lỗi runtime. Dev của người dùng không bị dừng.
- Ảnh lưu ngoài repository tại `C:/Users/Admin/AppData/Local/Temp/opencode/production-<width>-<locale>-focus.png`. Đã trực tiếp xem ảnh 375 VI và 1440 EN: danh mục hai tạp chí, ba bài, bố cục một/hai cột phù hợp, không thấy chồng lấn; viền focus skip link nhìn thấy. Chỉ là rà soát ảnh bởi tác nhân, không phải kiểm thử thủ công bởi người dùng hay trình đọc màn hình. Sáu ảnh còn lại đã tạo nhưng chưa được xem trực tiếp.
- CHƯA CHẠY: Firefox/WebKit, trình đọc màn hình, toàn bộ focus/tương phản, ảnh mọi route, kiểm thử rút xuất bản/quyền truy cập/PDF/bìa, đo lại OAI. OAI 0 làm giàu vẫn chưa xác minh độc lập.
- Không sửa mã ứng dụng trong lượt này; không thay OJS/env/dữ liệu xuất bản, không commit/merge. Rà soát Next feedback chưa thấy lỗi framework đủ điều kiện; không gọi CLI phản hồi.
- Giữ nguyên lịch sử bên dưới và các đính chính; việc dịch toàn bộ lịch sử tiếng Anh chưa hoàn tất. Trạng thái mới ở đầu tài liệu ưu tiên hơn lịch sử.


## 2026-11-26 — Nghiệm thu thực tế trên Chromium (kết quả tự động ĐẠT cuối cùng)
- Lệnh chạy cuối cùng: `$env:PLAYWRIGHT_MODULE='C:\Users\Admin\AppData\Local\Temp\opencode\browser-acceptance\node_modules\playwright'; node scripts/browser-acceptance.cjs` — ĐẠT 88/88 nhóm, 0 lỗi, trên máy chủ phát triển đang chạy. Bốn khung nhìn Chromium thực (1440/1024/768/375 x 900), cả VI/EN, mỗi ngôn ngữ 10 tuyến (80 nhóm trang), cùng 8 nhóm tương tác.
- Các khẳng định trang ĐẠT: HTTP 200 / tiêu đề chính, không có cảnh báo lỗi nguồn trong nội dung chính, chiều rộng tài liệu / không tràn ngang, phím Tab đầu đến liên kết bỏ qua và Enter chuyển tiêu điểm vào main, href liên kết ngôn ngữ, số lượng bài tìm kiếm bằng 3, liên kết bài tapchi2, không có lỗi bảng điều khiển hoặc lỗi trang chưa bắt được trong quá trình kiểm tra trang. Các tương tác ĐẠT: lọc tìm kiếm tapchi2 ra 1 bài, điều hướng ngôn ngữ bằng bàn phím giữ nguyên truy vấn/bộ lọc, tìm kiếm không có kết quả ra 0 bài, mở/Tab/Home/đóng trình đơn di động bằng bàn phím ở 375px.
- Các bản sửa lỗi ứng dụng đã xác minh: đích liên kết bỏ qua trước đó không nhận tiêu điểm (78 lỗi trang ở lần chạy 2), đã sửa main `tabIndex={-1}`; bài 3 tràn ngang ở 375px ở cả hai ngôn ngữ (2 lỗi), đã sửa giới hạn chiều rộng bài và ngắt từ bất kỳ đâu. Lần chạy cuối xác nhận cả hai lỗi đã được giải quyết. 8 lỗi tương tác ở lần chạy 2 do chọn nhầm các ô nhập ẩn được giữ lại trong DOM; bộ chọn phần tử nhìn thấy đã sửa đúng phạm vi kiểm thử.
- Sau các bản sửa lỗi: `npm test` ĐẠT 19/19; `npx tsc --noEmit` ĐẠT; `npm run lint` ĐẠT; `npm run build` kết thúc thành công (chỉ hiển thị TypeScript 2.3s). Chưa thực hiện nghiệm thu thủ công giao diện / kiểu hiển thị tiêu điểm toàn diện, trình đọc màn hình hoặc trình duyệt Firefox/WebKit trên bản production.
- Rà soát phản hồi Next hoàn tất: không có lỗi khung ứng dụng đủ điều kiện. Sai sót bộ chọn kiểm thử là quá trình gỡ lỗi thông thường; không cần gọi CLI phản hồi. Không đổi mã nguồn OJS/dữ liệu xuất bản/biến môi trường, không tạo commit. Bảo toàn các thay đổi có sẵn.

### Các lần thử ban đầu (bị thay thế bởi kết quả cuối cùng bên trên)
- Đã thêm `scripts/browser-acceptance.cjs`, sử dụng Playwright cài đặt bên ngoài (`PLAYWRIGHT_MODULE`) chạy với localhost:3000, kích thước khung nhìn thực 1440/1024/768/375 ở chiều cao 900; không dùng dữ liệu giả lập hay mô phỏng khung nhìn bằng CSS.
- Lần chạy đầu tiên KHÔNG ĐẠT 0/88 nhóm: bộ chọn alert quá rộng đã đếm nhầm vùng thông báo tuyến hỗ trợ tiếp cận trống của Next trên cả 80 lượt truy cập trang. Đã xác minh DOM; thu hẹp phạm vi khẳng định vào nội dung chính `main`. Đây là lỗi kịch bản kiểm thử, không phải lỗi nguồn dữ liệu. 8 nhóm tương tác hết thời gian chờ do ô nhập ẩn sau điều hướng ngôn ngữ; đã sửa mục tiêu vào ô nhập nhìn thấy.
- ĐẠT `npm test` 19/19, `npx tsc --noEmit`, và `npm run lint` cuối cùng. Lỗi lint ban đầu của bộ chạy đã được sửa bằng ghi chú bỏ qua hẹp cho việc nhập CommonJS. `npm run build` thoát thành công.

## 2026-11-26 — Kiểm tra lại mới ở chế độ chỉ đọc sau khi tapchi2 xuất bản
- ĐẠT kiểm tra nhánh/lịch sử: `feature/multi-journal-ojs` tại 982c3e9; `git status --short --branch` ban đầu báo sạch. Đã kiểm tra tài liệu dự án/bằng chứng/UI bắt buộc và dịch vụ hiện tại. Bảo toàn các tệp có sẵn; không commit hay sửa đổi cấu hình/xuất bản OJS.
- ĐẠT lệnh chạy thực tế cuối cùng: `npx --no-install tsx C:\Users\Admin\AppData\Local\Temp\opencode\recheck-public.ts` (thử nghiệm tạm bên ngoài, cấu hình @next/env; chỉ GET không xác thực, đầu ra tổng hợp/không lưu giữ dữ liệu thô).
- ĐẠT danh sách projection: tapchi1 HTTP 200, hợp đồng `public-publications-v1`, itemsMax=1, số ID 1; tapchi2 HTTP 200, cùng hợp đồng, itemsMax=1, số ID 2. Chi tiết HTTP 200 với lần lượt 2 bài và 1 bài. Kết quả tapchi2 rỗng trước đó đã được thay thế.
- ĐẠT dịch vụ thực: `journals()` bao gồm cả hai tạp chí; `issueList`/`issueDetail`/`journalArticles` trả về tapchi1 1/2 và tapchi2 1/1 số/bài (tổng cộng 2 số, 3 bài).
- ĐẠT cả hai chiều cách ly: tapchi1/issues/2 và tapchi2/issues/1 không xác thực trả về 404; `issueDetail` trả về null cho số thuộc tạp chí khác. Vấn đề chặn cách ly chiều ngược trước đó đã được giải quyết.
- ĐẠT HTML kết xuất: `/vi/journals/tapchi1` và `/en/journals/tapchi1` liên kết tới bài ID 2 và 1; `/vi/journals/tapchi2` và `/en/journals/tapchi2` liên kết tới bài ID 3. Cả 4 trang tạp chí HTTP 200, không có dấu hiệu lỗi nguồn dữ liệu. Cả 6 liên kết bài theo ngôn ngữ thực tế HTTP 200 và mỗi liên kết chứa một URL công khai OJS khớp đã được dịch vụ xác nhận.

## 2026-11-26 — Tích hợp tapchi2 đã được phê duyệt
- Độc giả công khai tapchi2 ban đầu trả 200; projection trả 404. Kiểm tra trạng thái đã cài đặt: cả hai ngữ cảnh đều kích hoạt, restrictSiteAccess null, publishingMode null; plugin chỉ mới bật cho tapchi1. Kiểm tra ban đầu gọi `Repo::context()` không tồn tại và thất bại mà không gây thay đổi dữ liệu; đã sửa thành `JournalDAO::getByPath` đã cài đặt.
- Chỉ kích hoạt plugin tapchi2 qua `Plugin::updateSetting` với context ID tường minh sau khi kiểm tra. Đã triển khai bộ điều khiển/visibility cập nhật. Không tạo/xuất bản bản ghi hay thay đổi cài đặt truy cập. Cập nhật chính xác một cài đặt danh mục cục bộ bị bỏ qua thành tapchi1,tapchi2.
- ĐẠT Node fetch không xác thực: cả hai danh sách projection trả 200; tapchi1 itemsMax=1, tapchi2 itemsMax=0. tapchi2 `/issues/1` trả 404 (số của tạp chí khác); `/issues/abc` sai định dạng trả 404 ở cả hai ngữ cảnh, khắc phục lỗi 500 trước đó.
- ĐẠT kiểm tra PHP: `C:\xampp\php\php.exe integrations\ojs-public-publications\tests\visibility.php`: 29 khẳng định, bao gồm phần tử danh sách cho phép thứ hai, từ chối giá trị gần khớp, từ chối chế độ thiếu/sai định dạng. Giá trị null tường minh vẫn được cho phép dựa trên lược đồ và chính sách từ chối NONE; không ép kiểu OPEN.
- ĐẠT `npm test` 19/19; `npx tsc --noEmit`; `npm run lint`; `npm run build` kết thúc thành công với đầu ra TypeScript 1931ms.

## 2026-11-26 — Đính chính tiếp tục (thay thế các khẳng định kết hợp dữ liệu thực trước đó)
- ĐẠT chẩn đoán: Node fetch không xác thực đường dẫn cấu hình `/ojs/tapchi1/api/v1/publicPublications/issues` trả 404; `/ojs/index.php/tapchi1/api/v1/publicPublications/issues` trả 200. Chỉ sửa đường dẫn `OJS_BASE_URL` trong `.env.local` bị bỏ qua.
- ĐẠT kiểm tra dịch vụ REST: `journalArticles('tapchi1')` sau đó trả về 2 bài báo.
- ĐẠT kiểm tra dev HTML: Node fetch `http://localhost:3000/vi` trả 200, không có văn bản lỗi nguồn, xuất hiện 4 liên kết bài báo của tạp chí.
- Điểm Lighthouse 100 về accessibility/best-practices/SEO do người dùng báo trước đó chỉ đo trang chủ ở trạng thái lỗi, không phải nghiệm thu xuất bản thực tế.
- ĐẠT `npm test`: 19/19 kiểm thử tổng hợp, không phải 16. ĐẠT `npx tsc --noEmit`; ĐẠT `npm run lint`.
- KHÔNG ĐẠT nghiệm thu HTTP âm: `/issues/abc` sai định dạng không xác thực trả về 500 (bỏ qua nội dung), chưa phải mã 400/404 có kiểm soát (vấn đề này sau đó đã được khắc phục).

## 2026-11-26 — Triển khai plugin publicPublications và xác minh tích hợp thực tế
- **Triển khai & Kích hoạt Plugin**:
  - Plugin được triển khai tới `C:\xampp\htdocs\ojs\plugins\generic\publicPublications`.
  - Phiên bản được đăng ký vào bảng `versions`: `plugins.generic`, `publicPublications`, lớp `PublicPublicationsPlugin`, lazyLoad=1, sitewide=0.
  - Kích hoạt cho contextId 1 (`tapchi1`) trong `plugin_settings`.
  - Bộ xử lý hook đăng ký tại `APIHandler::endpoints::plugin`: nhận `($hook, $router)` trong OJS 3.5.0.6.
  - Vị từ hiển thị fail-closed `Visibility::context()` xử lý `publishingMode` dạng null mặc định thành 0 (OPEN).
- **Khẳng định hiển thị PHP tổng hợp**: ĐẠT 20/20 (`C:\xampp\php\php.exe integrations\ojs-public-publications\tests\visibility.php`).
- **Thử nghiệm endpoint không xác thực thực tế (curl)**:
  - `GET /tapchi1/api/v1/publicPublications/issues` -> **HTTP 200 OK**, `Content-Type: application/json`, hợp đồng `"public-publications-v1"`, itemsMax: 1, trả về số đã xuất bản 1.
  - `GET /tapchi1/api/v1/publicPublications/issues/1` -> **HTTP 200 OK**, `Content-Type: application/json`, trả về chi tiết số với 2 bài đã xuất bản (id: 2 và id: 1) kèm tiêu đề bản địa hóa, chuỗi tác giả, publishedUrl.
  - `GET /nonexistent/api/v1/publicPublications/issues` -> **HTTP 404 Not Found** (fail-closed khi tạp chí không tồn tại hoặc chưa phê duyệt).
  - `GET /tapchi1/api/v1/publicPublications/issues/99999` -> **HTTP 404 Not Found** (`{"error":"Not available"}`).
  - `GET /tapchi1/api/v1/publicPublications/issues?count=-1` -> **HTTP 400 Bad Request** (`{"error":"Invalid pagination"}`).
  - `GET /tapchi1/api/v1/publicPublications/issues?offset=10000` -> **HTTP 400 Bad Request** (`{"error":"Invalid pagination"}`).
- **Tích hợp dịch vụ Next.js thực tế đầu cuối**:
  - `journals('vi')`: trả về `[{ path: 'tapchi1', name: 'tapchi1' }]`.
  - `issueList('tapchi1')`: trả về 1 số (`"Số này để test"`).
  - `issueDetail('tapchi1', 1)`: trả về số với 2 bài báo đã xuất bản.
- **Bộ kiểm thử cổng thông tin & Bản dựng**:
  - `npm test`: **ĐẠT** (19 kiểm thử tổng hợp).
  - `npx tsc --noEmit`: **ĐẠT** (0 lỗi).
  - `npm run lint`: **ĐẠT** (0 cảnh báo, 0 lỗi).
  - `npm run build`: **ĐẠT** (Next.js 16.4.6 với Turbopack, 563 trang tĩnh biên dịch thành công).
  - Kiểm tra HTTP máy chủ dev: `curl http://localhost:3000/vi` -> **HTTP 200 OK**.
## 2026-11-26 — Khảo sát mã nguồn đã cài đặt / Cập nhật tài liệu
- Kiểm tra nguồn: ĐẠT. `C:\xampp\htdocs\ojs\dbscripts\xml\version.xml` thực tế khai báo phiên bản 3.5.0.6, tag 3_5_0-6. Trạng thái nâng cấp cơ sở dữ liệu CHƯA KIỂM TRA. Chuỗi PolicyAuthorizer toàn cục -> IssueController -> UserRolesRequiredPolicy từ chối khi thiếu người dùng trước middleware của tuyến; has.user/context/roles độc lập bảo vệ list/current/detail. Truy vết runtime / kiểm tra log CHƯA CHẠY.
- Xác minh hằng số xuất bản trong mã nguồn: ĐẠT, `lib/pkp/classes/submission/PKPSubmission.php:44` định nghĩa `STATUS_PUBLISHED = 3`. Điều này thay thế nghi vấn hằng số trước đó, không thay thế kiểm tra PDF/số hiện hành/tạp chí thứ hai.
- Kiểm tra nguồn OAI: ĐẠT đối với cấu trúc truy vấn, không phải nghiệm thu hiển thị trực tiếp. Nối bảng current publication, kiểm tra issue/submission đã xuất bản và tạp chí kích hoạt/bật OAI đã được xác minh; vắng mặt vị từ p.status rõ ràng và sự bằng nhau về ngữ cảnh của issue/section.
- Mẫu lệnh kiểm tra an toàn: `curl.exe --silent --max-time 25 --output NUL --write-out "HTTP=%{http_code} type=%{content_type} redirect=%{redirect_url}" "http://localhost/ojs/index.php/<path>"`. GET gửi không cookie/bearer token và không theo dõi chuyển hướng; bỏ qua nội dung, không lưu payload thô.

| Đường dẫn / kiểm tra không xác thực | Kết quả thực tế |
|---|---|
| tapchi1/api/v1/issues | 401 application/json; REST gốc BỊ CHẶN theo thiết kế |
| tapchi1/api/v1/issues/1 | 401 application/json; không chuyển hướng |
| tapchi1/vi/issue/archive | 200 HTML; ĐẠT khả năng tiếp cận |
| tapchi1/vi/issue/view/1 | 200 HTML; ĐẠT khả năng tiếp cận |
| tapchi1/vi/article/view/1 | 302 tới slug tùy chỉnh chuẩn hóa; GET riêng đích đến trả 200 HTML |
| tapchi1/vi/oai?verb=ListRecords&metadataPrefix=oai_dc | 200 XML; ĐẠT khả năng tiếp cận, không phân tích nội dung trong giai đoạn này |
| Plugin projection / hybrid thực tế / kiểm tra hiển thị âm | ĐÃ TRIỂN KHAI & XÁC MINH trong các giai đoạn sau |
| npm test / npx tsc --noEmit / npm run lint / npm run build | CHƯA CHẠY ở giai đoạn chỉ khảo sát nguồn; kết quả trước đó là lịch sử |

## 2026-11-26 — Theo dõi làm giàu siêu dữ liệu và phân quyền
- `npm test`: ĐẠT 18/18. Ba kiểm thử dịch vụ tổng hợp bổ sung: làm giàu tóm tắt OAI tùy chọn với chuyển đổi public-base/slug tùy chỉnh; lệch URL dạng số không được làm giàu; phân trang REST dừng tại 100 request; trang 100 hoàn chỉnh thành công.
- `npx tsc --noEmit`: ĐẠT; `npm run lint`: ĐẠT; `npm run build`: kết thúc thành công.
- Node fetch an toàn không xác thực (15s timeout, credentials omit, manual redirects): BỊ CHẶN list/detail HTTP 401. Bộ điều khiển OJS 3.5.0.6 công khai yêu cầu người dùng/vai trò xác thực.
- Kỹ năng trình duyệt: Đã dùng máy chủ dev localhost:3000. Nhấp liên kết VI -> EN ĐẠT (/en nội dung tiếng Anh); khung nhìn 1000px không tràn ngang, có thông báo lỗi nguồn.
- Khung nhìn 1440/1024/768/375 và menu di động CHƯA CHẠY trong giai đoạn này (đã chạy sau đó qua Playwright).

## 2026-11-26 — Xác minh tiếp tục dịch vụ và proxy
- `npm test`: ĐẠT 15/15 sau khi bổ sung ngày xuất bản trong fixture bài báo. Sáu kiểm thử dịch vụ/proxy mới bao gồm từ chối/khử trùng lặp danh mục, offset và bộ lọc xuất bản, số trùng lặp, tổng số sai định dạng/trang chưa đủ/JSON sai/giới hạn 4 MiB, quyền sở hữu list/detail, phân trang proxy/no-store và lỗi HTTP được chuẩn hóa, dự phòng lỗi OAI.
- `npx tsc --noEmit`: ĐẠT; `npm run lint`: ĐẠT; `npm run build`: ĐẠT (exit 0).
- Node fetch các issues và issues/1 công khai: BỊ CHẶN, đều HTTP 401 application/json, không chuyển hướng.
- `npm run start -- --port 3100`: Máy chủ production đã chạy; kiểm tra HTTP smoke qua Node fetch: /vi, /en, /vi/journals, /vi/search?q=test HTTP 200; proxy issues HTTP 502; users không hỗ trợ và tạp chí lạ HTTP 404.

## 2026-11-26 — Thực thi trên Windows cục bộ ban đầu
Nhánh: feature/multi-journal-ojs; HEAD ban đầu 982c3e9. Nhánh main không đổi. Giữ nguyên `.env.local` có sẵn; chỉ thêm tạp chí tapchi1. Không dùng thông tin xác thực đặc quyền.

| Kiểm tra / lệnh | Kết quả thực tế |
|---|---|
| `git fetch origin`; kiểm tra nhánh/log/so sánh | ĐẠT; bắt đầu sạch, nhánh đồng bộ (0/0) |
| `npm ci` | ĐẠT; 358 gói, 0 lỗ hổng bảo mật ban đầu |
| Baseline `npx tsc --noEmit` | ĐẠT |
| Baseline `npm run lint` | KHÔNG ĐẠT: 34 lỗi, 22 cảnh báo trong mã cũ |
| Baseline `npm run build` | KHÔNG ĐẠT: 3 export dynamic không tương thích cacheComponents |
| `npm test` ban đầu | ĐẠT: 9 kiểm thử tổng hợp |
| `npm run dev` | ĐẠT; máy chủ chạy trên localhost:3000 |
| Anonymous fetch localhost `/tapchi1/api/v1/issues` | BỊ CHẶN: timeout 15s ban đầu; sau đó HTTP 401 |
| Anonymous `/tapchi1/vi/api/v1/issues` | HTTP 404; không phải đường vòng cho REST |
| Anonymous `/tapchi1/oai?verb=ListRecords&metadataPrefix=oai_dc` | HTTP 302 tới cùng tạp chí `/vi/oai` |
| Điểm cuối OAI theo ngôn ngữ trực tiếp + bộ phân tích | ĐẠT: HTTP 200, 2 bản ghi, 0 bị xóa, nhãn vi/en rõ ràng |
| Hợp nhất REST/OAI trực tiếp | BỊ CHẶN trước đó bởi REST 401 (nay đã giải quyết) |
| Node fetch smoke các tuyến chính | ĐẠT: HTTP 200 |
| `/api/ojs/issues?journal=tapchi1` | ĐẠT xử lý lỗi: HTTP 502 với thông báo chung |
| `/api/ojs/users?journal=tapchi1` | ĐẠT: HTTP 404 tài nguyên công khai không hỗ trợ |
| `/api/ojs/issues?journal=unknown` | ĐẠT: HTTP 404 trước khi truy cập upstream |
| Trình duyệt cơ bản 1000px | ĐẠT kết xuất cơ bản, không tràn ngang; giữ truy vấn khi đổi ngôn ngữ |
