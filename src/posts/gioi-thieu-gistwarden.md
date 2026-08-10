---
title: "Gistwarden - Trình quản lý mật khẩu mã hóa cá nhân"
date: "2026-08-10"
tags: ["Tool & Projects"]
description: "Hành trình xây dựng Gistwarden - Trình quản lý mật khẩu mã hóa client-side Zero-Knowledge kết hợp Passkeys FIDO2, mã 2FA TOTP, hỗ trợ Local Vault ngoại tuyến và lưu trữ trên GitHub Gist."
published: true
---

Trong thời đại số hiện nay, việc quản lý hàng trăm tài khoản với các mật khẩu khác nhau cùng các mã xác thực hai yếu tố (2FA / TOTP) là một bài toán nhức nhối với bất kỳ ai. Mặc dù có nhiều giải pháp cloud thương mại như Bitwarden, 1Password hay LastPass, nhưng việc giao toàn bộ dữ liệu nhạy cảm cho các server bên thứ ba luôn tiềm ẩn những nỗi lo về quyền riêng tư, rò rỉ dữ liệu hoặc chi phí duy trì hàng tháng.

Chính vì lý do đó, mình đã bắt tay vào xây dựng **Gistwarden** — một ứng dụng quản lý mật khẩu và mã 2FA cá nhân dựa trên triết lý **Zero-Knowledge**, mã hóa 100% tại Client và hỗ trợ linh hoạt cả 2 chế độ lưu trữ: **Local Vault (hoàn toàn ngoại tuyến trên máy)** và đồng bộ an toàn qua **GitHub Gist** riêng tư của chính bạn.

![Giao diện danh sách Két sắt Gistwarden](/images/gioi-thieu-gistwarden/vault-list.png)

---

## 🛡️ 1. Lý do ra đời: Tự chủ dữ liệu 100%

Một ứng dụng quản lý mật khẩu lý tưởng đối với mình phải thỏa mãn các tiêu chí:
- **An toàn tuyệt đối (Zero-Knowledge)**: Server hay bất kỳ ai (kể cả GitHub hay nhà phát triển) cũng không thể đọc được dữ liệu nếu không có Mật khẩu Master.
- **Không tốn phí server duy trì & Linh hoạt chế độ lưu trữ**:
  - **Local Vault (Ngoại tuyến Offline)**: Lưu trữ két sắt mã hóa hoàn toàn cục bộ trên máy tính/trình duyệt (`chrome.storage` / LocalStorage), không bắt buộc phải có tài khoản GitHub hay kết nối mạng Internet.
  - **GitHub Gist Sync (Đồng bộ)**: Tận dụng hạ tầng đám mây của GitHub làm "database tĩnh" miễn phí thông qua **Private GitHub Gist** và GitHub Personal Access Token (PAT scope `gist`).
- **Hoạt động độc lập & Đa nền tảng**: Cung cấp cả 2 phiên bản **Browser Extension (Manifest V3)** và **Web Vault độc lập (SPA)**.

---

## 🔒 2. Kiến trúc bảo mật Zero-Knowledge & Argon2id KDF

Kiến trúc bảo mật của **Gistwarden** được thiết kế theo nguyên tắc: **Mọi thao tác mã hóa và giải mã chỉ diễn ra trên thiết bị của người dùng (Client-Side Encryption)**.

```
[ Master Password ] + [ Salt ] ──► (Argon2id WASM 64MB) ──► [ Encryption Key ]
                                                                   │
[ Plaintext Vault (Mật khẩu/2FA) ] ──► (AES-GCM-256) ──────────────┼──► [ Ciphertext JSON ]
                                                                             │
                                                                             ▼
                                                     [ Local Storage / GitHub Private Gist ]
```

