---
trigger: glob
globs: src/posts/**/*.md
---

# Blog Writing Style Rule

Mỗi khi người dùng yêu cầu AI viết một bài blog mới, hãy luôn luôn tuân theo những chỉ dẫn văn phong (Voice & Tone) dưới đây để đảm bảo bài viết giống văn phong của tác giả.

## Voice & Tone (Giọng điệu)
- Xưng hô: Thân thiện, gần gũi như đang trò chuyện chia sẻ kiến thức với bạn bè ("mình" - "mọi người" / "các bạn").
- Hài hước, tự trào (Self-deprecating): Thỉnh thoảng trêu đùa bản thân một cách vui vẻ (Ví dụ: "gõ mỏi tay", "lười quá chả viết nữa", "C/C++ khó quá không học nổi").
- Biểu lộ cảm xúc thật: Chia sẻ thẳng thắn về những đoạn code khó, những lúc debug bị "lú" hay sự lười biếng ở cuối mỗi bài viết (như "bài dài rồi nên mình xin phép chuyển part 2").
- Teencode/Biểu cảm linh hoạt: Sử dụng đan xen những biểu tượng quen thuộc như: `:v`, `:V`, `:D`, `:))`, `thui`, `chả`, `éc éc`, `xíu`. (Dùng vừa đủ để tạo sự thân thiện, tự nhiên).
- LƯU Ý QUAN TRỌNG: Tránh sử dụng những từ ngữ quá khích hoặc cường điệu (như 'quần què', 'cục súc', 'não to', 'hack', 'húp', 'chém', 'vl', 'cmnr'). Giữ giọng điệu dân dã, chân thực của dân kỹ thuật nhưng vẫn phải lịch sự, nhẹ nhàng và tích cực.

## Nội dung & Cốt truyện (Storytelling)
- Bài viết cần CHI TIẾT và DÀI: Tuyệt đối không viết ngắn gọn hay kết thúc cụt lủn. Phải kể lại chi tiết quá trình từ lúc nhen nhóm ý tưởng, cảm xúc ban đầu, cho đến khi hoàn thành. 
- Mở đầu cảm xúc: Bắt đầu bài luôn bằng 1 câu chuyện thực tế hoặc kỉ niệm gắn liền với nguồn cảm hứng ("Hồi lớp 7..", "Hôm nọ bực mình quá.."). Tạo sự đồng cảm và tò mò ngay từ đoạn đầu.
- Quá trình "Vật lộn" & Gian nan: Đưa người đọc đi qua quy trình phát triển thực tế. Phải có mô tả sự bế tắc, sai lầm, hoặc vấn đề kĩ thuật oái oăm ("lỗi rạn vỡ màn hình đỏ lòm", "ngồi debug mờ cả mắt", "hý hửng tưởng vậy mà không phải"). Câu chuyện cần nhấn mạnh vào "nỗi đau" và sự cố gắng giải quyết.
- Trình diễn Code chi tiết: Dùng nhiều đoạn code block rải rác xuyên suốt câu chuyện để dẫn chứng cho quá trình giải quyết vấn đề (như đoạn code lỗi lúc đầu, đoạn code fix lỗi, cấu hình hệ thống, thuật toán cốt lõi).
- Lối tư duy giải quyết "Thực dụng": Tập trung vào bài học xương máu, focus mạnh vào việc thực hành và giải quyết cho xong vấn đề ("mình tìm ra hàm này giải quyết luôn"), không mang tính học thuật hay lý thuyết sáo rỗng.

## Format bài viết (Cấu trúc Markdown)
- Frontmatter chuẩn: Có đủ `title`, `date`, `tags`, `description`, `published`. Các bài blog được lưu trong thư mục `src/posts/`.
- Heading: Dùng `H2` (##), `H3` (###) để tách dòng mạch lạc.
- Hình ảnh: Khuyến khích user cung cấp hình ảnh, và để sẵn markdown `![Mô tả ảnh](/images/slug/image-xx.png)`. Thêm một dòng caption in nghiêng phía dưới ảnh.
- Code & Data: Dùng Code Block tương ứng ngôn ngữ (`rust`, `csharp`, `typescript`), dùng Table nếu cần so sánh.
