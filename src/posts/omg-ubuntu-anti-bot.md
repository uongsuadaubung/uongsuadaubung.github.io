---
title: "Viết crawler tin công nghệ và phát hiện thú vị về cơ chế chống bot của OMG! Ubuntu"
date: 2026-06-29
tags: ["crawl", "anti-bot", "security", "side-project"]
description: "Vì lười lướt qua lại giữa chục trang tin tức công nghệ mỗi sáng, mình quyết định tự build một crawler gom mọi thứ về một nơi và vô tình đụng độ một cơ chế chống bot khá dị của OMG! Ubuntu."
published: true
---

# Viết crawler tin công nghệ và phát hiện thú vị về cơ chế chống bot của OMG! Ubuntu

Mỗi sáng thức dậy, thói quen khó bỏ của mình là nhâm nhi tách cà phê và lướt qua hàng tá trang tin công nghệ để xem thế giới hôm nay có drama hay ho gì mới không. Từ mấy trang tin tức quốc tế, diễn đàn cho đến mấy blog chuyên biệt về Linux, mã nguồn mở... trang nào mình cũng muốn ngó qua một chút để cập nhật xu hướng.

Thế nhưng, cái sự sung sướng khi đọc tin nhanh chóng bị lung lay bởi... sự lười biếng. Nghĩ cảnh mỗi sáng phải mở hàng chục tab trình duyệt, click qua click lại tìm bài mới thực sự là một cực hình đối với một thằng lười như mình. Để giải quyết cái sự khó chịu này, mình quyết định mang cái "IQ 40" của bản thân ra để build một cái crawler gom hết bài viết từ các nguồn yêu thích về một nơi đọc cho tiện. Kế hoạch nghe ngon lành cành đào phết đúng không anh em?

Vừa bắt tay vào làm, trang đầu tiên mình chọn để thử nghiệm luôn là **OMG! Ubuntu!** (một blog cực kỳ nổi tiếng về Ubuntu). Để cho nhanh gọn lẹ, mình vác **Deno** ra code nhanh file `script.ts` để kéo thử HTML của trang về xem thế nào. Đoạn code cũng chả có gì phức tạp, chỉ đơn giản là tạo một request `fetch` kèm cái header `User-Agent` giả lập Chrome xịn xò:

```typescript
// Gửi một request fetch thông thường đến OMG! Ubuntu! kèm User-Agent giả lập trình duyệt
console.log("Sending a standard fetch request to OMG! Ubuntu!...");
const response = await fetch("https://www.omgubuntu.co.uk", {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
});

console.log(`Status Code: ${response.status}`);
const html = await response.text();
```

Cơ mà đời không như là mơ. Ngay request đầu tiên gửi đi, script của mình đã ăn cmn hành khi bị chặn đứng hoàn toàn với lỗi `403 Forbidden`. 

Không phục kết quả này, mình thử mở **Postman** lên (công cụ debug API quốc dân) rồi gõ thẳng URL của trang vào để gửi một GET request xem sao. Bùm! Nó lại chạy ngon lành cành đào anh em ạ, trả về HTML đầy đủ với status `200` cực kỳ mượt mà.

Ơ kìa? Khó hiểu thật sự! Chả nhẽ hệ thống chống bot này chỉ chặn code của mình mà lại tha cho Postman?

Ngồi ngẫm nghĩ một lúc, mình nghi ngờ thủ phạm đứng sau chính là cái **User-Agent**. Trong Deno script ban đầu, mình đang giả lập một User-Agent Chrome xịn xò của trình duyệt. Còn Postman khi gửi đi thì mặc định sẽ đính kèm User-Agent của riêng nó là `PostmanRuntime/7.54.0`.

Thế là mình liền nảy số, copy nguyên xi cái User-Agent của Postman quăng vào script:

```typescript
const response = await fetch("https://www.omgubuntu.co.uk", {
  headers: {
    "User-Agent": "PostmanRuntime/7.54.0"
  }
});
```

Chạy lại script một phát... Ôi vãi! Khớp cmn lệnh luôn! Nó trả về status `200` ngon lành. 

