---
title: "Khi Sophos chặn luôn cả localhost và cách mình vượt rào để chơi game"
date: "2026-06-22"
tags: ["Sophos", "Bypass", "Localhost", "Base64", "Cocos Creator", "Docker"]
description: "Game chạy Docker ở localhost ngon lành mà vẫn bị Sophos Endpoint chặn file bin, mình quyết định đổi biểu diễn dữ liệu sang Base64 để vượt mặt DPI."
published: true
---

Chào anh em, dạo gần đây mình có mày mò chơi thử con game huyền thoại **PvZGE**
(Plants vs Zombies 2 PC port chạy trên nền web - Cocos Creator v3.8.4).

Do trang chủ chính thức `play.pvzge.com` đã bị hệ thống bảo mật doanh nghiệp
**Sophos Endpoint Agent** chặn thẳng tay với lý do "Games" (chính sách công ty
nên đành chịu thôi), mình quyết định chuyển sang giải pháp chạy game local. Mình
kéo **Docker Image** đóng gói sẵn của game về chạy dưới container `pvzge`, port
mapping `8080:80` trên `localhost`.

Tưởng thế là xong, ai ngờ lại gặp một vấn đề: dù chạy trên localhost, Sophos Web Control vẫn thò tay vào chặn tệp tin đồ họa .bin của game, làm game bị treo ở màn hình loading!

---

## 1. Khi game local chạy nhưng vẫn bị Sophos chặn 🛡️

### Triệu chứng "treo máy"

Khi truy cập game tại `http://localhost:8080/`, game đứng im ở màn hình tải. Bật
`F12` lên soi network thì thấy yêu cầu tải tệp tin cấu hình đồ họa tại:
`http://localhost:8080/src/effect.bin` bị chặn hoàn toàn và trả về mã lỗi **HTTP
403 Forbidden**.

Phần Response Body trả về không phải là dữ liệu nhị phân của game mà là một
trang HTML cảnh báo đỏ lòm từ Sophos:

- **Tiêu đề**: _Access denied: Restricted file type_
- **Loại tệp bị chặn**: _File type: Other Executables_
- **MIME type ghi nhận**: _application/x-executable-file_
- **Chính sách áp dụng**: _Sophos Web Protection_

```text
Browser (Chrome/Edge)        Sophos Web Control           Nginx (Docker)
       |                           |                           |
       |---(1) GET /effect.bin---->|                           |
       |                           |---(2) Forward request---->|
       |                           |                           |
       |                           |<--(3) Resp: effect.bin ---|
       |                           |       (Binary Data)       |
       |                           |                           |
       |                           | [DPI Scan: Phát hiện      |
       |                           |  file nhị phân / executable]
       |                           |                           |
       |<--(4) Resp: Block Page ---|                           |
       |       (HTTP 403 HTML)     |                           |
```

### Tại sao Sophos lại khó chịu thế?

Sophos Web Control hoạt động bằng cách hook trực tiếp vào các tiến trình trình
duyệt phổ biến (`chrome.exe`, `firefox.exe`, `msedge.exe`) hoặc lọc gói tin
thông qua WFP (Windows Filtering Platform).

Khi trình duyệt yêu cầu hoặc nhận về một tệp tin qua giao thức HTTP không mã
hóa:

1. Sophos quét phần mở rộng của URL (ở đây là đuôi `.bin`).
2. Sophos thực hiện **DPI (Deep Packet Inspection)** quét các byte đầu tiên
   (magic bytes) để nhận diện cấu trúc file nhị phân thực thi.
3. Vì chính sách an ninh chặn tải các tệp thực thi trái phép (tránh malware),
   Sophos chặn luôn luồng phản hồi và nhét trang HTML cảnh báo (403) vào.

---

## 2. Quá trình thử và sai

Để tìm cách vượt qua rào cản này mà không cần quyền Admin (vì laptop công ty cấp
thì lấy đâu ra quyền Admin), mình đã thử đủ trò từ dễ đến khó. Dưới đây là 4
phương án mình đã test và cái kết:

