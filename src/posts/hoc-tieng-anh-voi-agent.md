---
title: "Hành trình tự làm AI English Tutor"
date: "2026-06-03"
tags: ["Lập Trình", "AI Agent", "SQLite", "Drizzle ORM", "Hono", "Deno"]
description: "Kể về lúc rảnh rỗi tự nhiên nghĩ đến việc học tiếng Anh với AI Agent. Từ việc lưu trữ thô sơ bằng file Markdown, chuyển qua SQLite, dùng Hono làm web server rồi lại có cú quay xe cực khét khi xóa béng server đi để chuyển sang CLI thuần."
published: true
---

Dạo này rảnh rỗi sinh nông nổi, mình tự nhiên nảy ra ý định muốn cải thiện phản xạ tiếng Anh. Nhưng thay vì lướt app hay làm mấy bài tập ngữ pháp khô khan thông thường, đầu óc của một thằng dev lười lại mách bảo: *\"Ủa, sao mình không bắt một chú AI Agent làm gia sư tiếng Anh riêng cho mình nhỉ?\"*. Vừa học, vừa bắt Agent chạy bằng cơm, lại vừa có cớ nghịch công nghệ mới. Thế là dự án AI English Tutor ra đời.

Cơ mà con đường làm "thầy giáo AI" này gian nan hơn mình nghĩ nhiều. Từ lúc ngây ngô dùng file text thô sơ cho đến khi over-engineer dựng cả Web Server, rồi cuối cùng nhận ra mình "ngáo ngơ" thế nào để quay xe về CLI thuần... Đúng là một chuỗi ngày ăn hành ngập mồm nhưng cực kỳ cuốn!

---

## 📅 Giai đoạn 1: Khởi đầu ngây ngô và đống Markdown thô sơ

Ở những bước đầu tiên, mình dùng quả "IQ 40" của mình để thiết kế một hệ thống lưu trữ dữ liệu học tập vô cùng trực diện: **Bắt Agent đọc và ghi trực tiếp vào các file Markdown tĩnh (.md)**. 

Ý tưởng rất đơn giản: khi học từ mới hay làm bài tập, Agent sẽ tự động mở file ra đọc lịch sử, chấm điểm, rồi lại ghi đè/nối thêm nội dung mới vào file Markdown để làm "database". Lúc đó cấu trúc thư mục của mình trông như thế này:
```text
learning-english/
├── progress/
│   ├── journal.md     # Nhật ký học tập từng buổi
│   └── stats.json     # Thống kê vài thông số cơ bản
├── subjects/
│   └── 01_foundation_sentences.md # Bài học số 1
└── words/
    └── interested.md  # Chi tiết từ vựng đã học
```

