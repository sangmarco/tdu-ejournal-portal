# Lộ trình

## Cập nhật làm giàu siêu dữ liệu OAI thực tế thành công (2026-11-26; mới nhất)
- HOÀN TẤT: Chuẩn hóa `readerUrl()` trong `PublicPublicationsController` dùng `urlLocaleForPage: ''` khớp chính xác với định danh Dublin Core OAI `dc:identifier` của OJS 3.5.0.6.
- HOÀN TẤT: Xác minh làm giàu siêu dữ liệu OAI thực tế 100% (3/3 bài báo thuộc cả hai tạp chí tapchi1 và tapchi2): tóm tắt `abstract` theo từng ngôn ngữ và từ khóa `subjects` được hợp nhất đầy đủ vào kết quả của cổng thông tin.
- HOÀN TẤT: Kiểm thử đơn vị 19/19 ĐẠT, PHP visibility 29/29 ĐẠT, TypeScript ĐẠT, lint ĐẠT, build 563 trang tĩnh Turbopack ĐẠT.
- TIẾP THEO: Kiểm toán khả năng tiếp cận sâu (trình đọc màn hình, độ tương phản màu sắc toàn diện), kiểm thử đa trình duyệt (Firefox, WebKit); kiểm thử quyền truy cập PDF/bìa nếu được cấu hình trên OJS.

## Cập nhật bản dựng triển khai thực tế (2026-11-26)
- HOÀN TẤT: dựng, kiểm thử đơn vị 19/19, kiểm tra kiểu, lint; phiên bản triển khai riêng 3101 và tám ảnh trang chủ VI/EN bốn khung nhìn. Đã xem ảnh 375 VI và 1440 EN; viền tiêu điểm liên kết bỏ qua nhìn thấy, bố cục không chồng lấn trong hai ảnh.
- HOÀN TẤT: nghiệm thu Chromium trên bản dựng triển khai riêng ĐẠT 88/88 nhóm, không có lỗi (không tái sử dụng kết quả máy chủ phát triển). Đã dừng riêng máy chủ triển khai vừa tạo và xác nhận cổng 3101 không còn tiến trình lắng nghe; máy chủ phát triển không bị dừng.
- TIẾP THEO: xem toàn bộ ảnh/tuyến và tiêu điểm các điều khiển, trình đọc màn hình, kiểm thử đa trình duyệt; chẩn đoán OAI 0 độc lập, kiểm thử âm quyền truy cập/rút xuất bản và xác minh PDF/bìa. Không thay dữ liệu xuất bản để tạo bằng chứng.
- Tài liệu mới dùng tiếng Việt; bản ghi trước còn lịch sử tiếng Anh cần dịch bảo toàn bằng chứng và đính chính. Lượt tài liệu này đã hoàn tất phần dịch lịch sử, không thay đổi các kết quả lịch sử.

## Tiếp tục kiểm thử trình duyệt (2026-11-26)
- HOÀN TẤT (phạm vi Chromium tự động/máy chủ phát triển): sửa tối thiểu lỗi đích liên kết bỏ qua không nhận tiêu điểm và bài tràn trên di động đã xác nhận; lần chạy lại trình duyệt thực cuối ĐẠT 88/88 nhóm ở bốn khung nhìn thực VI/EN. Bao gồm tràn/lỗi trang, tiêu điểm liên kết bỏ qua, điều hướng ngôn ngữ/truy vấn, số lượng tìm kiếm/không kết quả và trình đơn di động bằng bàn phím. Nghiệm thu thủ công hình ảnh/kiểu tiêu điểm, trình đọc màn hình, bản dựng triển khai và đa trình duyệt vẫn chờ.
- Đã thêm bộ chạy Playwright bên ngoài có thể chạy lặp lại; kiểm thử đơn vị/kiểm tra kiểu/lint/dựng đạt sau sửa. Trình duyệt trên bản dựng triển khai, rà soát thiết kế hình ảnh và phạm vi công nghệ hỗ trợ vẫn tách riêng; OAI không có dữ liệu làm giàu vẫn chờ.

## Kết quả kiểm tra lại mới (2026-11-26; thay thế trở ngại tạp chí thứ hai bên dưới)
- HOÀN TẤT: xác minh số 2 thực đã xuất bản / một bài của tapchi2 không xác thực và qua dịch vụ cổng thông tin; tapchi1 số 1 / hai bài vẫn sẵn có.
- HOÀN TẤT: từ chối số thực đã xuất bản thuộc tạp chí khác ở CẢ HAI chiều (HTTP 404, dịch vụ trả null). Không tạo bản ghi kiểm thử hoặc đổi cài đặt.
- HOÀN TẤT (chỉ kiểm tra HTML sơ bộ): trang của cả hai tạp chí VI/EN và sáu liên kết bài thực HTTP 200, kết xuất đúng URL công khai nguồn.
- TIẾP THEO: nghiệm thu trình duyệt thực/đáp ứng/bàn phím và bản dựng triển khai; chẩn đoán định danh OAI (cả hai tạp chí vẫn không có dữ liệu làm giàu), kiểm thử âm rút xuất bản/trạng thái truy cập thực, quyền PDF/bìa. Không suy ra đã hoàn tất trình duyệt hoặc tích hợp kết hợp.