| STT   | Phương án                       | Cách làm                                                                                         | Kết quả                      | Vì sao tạch/thành công?                                                                                                           |
| :---- | :------------------------------ | :----------------------------------------------------------------------------------------------- | :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **1** | **Dùng công cụ non-browser**    | Dùng `Postman` hoặc `curl` không giả lập User-Agent của trình duyệt để tải tệp.                  | **Thành công** (HTTP 200 OK) | Sophos Web Control bỏ qua các tiến trình dev như `curl.exe` hay `Postman.exe` để anh em dev còn làm việc.                         |
| **2** | **Đổi Content-Type trên Nginx** | Cấu hình Nginx trả về tệp `.bin` dưới dạng MIME `text/plain` thay vì `application/octet-stream`. | **Thất bại** (HTTP 403)      | Sophos dùng DPI quét magic bytes ở đầu file. Thấy là file nhị phân (non-ASCII) là nó trảm luôn không cần biết Content-Type là gì. |
| **3** | **Chuyển hướng (302 Redirect)** | Đổi tên file thành `.bin.txt`, cấu hình Nginx redirect (302) từ `.bin` sang `.bin.txt`.          | **Thất bại** (HTTP 403)      | Dù chuyển sang `.txt` (vốn được phép tải), Sophos vẫn quét ruột file. Thấy nhị phân là lại cấm.                                   |
| **4** | **Nén dữ liệu mạng (Gzip)**     | Ép Nginx nén gzip tệp tin `.bin` trước khi gửi đi với header `Content-Encoding: gzip`.           | **Thất bại** (HTTP 403)      | Sophos thừa sức giải nén gzip on-the-fly để quét trước khi đưa tới trình duyệt.                                                   |

---

## 3. Giải pháp thành công: Mã hóa Base64 & vá Engine Cocos 🛠️

Vì mấy cái trò đổi header hay nén gzip đều bị Sophos đi guốc trong bụng nhờ quả
DPI xịn xò, mình đành phải chơi chiêu cuối: **chuyển toàn bộ dữ liệu nhị phân
(Binary) của file `.bin` thành văn bản thuần túy (Plain Text) bằng Base64**. Để
xem Sophos còn chặn kiểu gì!

### Chiêu thức hoạt động

1. **Phía Server (Nginx)**: Tệp `effect.bin` (nhị phân) được mã hóa Base64 thành
   tệp `effect.txt` (văn bản ASCII chỉ chứa các ký tự `A-Z`, `a-z`, `0-9`, `+`,
   `/`, `=`). Đối với Sophos, đây hoàn toàn là một tệp văn bản hợp lệ và vô hại,
   cho phép đi qua tự do.
2. **Phía Client (Trình duyệt)**: Sửa đổi logic nạp dữ liệu đồ họa của Cocos
   Engine. Khi engine cố gắng tải `src/effect.bin` qua `XMLHttpRequest`, ta can
   thiệp để chuyển hướng yêu cầu sang tệp văn bản `src/effect.txt`. Sau khi tải
   về chuỗi Base64, mã JavaScript client-side sẽ giải mã chuỗi này ngược lại
   thành một mảng byte (`Uint8Array`) và đưa lại vào vùng nhớ đệm
   (`ArrayBuffer`) ban đầu để Cocos tiếp tục xử lý.

```text
Browser (Game Code)          Sophos Web Control           Nginx (Docker)
       |                           |                           |
       |---(1) GET /effect.txt---->|                           |
       |                           | [Quét: URL (.txt) &       |
       |                           |  Nội dung (Base64 ASCII)  |
       |                           |  => Bỏ qua (Hợp lệ)]      |
       |                           |                           |
       |                           |---(2) Forward request---->|
       |                           |                           |
       |                           |<--(3) Resp: effect.txt ---|
       |                           |       (Base64 String)     |
       |                           |                           |
       |<--(4) Resp: effect.txt ---|                           |
       |       (HTTP 200 OK)       |                           |
       |                           |                           |
       | [window.atob() decode     |                           |
       |  Base64 -> ArrayBuffer]   |                           |
       |                           |                           |
       | [Cocos Engine khởi chạy]  |                           |
```

### Bắt tay vào thực hiện thôi!

#### Bước 1: Phù phép file nhị phân thành chuỗi Base64

Đọc file nhị phân từ game, đổi sang chuỗi Base64 và ghi đè ra file `.txt`:

```powershell
# Tải file từ container ra host
docker cp pvzge:/usr/share/nginx/html/src/effect.bin ./effect.bin

# Mã hóa Base64 sang file text thuần túy
[IO.File]::WriteAllText("$(Get-Location)/effect.txt", [Convert]::ToBase64String([IO.File]::ReadAllBytes("./effect.bin")))

# Đẩy file text lên lại container
docker cp ./effect.txt pvzge:/usr/share/nginx/html/src/effect.txt
```

#### Bước 2: "Vá" engine Cocos Creator

Trong mã nguồn Cocos Creator v3.8.4, cấu hình đường dẫn `effectSettingsPath`
được đọc từ `settings.json` và truyền vào hàm khởi tạo:

```javascript
TB.init(Pe.querySettings(De.Category.RENDERING, "effectSettingsPath"));
```

Hàm `TB.init` gốc sử dụng `XMLHttpRequest` để tải file dưới dạng nhị phân
(`responseType = "arraybuffer"`):

```javascript
t.prototype.init = function (t) {
  var e = this;
  return void 0 === t && (t = ""),
    S.rendering && S.rendering.enableEffectImport && t
      ? new Promise(function (i, n) {
        var r = new XMLHttpRequest();
        r.open("GET", t),
          r.responseType = "arraybuffer",
          r.onload = function () {
            e._data = r.response, i();
          },
          r.onerror = function () {
            n(new Error("request effect settings failed!"));
          },
          r.send(null);
      })
      : Promise.resolve();
};
```

Và đây là cách mình đè lại hàm `init` để bắt nó tải file `.txt` chứa chuỗi
Base64 rồi tự decode ngược lại:

```javascript
t.prototype.init = function (t) {
  var e = this;
  return void 0 === t && (t = ""),
    S.rendering && S.rendering.enableEffectImport && t
      ? new Promise(function (i, n) {
        var r = new XMLHttpRequest();
        // 1. Chuyển hướng yêu cầu từ .bin sang .txt
        var targetUrl = t.replace("effect.bin", "effect.txt");
        r.open("GET", targetUrl),
          r.onload = function () {
            try {
              // 2. Đọc chuỗi Base64 và giải mã sang chuỗi nhị phân bằng atob()
              var binary_string = window.atob(r.responseText.trim()),
                len = binary_string.length,
                bytes = new Uint8Array(len);
              // 3. Chuyển đổi chuỗi nhị phân thành ArrayBuffer
              for (var idx = 0; idx < len; idx++) {
                bytes[idx] = binary_string.charCodeAt(idx);
              }
              e._data = bytes.buffer;
              i();
            } catch (err) {
              n(err);
            }
          },
          r.onerror = function () {
            n(new Error("request effect settings failed!"));
          },
          r.send(null);
      })
      : Promise.resolve();
};
```

---

## 4. Kết luận & Bài học rút ra 💡

### Đánh giá "quả" giải pháp này

- **Ưu điểm**:
  - Vượt qua 100% cơ chế kiểm duyệt DPI của Sophos mà không cần xin quyền Admin
    hay cấu hình Exclusions mệt mỏi.
  - Tải game mượt mà trên mọi trình duyệt mà không làm ảnh hưởng trải nghiệm
    chơi.
  - File `effect.bin` cực kỳ nhỏ (~4KB) nên khi chuyển sang Base64 tăng lên
    ~5.3KB, giải mã ở client mất chưa đến 1ms, không lo giật lag.
- **Nhược điểm**:
  - Mỗi lần game cập nhật phiên bản mới, nếu dev build lại dự án Cocos, ta phải
    vá lại đống JS của engine (vì tên file build hay bị hash ngẫu nhiên). Cơ mà
    việc này viết script PowerShell tự động hóa là xong ngay.

### Bài học xương máu

Khi gặp mấy quả tường lửa hoặc antivirus công ty chặn mạng:

- Đừng cố tìm cách bypass ở tầng hạ tầng hay network bypass nếu không có quyền
  admin.
- **Thay đổi biểu diễn dữ liệu (Data Representation Transformation)** như mã hóa
  Base64, XOR nhẹ hoặc custom serialization luôn là cứu cánh tuyệt vời để lách
  qua các khe cửa hẹp của hệ thống giám sát.

Thôi bài viết đến đây cũng mỏi tay gõ phím cmnr. Chúc anh em lách luật và chơi
game vui vẻ nhé! 😉