Cái cơ chế chống bot gì lạ lùng vậy trời? Chặn trình duyệt thật nhưng lại thả cho Postman đi qua thoải mái? 

Nhưng mà, nếu chỉ dừng lại ở việc dùng cái User-Agent của Postman để "lách luật" thì câu chuyện chả có gì vui và đáng tiền bát gạo cả. Mình tò mò muốn biết cái hệ thống chống bot thực sự đằng sau nó hoạt động ra làm sao. Thế là mình lại táy máy sửa User-Agent về lại phiên bản Chrome cũ, gửi lại request và lần này quyết tâm lôi cổ cái đống HTML trả về của status `403 Forbidden` ra để soi kỹ xem có manh mối gì không.

### 🕵️‍♂️ Những manh mối đầu tiên

Lục lọi đống dữ liệu nhận về, mình lòi ra một vài điểm vô cùng thú vị:

*   **Không phải trang lỗi thông thường:** Trang HTML nhận về với status 403 hoàn toàn không phải là trang báo lỗi máy chủ thông thường. Tiêu đề (title) của nó ghi lù lù là: `"Checking your browser"` (Đang kiểm tra trình duyệt của bạn).
*   **Javascript rối rắm:** Ngó vào bên trong thẻ `<body>`, mình thấy có một thẻ `<script>` chứa một lượng lớn code JavaScript đã bị làm rối (obfuscated) đến mức chả hiểu quần què gì.
*   **Cookie lạ lùng:** Đồng thời, soi kỹ trong Response Header, mình thấy hệ thống có set một cookie tên là `_hcc` với giá trị trông rất dị hợm, được phân tách bằng dấu hai chấm (dạng `xxxx:yyyy`). Ví dụ thực tế mình tóm được:

```http
_hcc=ZDU0ZjM3ZjM2ZTVjODNhZmRiN2Q5MzllMmM0OGYyM2JjNWM3ODc4ZDQwNzk1ZWUyMmE3MTU2YjVmNmM5ZTI3MA==:MjIyLjI1Mi4yNy4yMjh8MTc4MjcxODE2N3xcZ0lHa2pwXWhLSllYRmNOd0Jwd3VReEJCdGJkVmR7SHwx; Max-Age=30; Path=/
```

**Suy đoán ban đầu:** Hệ thống CDN của trang này không chỉ đơn thuần là chặn bot dựa trên IP hay User-Agent. Nó đang gửi một thử thách (challenge) bắt trình duyệt của chúng ta phải thực thi đoạn mã JavaScript kia để giải quyết một bài toán Proof-of-Work (bằng chứng công việc) nào đó. Sau khi giải xong, gửi kết quả ngược lại thì mới được "mở cửa" cho qua.

Đến đây thì cuộc chơi bắt đầu cuốn rồi đấy!

### 🧠 Phân tích và "Dịch ngược" thuật toán giải đố

Nhìn đống code JS bị làm rối đến hoa cả mắt, thay vì ngồi tự mò mẫm thủ công cho tổn thọ, mình quyết định... nhờ vả AI phân tích hộ (tội gì không dùng công nghệ đúng không anh em? 😂). 

Kết hợp giữa gợi ý của AI và việc tự lùng sục, đọc kỹ file JavaScript đó để lọc ra các từ khóa quan trọng (như `cookie`, `hash`, `crypto`, `POST`, `/__challenge`), mình cuối cùng cũng xâu chuỗi được toàn bộ logic giải đố của hệ thống. Hóa ra thuật toán của nó hoạt động như thế này:

1. **Bóc tách Cookie:** Đầu tiên, nó lấy giá trị của cookie `_hcc` nhận được từ response header, sau đó cắt chuỗi để lấy phần Base64 nằm phía sau dấu hai chấm.
2. **Giải mã dữ liệu:** Tiếp theo, nó decode chuỗi Base64 này để lấy ra một chuỗi thông tin gốc (tạm gọi là `eStr`).
3. **Đào (Mine) tìm Nonce:** Đây là bước Proof-of-Work thực sự. Nó chạy một vòng lặp tăng dần từ 0 để tìm một số `nonce` (số dùng một lần) sao cho khi ghép số `nonce` này vào sau `eStr` rồi băm bằng thuật toán SHA-256, chuỗi hash nhận về phải bắt đầu bằng **4 chữ số 0** (`0000`).
4. **Gửi lời giải:** Ngay khi đào ra được số `nonce` hợp lệ, nó sẽ lập tức gửi lời giải đó lên API xác thực `/__challenge` bằng phương thức `POST` để nhận về tấm vé thông hành (session cookie mới).

Đoạn code minh họa thuật toán bóc tách và đào tìm nonce trông đại khái như thế này:

```typescript
// Bước 1 & 2: Cắt cookie _hcc và giải mã Base64 phần sau dấu hai chấm
const cookieValue = rawHcc.split("=")[1]; 
const eStr = atob(cookieValue.split(":")[1]); // Chuỗi thông tin gốc

// Bước 3: Vòng lặp Proof-of-Work (SHA-256) tìm nonce
let solution = "";
for (let nonce = 0; nonce < 200000000; nonce++) {
  const candidate = eStr + nonce;
  const hash = await sha256(candidate); // Hàm băm SHA-256
  if (hash.startsWith("0000")) {
    solution = candidate; // Tìm thấy lời giải
    break;
  }
}
```

### 🛠️ Thử nghiệm giải toán lần 1 và Vấp ngã (400 Bad Request)

Nắm trong tay thuật toán, mình nhanh chóng viết code giải SHA-256 chạy trực tiếp bằng Deno. Với sức mạnh của CPU hiện đại, đoạn script giải toán chạy cực kỳ nhanh — chỉ mất khoảng 40ms là đã tìm ra số `nonce` chuẩn bài. Sướng quá, mình lập tức quăng `nonce` vào và gửi ngay một request `POST` mang theo lời giải lên `/__challenge`.

Nhưng đời không dễ xơi thế. Kết quả trả về là một cú tát trời giáng khác: **400 Bad Request**! Hệ thống lạnh lùng từ chối lời giải của mình.

Đoạn code "ngây thơ" lúc đó chỉ đơn giản thế này:

```typescript
// Tìm thấy solution sau 40ms là lập tức gửi POST lên xác thực ngay
const postRes = await fetch("https://www.omgubuntu.co.uk/__challenge", {
  method: "POST",
  headers: {
    "User-Agent": userAgent,
    "Cookie": rawHcc,
    "X-Hashcash-Solution": btoa(solution) // Gửi đi luôn
  }
});
console.log(postRes.status); // Kết quả nhận về: 400 Bad Request
```

Lúc đó mình khá là hoang mang, vắt óc suy nghĩ và đưa ra 3 giả thuyết:

*   **Giả thuyết A (Mã hóa sai lời giải?):** Có khi nào mình tính toán hoặc encode sai kết quả? Mình cẩn thận chạy debug, kiểm tra lại thuật toán băm từng li từng tí. Nhưng rõ ràng chuỗi băm ra bắt đầu bằng đúng 4 chữ số `0000`, không sai đi đâu được.
*   **Giả thuyết B (Thiếu các Header bảo mật?):** Có thể CDN chặn vì nghi ngờ do thiếu thông tin của trình duyệt. Thế là mình nảy số, bổ sung thêm các header như `Origin` và `Referer` trỏ về trang chủ của OMG! Ubuntu. Cơ mà gửi lại request thì vẫn ăn quả lỗi `400` như cũ.
*   **Giả thuyết C (Có một bẫy thời gian!):** Chắc chắn còn một "Trùm Cuối" nào đó núp lùm ở đây. Có khả năng hệ thống thiết lập một cơ chế kiểm tra thời gian (time-lock) để ngăn chặn các máy tính giải PoW quá nhanh chăng?

### 🔓 Trùm cuối lộ diện: Phát hiện "Bẫy thời gian" (Time-lock)