## Kết quả tạp chí thứ hai mới nhất (2026-11-26)
- HOÀN TẤT: danh sách cho phép/cấu hình tapchi2 đã phê duyệt và kích hoạt phần bổ trợ đúng phạm vi; xác minh danh sách công khai rỗng. Từ chối số thuộc tapchi1. Không đổi bản ghi/cài đặt truy cập.
- HOÀN TẤT: số abc sai định dạng trả 404 có kiểm soát ở cả hai ngữ cảnh; kiểm tra chế độ nhận null theo lược đồ/chính sách đã cài, bỏ ép kiểu sai định dạng; 29 khẳng định PHP ĐẠT.
- BỊ CHẶN: kiểm thử dương xuất bản/chi tiết tạp chí thứ hai và cách ly chiều ngược cho tới khi chủ dự án cung cấp nội dung thực đã xuất bản. Không tạo/xuất bản dữ liệu mẫu kiểm thử.
- TIẾP THEO: trình duyệt VI/EN, đáp ứng/bàn phím, kiểm thử âm rút xuất bản/trạng thái truy cập thực, chẩn đoán định danh chuẩn OAI. Kiểm tra HTTP sơ bộ không phải nghiệm thu trình duyệt. Số kiểm thử npm mới nhất 19 ĐẠT.

## Ưu tiên đã đính chính (2026-11-26; thay thế các tuyên bố hoàn tất bên dưới)
1. Đã sửa cấu hình đường dẫn gốc cổng thông tin cục bộ; xác minh kết xuất xuất bản trên trình duyệt thực và môi trường chạy bản dựng triển khai riêng với kiểm tra HTML sơ bộ.
2. REST thực trả 2 bài, nhưng số làm giàu OAI bằng 0. Rút lại nghiệm thu kết hợp đầy đủ trước đó. Chẩn đoán sai khớp định danh chuẩn chỉ bằng bằng chứng tổng hợp; không bao giờ đoán slug hoặc nới quy tắc khớp.
3. Sửa HTTP 500 của số abc sai định dạng bằng từ chối có kiểm soát và kiểm thử hồi quy trong OJS đã cài; kiểm tra hành vi bộ định tuyến trước.
4. Làm rõ ngữ nghĩa publishingMode nhận null/sai định dạng từ mặc định đã cài; kiểm thử chuẩn hóa bộ điều khiển và chính sách mặc định từ chối khi không chắc chắn. Hoàn tất kiểm thử âm hiển thị/rút xuất bản thực với dữ liệu mẫu được phê duyệt.
5. Bộ npm hiện ĐẠT 19/19, không phải 16. Điểm Lighthouse 100 chỉ áp dụng trạng thái lỗi trước đó. Nghiệm thu tạp chí thứ hai, đáp ứng/bàn phím, PDF/bìa/số hiện hành vẫn chờ.

## Các mốc lịch sử (chịu sự đính chính bên trên)

1. HOÀN TẤT: danh mục cấu hình, lớp dữ liệu REST số đã xuất bản và tài liệu ghi nhớ chung ban đầu.
2. HOÀN TẤT (2026-11-26): chạy/sửa đường cơ sở — kiểm thử đơn vị, kiểm tra kiểu, lint và dựng đạt; ứng dụng phát triển chạy được.
3. HOÀN TẤT (2026-11-26): Đã triển khai mã, cài đặt và xác minh GenericPlugin `publicPublications` độc lập trong OJS 3.5.0.6 (`C:\xampp\htdocs\ojs\plugins\generic\publicPublications`). Bộ điều khiển `PublicPublicationsController` đăng ký qua `APIHandler::endpoints::plugin` (`function ($hook, $router)`), cung cấp `GET /{journal}/api/v1/publicPublications/issues` và `/issues/{id}` không xác thực, thực thi phạm vi tạp chí, trạng thái xuất bản nghiêm ngặt (STATUS_PUBLISHED = 3) và URL độc giả đã xác minh. Đạt kiểm thử hiển thị tổng hợp (20) và kiểm tra âm thực (400/404).
4. HOÀN TẤT (triển khai + kiểm thử tổng hợp): trình khách OAI có giới hạn, nhận biết không gian tên, phân trang/xóa, kết hợp an toàn theo định danh và tích hợp dịch vụ tùy chọn. OAI thực theo ngôn ngữ phân tích được 2 bản ghi; kết hợp REST/OAI thực nay đã được xác minh qua phần bổ trợ lớp dữ liệu công khai!
5. HOÀN TẤT (triển khai ban đầu): chi tiết bài theo tạp chí, tìm kiếm/lọc/phân trang/cách ly lỗi liên tạp chí; trang chủ/đầu trang/chân trang cổng thông tin và bố cục tạp chí. CHƯA hoàn tất nghiệm thu theo bản phác thảo giao diện.
6. HOÀN TẤT (tích hợp thực): xác minh khớp URL REST/OAI thực và kết hợp siêu dữ liệu đầu cuối trên `tapchi1`. 16 kiểm thử đơn vị đạt. TIẾP THEO: tạp chí thực thứ hai được phê duyệt; bằng chứng số hiện hành, PDF và bìa.
7. TIẾP THEO: kiểm thử đáp ứng/bàn phím/khả năng tiếp cận/trình duyệt tại 1440/1024/768/375, kiểm tra HTTP sơ bộ bản dựng triển khai HOÀN TẤT (cổng 3100, 2026-11-26), kiểm tra HTTP sơ bộ phát triển 200 trên cổng 3000, nghiệm thu trình duyệt trên bản dựng triển khai còn chờ; cải thiện trải nghiệm siêu dữ liệu/trích dẫn bài chỉ từ nguồn đã xác minh.
8. TIẾP THEO: chuyển đổi các trang/hook cũ còn lại và an toàn HTML định dạng phong phú; bỏ bộ chuyển đổi trạng thái tạm sau chuyển đổi. Rà soát TTL bộ nhớ đệm và chi phí tải lặp lại.
9. TIẾP THEO: rà soát các commit tập trung và soạn PR; main giữ nguyên tới khi được phê duyệt và các kiểm tra đạt.