### Các lớp bảo mật cốt lõi:
1. **Khóa chống tấn công phần cứng Argon2id (WebAssembly)**: Gistwarden áp dụng thuật toán **Argon2id** (WebAssembly) với thông số **64 MB RAM**, **3 vòng lặp (iterations)** cho mỗi lần sinh khóa. Việc yêu cầu 64MB RAM khiến các thiết bị đào coin/GPU bị nghẽn cổ chai RAM và tăng chi phí tấn công brute-force lên hàng triệu lần. Nhân WASM của `hash-wasm` được mã hóa Base64 nhúng trực tiếp vào bundle JS, tuân thủ nghiêm ngặt tiêu chuẩn Content Security Policy (CSP) của Chrome Extension Manifest V3 và không tải bất kỳ script nào từ internet.
2. **Mã hóa đối xứng AES-GCM 256-bit**: Dữ liệu két sắt được bảo vệ bằng chuẩn mã hóa đối xứng xác thực **AES-GCM 256-bit** với IV (Vector khởi tạo) 12-byte ngẫu nhiên cho mỗi lần lưu (`crypto.getRandomValues`). Bất kỳ sự can thiệp trái phép nào trên dữ liệu két sẽ khiến quá trình giải mã thất bại ngay lập tức.
3. **Mở khóa nhanh bằng mã PIN (Quick PIN Unlock)**: Cho phép thiết lập mã PIN ngắn để mở khóa nhanh phiên làm việc cục bộ mà không cần nhập lại Mật khẩu Master dài mỗi lần mở extension.

---

## ✨ 3. Các tính năng nổi bật của Gistwarden

### 🗝️ Két sắt Đa danh mục & Thư mục (Folders)
- Lưu trữ an toàn các loại dữ liệu: **Tài khoản đăng nhập (Logins)**, **Ghi chú bảo mật (Secure Notes)**, **Thẻ ngân hàng (Credit Cards)**, **Định danh cá nhân (Identities)**, **SSH Keys** kèm các trường tùy biến (Custom Key-Value fields).
- Phân loại bằng Thư mục (Folders) và tìm kiếm tức thì.

### 🎲 Trình tạo Mật khẩu & Cụm từ ghép Diceware (EFF Wordlist)
- Tự động tạo mật khẩu ngẫu nhiên với độ dài tùy chỉnh, lựa chọn loại ký tự và loại bỏ các ký tự dễ nhầm lẫn.
- **Diceware Passphrase**: Sinh cụm từ ghép ngẫu nhiên dễ nhớ dựa trên danh sách từ vựng chuẩn **EFF Large Wordlist**.
- **Lịch sử khởi tạo**: Lưu giữ lịch sử các mật khẩu vừa tạo giúp dễ dàng truy vết và khôi phục khi cần.

![Giao diện Trình tạo mật khẩu Gistwarden](/images/gioi-thieu-gistwarden/password-generator.png)

### 🛡️ Báo cáo Kiểm tra Bảo mật Vault (Vault Security Audit)
- **Kiểm tra rò rỉ dữ liệu (HIBP)**: Phân tích email & username với cơ sở dữ liệu Have I Been Pwned qua mô hình *k-Anonymity* bảo mật tuyệt đối.
- **Đánh giá độ mạnh & Trùng lặp**: Sử dụng thuật toán `zxcvbn` chấm điểm mật khẩu kết hợp bộ từ điển **Tiếng Việt (`Viet74K`)** và **Tiếng Anh (`EFF`)** để phát hiện các mật khẩu bị dùng trùng hoặc chứa từ ngữ thông dụng dễ bị đoán.
- **Cảnh báo lỗ hổng**: Tự động phát hiện các tài khoản chưa bật 2FA/TOTP và các trang web chưa dùng HTTPS.

![Giao diện Báo cáo bảo mật Vault Audit](/images/gioi-thieu-gistwarden/security-audit.png)

