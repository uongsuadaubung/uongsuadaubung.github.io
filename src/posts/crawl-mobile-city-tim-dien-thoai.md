---
title: "Vợ cho tiền mua điện thoại, tôi dành 2 ngày viết crawler để rồi nghe 3 tiếng: 'hết hàng rồi'"
date: 2026-04-23
tags: ["crawl", "typescript", "svelte", "bun", "side-project"]
description: "Câu chuyện về một chiếc điện thoại cũ, một người vợ tốt bụng, một đêm viết code và một cái kết... không ai ngờ tới."
published: true
---

Chiếc điện thoại của tôi đã cũ lắm rồi. Không phải kiểu "cũ nhưng vẫn ngon", mà kiểu cũ thật sự — màn hình bị burn-in một góc, pin tụt từ 80% xuống 20% trong vòng 2 tiếng, camera thì thôi khỏi nói, chụp ảnh ban đêm trông như bức tranh impressionism của Monet nhưng phiên bản xấu hơn nhiều.

Vợ tôi thấy thế, bảo: *"Thôi anh mua cái máy mới đi, em cho tiền"*.

Câu đó nghe như âm nhạc. Tôi gật đầu ngay, chưa kịp nghĩ.

---

## Hành trình 1: Lạc vào mê cung "máy xách tay nội địa Trung"

Tôi bắt đầu nghiên cứu. Lúc đầu nghĩ sẽ mua Samsung hay Xiaomi bình thường, nhưng sau khi lướt một hồi thì rơi vào cái hố không đáy gọi là **"điện thoại nội địa Trung Quốc xách tay"**.

Nghe có vẻ lạ, nhưng thực ra thị trường này rất béo: những chiếc máy như Xiaomi 15, Redmi Note 14, OPPO Reno... phiên bản bán tại Trung Quốc thường có chip tốt hơn, RAM nhiều hơn, nhưng giá lại rẻ hơn hàng chính hãng Việt Nam đáng kể. Đổi lại là bảo hành hạn chế và không có tiếng Việt sẵn (nhưng cài được).

Tôi tìm đến **MobileCity** — một trong những nơi bán máy xách tay nội địa Trung uy tín nhất Hà Nội. Website có vẻ ổn, nhiều hàng, giá niêm yết rõ ràng.

Nhưng rồi tôi nhận ra vấn đề.

---

## Vấn đề: Website không có bộ lọc

MobileCity bán **rất nhiều** điện thoại. Hàng trăm sản phẩm. Nhưng trang web lại không có chức năng lọc đủ mạnh để tôi tìm theo nhu cầu cụ thể của mình:

- RAM ít nhất 8GB
- Bộ nhớ 256GB
- Chip Snapdragon hoặc Dimensity (không thích MediaTek Helio cũ)
- Màn hình AMOLED
- Pin từ 5000mAh trở lên
- Có sạc nhanh
- Cổng USB Type-C
- Giá không quá X triệu

Tôi phải vào từng trang sản phẩm, đọc từng cái, rồi so sánh tay. Sau 30 phút, tôi bực bội đóng tab lại.

*Và rồi tôi nghĩ: "Thay vì mất công tìm thủ công, mình viết code crawl về rồi tự lọc cho nhanh."*

---

## Hành trình 2: Ngồi viết crawler

### Khám phá cấu trúc website

Bước đầu tiên là hiểu website hoạt động như thế nào. Tôi mở DevTools, vào tab Network, và bắt đầu theo dõi request khi tải trang danh sách điện thoại.

Phát hiện thú vị: website dùng **CSRF token** để bảo vệ API phân trang. Khi cuộn xuống hoặc chuyển trang, trình duyệt gửi một `POST` request lên endpoint `/product_view_more` kèm theo:
- `csrf-token` lấy từ `<meta>` tag
- `Cookie` session từ lần load đầu tiên
- Các param: `slug`, `page`, `count`, `type_category`

Đây là cái hay — thay vì phải crawl 20 trang HTML rời rạc, tôi chỉ cần giả lập đúng flow này là lấy được toàn bộ dữ liệu qua API một cách gọn gàng.

### Tech stack

Tôi chọn:
- **Bun** — runtime TypeScript native, nhanh hơn Node.js nhiều, không cần compile
- **Axios** — HTTP client để gửi request
- **Cheerio** — parse HTML phía server (kiểu jQuery nhưng cho Node/Bun)
- **Zod** — schema validation để đảm bảo dữ liệu đúng format
- **Svelte 5 + Vite** — frontend để hiển thị và lọc kết quả

### Quá trình crawl 3 giai đoạn

Crawler được thiết kế theo pipeline 3 bước, mỗi bước có validation độc lập bằng Zod:

**Bước 0 — Load dữ liệu cũ:**  
Nếu đã có `products.json` từ lần chạy trước, load lên để cache. Những sản phẩm đã có đủ thông số sẽ không bị crawl lại, tiết kiệm thời gian và tránh bị rate-limit.

**Bước 1 — Lấy danh sách sản phẩm từ List Page:**

