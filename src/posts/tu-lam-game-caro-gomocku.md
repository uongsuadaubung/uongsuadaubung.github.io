---
title: "Tự làm game cờ Carô GoMockU: Khi AI vừa đánh cờ vừa cà khịa"
date: "2026-08-22"
tags: ["Game & Auto", "Web Dev"]
description: "Hành trình xây dựng game cờ Carô (Gomoku) chạy trên trình duyệt bằng SolidJS, tích hợp AI đa luồng không giật lag, 6 chế độ chơi và hệ thống nhận diện sự kiện cà khịa cực kỳ đa dạng."
published: true
isApp: true
appName: "GoMockU"
appIcon: "🎯"
appPeriod: "08/2026"
liveUrl: "/gomoku/"
techStack: ["SolidJS", "TypeScript", "Tailwind CSS", "Web Worker", "Web Audio API"]
showOnResume: true
---

Cờ Carô (Gomoku) chắc chắn là trò chơi quốc dân gắn liền với tuổi thơ của hầu hết anh em lập trình từ những ngày còn ngồi xé vở ô ly cắn bút thách đấu đứa bàn bên. Dạo này công việc trên công ty cũng hòm hòm, rảnh rỗi ngứa tay muốn làm một cái gì đó vừa mang tính hoài niệm vừa có chút gia vị thuật toán cho vui. 

Lên mạng dạo một vòng thử mấy con bot cờ Carô có sẵn thì thấy đa phần một là đánh quá máy móc khô khan, hai là giao diện cũ kỹ từ thập kỷ trước. Quan trọng nhất là mỗi lần thắng hay thua, con bot cứ trơ trơ ra chả có cảm xúc gì. Thế là mình nảy ra ý tưởng: *Sao không tự viết một con game cờ Carô hiện đại, mượt mà, có thuật toán giải cờ bài bản và quan trọng nhất là con bot phải biết... "gáy bẩn" và cà khịa mỗi khi đối thủ đi nước sai?*

Thế là dự án **GoMockU** ra đời.

```
            Go               +         Mock         +         U (You)
(Vừa là cờ, vừa là đi nước cờ)      (Cà khịa, chọc ngoáy)        (Chính là bạn)
─────────────────────────────────────────────────────────────────────────────
          👉 Thông điệp: "Bạn hạ một quân cờ, Bot cà khịa bạn một câu!"
```

---

## 🧭 Khám phá 6 chế độ chơi tại Menu chính

Khi thiết kế menu chính cho GoMockU, mình không muốn nhồi nhét một danh sách nút bấm đơn điệu. Toàn bộ trải nghiệm được phân bổ thành 2 khu vực rõ ràng: **Đấu Trường Thi Đấu** và **Học Tập & Kỳ Viện**, tương ứng với 6 chế độ chơi riêng biệt:

---

### ⚔️ Khu vực 1: Đấu Trường Thi Đấu

Khu vực này dành riêng cho việc so tài kỹ năng và thử thách bản lĩnh thi đấu trực tiếp với các cấp độ AI:

![Đấu Trường Thi Đấu trong GoMockU](/images/tu-lam-game-caro-gomocku/image-01.png)

#### 1. 🏆 Chiến Dịch Leo Cấp (Campaign Mode) — Thập Nhị Đại Tông Sư
Chế độ cốt lõi cho anh em thích cảm giác leo rank bậc thang. Bạn sẽ bắt đầu từ con số 0 và leo qua 12 tầng tháp để đối đầu với 12 nhân cách Bot:
* **Cấp 1 – Bé Tập Chơi**: Đánh cờ ngây ngô, chọn ô ngẫu nhiên, hay tự thua nhưng độ tự tin thì thừa.
* **Cấp 3 – Kỳ Thủ Phố**: Lối đánh cờ vỉa hè đầy biến hóa, chuyên dùng đòn tâm lý châm chọc đối thủ.
* **Cấp 6 – Kiện Tướng Trẻ**: Bắt đầu thành thạo các đòn bẫy kép 4-3, phản công rất rát nếu bạn sơ hở.
* **Cấp 12 – Độc Cô Cầu Bại**: Đỉnh cao AI với Minimax duyệt sâu 6–8 tầng, tích hợp bộ giải sát cục VCF/VCT vét cạn mọi nhánh đe dọa.