Hóa ra, giả thuyết C chính là câu trả lời! Để chắc chắn, mình quay lại đọc kỹ đoạn JavaScript của trang Challenge và chú ý đến một đoạn lệnh tính toán thời gian có sử dụng `setTimeout`. 

Hóa ra, JavaScript chạy trên trình duyệt sẽ lấy mốc thời gian (timestamp) lúc bắt đầu tải trang, sau đó nó tính toán sao cho **chỉ gửi request POST xác thực đi sau khi trang đã tải được ít nhất 3.5 giây**. 

Lý do đằng sau cơ chế này khá thực tế: CDN lập luận rằng một trình duyệt của người dùng thật cần thời gian để phân giải HTML, tải tài nguyên, dựng giao diện (render) rồi mới chạy JS giải toán. Quá trình này không thể nào diễn ra siêu tốc chỉ trong 50ms như một con bot cào dữ liệu được. Nếu gửi lên quá nhanh, CDN sẽ lập tức gắn mác là bot và táng thẳng lỗi `400 Bad Request`.

**Giải pháp của mình:** Đưa vào đoạn code cào một lệnh sleep bắt buộc. Mình đo khoảng thời gian từ lúc bắt đầu gửi request GET đầu tiên. Nếu CPU giải toán quá nhanh, script bắt buộc phải đợi (`delay`) thêm một khoảng cho đủ 4 giây (mình để 4 giây cho chắc cú) trước khi được phép gửi request POST xác thực lên `/__challenge`.

Dưới đây là phần code logic cốt lõi để xử lý phần bẫy thời gian này:

```typescript
// Bước 3: Kiểm tra và chờ đủ độ trễ 4 giây (Bypass Time-lock)
const elapsed = Date.now() - fetchStartTime;
if (elapsed < 4000) {
  const waitTime = 4000 - elapsed;
  console.log(`CPU giải toán quá nhanh (${elapsed}ms). Đang đợi thêm ${waitTime}ms cho đủ 4 giây...`);
  await delay(waitTime); // Chờ cho đủ thời gian quy định
}

// Bước 4: Gửi POST xác thực lên /__challenge kèm theo lời giải
const postRes = await fetch("https://www.omgubuntu.co.uk/__challenge", {
  method: "POST",
  headers: {
    "User-Agent": userAgent,
    "Cookie": rawHcc, // Cookie _hcc nhận được ở bước 1
    "X-Hashcash-Solution": btoa(solution), // Lời giải PoW mã hóa Base64
    "Referer": "https://www.omgubuntu.co.uk",
    "Origin": "https://www.omgubuntu.co.uk",
    "Content-Length": "0"
  }
});
```

### 🎉 Thành công vượt rào

Với giải pháp bẫy thời gian được bổ sung, mình chạy thử nghiệm lại script một lần nữa để xem kết quả. Mọi thứ diễn ra chuẩn từng mili-giây:

1. **Gửi request đầu tiên:** Nhận ngay về lỗi 403 cùng cookie `_hcc`.
2. **CPU giải mã:** Thuật toán SHA-256 chạy loáng cái mất khoảng 40ms để đào ra số `nonce` chính xác.
3. **Chờ đợi thời gian:** Script tự tính toán thấy còn thiếu 3960ms nữa mới đủ 4 giây, nên nó ngoan ngoãn nằm ngủ.
4. **Gửi POST xác thực:** Đủ 4 giây trôi qua, request POST mang theo lời giải được bắn lên `/__challenge`. Kết quả phản hồi: **200 OK**!
5. **Cào dữ liệu thật:** Server trả về thêm cookie session đã xác thực. Mình đính kèm đống cookie này rồi gửi request tải lại trang chủ... Bùm! Dữ liệu HTML thật bự chà bá của OMG! Ubuntu! đã nằm gọn trong tay mình mà không còn một trở ngại nào nữa.

Nhìn lại thì đây là một hành trình tư duy cực kỳ thú vị đối với một "thằng lười". Đi từ việc phát hiện lỗi bị chặn -> tò mò đọc payload -> nhờ vả AI dịch ngược thuật toán -> chạy thử lần đầu vấp ngã -> lùng sục tìm ra bẫy thời gian phụ -> và cuối cùng là bypass vượt rào thành công!