```typescript
// Lấy CSRF token và session từ trang chủ
const firstPage = await session.get('https://mobilecity.vn/dien-thoai');
const $ = cheerio.load(firstPage.data);
const csrfToken = $('meta[name="csrf-token"]').attr('content');
const cookies = firstPage.headers['set-cookie'];

// Sau đó loop qua API phân trang
const response = await session.post(`https://mobilecity.vn/product_view_more`,
    `count=50&slug=dien-thoai&page=${page}&type_category=phone_categories&get_order=`,
    { headers: { 'X-CSRF-TOKEN': csrfToken, 'Cookie': cookies.join('; '), ... } }
);
```

Mỗi sản phẩm từ danh sách được parse lấy: tên, giá, link, ảnh, thương hiệu. Sản phẩm qua được `BaseProductSchema` của Zod mới được chấp nhận. Các sản phẩm trong blacklist (tai nghe, đồng hồ, ốp lưng...) bị loại bỏ ngay tại bước này.

**Bước 2 — Lấy thông số kỹ thuật từ trang chi tiết:**

```typescript
// Crawl song song theo batch 10 sản phẩm
const batchSize = 10;
for (let i = 0; i < productsToFetch.length; i += batchSize) {
    const batch = productsToFetch.slice(i, i + batchSize);
    await Promise.all(batch.map(async (product) => {
        const response = await session.get(product.link);
        const $ = cheerio.load(response.data);
        
        // Parse bảng thông số kỹ thuật
        const specsTable = {};
        $('table tr').each((_, tr) => {
            const [key, value] = $(tr).find('td');
            if (key && value) specsTable[key.text()] = value.text();
        });
        
        // Normalize RAM: "8GB / 12GB" -> [8, 12]
        // Normalize Storage: "256GB / 512GB" -> [256, 512]
        // Extract pin, cổng sạc, loại loa...
    }));
    
    await delay(500); // Nghỉ 500ms giữa các batch
}
```

Dữ liệu specs được normalize về dạng mảng số để việc lọc sau này dễ dàng hơn. Ví dụ: một máy có "8GB/12GB RAM" sẽ có `ram_values: [8, 12]`, người dùng lọc "8GB" hoặc "12GB" đều tìm thấy máy này.

**Bước 3 — Validate và lưu:**  
Gộp `BaseProduct` + `ProductSpecs` → validate lần cuối bằng `ProductSchema` → lưu vào `products.json`.

### Frontend với Svelte 5

Sau khi có data, tôi xây frontend bằng Svelte 5 với **faceted filter** — kiểu lọc thông minh mà các tùy chọn sẽ tự động ẩn/hiện dựa trên context hiện tại. Ví dụ: nếu bạn đang lọc "Xiaomi", thì dropdown RAM sẽ chỉ hiện các giá trị RAM có trong máy Xiaomi thôi, thay vì hiện hết rồi kết quả 0 sản phẩm.

Bộ lọc hỗ trợ:
- Tìm theo tên
- Hãng sản xuất
- Tình trạng (mới/cũ)
- RAM, bộ nhớ trong
- Dòng chip (Snapdragon, Dimensity, MediaTek...)
- Loại màn hình (AMOLED, OLED, IPS...)
- Cổng sạc
- Dung lượng pin tối thiểu
- Có/không có sạc nhanh
- Khoảng giá
- Hệ thống loa (Stereo/Mono)
- Tình trạng kho

Ngoài ra còn có GitHub Actions chạy tự động mỗi ngày lúc 0 giờ để crawl dữ liệu mới và re-deploy lên GitHub Pages. Xịn chứ?

---

## Kết quả

Sau khoảng 2 ngày code (vừa làm vừa debug, vừa chửi CSRF token), crawler chạy ngon, kéo về được gần 2 nghìn sản phẩm.

Tôi bật giao diện lên, set filter:
- RAM: 8GB
- Storage: 256GB  
- Chip: Dimensity
- Màn hình: AMOLED
- Pin: `>= 5000mAh`
- Giá: `<= 5 triệu`

**Kết quả: 2 chiếc máy.**

Hai chiếc máy hoàn hảo trên giấy tờ. Tôi mừng lắm, chụp màn hình, paste vào chat với vợ: *"Em ơi anh tìm được rồi nè!"*

---

## Cái kết... không ai ngờ tới

Tôi gọi điện cho MobileCity.

Hỏi máy A → *"Dạ máy đó bên em hết xách tay rồi anh ơi, chỉ còn hàng chính hãng thôi."*

Hỏi máy B → *"Máy đó cũng vậy anh ơi, xách tay hết lâu rồi."*

...

Tôi ngồi nhìn cái giao diện filter đẹp long lanh mà mình mất 2 ngày build, với kết quả 2 sản phẩm bây giờ thực tế đều **hết hàng**.

Vợ hỏi: *"Tìm được chưa anh?"*

Tôi: *"...Tìm được rồi. Nhưng hết hàng."*

Vợ: *"..."*

---

## Bài học rút ra

1. **Dữ liệu trên web không phải lúc nào cũng phản ánh thực tế** — website hiển thị "còn hàng" nhưng thực tế kho đã hết lâu.

2. **Đôi khi giải pháp kỹ thuật không phải câu trả lời** — bước đơn giản nhất là gọi điện hỏi trước.

3. **Nhưng viết crawler thì vẫn vui** — tôi học được cách xử lý CSRF token, faceted filtering, Svelte 5 runes, Zod validation pipeline... Không hoàn toàn vô nghĩa.

4. **Vợ tốt thật sự** — đưa tiền mua điện thoại mà chồng dành 2 ngày viết code rồi cuối cùng vẫn chưa mua được máy. Cô ấy không nói gì thêm, chỉ cười.

---

*Code của dự án này được public tại [github.com/uongsuadaubung/mobile-city](https://github.com/uongsuadaubung/mobile-city) và bạn có thể trải nghiệm bộ lọc tại [uongsuadaubung.github.io/mobile-city](https://uongsuadaubung.github.io/mobile-city/). Nếu bạn cũng đang tìm máy xách tay nội địa Trung và muốn có công cụ filter xịn hơn MobileCity, có thể clone về dùng — chỉ cần nhớ **gọi điện xác nhận còn hàng trước** khi mừng. :))*