Đánh thắng cấp hiện tại thì hệ thống mới mở khóa đối thủ tiếp theo. Cảm giác vượt qua từng cấp rồi nghe bot đổi giọng từ khinh khỉnh sang cay cú khá là giải trí.

#### 2. ⚡ Cờ Chớp Thử Thách (Blitz Challenge) — Áp lực nghẹt thở từng giây
Nơi thử thách phản xạ và trực giác chiến thuật dưới áp lực thời gian:
* **Giới hạn thời gian siêu gắt**: Chọn giữa **5 giây** *(Khắc nghiệt)*, **10 giây** *(Tiêu chuẩn)* hoặc **15 giây** *(Dễ thở)* cho mỗi nước đi.
* **Luật Sinh Tử (Sudden Death)**: Thắng một ván sẽ ngay lập tức bước sang cấp độ Bot cao hơn. Nhưng chỉ cần **thua 1 ván hoặc để cháy giờ**, chuỗi sinh tử lập tức bị bẻ gãy và bạn phải quay về vạch xuất phát Cấp 1!
* **Cấm hoàn toàn nút Đi Lại (No Undo)**: Hạ cờ là không rút lại được. Khi đồng hồ đếm ngược dưới 3 giây, âm thanh tích tắc dồn dập vang lên bảo đảm tim đập thình thịch.

#### 3. ⚔️ Đấu Tùy Chọn (Custom Match) — Phòng tập tự do
* Tự do chọn bất kỳ cấp độ Bot nào bạn đã mở khóa được từ Chiến Dịch.
* Cho phép chọn cầm **Quân Đen** (đi trước nắm tiên thủ) hoặc **Quân Trắng** (đi sau tập phản công hóa giải sức ép).
* Có đầy đủ các công cụ hỗ trợ như đổi bên, đi lại (Undo) và xem lại lịch sử các nước cờ để mổ xẻ nước đi sai lầm.

---

### 🎓 Khu vực 2: Học Tập & Kỳ Viện

Nếu không muốn chỉ cắm đầu vào đánh cờ mà muốn nghiên cứu bài bản, khu vực này sẽ biến game thành một học viện cờ thu nhỏ:

![Học Tập & Kỳ Viện trong GoMockU](/images/tu-lam-game-caro-gomocku/image-02.png)

#### 4. 📘 Kỳ Viện Bách Khoa & Bàn Cờ Sandbox (Master Guide & Sandbox)
* **Giáo trình 8 Chương & 28 Bài học tương tác**: Đi từ những khái niệm căn bản như điểm tâm bàn cờ (Tengen H8), cự ly liên kết quân, cho đến 26 thế khai cuộc Renju chuẩn quốc tế (*Hoa Nguyệt, Phố Nguyệt, Khâu Nguyệt...*), nghệ thuật bẫy đôi (4-3, 3-3, 4-4), quản lý nhịp độ & nước chờ, kỹ thuật sát cục dồn ép VCF/VCT, nghệ thuật phòng thủ phản kích và chuyên đề luật cấm Renju.
* **Bàn cờ Sandbox & Radar Chiến Thuật (Tactical Radar)**: Đi kèm với giáo trình là phòng giả lập tương tác. Hệ thống sẽ vẽ trực quan bản đồ nhiệt (Heatmap) kiểm soát ô cờ và các trục đe dọa theo thời gian thực để bạn thử nghiệm các kịch bản *"Nước này đi vào đây thì thế trận biến đổi ra sao?"*.

