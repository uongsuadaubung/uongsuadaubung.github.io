---
title: "Lần đầu tự viết MCP Server cho AI Agent"
date: "2026-08-14"
tags: ["Tool & Projects", "Rust & Backend"]
description: "Chia sẻ hành trình tự viết 1 MCP server cho AI Agent: từ thử nghiệm ban đầu với TypeScript, chuyển sang Rust cho nhẹ nhàng, đến khi nhận ra kiến trúc Plugin mới là cách đóng gói trọn vẹn nhất."
published: true
---

Chuyện là dạo gần đây mình làm việc khá nhiều với các AI Agent trong công việc hàng ngày. Phải công nhận là Agent thông minh thật, nhưng ngặt nỗi có một vấn đề làm mình thấy chưa được ưng cho lắm: vụ quản lý bộ nhớ (Memory) và ngữ cảnh (Context) cho Agent cứ lắt léo và rời rạc kiểu gì ấy.

Thiệt ra thì trên mạng (đặc biệt là GitHub hay cộng đồng open-source) không thiếu các MCP Server quản lý memory sẵn có để tải về dùng ngay. Nhưng tính mình vốn thích táy máy, lại muốn đào sâu tìm hiểu xem bên trong một AI Agent thực sự vận hành, nhận diện tool và tư duy về context như thế nào. Việc tự xắn tay áo làm từ đầu chính là cách tốt nhất để hiểu rõ từng mảnh ghép hệ thống.

Thế là trong một chiều rảnh rỗi ở công ty, mình ngứa tay quyết định tự viết một con **MCP (Model Context Protocol) Server** riêng để vừa lưu trữ memory bền vững, vừa quản lý quy tắc cho Agent sử dụng.

Và thế là hành trình từ thử nghiệm TypeScript quen thuộc, đập đi viết lại bằng Rust, cho đến cú nhấp "Eureka" về tư duy thiết kế dạng **Plugin** bắt đầu!

---

## 🟢 Chặng 1: Thử nghiệm bằng TypeScript – Nhanh nhưng... "nặng nợ"

Như hầu hết anh em khi mới bắt tay vào vọt vạch MCP, lựa chọn đầu tiên của mình không gì khác ngoài **TypeScript**.

Ecosystem của TypeScript thì quá mạnh rồi, lại sẵn có SDK chính chủ từ Anthropic hỗ trợ tận răng. Thế nên chỉ sau vài tiếng táy máy gõ code, mình đã dựng xong một con MCP server prototype chạy ngon lành cành đào trên máy local.

Nhưng rắc rối thực sự chỉ bắt đầu xuất hiện khi mình muốn đóng gói và đem nó sang máy khác dùng, hoặc chia sẻ cho đồng nghiệp:

1. **Phụ thuộc Node.js runtime:** Máy nào muốn dùng cũng bắt buộc phải cài sẵn Node.js và npm.
2. **Kéo theo cả rổ `node_modules`:** Việc phân phối một công cụ nhỏ gọn mà phải tải theo hàng trăm dependencies cồng cềnh nghe nó hơi "nặng nợ".
3. **Đường dẫn lắt léo:** Mỗi lần cấu hình trong file `mcp.json` của IDE hay Agent, việc gọi npx hoặc node script ngầm qua đường dẫn tuyệt đối rất hay gặp lỗi lặt vặt liên quan đến môi trường (PATH, version Node mismatch...).

Cảm giác một công cụ chạy ngầm nền hệ thống mà cõng theo nguyên cái Node runtime cồng cềnh làm mình thấy không được thoải mái cho lắm.

---

## 🦀 Chặng 2: Re-write sang Rust – Cực nhẹ nhưng vẫn thấy "rời rạc"

Để giải quyết bài toán cồng cềnh của Node.js, mình quyết định đập đi viết lại toàn bộ core engine bằng **Rust**.

Cảm giác biên dịch code Rust ra **1 file Single Binary** duy nhất nó đã gì đâu anh em ạ! 
* Khởi động tức thì trong vài milisecond.
* Dung lượng cực nhỏ gọn, ăn cực ít RAM.
* Quan trọng nhất là **chạy độc lập hoàn toàn**, máy đích không cần cài đặt bất kỳ môi trường runtime nào cả. Bật phát là chạy ngay!

Tuy nhiên, dùng thực tế được vài hôm thì một bài toán mới về mặt Trải nghiệm lập trình (Developer Experience - DX) lại lòi ra: **Một MCP Server cho AI Agent không bao giờ sống độc lập một mình.**

