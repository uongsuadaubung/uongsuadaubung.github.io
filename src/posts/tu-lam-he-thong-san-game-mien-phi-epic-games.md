---
title: "Săn game miễn phí Epic Games Store tự động với Deno, GitHub Actions và Telegram"
date: "2026-05-27"
tags: ["Lập Trình", "Dự Án Cá Nhân", "Deno", "Automation"]
description: "Hành trình đảo ngược API ẩn của Epic Games Store, viết script chạy bằng Deno và thiết lập GitHub Actions tự động hóa săn game miễn phí gửi qua Telegram Bot mỗi tuần."
published: true
---

# Săn game Epic miễn phí: Việc gì phải mở Launcher? 🎮

Chắc hẳn ai trong chúng ta cũng đều có một thói quen rất "game thủ": **Chăm chỉ nhận game miễn phí trên Epic Games Store nhưng cả năm chẳng mở launcher lên chơi một lần nào.** 

Hàng tuần cứ đến tối thứ Năm, Epic Games lại hào phóng phát từ một đến hai tựa game miễn phí. Có tuần là những siêu phẩm bom tấn AAA (như GTA V, Death Stranding), cũng có tuần là những tựa game độc lạ indie. Nhưng khổ một nỗi, vì lười mở cái Epic Games Launcher siêu nặng nề nên mình rất hay quên nhận game. 

Để giải quyết triệt để sự "não cá vàng" này, mình đã quyết định tự code một hệ thống quét tự động (crawler) và gửi tin nhắn báo về điện thoại qua Telegram Bot mỗi khi có game mới. Toàn bộ hệ thống được xây dựng gọn gàng bằng **Deno** và chạy hoàn toàn tự động.

---

## 🔍 Bước 1: Đảo ngược (Reverse) API ẩn của Epic Games Store

Thay vì viết một con bot chạy giả lập trình duyệt (Puppeteer/Playwright) rất nặng nề và dễ lỗi, mình đã tìm cách đảo ngược (reverse engineer) API ẩn mà Epic Games sử dụng để hiển thị các chương trình khuyến mãi trên trang chủ của họ.

Sau vài phút "F12 thần chưởng" và rà soát tab Network, mình phát hiện ra Epic Games Store cung cấp một endpoint public dạng tĩnh cực kì xịn xò:

```http
GET https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=VN&allowCountries=VN
```

### Phân tích cấu trúc dữ liệu khuyến mãi

Endpoint này trả về một cục dữ liệu JSON chứa toàn bộ danh sách game đang và sắp có trên cửa hàng. Tuy nhiên, cấu trúc của nó tương đối lằng nhằng. Để biết chính xác một tựa game có đang được phát miễn phí hay không, chúng ta phải lọc theo quy tắc:

1. **Game đang miễn phí (Free Now):** Nằm trong `promotions.promotionalOffers`. Chúng ta cần duyệt qua mảng này và tìm ưu đãi nào có `discountType === 'PERCENTAGE'` và tỷ lệ giảm giá `discountPercentage === 0`.
2. **Game sắp miễn phí (Coming Soon):** Nằm trong `promotions.upcomingPromotionalOffers`. Chúng ta cũng tìm ưu đãi có `discountPercentage === 0` nhưng thời gian bắt đầu nằm ở tương lai.
3. **Đường dẫn nhận game:** Cấu trúc liên kết động bằng cách ghép nối mã nhận dạng: `https://store.epicgames.com/en-US/p/` + `pageSlug` (hoặc `productSlug` làm fallback).

Để thử nghiệm nhanh, bạn có thể mở Console F12 trên bất kỳ trang nào của Epic Games (để tránh lỗi chặn CORS) và chạy đoạn mã Javascript sau để thấy kết quả ngay lập tức:

```javascript
fetch("https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US")
  .then(res => res.json())
  .then(data => {
    const games = data.data.Catalog.searchStore.elements;
    games.forEach(game => {
      const activePromos = game.promotions?.promotionalOffers?.[0]?.promotionalOffers || [];
      if (activePromos.length > 0 && activePromos[0].discountSetting?.discountPercentage === 0) {
        console.log(`🔥 [FREE NOW] ${game.title}`);
        console.log(`📅 Hạn nhận: ${new Date(activePromos[0].endDate).toLocaleDateString()}`);
      }
    });
  });
```

---

