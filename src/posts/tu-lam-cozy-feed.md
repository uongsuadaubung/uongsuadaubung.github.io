---
title: "Cozy Feed: Bộ cào và đọc tin tức tập trung"
date: "2026-07-01"
tags: ["Lập Trình", "Dự Án Cá Nhân", "Deno", "Crawler"]
description: "Trong lúc rảnh rỗi ở công ty, mình ngẫu hứng muốn làm một cái gì đó mới mới nên đã nghĩ đến việc viết một con crawler để tự động gom tin tức từ các trang ưa thích về một mối."
published: true
---

# Cozy Feed: Bộ cào và đọc tin tức tập trung ☕

Chuyện là dạo này trên công ty việc của mình cũng hòm hòm, task tủng được dẹp gọn gàng sạch sẽ nên đâm ra có kha khá thời gian rảnh rỗi ngồi chơi xơi nước. Vì muốn tìm cái gì đó mới mới để làm trong lúc rảnh cho đỡ chán, mình chợt nghĩ ngay đến việc viết một con crawler cào dữ liệu.

Ý tưởng này xuất phát từ việc mình rất thích đọc tin tức ở một vài trang quen thuộc, cả trong nước lẫn ngoài nước (như *Hacker News, OMG! Ubuntu, GenK, Tinh tế*...). Nhưng ngặt nỗi mỗi lần đọc cứ phải gõ URL mở chục cái tab rồi chuyển qua chuyển lại liên tục thì hơi lười.

Thế là mình bắt tay vào viết một cái "RSS Reader" tự chế mang tên **Cozy Feed** — sử dụng Deno, Cheerio và Preact để tự động cào tin về và hiển thị tập trung tại một nơi duy nhất cho ấm cúng và sạch sẽ.

---

## 🛠️ Cozy Feed hoạt động thế nào?

Ý tưởng xây dựng con app này cực kì tinh gọn, chia làm 2 phần chính chạy hoàn toàn độc lập:

1. **Bộ Cào Dữ Liệu (Backend/Sync)**: Viết bằng **Deno** kết hợp với thư viện parse HTML **Cheerio**. Chức năng là cào dữ liệu từ các trang tin mục tiêu, lấy tiêu đề, ảnh thumbnail, mô tả ngắn rồi gom tất cả lưu vào một file dữ liệu tĩnh `data.json`.
2. **Bộ Hiển Thị (Frontend UI)**: Sử dụng **Preact** (cho nó siêu nhẹ) kết hợp với CSS tối giản. Giao diện này chỉ việc fetch file `data.json` tĩnh kia về rồi render lên màn hình. Đọc tin không quảng cáo, chuyển trang mượt mà!

```
[Các trang tin: GenK, Tinh tế, HN...] 
       │
       ▼ (Deno + Cheerio Scraper)
┌──────────────┐
│   sync.ts    │ ──► Ghi đè file dữ liệu tĩnh
└──────────────┘
       │
       ▼
┌──────────────┐
│  data.json   │ ◄── Fetch data cực nhanh
└──────────────┘
       │
       ▼
┌──────────────┐
│  Preact UI   │ ──► Đọc tin sạch sẽ, ấm cúng
└──────────────┘
```

---

## 📡 Cào dữ liệu bằng Deno & Cheerio

Để lấy dữ liệu tin tức, mình viết các script cào (scraper) cho từng trang. Chỉ cần F12 soi cấu trúc HTML của từng site là có thể bóc tách được các thông tin cần thiết.

Dưới đây là một đoạn code scraper ví dụ cho trang **Hacker News** mà mình viết bằng Deno:

```typescript
import * as cheerio from "cheerio";
import { Post } from "../types.ts";

export const hackerNewsScraper = {
  source: "HackerNews",
  async fetchPosts(): Promise<Post[]> {
    const res = await fetch("https://news.ycombinator.com/");
    const html = await res.text();
    const $ = cheerio.load(html);
    const posts: Post[] = [];

    // Lùng sục các thẻ class athing để lôi cổ thông tin ra
    $(".athing").each((_, element) => {
      const id = $(element).attr("id") || "";
      const titleLink = $(element).find(".titleline > a").first();
      const title = titleLink.text();
      const url = titleLink.attr("href") || "";

      posts.push({
        id: `hn-${id}`,
        title,
        url,
        source: "HackerNews",
        // Hacker News không có mô tả hay ảnh, ta để mặc định
        description: "Bàn luận công nghệ trên Hacker News...",
        thumbnail: "https://news.ycombinator.com/y18.svg",
        createdAt: new Date().toISOString()
      });
    });

    return posts;
  }
};
```

Cứ thế, mỗi nguồn tin sẽ có một file scraper riêng. Mình chỉ cần viết một vòng lặp trong file `sync.ts` để điều phối tất cả các bộ cào này chạy đồng thời, sau đó gộp kết quả lại:

```typescript
// Chạy song song tất cả scrapers để lấy tin tức mới nhất
const results = await Promise.allSettled(
  scrapers.map(async (scraper) => {
    const posts = await scraper.fetchPosts();
    return posts;
  })
);
```

Để tránh việc lưu trùng những bài viết cũ, bộ sync sẽ đọc file `data.json` hiện tại, so sánh ID của các bài viết mới xem có bị trùng không. Nếu chưa có thì mới thêm vào mảng và lưu lại.

---

## 🎨 UI Cozy: Nơi tập trung đọc tin ấm cúng

Sau khi đã có đống dữ liệu `data.json` ngon lành cành đào, phần UI được dựng cực kỳ tối giản với Preact. Mình thiết kế giao diện dạng cột, bên trái là menu các nguồn tin (Tinh tế, GenK, Hacker News...) và bên phải là danh sách bài viết hiển thị sạch sẽ dưới dạng thẻ (Card) có ảnh thumbnail rõ ràng.

Đặc biệt là không hề có bất kì một banner quảng cáo hay pop-up "nhận thông báo" phiền phức nào. Tốc độ tải trang thì nhanh như chớp vì dữ liệu đã được cào sẵn và phục vụ như một file JSON tĩnh.

---

## ☕ Kết luận

Thế là chỉ sau vài tiếng táy máy nghịch ngợm trong lúc rảnh rỗi ở công ty, mình đã có ngay một công cụ Cozy Feed hoạt động cực kì mượt mà. Từ nay, cứ mỗi sáng mở máy lên là chỉ việc vào một trang duy nhất là nắm bắt được hết biến động công nghệ trong ngày, chả cần phải lạch cạch gõ từng URL hay chuyển qua chuyển lại giữa chục cái tab nữa. Tiết kiệm được bao nhiêu thời gian và công sức!

Đến đây thì cũng mỏi tay gõ phím cmnr. Anh em nào ngại chuyển tab giống mình thì có thể bấm ngay vào menu **Cozy** mới toanh ở trên thanh điều hướng để trải nghiệm thử Cozy Feed nhé! 🚀