Để con Agent thực sự hiểu và dùng đúng tool, ngoài file binary ra, mình phải duy trì thêm hàng đống file phụ trợ xung quanh:
* File `instruction.md` / `rules.md` để "dạy" Agent khi nào nên kích hoạt tool và tuân thủ luồng tư duy (ví dụ: *Memory-First Guard*).
* File cấu hình JSON (`mcp.json`) chỉ định cách khởi chạy server cho IDE.
* Các quy tắc prompt system đi kèm...

Rốt cuộc, dù file Rust binary rất gọn, nhưng đống file bổ trợ xung quanh vẫn nằm **rời rạc khắp nơi**. Mỗi lần cài lại hay chia sẻ cho người khác, mình vẫn phải làm mấy bước manual kiểu: *"Copy file executable này vào thư mục A, chép file instructions vào thư mục B, dán đoạn config JSON này vào file C..."*

Nghe đến đây thôi đã thấy phờ phạt mỏi tay gõ phím cmnr!

---

## 💡 Chặng 3: Cú nhấp "Eureka" mang tên... Plugin Bundle

Trong lúc ngồi suy nghĩ xem làm sao để gom tất cả đống lộn xộn đó lại thành một đơn vị duy nhất, mình chợt nhận ra một khái niệm quen thuộc: **Plugin Bundle**.

Thay vì coi MCP Server chỉ là một file thực thi độc lập (Standalone Binary), tại sao không đóng gói nó thành một **Plugin hoàn chỉnh**?

Bản chất của một Plugin trong hệ sinh thái AI Agent không đơn thuần chỉ là code thực thi. Nó là một chiếc hộp duy nhất bao hàm trọn vẹn 3 thành phần:

```
┌─────────────────────────────────────────────────────────────┐
│                    APM-MCP PLUGIN BUNDLE                    │
│                                                             │
│  ┌───────────────────┐ ┌─────────────────────────────────┐  │
│  │   Rust Executable │ │      Instructions & Rules       │  │
│  │   (Core Memory)   │ │    (Agent Memory-First Guard)   │  │
│  └───────────────────┘ └─────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │               Plugin Manifest & Auto Config           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
               [ Một bước cài đặt - Plug & Play ]
```

1. ⚙️ **Core Executable (Rust Binary):** Xử lý logic đọc/ghi database SQLite, search memory cực nhanh ở phần chìm.
2. 📄 **Instructions & Rules:** Phần nổi chứa prompt và quy tắc để "dạy" AI Agent biết cách vận hành tool chuẩn chỉnh.
3. 🔧 **Manifest & Config:** Tự động đăng ký với hệ thống mà người dùng không cần gõ tay bất kỳ đoạn config JSON nào.

Cài đặt và chia sẻ bây giờ chỉ đơn giản là **Plug & Play** – vừa cấp "Tool" (công cụ), vừa cấp luôn "Brain" (hướng dẫn tư duy) cho Agent trong đúng một nốt nhạc!

---

## 🎯 Và đó là sự ra đời của `apm-mcp`

Từ trải nghiệm thực tế và ý tưởng đóng gói đó, dự án **`apm-mcp`** (Antigravity Plugin Memory / Memory MCP) chính thức ra đời.

Nhờ sự kết hợp giữa hiệu năng mạnh mẽ của **Rust** và kiến trúc đóng gói dạng **Plugin**, `apm-mcp` giúp việc quản lý bộ nhớ cho AI Agent trở nên cực kỳ mượt mà:
* **Tốc độ cực nhanh:** Quản lý SQLite database, keyword search và retrieval với độ trễ tối thiểu.
* **Auto-Memory Guard:** Tích hợp sẵn bộ quy tắc `memory-first guard` trong gói Plugin, ép Agent phải tra cứu bộ nhớ và quy tắc dự án trước khi thực hiện các hành động quét codebase.

### 📦 Ma thuật nhúng (Embedding) trong Rust & Lệnh install thần tốc

Đặc biệt nhất trong thiết kế của `apm-mcp` là việc tận dụng macro `include_str!` và `include_bytes!` thần thánh của Rust:
* Toàn bộ file `instructions.md`, các bộ quy tắc `rules/memory.md`, schema cấu hình JSON và template **đều được nhúng trực tiếp (embed) vào bên trong file binary Rust** ngay tại thời điểm biên dịch (compile time).
* Nhờ đó, file binary Rust không chỉ đóng vai trò làm MCP Server xử lý logic, mà nó còn tự đóng vai trò như một **Bộ tự cài đặt (Self-installer & Asset Provider)**!