## 🛠️ Bước 2: Triển khai Tracker tự động bằng Deno

Mình chọn **Deno 2.x** để triển khai dự án này vì nó hỗ trợ TypeScript mặc định mà không cần cấu hình Babel hay Webpack rườm rà, tốc độ khởi động nhanh như chớp và cực kì bảo mật.

Cấu trúc thư mục của dự án cực kỳ tinh gọn:

```text
freegames/
├── games.json          # Cơ sở dữ liệu JSON lưu lịch sử các game đã thông báo
├── tracker.ts          # Script điều phối chính
└── src/
    ├── services/
        ├── database.ts    # Đọc/ghi lịch sử tránh gửi tin nhắn trùng lặp
        ├── epicStore.ts   # Fetch và trích xuất dữ liệu từ Epic Games API
        └── telegram.ts    # Định dạng tin nhắn HTML và gửi qua Telegram Bot
```

### Cơ chế chống trùng lặp với cơ sở dữ liệu `games.json`

Một vấn đề cực kỳ quan trọng khi viết bot tự động quét tin tức là **tránh gửi trùng lặp**. Nếu không lưu lại trạng thái, cứ mỗi lần GitHub Actions khởi chạy, bot sẽ lại "bắn" thông báo của những tựa game đang miễn phí vào Telegram, gây phiền hà và spam kênh nhận tin.

Để giải quyết vấn đề này, mình đã thiết kế một giải pháp lưu trữ trạng thái đơn giản nhưng cực kỳ hiệu quả:
* **Cơ sở dữ liệu dạng file tĩnh `games.json`:** Tệp này đóng vai trò như một "lịch sử quét", lưu trữ mảng các game đã gửi thông báo thành công dưới dạng JSON terabyte-scale (gồm các trường thông tin tối thiểu như `id`, `title`, `start_date`, `end_date`, `store_url`).
* **Hàm kiểm tra trạng thái (`isGameNotified`):** Khi Deno quét danh sách game từ Epic, trước khi gửi bất kỳ thông báo nào, hệ thống sẽ mở file `games.json`, đọc dữ liệu và so khớp ID của game khuyến mãi hiện tại. 
* **Quy trình lọc tin nhắn thông minh:**
  1. Nếu ID game **đã tồn tại** trong danh sách lịch sử: Bỏ qua (Skip), không gửi tin nhắn.
  2. Nếu ID game **chưa tồn tại**: Kích hoạt gửi thông báo qua Telegram Bot. Sau khi gửi thành công, game mới sẽ được tự động thêm vào lịch sử của tệp `games.json` và lưu lại xuống ổ đĩa.
* **Kết hợp lưu trữ trạng thái:** File `games.json` sau đó sẽ được GitHub Actions tự động commit và push ngược lại repository để lưu giữ trạng thái cho lần chạy tiếp theo.

### Module gửi thông báo qua Telegram Bot

Tận dụng API của Telegram, mỗi khi phát hiện ra game mới chưa có trong lịch sử lưu ở file `games.json`, hệ thống sẽ sử dụng phương thức `sendPhoto` (hoặc `sendMessage` làm fallback) để gửi tin nhắn kèm ảnh bìa game. Tin nhắn được định dạng dưới dạng **HTML** (`parse_mode: "HTML"`) cực kì chuyên nghiệp và trực quan:

```typescript
export function buildHtmlMessage(game: EpicGameStruct): string {
  const startFormatted = formatDate(game.start_date);
  const endFormatted = formatDate(game.end_date);

  return [
    `🎁 <b>GAME MIỄN PHÍ TRÊN EPIC GAMES STORE</b> 🎁`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🎮 <b>Tên Game:</b> <a href="${game.store_url}">${game.title}</a>`,
    `📅 <b>Thời hạn:</b> <code>${startFormatted}</code> đến <code>${endFormatted}</code>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 <b>Nhấp vào đây để nhận game miễn phí:</b>`,
    `<a href="${game.store_url}">👉 NHẬN NGAY ${game.title.toUpperCase()} 👈</a>`,
  ].filter((line) => line !== null).join("\n");
}
```

---

## ⚙️ Bước 3: Tự động hóa định kỳ với GitHub Actions

Code chạy bằng Deno đã xong, nhưng làm sao để nó tự chạy hàng ngày mà không cần chúng ta phải bật máy tính lên gõ lệnh? Giải pháp chính là **GitHub Actions** — một nền tảng CI/CD miễn phí, mạnh mẽ và cực kì thích hợp cho các tác vụ tự động hóa dạng này.

Mình đã thiết lập một file workflow tinh gọn tại `.github/workflows/epic-tracker.yml` tập trung vào các cấu hình cốt lõi sau:

```yaml
on:
  schedule:
    # Chạy tự động hàng ngày lúc 09:00 sáng giờ Việt Nam (02:00 UTC)
    - cron: "0 2 * * *"
  workflow_dispatch: # Cho phép kích hoạt chạy thủ công

