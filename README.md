# Kien's Portfolio & Blog 🚀

> Mã nguồn trang web cá nhân, hồ sơ năng lực (CV) và Blog chia sẻ kỹ thuật của **uongsuadaubung**.

Được xây dựng với trọng tâm là tốc độ, sự tối giản và tối ưu SEO dựa trên sức mạnh của **Svelte 5** và **SvelteKit**.

![SvelteKit](https://img.shields.io/badge/SvelteKit-ff3e00.svg?style=for-the-badge&logo=svelte&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6.svg?style=for-the-badge&logo=typescript&logoColor=white) 
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Tính năng nổi bật

- **Kiến trúc SPA (Single Page Application) lai cấu trúc thư mục dạng tĩnh:** Load siêu nhanh, mượt mà khi chuyển trang.
- **Hệ thống Blog tự động (Markdown):** Tự động parse và load các bài viết bằng markdown (`.md`) lấy từ thư mục `src/posts/`. Hỗ trợ syntax highlighting đầy đủ cùng với front-matter.
- **Trang CV/Resume điện tử:** Tổ chức theo bố cục chuyên nghiệp, tối ưu và tương thích mọi giao diện Web & Mobile.
- **Dark/Light Mode:** Xử lý bằng Vanilla CSS Variables dễ cấu hình, tự ghi nhớ state giao diện của người dùng.
- **SEO Tối Ưu:** Meta tag độc lập trên từng bài viết. Có sẵn file cấu hình `robots.txt` và bộ sinh `sitemap.xml`.

---

## 📂 Kiến trúc Thư Mục

```text
uongsuadaubung.github.io/
├── src/
│   ├── lib/                  # Mã nguồn gốc
│   │   ├── components/       # Các module giao diện tĩnh (Navbar, Footer, Modal, Mdsvex...)
│   │   ├── stores/           # Các Global States / Settings (Svelte 5 Runes)
│   │   ├── views/            # Các trang tĩnh lớn như ResumeView, BlogView, HomeView
│   │   └── utils/            # Code bổ trợ (parse ngày, xử lý text...)
│   ├── posts/                # 📝 THƯ MỤC VIẾT BLOG: Chứa Markdown file (.md)
│   ├── routes/               # Endpoint Routing của SvelteKit
│   └── app.scss              # Global Styling & Design Tokens
├── static/                   # Tài nguyên File tĩnh: Hình ảnh bài viết, icon, favicons...
├── tmp/                      # Thư mục xử lý code script nháp (đã được untrack git)
└── svelte.config.js          # File cấu trúc lõi hệ sinh thái SvelteKit
```

---

## 🛠️ Hướng dẫn cài đặt & Cấu hình môi trường

Tất tần tật những gì cần làm để chạy thử dự án này trên máy bạn:

**1. Clone repository**
```bash
git clone https://github.com/uongsuadaubung/uongsuadaubung.github.io.git
cd uongsuadaubung.github.io
```

**2. Cài đặt Dependencies**
Dự án sử dụng `npm`, nếu bạn xài `pnpm` hoặc `yarn`, cứ tùy ý thao tác:
```bash
npm install
```

**3. Khởi động Dev Server**
Chạy trên máy local cổng mặc định `5173`:
```bash
npm run dev
# Hoặc tự động mở kèm trình duyệt
npm run dev -- --open
```

**4. Kiểm tra Lỗi (Type Checking)**
Cấu hình Svelte TypeScript Sync để check code trước khi đẩy lên repo:
```bash
npm run check
```

---

## 📦 Build và Xuất bản (Production)

Để dựng bộ mã nguồn ra phiên bản thực tế chạy cho người dùng:

```bash
npm run build
```
Bạn có thể kết hợp cùng `npm run preview` để ngắm nghía kết quả cuối cùng tại cổng Local. Khi đẩy mã nguồn lên Github `main` branch, hệ thống thông qua `Vercel` / `Github Pages` sẽ tự động nắm bắt Build script và xuất bản cấu hình mới nhất ra Website public.

---

## 📝 Hướng dẫn viết Blog mới

Để viết 1 bài Blog, bạn chỉ việc tạo ra 1 file mới theo đường dẫn `src/posts/<url-bai-viet>.md`

Cấu trúc khai báo ngay phần đầu bài viết `(Front-matter)` như sau:
```markdown
---
title: "Tiêu đề bài viết"
date: "2026-10-25"
tags: ["Tag 1", "Tag 2"]
description: "Mô tả ngắn gọn về bài blog của bạn..."
published: true
---

[Nội dung bài viết bắt đầu từ đây...]
```
> Hình ảnh đi kèm bài viết vui lòng bỏ vào thư mục `static/images/` để có thể truy xuất.

---

## 📄 Bản quyền (License)

Mã nguồn được open source phục vụ mục đích cá nhân học tập và tham khảo.
Trừ các bài viết mang tính cá nhân trên Blog, các source code liên quan đền hệ sinh thái Svelte trong repository này đều tuân theo chuẩn License công khai.

---
*© Được thiết kế và xây dựng bởi uongsuadaubung*