#### 5. 🎓 Học Viện Gomo (Tutor Coaching Mode) — Gia sư 1-1 theo sát từng nước
Tính năng đóng vai trò như một người thầy dạy cờ ngồi bên cạnh bạn trong suốt ván đấu:
* **Trước khi đi**: Gia sư tính toán ở luồng ngầm để tìm ra *"Nước cờ vàng"* tối ưu nhất, đồng thời phát báo động đỏ nếu đối thủ đang rình rập một đòn kết liễu.
* **Sau khi hạ quân**: Ngay khi bạn đặt quân xuống, Gia sư sẽ đối chiếu và xếp hạng chất lượng nước đi (*Brilliant, Great, Good, Inaccuracy, Blunder*) kèm lời giải thích tại sao nước cờ đó hay hoặc dở.
* **Không lo giật lag UI**: Toàn bộ thuật toán phân tích của Gia sư chạy ngầm trên luồng riêng, giữ cho giao diện luôn mượt mà 60 FPS.

#### 6. 🧩 Giải Đố Thế Cờ (Tactical Puzzles) — Sát cục tạo sinh ngẫu nhiên
Thay vì tải về một danh sách vài chục bài tập tĩnh giải vài lần là nhớ hết đáp án, mình xây dựng hệ thống cờ thế theo dạng **Tạo sinh thủ tục (Procedural Kernel Generator)**:
* **Kho hạt giống chiến thuật 1⭐ đến 7⭐**: Chứa các cấu trúc sát cục lõi kinh điển như VCF (chuỗi ép nước 4 liên hoàn), VCT (chuỗi phối hợp nước 3 mở và nước 4), đòn móc chữ L, đòn Z-Cascade hay Thất Tinh Bắc Đẩu.
* **Biến đổi không gian & Nhiễu giao tranh**: Thuật toán lấy ngẫu nhiên một hạt giống, áp dụng các phép biến đổi xoay góc, lật gương và rải thêm nhiều mẫu giao tranh trung cuộc ngẫu nhiên. Sinh ra **hàng triệu thế cờ độc nhất vô nhị** nhưng vẫn đảm bảo có lời giải chặt chẽ 100%.

---

## 🎭 Hệ thống nhận diện sự kiện cà khịa đa dạng & Bắt thóp tâm lý người chơi

Điểm làm nên linh hồn và sự hài hước của GoMockU chính là hệ thống Bot Persona được lập trình để **nhận diện hàng loạt hành vi và tình huống đa dạng** trong và ngoài bàn cờ, kết hợp cùng kho câu thoại tiếng Việt phong phú đậm chất "gáy bẩn":

![Giao diện bàn cờ và Bot cà khịa thời gian thực](/images/tu-lam-game-caro-gomocku/image-03.png)

Hệ thống cảm xúc của Bot được phân chia thành **nhiều sắc thái biểu cảm** như *Khinh bỉ (😒), Cười khẩy (😏), Mặt hề (🤡), Kính lúp bắt thóp (🧐), Ngáp ngủ (🥱), Ác quỷ (😈), Hoảng loạn (😱)...* tương ứng với 4 nhóm tình huống chính:

### 1. ⚔️ Nhóm Diễn Biến Trận Đấu
Bot theo dõi sát sao từng nước đi trên bàn cờ để châm chọc kỹ năng của bạn:
* **Chặn ngáo & Tự bóp**: Bỏ sót nước 4 mở của Bot, chặn sai đầu của nước 3 mở, hoặc tự đặt quân chặn mất đường phát triển của chính mình.
* **Đòn thế kỳ dị**: Nhận diện khi người chơi xếp cờ hình tam giác cụm bo góc như chơi Cờ Vây, xếp cờ hình chữ T vuông góc, hoặc dạt quân ra tít góc bàn cờ cách xa cụm giao tranh chính ("đi đảo hoang").
* **Thua nước định mệnh**: Thua cuộc đúng ở nước cờ thứ 13, thua chớp nhoáng dưới 60 giây, hoặc cày cuốc đến hơn 100 quân mà vẫn bị Bot bẻ gãy thế trận.

### 2. ⏳ Nhóm Trạng Thái Chờ & Treo Máy
* **Ngồi ngắm đường thua**: Vừa bị Bot kết liễu xong mà ngồi thừ người ra ngắm đường 5 quân phát sáng quá lâu.
* **Ngâm cờ câu giờ**: Suy nghĩ quá lâu khi đến lượt đi hoặc ngâm một nước cờ cả buổi là Bot sẽ ngáp ngắn ngáp dài chê bạn đánh rùa bò.