Khi muốn tích hợp `apm-mcp` vào AI Agent, thay vì phải lạch cạch tải và copy từng file lộn xộn, bạn chỉ cần chạy **một dòng lệnh duy nhất**:

```bash
# Cài đặt thần tốc và tự động cấu hình toàn bộ Plugin cho Agent
apm-mcp install
```

Khi câu lệnh này chạy:
1. Binary Rust sẽ tự động bung (extract) các file instruction và rules nhúng bên trong ra đúng cấu trúc thư mục Plugin của Agent.
2. Tự tạo database SQLite `apm.db` và khởi tạo bảng biểu ban đầu.
3. Tự động đăng ký cấu hình MCP Server với Agent/IDE mà không cần bạn phải mở file `mcp.json` ra gõ thủ công bất kỳ dòng nào.

Chỉ mất đúng **2 giây**, Agent của bạn vừa có ngay Tool xử lý memory siêu nhẹ từ Rust, vừa có sẵn "bộ não hướng dẫn" để tự động ghi nhớ và tuân thủ quy tắc!

### 🧠 Thiết kế bộ nhớ 3 tầng (Memory Scope Architecture) với SQLite

Về mặt lưu trữ, mình chọn **SQLite** làm database hạt nhân. Lý do đơn giản vì SQLite nhẹ, lưu trữ dạng file đơn cực kỳ an toàn, lại nhúng trực tiếp vào Rust qua `rusqlite` cho tốc độ đọc ghi chuẩn milisecond mà không cần cài thêm bất kỳ database server phức tạp nào.

Để Agent không bị "ngợp" hay nhầm lẫn giữa quy tắc chung và context riêng của từng bài toán, mình thiết kế bộ nhớ phân loại theo **3 cấp độ rõ ràng**:

1. **🌐 Global Permanent (`project_id = "global"`, `is_permanent = true`)**:
   - Bộ nhớ vĩnh viễn toàn cục. Lưu trữ những sở thích, quy định chung hoặc phong cách code của bạn mà Agent **phải tuân thủ ở tất cả dự án** (Ví dụ: *"Luôn xưng 'mình' khi giải thích"*, *"Luôn comment code rõ ràng"*...).

2. **📌 Project Permanent (`project_id = "<active_project_id>"`, `is_permanent = true`)**:
   - Bộ nhớ vĩnh viễn theo dự án. Lưu trữ kiến trúc, conventions, cấu hình DB hay các bí kíp riêng **chỉ gắn liền với dự án đó** (Ví dụ: *"Dự án này dùng Clean Architecture"*, *"Bảng User có các trường..."*).

3. **⏳ Project Ephemeral (`project_id = "<active_project_id>"`, `is_permanent = false`)**:
   - Bộ nhớ **tạm thời** theo dự án. Dùng để lưu nhật ký fix bug, mục tiêu task ngắn hạn hoặc tiến độ công việc đang dở dang. Khi xong task hoặc quy tắc thay đổi, Agent có thể dọn dẹp xoá đi dễ dàng.

```
┌───────────────────────────────────────────────────────────────┐
│                     SQLITE DATABASE (apm.db)                  │
├───────────────────────────────────────────────────────────────┤
│ 🌐 Global Permanent    : Quy tắc chung cho mọi dự án          │
│ 📌 Project Permanent   : Kiến trúc & Convention riêng repo    │
│ ⏳ Project Ephemeral   : Ghi chú tạm thời, log fix bug        │
└───────────────────────────────────────────────────────────────┘
```

Nhờ có cấu trúc 3 tầng này nằm gọn trong SQLite, Agent vừa hiểu được phong cách làm việc chung của mình, vừa nắm chắc context của từng dự án mà không bao giờ lo bị loạn bộ nhớ!

---

## ☕ Kết luận

Trải qua cả 3 giai đoạn tiến hóa từ TypeScript → Rust Binary → Plugin Architecture, điều làm mình tâm đắc nhất chính là việc tự tay giải quyết được bài toán DX cho cả người lập trình lẫn AI Agent.

Khi thiết kế công cụ cho AI Agent dùng, hãy nhớ rằng ta không chỉ thiết kế cho **người cài** mà còn phải thiết kế cho **AI đọc hiểu**. Đóng gói trọn vẹn dưới dạng Plugin chính là chìa khóa để mọi thứ trở nên gọn gàng nhất.

Đến đây thì cũng mỏi tay gõ phím cmnr. Anh em nào cũng đang vọc vạch MCP Server hoặc muốn cấp bộ nhớ "xịn xò" cho AI Agent của mình thì có thể trải nghiệm thử `apm-mcp` nhé! 🚀