### 🔄 Nhập / Xuất dữ liệu & Giải mã Google Authenticator
- **Quản lý dữ liệu toàn diện**: Nhập/xuất dữ liệu tệp JSON/CSV từ Bitwarden, Chrome, Firefox, Edge và các ứng dụng quản lý mật khẩu khác.
- **Google Authenticator Migration Tool**: Bóc tách nhị phân Protobuf trực tiếp từ ảnh QR hoặc chuỗi `otpauth-migration://` xuất từ Google Authenticator để tự động đưa toàn bộ mã 2FA vào Két sắt.
- **Quản lý Thư mục & Thùng rác**: Quản lý thư mục linh hoạt, xem và khôi phục các mục đã xóa từ Thùng rác.

![Giao diện Quản lý dữ liệu và Chuyển đổi 2FA](/images/gioi-thieu-gistwarden/data-management.png)

### ⏱️ Mã xác thực 2FA (TOTP) & Quét mã QR
- Tự động tính toán mã xác thực 2 lớp (TOTP 6 chữ số) cập nhật tự động sau mỗi 30 giây.
- **Quét mã QR tự động**: Đọc mã QR 2FA trực tiếp trên trang web hoặc nạp file ảnh QR để tự bóc tách Secret Key.

### ⚡ Hỗ trợ Passkeys (FIDO2 / WebAuthn)
- Khởi tạo, giả lập và lưu trữ các khóa đăng nhập không mật khẩu (**Passkeys**) hiện đại ngay trong extension.
- **Bảo vệ chống rò rỉ chéo tên miền**: Tích hợp kiểm tra tên miền (Domain match protection) bảo vệ tài khoản không bị rò rỉ thông tin khóa trước các đòn tấn công Phishing.

### ✨ Tự động điền (Autofill) & Gợi ý lưu thông minh
- Nhận diện ô nhập tài khoản/mật khẩu trên website và hiển thị menu điền nhanh 1-click.
- Tự động phát hiện khi đăng nhập/đăng ký tài khoản mới và hiển thị gợi ý lưu hoặc cập nhật mật khẩu.

---

## 💻 4. Tech Stack & Trải nghiệm phát triển

- **Frontend Framework**: [SolidJS](https://www.solid-js.com/) — Mang lại hiệu năng tiệm cận JS thuần, reactivity mạnh mẽ, không ảo hóa DOM (No Virtual DOM), giúp Extension và Web Vault khởi động tức thì.
- **Runtime & Package Manager**: **Bun** — Tốc độ cài đặt package và thực thi script cực nhanh.
- **Bundler**: **Esbuild** — Đóng gói Extension (Manifest V3) và Web Vault chỉ trong vài mili-giây.
- **Giao diện & Song ngữ**: Thiết kế tinh tế với chế độ Sáng/Tối (Light/Dark Mode) và hỗ trợ song ngữ **Tiếng Việt 🇻🇳** và **Tiếng Anh 🇬🇧**.

---

## 📥 Tải xuống Browser Extension

Bạn có thể cài đặt trực tiếp **Gistwarden Browser Extension** cho trình duyệt của mình từ 2 cửa hàng tiện ích chính thức:

- 🦊 **Firefox Add-ons Store**: [Tải Gistwarden cho Firefox](https://addons.mozilla.org/en-US/firefox/addon/gistwarden/)
- 🌊 **Microsoft Edge Add-ons Store**: [Tải Gistwarden cho Microsoft Edge / Chrome](https://microsoftedge.microsoft.com/addons/detail/gistwarden/gcbibgbakekbbeeibgaeciiikbdlfndl)

---

## 🚀 Lời kết

**Gistwarden** là một dự án cá nhân mang lại cho mình rất nhiều niềm vui khi áp dụng các kỹ thuật mã hóa hiện đại và làm chủ toàn bộ dữ liệu riêng tư của bản thân. Bạn có thể trải nghiệm thử Web Vault trực tiếp tại menu **Gistwarden** trên trang web này!

Cảm ơn bạn đã đọc bài viết! 💡