### 3. 💬 Nhóm Bắt Bài Tương Tác & Tâm Lý
Đây là phần thú vị nhất khi Bot bắt bài các thói quen vô thức của người chơi qua chuột và bàn phím:
* **Lắc chuột hoảng loạn**: Khi bạn bí nước và lắc chuột lia lịa qua lại trên màn hình $\rightarrow$ Bot cười nhạo sự bấn loạn của bạn ngay.
* **Do dự bấm Undo**: Rê chuột hover vào nút Đi Lại quá 2 giây rồi lại rụt tay về không dám bấm.
* **Bắt quả tang mở F12**: Bấm phím mở DevTools để soi code $\rightarrow$ Bot lập tức cảnh cáo không được gian lận!
* **Bắt bài phím tắt & chụp màn hình**: Nhận diện khi người chơi bấm tổ hợp phím Undo, ấn phím chụp màn hình, hay quét chuột bôi đen giao diện xung quanh bàn cờ để tìm manh mối.
* **Đập phím & Chọc Bot**: Bấm phím Space liên hồi khi sốt ruột hoặc click spam liên tục vào mặt Avatar Bot sẽ khiến nó nổi đóa mắng lại.

### 4. ⚙️ Nhóm Ngữ Cảnh Thời Gian Thực & Hệ Thống
Bot nắm rõ cả thời gian thực tế bên ngoài đời thực của bạn để "nói trúng tim đen":
* **Theo khung giờ**: Chơi sáng thứ Hai đầu tuần, chiều thứ Sáu chuẩn bị tan sở, đầu giờ chiều căng da bụng chùng da mắt, hoặc cú đêm 3 giờ sáng.
* **Đổi theme cầu may**: Đang thua liên tiếp 3 ván mà cuống cuồng đổi giao diện bàn cờ từ Wood sang Cyber/Jade để giải đen $\rightarrow$ Bot nhảy vào châm chọc ngay: *"Đổi theme cũng chả đổi được vận mệnh thua đâu sếp!"*.
* **Tắt loa trốn tránh**: Người chơi bấm tắt âm thanh để đỡ nghe Bot gáy thì Bot sẽ làm biểu cảm suýt im lặng (🤫).

---

## 🧠 Hậu trường kỹ thuật & Động cơ AI

Về mặt công nghệ, GoMockU được xây dựng trên bộ tech stack khá gọn gàng:

| Thành phần | Công nghệ sử dụng | Mục đích |
| :--- | :--- | :--- |
| **Giao diện** | SolidJS + Tailwind CSS v4 | Render siêu nhanh, Fine-grained reactivity không tốn chi phí Virtual DOM |
| **Runtime & Build** | Bun + Vite v8 | Tốc độ cài package và build ứng dụng cực nhanh |
| **Động cơ AI** | Minimax + Alpha-Beta + Zobrist Table | Tìm kiếm sâu nước cờ tối ưu, lưu bảng băm 150.000 trạng thái với phép XOR $O(1)$ |
| **Đa luồng** | Web Workers | Đẩy toàn bộ tính toán nặng sang background thread |
| **Âm thanh** | Procedural Web Audio API | Tự tổng hợp sóng âm cho tiếng cờ, đồng hồ... không cần tải file MP3 |

---

## 🎯 Lời kết

GoMockU là một dự án cá nhân mang lại cho mình rất nhiều niềm vui khi làm, từ việc tối ưu từng mili-giây cho thuật toán Minimax, viết bộ sinh map cờ thế ngẫu nhiên đến việc thiết kế hàng loạt sự kiện tương tác phong phú để biến con bot thành một "đại kình địch" độc mồm thực sự.

Nếu bạn muốn ôn lại kỷ niệm tuổi thơ với cờ Carô hoặc thử sức leo tháp với những con bot "gáy bẩn", hãy ghé qua chơi thử nhé!