### 🛡️ Giải mã cơ chế phòng thủ: Tại sao OMG! Ubuntu lại dùng nó?

Nếu anh em thắc mắc cơ chế này gọi là gì và tại sao một trang tin tức như OMG! Ubuntu lại phải bày vẽ ra trò giải toán phức tạp này, thì đây là câu trả lời:

Cơ chế này chính là sự kết hợp giữa **Proof-of-Work (PoW) / Hashcash** và **Time-lock (Khóa thời gian)**:

*   **Proof-of-Work (PoW):** Bắt trình duyệt phải bỏ ra tài nguyên CPU để tính toán một bài toán mã hóa (ở đây là tìm mã băm SHA-256 bắt đầu bằng `0000`). Đối với người dùng thật, việc máy tính chạy giải toán mất 40-50ms là hoàn toàn vô hại và không hề gây cảm giác giật lag. Thế nhưng, đối với các hệ thống spam bot hoặc công cụ DDOS muốn gửi hàng triệu request liên tục, việc bắt buộc phải giải toán trên mỗi request sẽ khiến kẻ tấn công cạn kiệt tài nguyên CPU cực kỳ nhanh chóng.
*   **Time-lock:** CDN chèn thêm độ trễ (ít nhất 3.5 giây) để đảm bảo trình duyệt có thời gian thực hiện việc render trang giống như người dùng thật, chặn đứng các loại bot tự động hóa muốn cào hàng loạt trang tin trong chớp mắt.

**Vậy tại sao OMG! Ubuntu lại dùng nó thay vì chặn thẳng tay hoặc dùng CAPTCHA?**

1. **Chống cào dữ liệu (Anti-Scraping) thông minh:** OMG! Ubuntu là một trang blog cực kỳ nổi tiếng, nội dung của họ thường xuyên bị các trang web rác tự động cào về để xào nấu kiếm view. Việc bắt buộc giải PoW và đợi 4 giây khiến tốc độ cào tin của bot bị kéo chậm đáng kể. Việc cào hàng nghìn bài viết bây giờ sẽ tốn CPU và mất cực kỳ nhiều thời gian, khiến kẻ đi cào nản lòng mà từ bỏ.
2. **Trải nghiệm người dùng (UX) mượt mà:** Khác với các loại CAPTCHA truyền thống bắt bạn phải click chọn đèn giao thông, xe buýt, vạch kẻ đường cực kỳ phiền phức, cơ chế PoW chạy hoàn toàn ẩn dưới nền (background). Người dùng thật truy cập bằng trình duyệt Chrome, Firefox... chỉ cần đợi vài giây ở lần đầu tiên để JS tự động giải toán và set cookie. Sau đó, họ thoải mái đọc tin mà không hề bị làm phiền thêm lần nào nữa.

Đúng là một mũi tên trúng hai nhạn: vừa chặn được bot phá phách, vừa giữ chân được người đọc thật!

### 📝 Tổng kết

Vậy là từ một buổi sáng lười biếng muốn viết bot cào tin cho tiện, mình đã vô tình chạm trán và vượt qua một hệ thống chống bot khá thông minh và thú vị của OMG! Ubuntu. Qua đó mới thấy, các hệ thống bảo mật hiện nay không chỉ đơn thuần dựa vào việc đối chiếu IP/UA tĩnh mà đã áp dụng Proof-of-Work kết hợp Time-lock rất tinh tế.

Tất nhiên, nếu lười giải PoW thì anh em vẫn có thể dùng cái User-Agent của Postman như mình phát hiện ở trên để lách luật cho nhanh, nhưng tự tay decode thuật toán và viết script bypass xịn xò thế này thì mới đúng chất dân lập trình chứ đúng không? 

Cảm ơn mọi người đã theo dõi bài viết này. Hẹn gặp lại anh em ở những bài viết "vọc vạch" công nghệ thú vị lần sau! 🚀