jobs:
  track-and-notify:
    runs-on: ubuntu-latest
    permissions:
      contents: write # Cấp quyền ghi để tự động commit và push file games.json

    steps:
      # ... (Các bước checkout và cài đặt môi trường Deno) ...

      - name: Khởi chạy bộ quét game Epic Games & Gửi thông báo
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
        run: deno task start

      - name: Tự động cập nhật cơ sở dữ liệu games.json
        run: |
          git config --global user.name "github-actions[bot]"
          git add games.json

          # Chỉ commit và push ngược lên repo nếu có game mới được lưu
          if ! git diff --staged --quiet; then
            git commit -m "chore: cập nhật cơ sở dữ liệu games.json [skip ci]"
            git push
          fi
```

### Các điểm sáng trong cấu hình này:
1. **Lịch trình Cronjob:** Bộ quét tự động chạy vào lúc 9h sáng hàng ngày để luôn cập nhật game sớm nhất có thể.
2. **Quyền ghi tệp tự động (contents: write):** Khi phát hiện game mới, script Deno sẽ thêm game đó vào tệp lịch sử `games.json`. Nhờ phân quyền ghi của GitHub Actions, bot sẽ tự động thực hiện commit và push cập nhật này ngược lại repository, tránh gửi lặp lại cùng một tựa game vào ngày hôm sau.
3. **Bảo mật tối đa với Secrets:** Token của bot Telegram và Chat ID của bạn được mã hóa an toàn dưới dạng các biến môi trường ẩn (`secrets`), tuyệt đối không bị lộ ra ngoài mã nguồn công khai.

---

## 🏁 Kết quả ngọt ngào

Hệ thống sau khi hoàn thành chạy cực kỳ ổn định. Mỗi ngày, GitHub Actions sẽ tự động khởi động máy ảo Ubuntu, cài đặt Deno, chạy script quét và tắt máy chỉ trong vòng chưa đầy **15 giây** (hoàn toàn miễn phí!). Và kết quả là những thông báo game miễn phí dạng HTML cực sắc nét kèm ảnh bìa đã được gửi thẳng vào Telegram thông qua bot "Meow":

<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; margin: 24px 0;">
  <img src="/images/tu-lam-he-thong-san-game-mien-phi-epic-games/image-01.jpg" alt="Thông báo game Tomb Raider" style="width: 100%; max-width: 260px; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
  <img src="/images/tu-lam-he-thong-san-game-mien-phi-epic-games/image-02.jpg" alt="Thông báo game Sunderfolk" style="width: 100%; max-width: 260px; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
  <img src="/images/tu-lam-he-thong-san-game-mien-phi-epic-games/image-03.jpg" alt="Thông báo game Batman" style="width: 100%; max-width: 260px; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
</div>

Chỉ với một cú click nhẹ ngay từ liên kết nhận game trong tin nhắn, trình duyệt sẽ mở thẳng trang nhận game của Epic Games Store mà mình không cần phải mở launcher hay vào trang chủ để tìm kiếm nữa!

### Bài học rút ra từ dự án nhỏ này:
* **Tận dụng API ẩn:** Hầu hết các website lớn đều có API nội bộ hoạt động rất mượt mà. Thay vì cào HTML (web scraping) dễ lỗi, hãy ưu tiên tìm kiếm các endpoint JSON ẩn này.
* **TypeScript trên Deno là chân ái:** Cho các dự án kịch bản (automation scripts), Deno giúp giảm thiểu 90% thời gian thiết lập môi trường so với Node.js truyền thống.

Chúc các bạn săn game vui vẻ và không bao giờ bỏ lỡ bất kỳ cực phẩm miễn phí nào từ Epic Games nữa nhé! 🚀
