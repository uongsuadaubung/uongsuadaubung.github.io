---
title: "Vượt rào Sophos bằng Bun Proxy siêu đơn giản"
date: "2026-05-11"
tags: ["Bun", "Proxy", "Sophos", "Bypass", "Trick"]
description: "Công ty cài Sophos chặn đa số web, nhưng mình phát hiện ra một lỗ hổng và đã tự code một con proxy bằng Bun để lách luật thành công."
published: true
---

Chào anh em, công ty mình vốn có cài đặt phần mềm diệt virus kiêm quản lý mạng **Sophos** lên toàn bộ laptop của nhân viên từ lâu. Hậu quả là đa số các trang web giải trí, báo mạng đều bị block thẳng tay.

![Bị chặn truy cập VnExpress](/images/vuot-mat-sophos-bang-bun-proxy/vnexpress.png)
![Bị chặn truy cập MobileCity](/images/vuot-mat-sophos-bang-bun-proxy/mobilecity.png)

Tuy nhiên, với bản tính tò mò của một dev, mình đã phát hiện ra một điều khá thú vị và quyết định tự code một cái proxy để vượt mặt nó.

### 1. Phát hiện "lỗ hổng" của Sophos

Khi test thử các tool dev (như `curl` hay Postman) gửi request đến các trang bị chặn (trừ các trang bị chặn cứng ở mức hệ thống như Facebook, Tiktok...), mình thấy **hoàn toàn bình thường!** Sophos dường như chỉ bắt các request đi từ trình duyệt web (chắc thông qua extension hoặc filter HTTP traffic của trình duyệt). 

Vậy ý tưởng lóe lên: **Tại sao không biến localhost thành một cái trạm trung chuyển (Proxy)?** Mọi request từ trình duyệt sẽ đi qua `http://localhost`, từ đó proxy server sẽ dùng quyền của một "tool dev" để lấy nội dung web về và trả lại cho trình duyệt. Sophos thấy trình duyệt gọi vào `localhost` nên sẽ nhắm mắt cho qua!

### 2. Triển khai nhanh bằng Bun và Unblocker

Để làm cái này nhanh gọn lẹ, mình dùng **Bun** – runtime Javascript đang rất hot hiện nay, kết hợp với thư viện `unblocker`. Mã nguồn cực kỳ đơn giản:

```typescript
import http from "http";
import Unblocker from "unblocker";

const PORT = 3000;

// Khởi tạo Unblocker với prefix /proxy/
const unblocker = new Unblocker({
    prefix: "/proxy/",
    requestMiddleware: [
        (data: any) => {
            // Giả lập trình duyệt xịn để không bị web chặn ngược
            delete data.headers["accept-encoding"];
            data.headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
        }
    ]
});

const server = http.createServer((req, res) => {
    if (req.url?.startsWith("/proxy/")) {
        // Strip các header bảo mật có thể ngăn iFrame hoặc Script chạy
        const _writeHead = res.writeHead;
        res.writeHead = function(statusCode: number, ...args: any[]) {
            res.removeHeader('content-security-policy');
            res.removeHeader('x-frame-options');
            return _writeHead.apply(this, [statusCode, ...args] as any);
        };

        return unblocker(req, res, (err) => {
            if (err) console.error("Lỗi:", err.message);
        });
    }
    
    // ... các code xử lý tĩnh khác
});

server.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
```

![Khởi chạy server](/images/vuot-mat-sophos-bang-bun-proxy/start.png)

Chỉ với đoạn code nhỏ này, mình có thể truy cập `http://localhost:3000/proxy/https://trang-web-bi-chan.com` một cách vô tư.

![Truy cập VnExpress qua Proxy](/images/vuot-mat-sophos-bang-bun-proxy/vnexpress%20proxy.png)

### 3. Vấn đề khi build file thực thi (Bundle) với Bun

Vì muốn build ra một file `.exe` duy nhất để copy sang máy đồng nghiệp cho tiện, mình dùng lệnh compile của Bun. Tuy nhiên, thư viện `unblocker` lại sử dụng `fs.readFileSync` để đọc một số file config tĩnh (như `types.json` hay `effective_tld_names.dat`). Khi bundle thành 1 file, các file tĩnh này không đi kèm, dẫn đến lỗi crash app.

**Cách khắc phục:** Mình đã viết một file `patch-fs.ts` để ghi đè (override) lại hàm `fs.readFileSync` mặc định của Node.js/Bun.

```typescript
import fs from "fs";
import { embeddedTldDat, embeddedMimeTypes } from "./embedded-dist.ts";

const originalReadFileSync = fs.readFileSync;

(fs as any).readFileSync = function (path: any, options: any) {
    if (typeof path === "string") {
        // Nếu unblocker đòi đọc file TLD, trả về data đã nhúng thẳng vào code
        if (path.includes("effective_tld_names.dat") && embeddedTldDat) {
            return embeddedTldDat;
        }
        if (path.includes("types.json") && embeddedMimeTypes) {
            return embeddedMimeTypes;
        }
    }
    return originalReadFileSync.apply(this, arguments as any);
};
```

Sau đó chỉ cần import `patch-fs.ts` lên ngay đầu file `server.ts` là xong. Toàn bộ proxy giờ đã được đóng gói thành một file thực thi duy nhất, chạy độc lập không cần cài đặt Node.js hay Bun trên máy người dùng.

### 4. Một chút tạt ngang với Rust

Nói thêm một chút, ban đầu mình tính dùng **Rust** để code con proxy này cho ngầu, đồng thời tối ưu hiệu năng và tốn ít RAM nhất có thể. Về cơ bản thì cái proxy Rust vẫn chạy, request vẫn qua mặt được Sophos và trả về file HTML ngon ơ. 

Tuy nhiên, có một vấn đề "khoai" là khi trình duyệt load các file tĩnh như JS hay CSS bị proxy trả về, đôi lúc nó lại không load được hoặc bị lỗi CORS, sai đường dẫn tương đối (relative path), khiến giao diện trang web trông khá nát và hụt đi một nửa tính năng. Việc ngồi bóc tách và rewrite lại toàn bộ đường dẫn của JS/CSS bằng Rust thủ công tốn quá nhiều thời gian và công sức. 

Do đó, mình quyết định "quay xe" sang dùng Bun kết hợp với thư viện `unblocker`. Thư viện này đã xử lý sẵn mọi case khó nhằn về DOM và rewrite URL, vừa nhanh vừa ổn định.

### 5. Kết quả

Thành công mỹ mãn! Sophos hoàn toàn "mù" trước các luồng truy cập qua localhost. Giờ thì mình có thể thoải mái đọc báo mạng trong giờ nghỉ giải lao mà không bị chặn phiền phức nữa (tất nhiên là Facebook và TikTok bị chặn từ tầng router thì proxy này không cứu được rồi).

![Truy cập MobileCity qua Proxy](/images/vuot-mat-sophos-bang-bun-proxy/mobilecity%20proxy.png)

Nếu anh em thấy hứng thú, có thể tham khảo toàn bộ source code của mình trên Github nhé. Anh em cũng có thể clone về nghịch thử.

*Lưu ý: Bài viết chỉ mang tính chất nghiên cứu kỹ thuật mạng và chia sẻ kiến thức lập trình. Hãy tuân thủ nội quy công ty nhé!*