Để anh em dễ hình dung sự thô sơ này, đây là một đoạn demo "nhật ký học tập" mà Agent tự cập nhật vào [progress/journal.md](file:///c:/Users/kien.hm/Desktop/learning-english/progress/journal.md) ở buổi học đầu tiên khi mình học từ *interested*:

```markdown
### 📚 Buổi Học 1: Làm Chủ Cấu Trúc Câu Cơ Bản & Khắc Phục Lỗi Dịch "Word-by-Word"
* **Ngày học:** 2026-06-01
* **Từ vựng mới:** `interested` (words/interested.md)
* **Các câu bạn đã đặt chính xác:**
  1. *I like cooking at home very much.* (Dịch phản xạ Việt - Anh)
  2. *She is a big fan of K-pop music.* (Sắp xếp từ)
  3. *I am interested in coding.* (Sáng tạo câu tự do)
* **Nhận xét của AI Tutor:** Bạn có tư duy cấu trúc cực kỳ nhạy bén...
```

Lúc này, mọi thứ hoạt động khá mượt mà. Mỗi lần học chỉ cần quăng đống file này cho Agent đọc. Nhưng đời không như là mơ...

---

## ⚡ Giai đoạn 2: Nâng cấp bài tập vì học thế này dễ xơi quá!

Sau buổi học đầu tiên ngon lành cành đào, mình nhận thấy quá trình học kiểu này đơn giản quá. Chỉ dịch qua dịch lại mấy câu với sắp xếp từ thì chả mấy chốc mà chán. Học hành là phải thử thách, phải có tí "áp lực" thì phản xạ mới lên được!

Thế là mình quyết định vào cập nhật file luật chơi của Agent ([gemini.md](file:///c:/Users/kien.hm/Desktop/learning-english/gemini.md)), bổ sung thêm một loạt các dạng bài tập mới. Từ 3 dạng cơ bản ban đầu, mình nâng cấp lên **9 dạng bài tập** siêu đa dạng:

1. **Two-way Translation** (Dịch phản xạ Việt - Anh và ngược lại)
2. **Word Scramble** (Sắp xếp từ xáo trộn)
3. **Multiple Choice** (Trắc nghiệm chọn đáp án đúng)
4. **Fill-in-the-blank** (Điền giới từ/cụm từ vào chỗ trống)
5. **Error Identification** (Tìm và sửa lỗi sai word-by-word)
6. **Creative Builder** (Tự đặt câu thực tế với cấu trúc mới)
7. **Role-play / Scenario Practice** (Đóng vai hội thoại thực tế)
8. **Sentence Upgrading** (Nâng cấp câu nói thô/cơ bản thành câu lịch sự, tự nhiên)
9. **Contextual Q&A** (Trả lời câu hỏi mở về cuộc sống)

Từ đây, mỗi buổi học trở nên sống động hơn hẳn. Nhưng bù lại, một vấn đề siêu to khổng lồ bắt đầu xuất hiện...

---

## 💸 Giai đoạn 3: Nỗi đau xót ví và màn chuyển giao sang SQLite + Web Server

Vì bắt Agent đọc và lưu trữ toàn bộ quá trình học tập dạng text thô trong các file `.md` nên mỗi lần tương tác, Agent lại phải nhai đi nhai lại toàn bộ nội dung của các file này để nắm ngữ cảnh. Số lượng từ vựng tăng lên, lịch sử học tập dài ra đồng nghĩa với việc **đống token đầu vào (input tokens) tăng vọt theo cấp số nhân**. 

> Nhìn hóa đơn API Token bay như gió mà lòng mình đau như cắt! Quản lý bằng text thế này thì có ngày cạp đất mà ăn cmnr.

Quyết không để cúng tiền cho các ông lớn AI vô ích, mình quyết định đập đi xây lại hệ thống lưu trữ: **Dẹp hết đống file Markdown tĩnh đi, chuyển sang lưu dữ liệu vào SQLite và dựng một Web Server chạy localhost bằng Deno (`server.ts`)**.

```typescript
// server.ts phiên bản thô sơ sử dụng Deno native serve
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (path === "/api/words" && method === "GET") {
    // Phải tự viết regex matching và switch-case kiểm tra endpoint thủ công
    return await handleGetWords(req, url);
  }
  // ... Cả đống if-else dài dằng dặc phía dưới
}
Deno.serve({ port: PORT }, handleRequest);
```

Bằng cách này, Agent không cần phải đọc cả đống file Markdown nữa. Khi cần thông tin gì (ví dụ lấy danh sách từ vựng cần ôn hôm nay), Agent chỉ việc gửi một request API nhẹ nhàng lên localhost để server truy vấn SQLite và trả về đúng cục JSON cần thiết. Vừa tiết kiệm token, vừa bảo mật dữ liệu ngon lành.

---

## 🛠️ Giai đoạn 4: Lười viết SQL thuần và cú hích từ Drizzle ORM

Dựng được Web Server và SQLite chạy ngon lành rồi, cơ mà đời không bao giờ là dễ ăn. Việc viết các câu lệnh raw SQL `CREATE TABLE`, `INSERT INTO`, `SELECT`... rồi tự viết hàm parse validate đống dữ liệu đầu vào làm mình thấy mệt mỏi và tốn thời gian quá. Mỗi lần muốn thay đổi cấu trúc bảng lại phải hì hục viết file migration bằng tay.

Để tối giản hóa cuộc sống lập trình, mình quyết định kéo **Drizzle ORM** vào dự án. Drizzle giúp mình định nghĩa toàn bộ schema cơ sở dữ liệu một cách cực kỳ trực quan và type-safe bằng TypeScript trong file [db/schema.ts](file:///c:/Users/kien.hm/Desktop/learning-english/db/schema.ts):

```typescript
// db/schema.ts
import { sqliteTable, integer, text, real, primaryKey } from "drizzle-orm/sqlite-core";

export const words = sqliteTable("words", {
  word: text("word").notNull(),
  lang: text("lang").notNull().default("en"),
  pronunciation: text("pronunciation"),
  translation: text("translation"),
  srsNextReview: text("srs_next_review"),
  srsEase: real("srs_ease").default(2.5),
  srsRepetitions: integer("srs_repetitions").default(0),
}, (table) => [
  primaryKey({ columns: [table.word, table.lang] }),
]);
```

Có Drizzle ORM chống lưng, việc tương tác với database sướng hơn hẳn. Không còn cảnh gõ nhầm tên cột, không cần lo validate dữ liệu thủ công nữa. Chuẩn bài luôn!

---

## ⚡ Giai đoạn 5: Chuyển nhà sang Hono cho bớt dài dòng

Mặc dù có DB xịn nhưng code Web Server của mình trong `server.ts` vẫn là một đống hổ lốn. Việc dùng `Deno.serve` thuần khiến mình phải tự tay bóc tách URL, viết Regex để khớp các dynamic route kiểu `/api/words/:word` rồi check method `GET/POST/PUT/DELETE` bằng `if-else`. Nhìn ngứa mắt thực sự!

Để giải quyết cái sự dài dòng văn tự này, mình quyết định chuyển sang sử dụng **Hono** - một framework router siêu nhanh và gọn nhẹ. Code router của mình lập tức biến hình thành thế này:

```typescript
import { Hono } from "hono";
const app = new Hono();

// Route nhìn trực quan hơn hẳn!
app.get("/api/words", (c) => handleGetWords(c.req.raw, new URL(c.req.url)));
app.post("/api/words", (c) => handlePostWords(c.req.raw));
app.get("/api/words/:word", (c) => handleSingleWord(c.req.raw, c.req.param("word")));

Deno.serve({ port: PORT }, app.fetch);
```

Mọi thứ trở nên cực kỳ gọn gàng, sáng sủa và dễ mở rộng. Đến đây mình đã tưởng mình đã chạm tới đỉnh cao kiến trúc của app rồi...

---

## 🔄 Giai đoạn 6: Cú "quay xe" bất ngờ: Xóa béng Web Server!

Vào một buổi sáng đẹp trời, sau khi pha cốc cà phê sữa đá, mình ngồi nhìn lại kiến trúc hệ thống:
- Con Agent chạy local ngay trên máy mình.
- File DB SQLite cũng nằm lù lù ngay ở thư mục dự án local.
- Con Web Server Hono cũng chỉ để phục vụ cho mỗi con Agent chạy trên máy mình gọi API vào DB local.

*Ủa? Chẳng hiểu sao mình lại vẽ đường cho hươu chạy, tự dưng dựng một cái Web Server trung gian làm gì cho cồng kềnh thế nhỉ?* 

Mỗi lần học lại phải bật terminal lên chạy `deno run server.ts` để giữ port localhost hoạt động, rồi Agent lại phải serialize dữ liệu thành JSON gửi qua HTTP, server lại parse JSON ra để gọi SQLite... Rõ ràng là quá thừa thãi!

Không chần chừ gì nữa, mình làm quả refactor cực kỳ táo bạo: **Xóa sạch Web Server và Hono! Chuyển hoàn toàn sang mô hình Serverless CLI (gọi trực tiếp script local)**.

Mình viết một file wrapper dùng chung mang tên [scripts/runner.ts](file:///c:/Users/kien.hm/Desktop/learning-english/scripts/runner.ts):

```typescript
// scripts/runner.ts - Gọi trực tiếp file xử lý logic bằng tiến trình con Deno
export async function runHandler(handlerPath: string, commandName: string) {
  const cmd = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", handlerPath, commandName, ...Deno.args],
    stdout: "inherit",
    stderr: "inherit",
    stdin: "null",
  });
  const process = cmd.spawn();
  const status = await process.status;
  Deno.exit(status.code);
}
```

Và các script thao tác dữ liệu chỉ việc gọi thẳng thông qua runner này. Ví dụ như [scripts/health.ts](file:///c:/Users/kien.hm/Desktop/learning-english/scripts/health.ts):

```typescript
import { runHandler } from "@/scripts/runner.ts";
await runHandler("./handlers/session.ts", "health");
```

Bây giờ, khi con Agent cần thao tác dữ liệu (ví dụ cập nhật từ vựng ôn tập SRS hay lưu câu thực hành), nó không cần bắn HTTP request nữa. Nó chỉ việc tự chạy lệnh CLI trực tiếp trên máy mình:

`deno run -A scripts/update-word.ts --word=interested --rating=3`

Vừa bảo mật tuyệt đối, tốc độ xử lý nhanh như chớp vì đọc ghi file SQLite trực tiếp không qua HTTP, lại vừa nhẹ máy vì chả cần duy trì bất kỳ background server nào chạy ngầm nữa.

<video src="/videos/hoc-tieng-anh-voi-agent.mp4" controls style="width: 100%; max-width: 800px; border-radius: 8px; margin: 20px 0; border: 1px solid #ccc;"></video>
*Video demo quá trình tương tác thực tế giữa mình và AI Agent Tutor dưới dạng CLI local.*

---

## 💡 Tổng kết bài học rút ra

Hành trình từ đống file Markdown thô sơ cho đến CLI SQLite local của mình đã trải qua đủ các cung bậc của over-engineering. Đôi khi trong quá trình lập trình, chúng ta cứ bị cuốn theo những tư duy lối mòn (kiểu hễ có Database thì phải có Web Server API) mà quên mất đi giải pháp đơn giản và hiệu quả nhất cho bài toán hiện tại.

Việc loại bỏ server trung gian và chuyển sang CLI chạy trực tiếp không chỉ giúp tiết kiệm tài nguyên máy, tối ưu chi phí token, mà còn mang lại trải nghiệm tương tác real-time mượt mà hơn rất nhiều cho buổi học.

Thôi thì đến đây cũng mỏi tay gõ phím cmnr. Mình lười quá chả viết nữa, đi học tiếng Anh với chú Agent CLI local đây. Chúc anh em tìm được những giải pháp tối giản nhất cho project của mình nhé! 🚀
