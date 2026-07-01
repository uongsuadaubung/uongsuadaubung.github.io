---
title: "Tự làm Chrome Extension đồng bộ save game lên mây cho Plants vs. Zombies Gardenless Edition (PvZGE)"
date: "2026-05-27"
tags: ["Lập Trình", "Dự Án Cá Nhân", "Chrome Extension", "SolidJS", "Deno"]
description: "Hành trình giải cứu save game PvZ Gardenless Edition khỏi kiếp bay màu bằng cách tự chế Chrome Extension đồng bộ GitHub Gist và tự nhặt tài nguyên cực kỳ nhàn nhã."
published: true
---

# Tự làm Chrome Extension đồng bộ save game: Cứu nguy cày cuốc! 🌻🎮

Nếu anh em là tín đồ của dòng game thủ thành huyền thoại, chắc chắn không thể bỏ qua bản web game **Plants vs. Zombies Gardenless Edition (PvZGE)** cực cuốn trên trang [play.pvzge.com](https://play.pvzge.com). Mình cũng bị nghiện tựa game này cmnr, rảnh tay lúc nào là lại vào trồng cây bắn zombie lúc đó.

Nhưng đời không như là mơ. Vì đây là web game nên toàn bộ dữ liệu cày cuốc (mặt trời, vàng bạc, các map đấu đang chơi dở...) đều được lưu trữ trực tiếp dưới trình duyệt bằng `localStorage`. 

Một ngày đẹp trời, do trình duyệt tự động dọn dẹp cache giải phóng bộ nhớ, hoặc do mình đổi sang máy tính khác ở văn phòng... **Bùm!** Toàn bộ save game biến mất, công sức cày cuốc bấy lâu bay màu như một cơn gió.

Lấy cục save cũ chép qua chép lại thủ công thì khá bất tiện. Để giải quyết việc này, mình quyết định tự code một cái browser extension để lo trọn gói việc đồng bộ save game lên đám mây, kèm theo vài tính năng phụ.

---

## 🔍 Bước 1: Ý tưởng dùng GitHub Gist làm "Mây" (Cloud) giá 0 đồng

Để lưu trữ save game lên cloud, giải pháp thông thường là dựng một cái backend (Node.js/Python), kết nối database (MongoDB/Postgres), rồi thiết lập cơ chế đăng nhập OAuth lằng nhằng. Nghĩ đến cảnh duy trì server tốn tiền và cấu hình phức tạp là mình thấy hơi ngại (thực ra là mình không muốn tốn phí duy trì server).

Thế là mình nảy ra ý định tận dụng ngay **GitHub Gist API**. 
* **Miễn phí 100%:** GitHub cho phép tạo Gist không giới hạn.
* **Bảo mật tuyệt đối:** Không có server trung gian nào cả. Trình duyệt của bạn sẽ giao tiếp trực tiếp với GitHub qua mã **GitHub Personal Access Token** cá nhân do bạn tự tạo và chỉ lưu cục bộ trên máy.
* **Quản lý lịch sử (Version Control):** Gist tự động lưu các revision (phiên bản), lỡ đồng bộ nhầm vẫn có thể rollback lại được dễ dàng.

Cơ sở dữ liệu save game của PvZGE thực tế chỉ là hai key trong `localStorage`: `PvZ2_PlayerProperties` (chứa tài sản, tiến trình người chơi) và `PvZ2_Settings` (cấu hình cài đặt game). Chúng ta chỉ cần đóng gói chúng lại thành một file JSON duy nhất rồi đẩy lên Gist là xong!

---

## 🛠️ Bước 2: Build Extension xịn xò với SolidJS & Deno

Để xây dựng giao diện popup cho extension, mình chọn **SolidJS** kết hợp **TypeScript** và **Sass/SCSS**. SolidJS cực kỳ nhẹ, reactive phản hồi mượt mà chứ không hề cồng kềnh như React, giao diện popup mờ kính (Glassmorphism) trông sang xịn mịn hơn hẳn.

Về môi trường phát triển, thay vì cắm đầu vào `npm` truyền thống với quả thư mục `node_modules` nặng trĩu, mình dùng **Deno v2** làm runtime để lint, format và đóng gói.

```text
pvzge-sync/
├── build.ts              # Trình biên dịch esbuild & hậu xử lý cho Chrome / Firefox
├── deno.json             # File cấu hình nhiệm vụ thay thế package.json
└── src/
    ├── components/       # UI Components của popup (SolidJS)
    ├── domains/          # Logic đọc/ghi save game & gọi API GitHub Gist
    ├── extension/        
    │   ├── background.ts # Script nền chạy ngầm tự động đồng bộ định kỳ
    │   └── content.ts    # Content script tiêm vào trang play.pvzge.com
```

Phần thú vị nhất là kịch bản `build.ts`. Mình viết bằng TypeScript chạy trực tiếp trên Deno để lo từ A-Z quy trình:
1. Biên dịch Sass sang CSS tối giản.
2. Dùng **esbuild** đóng gói cực nhanh đống script SolidJS/TS.
3. Tự động chuyển đổi `manifest.json` tương thích cho cả Chrome lẫn Firefox (như chuyển `service_worker` sang `background.scripts` và nhét Gecko ID cần thiết cho Firefox).

---

## ☀️ Tính năng phụ "đáng tiền bát gạo": Auto Collect vì... chiều vợ là chính!

Thật ra, chơi PvZGE bản web thì anh em không cần phải click cật lực để nhặt đồ đâu, game đã tối ưu bằng cách chỉ cần di chuột (hover) qua là tài nguyên tự động bay vào túi rồi. Nhưng ngặt nỗi là hai vợ chồng mình đều nghiện trò này. Vợ mình chơi cứ than mỏi tay vì phải lia chuột liên tục khắp màn hình để hút Mặt Trời với Xu Vàng. Để chiều lòng "nóc nhà", mình quyết định ngâm cứu làm thêm tính năng tự động nhặt đồ này luôn cho bả dùng cho đỡ cực.

Lội vào code game bằng "F12 thần chưởng", mình phát hiện ra game thực chất có tích hợp sẵn phím tắt ẩn để "Thu thập tất cả" (mặc định là phím `A`, cấu hình trong `PvZ2_Settings` mục `KeyBinds.Game_CollectAll`). 

Vậy thì logic cực kỳ đơn giản! Trong `content.ts` (script tiêm trực tiếp vào trang game), chúng ta chỉ cần viết một vòng lặp `setInterval` chạy mỗi **500ms** để giả lập hành động ấn phím này và bắn trực tiếp vào phần tử canvas của game:

```typescript
// Trích đoạn logic tự động nhặt tài nguyên trong content.ts
if (enabled) {
  console.log("[PVZGE-Sync] AutoCollect started.");
  collectInterval = window.setInterval(() => {
    const canvas = document.getElementById("GameCanvas");
    if (canvas) {
      // Giả lập sự kiện gõ phím gửi thẳng vào Game Canvas
      const finalOptions = { ...keyOptions, bubbles: true, cancelable: true };
      canvas.dispatchEvent(new KeyboardEvent("keydown", finalOptions));
      canvas.dispatchEvent(new KeyboardEvent("keyup", finalOptions));
    }
  }, 500);
}
```

Kết quả? Vừa vào trận đấu là Mặt Trời hay Xu Vàng vừa rơi ra sẽ ngay lập tức được tự động gom sạch sẽ, không cần di chuột mỏi tay nữa. Vợ mình dùng xong khen nức nở, quả là đáng tiền bát gạo!

---

## 🔄 Cơ chế Smart Sync 3-Way: Tránh ghi đè save oan uổng

Khi chơi game trên nhiều thiết bị (lúc ở văn phòng, lúc về nhà), việc lệch save game là chuyện cơm bữa. Nếu extension cứ lấy save mới nhất đè lên save cũ thì sớm muộn gì anh em cũng có thể bị mất dữ liệu tiến trình chơi game.

Để giải quyết triệt để bài toán này, mình đã tự thiết kế một cơ chế đồng bộ thông minh gọi là **3-Way Sync (Đồng bộ 3 chiều) dựa trên mã băm (hash-based)** tương tự như cách Git giải quyết các xung đột merge code.

Cụ thể, mỗi lần kích hoạt đồng bộ, extension sẽ tính toán mã băm SHA-256 của ba đối tượng:
1. `H_local`: Mã băm của Save Data hiện tại dưới máy bạn.
2. `H_cloud`: Mã băm của Save Data đang nằm trên GitHub Gist.
3. `H_base`: Mã băm của bản ghi thành công gần nhất được lưu lại (Snapshot Base).

> **Mẹo nhỏ xử lý nhiễu:** Để tránh việc lệch hash ảo do những thay đổi vụn vặt của game, trước khi băm SHA-256, mình có viết một hàm `stripIgnoredKeys` để lột sạch các key liên quan đến thời gian hệ thống dễ thay đổi liên tục như `date`, `time`, `CamelPlayedTime`,...

Sau khi có đủ 3 mã băm này, extension sẽ so khớp theo ma trận quyết định cực kỳ an toàn sau:

| Trường hợp | So sánh mã băm | Quyết định hành động | Ý nghĩa thực tế |
| :--- | :--- | :--- | :--- |
| **Giống nhau** | `H_local === H_cloud` | **Không làm gì cả** | Hai bên đã đồng bộ hoàn hảo, khớp cmn lệnh! |
| **Không đổi** | `H_local === H_base` và `H_cloud === H_base` | **Không làm gì cả** | Cả local và cloud đều giữ nguyên từ lần đồng bộ trước. |
| **Chỉ Local thay đổi** | `H_local !== H_base` và `H_cloud === H_base` | **Tự động tải lên (Auto-Upload)** | Bạn vừa chơi xong trên máy này, lưu lượng save mới sẽ tự động đẩy lên Gist. |
| **Chỉ Cloud thay đổi** | `H_local === H_base` và `H_cloud !== H_base` | **Tự động tải về (Auto-Download)** | Bạn vừa chơi ở máy B trước đó, giờ mở máy A lên game sẽ tự động kéo save mới nhất về máy này. |
| **XUNG ĐỘT!** | Cả hai bên đều đổi và khác nhau | **Kích hoạt bảng Xung đột** | Cả máy A và Cloud đều có thay đổi độc lập từ mốc chung gần nhất. |

### Các lớp bảo hiểm cực kỳ an toàn cho Save Game:
* **Chống đè save trắng:** Trong trường hợp máy bạn bị xóa sạch cache (hoặc cài lại máy), save local trở thành game mới tinh chưa chơi tí nào (`hasProgress(local) === false`). Lúc này, dù rơi vào trường hợp "Chỉ Local thay đổi" nhưng hệ thống sẽ **phanh gấp cmnl** khi thấy Cloud đang có tiến trình chơi thực tế, không cho phép auto-upload ghi đè lên đám mây nhằm bảo vệ tuyệt đối dữ liệu.
* **Chặn Hot-Reload khi đang combat:** Ở trường hợp "Chỉ Cloud thay đổi", nếu đang chạy Auto Sync ngầm dưới background, extension sẽ tạm thời khóa tải save về máy để tránh việc tự động reload lại trang game khi người chơi đang combat căng thẳng.
* **Bảng so sánh trực quan Side-by-Side:** Nếu rơi vào trạng thái xung đột thực sự (Trường hợp D), một hộp thoại glassmorphic sẽ hiện lên hiển thị mốc thời gian cập nhật song song của cả hai bên để bạn tự chọn giữ bản nào.
---

## ⏰ Tác vụ chạy ngầm background định kỳ: Không lo tắt Popup

Một sai lầm kinh điển của các anh em mới viết extension lần đầu là viết toàn bộ logic xử lý trong file script của Popup. Vấn đề là: popup trình duyệt thực ra chỉ là một trang HTML tạm thời. Mỗi khi người dùng click ra ngoài hoặc đóng popup, tiến trình của nó sẽ bị **kill sạch sẽ cmnl**. 

Để giải quyết chuyện này và giúp tính năng tự động đồng bộ hoạt động ổn định 24/7, mình đã đẩy toàn bộ logic gọi API và so sánh băm vào chạy trong Service Worker ngầm (`background.ts`) kết hợp với **chrome.alarms**:

```typescript
// Thiết lập bộ báo thức định kỳ tự động chạy ngầm trong background.ts
async function setupAlarm() {
  const enabled = await getAutoSyncEnabled();
  const interval = await getAutoSyncInterval(); // 5, 10, 30 phút...
  const token = await getGithubToken();

  await chrome.alarms.clear(ALARM_NAME);

  if (enabled && interval > 0 && token) {
    chrome.alarms.create(ALARM_NAME, {
      periodInMinutes: interval,
      delayInMinutes: interval,
    });
    console.log(`[AutoSync] Alarm set: every ${interval} minutes.`);
  }
}
```

Nhờ cơ chế này, cho dù bạn có tắt popup hay tắt trang cấu hình đi chăng nữa, trình duyệt vẫn âm thầm chạy ngầm bộ hẹn giờ định kỳ để đồng bộ save game lên mây hoàn toàn tự động mà không cần bạn phải động tay động chân gì.

---

## ⏳ "Cỗ máy thời gian" (Time Machine): Quay ngược quá khứ khôi phục 5 bản lưu gần nhất

Thông thường, các hệ thống đám mây chỉ lưu trữ duy nhất một bản sao lưu cuối cùng. Nếu chẳng may bản lưu đó bị lỗi hoặc bạn lỡ tay đưa ra một quyết định "đi vào lòng đất" trong game và muốn chơi lại từ đầu ngày hôm nay thì coi như vô phương cứu chữa.

Nhưng vì chúng ta sử dụng **GitHub Gist**, tại sao không tận dụng luôn lịch sử commit phiên bản (version history) vốn là thế mạnh số một của anh em dev nhà mình nhỉ?

Trong `api.ts`, mình viết một hàm `fetchGistHistory` để lội ngược lại lịch sử của Gist qua endpoint `/gists/${gistId}/commits`, bốc ra 5 phiên bản gần đây nhất và tải dữ liệu tương ứng của chúng:

```typescript
// Lấy danh sách lịch sử sao lưu (5 bản ghi gần nhất) từ Gist commits
export async function fetchGistHistory(): Promise<HistoryItem[]> {
  const gistId = await getOrFindGistId();
  const commitsRaw = await githubRequest(`/gists/${gistId}/commits`);
  const commits = commitsSchema.parse(commitsRaw);

  // Lấy tối đa 5 bản ghi gần nhất
  const latestCommits = commits.slice(0, 5);

  const items = await Promise.all(
    latestCommits.map(async (commit) => {
      const detailRaw = await githubRequest(`/gists/${gistId}/${commit.version}`);
      // parse và tải nội dung save game lịch sử...
      return { version: commit.version, committedAt: commit.committed_at, saveData };
    })
  );
  return items;
}
```

Sau đó, trên giao diện Popup, mình dựng thêm tab **Lịch sử (History)** hiển thị chi tiết 5 mốc thời gian sao lưu gần đây nhất kèm theo nút **Khôi phục (Rollback)**. 

Bản chất đây là một "Cỗ máy thời gian" thực thụ! Bạn lỡ tay chơi lỗi? Chỉ cần bấm nhẹ một cái, game sẽ ngay lập tức được rollback về thời điểm cũ một cách mượt mà. Đẳng cấp kiểm soát phiên bản của lập trình viên được áp dụng thẳng vào trải nghiệm chơi game của game thủ là đây chứ đâu!

---

## 📖 Trung tâm Hướng dẫn (Guide) tích hợp xịn xò và trực quan

Hầu hết các extension nhỏ thường rất lười làm trang hướng dẫn sử dụng. Có chăng chỉ là quăng vài dòng text thô thiển không định dạng ngay trong khay popup chật chội. Người dùng (như vợ mình chẳng hạn) mở lên đọc là thấy lú cmnl.

Đã làm thì phải làm cho tới nơi tới chốn! Mình đã dựng hẳn một trang hướng dẫn sử dụng full-screen cực kỳ chuyên nghiệp và đẹp mắt bằng SolidJS (`Guide.tsx`):

* **Thiết kế Responsive Grid:** Chia Layout dạng Sidebar định tuyến mượt mà, tối ưu hóa cho cả màn hình PC lẫn các khung nhỏ trên trình duyệt.
* **Hỗ trợ đa ngôn ngữ (i18n):** Cho phép chuyển đổi nhanh chóng giữa **Tiếng Việt 🇻🇳** và **Tiếng Anh 🇬🇧** mượt mà, phản hồi ngay lập tức thông qua Reactive Store toàn cục.
* **Phân chia các tab thông tin khoa học:**
  - 📖 **Tổng quan (General):** Hướng dẫn cài đặt extension đã giải nén vào Chrome/Firefox.
  - 🔑 **GitHub Token (Token):** Hướng dẫn từng bước cách tạo Token trên GitHub kèm theo link cấu hình sẵn để người dùng click 1 cái là bay thẳng tới trang tạo Token với đầy đủ quyền hạn (gist scope) đã tích chọn.
  - ⚡ **Tính năng (Features):** Điểm mặt các món đồ chơi xịn xò của extension.
  - 💡 **Hỏi đáp (FAQ) & Bảo mật (Policy):** Giải đáp thắc mắc và khẳng định cam kết bảo mật 100% dữ liệu save game chỉ lưu trữ local.

---

## 📦 Hệ thống tự động tăng số phiên bản (Versioning) siêu thông minh

Khi đưa extension lên cửa hàng ứng dụng của Firefox (AMO), họ kiểm duyệt cực kỳ gắt gao các chuỗi số phiên bản trong `manifest.json`. Firefox không chấp nhận các số 0 đứng đầu ở Tháng và Ngày (ví dụ: phiên bản `2026.05.27` sẽ bị từ chối thẳng thừng).

Mình viết luôn một task nhỏ trong `deno.json` là `deno task bump-version` để tự động hóa khâu này:

```typescript
// Cơ chế tạo số phiên bản chuẩn hóa trong version.ts
// - Tự khởi tạo định dạng yyyy.m.d loại bỏ số 0 đi đầu (Ví dụ: 2026.5.27)
// - Hỗ trợ phát hành nhiều lần trong ngày bằng cách tự động tăng số revision ở phân đoạn thứ 4 (Ví dụ: 2026.5.27.1)
```

Nhờ vậy, mình có thể thoải mái build và test hàng chục lần một ngày mà không bao giờ sợ bị trùng số phiên bản hay lỗi kiểm duyệt.

---

## 🥵 Kể khổ: Tưởng "dễ ăn" mà bay màu ròng rã 2 tuần cày cuốc

Nhìn qua các tính năng của extension này, chắc hẳn nhiều anh em sẽ tặc lưỡi: *"Ối xời, có mỗi cái việc lưu JSON lên Gist, nhại phím tự nhặt đồ với cái popup nhỏ tí, chắc code nhoáng cái 1-2 buổi tối là xong chứ gì!"*

Thật ra lúc đầu mình cũng nghĩ thế. Nhưng đời không như là mơ, nhìn lại lịch sử Git mới thấy giật mình: từ commit đầu tiên khai sinh dự án ngày **12/05/2026** cho đến hôm nay là **27/05/2026**, ròng rã đúng **2 tuần trời (15 ngày)** cày cuốc không ngừng nghỉ (chủ yếu làm lúc buổi tối trước khi đi ngủ, tiện thể bật game lên chơi để test luôn :V)!

Để hoàn thành được chiếc extension "nhỏ bé" này, mình đã phải trả giá bằng cả đống neuron thần kinh vì những lý do củ chuối sau:

1. **Cơn ác mộng Zod Schema Validation:**
   Dữ liệu save game của PvZGE rất nhạy cảm. Để tránh việc đồng bộ làm hỏng save của người chơi, mình phải ngồi viết hàng tá schema phức tạp bằng Zod để kiểm tra tính toàn vẹn của dữ liệu cục bộ. Viết unit test chạy lồi cả mắt để đảm bảo dữ liệu save cũ và mới khớp cmn lệnh mới dám ghi đè vào `localStorage`.

2. **Cuộc chiến Cross-Browser (Chrome vs Firefox):**
   Extension chạy trên Chrome mượt mà bao nhiêu thì sang Firefox lại ăn cả rổ hành bấy nhiêu. Cơ chế xử lý script nền của Firefox bắt buộc phải cấu hình khác biệt hoàn toàn (chuyển đổi Service Worker sang Script nền truyền thống, cấp quyền cụ thể cho manifest). Việc tinh chỉnh file `build.ts` để nó tự động đóng gói ra cả 2 bản `chrome.zip` and `firefox.zip` chuẩn chỉ cũng ngốn của mình vài buổi tối mất ngủ.

Đúng là làm phần mềm cá nhân cho vui mà cũng cực dã man, cày cuốc và kiểm thử ròng rã nửa tháng trời mới tạm gọi là hòm hòm!

<div style="display: flex; flex-direction: column; align-items: center; gap: 32px; margin: 32px 0;">
  <div style="text-align: center; width: 100%;">
    <img src="/images/tu-lam-browser-extension-pvzge-sync/image-01.png" alt="Giao diện Popup đồng bộ Gist" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px; font-style: italic;">Giao diện Popup chính - Hỗ trợ đồng bộ hóa đám mây GitHub Gist.</p>
  </div>

  <div style="text-align: center; width: 100%;">
    <img src="/images/tu-lam-browser-extension-pvzge-sync/image-02.png" alt="Giao diện Cài đặt (Settings)" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px; font-style: italic;">Giao diện Cài đặt (Settings) - Tùy chỉnh tự động đồng bộ ngầm và bật/tắt Auto Collect.</p>
  </div>

  <div style="text-align: center; width: 100%;">
    <img src="/images/tu-lam-browser-extension-pvzge-sync/image-03.png" alt="Trang Hướng dẫn sử dụng tích hợp" style="width: 100%; border-radius: 12px; border: 1px solid var(--border-subtle); box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 8px; font-style: italic;">Trang tài liệu Hướng dẫn sử dụng chi tiết full-screen xây dựng bằng SolidJS.</p>
  </div>
</div>

---

## 🏁 Tổng kết

Sau vài buổi tối hì hục code, dự án nhỏ này hoạt động siêu ngon lành và ổn định. Bây giờ cày game ở công ty xong chỉ cần bấm một nút nhẹ nhàng lên mây, tối về nhà bật máy lên tải xuống là chiến tiếp mượt mà. 

Cái cảm giác tự làm được chiếc tool nhỏ giải quyết đúng "nỗi đau" thực tế của bản thân công nhận nó đã đời dã man anh em ạ. 

Đến đây cũng mỏi tay gõ phím cmnr. Thui lười quá chả viết nữa... Anh em nào cũng nghiện tựa game PvZGE này giống mình thì ghé qua [Repo GitHub](https://github.com/uongsuadaubung/pvzge-sync) lấy mã nguồn về nghịch thử, hoặc nếu xài Firefox thì bấm cài đặt trực tiếp trên [Firefox Add-on Store](https://addons.mozilla.org/en-US/firefox/addon/pvzge-sync/) luôn cho nóng nhé. 

*(P/s: Tại thời điểm viết bài này thì bản dành cho Microsoft Edge vẫn đang trong trạng thái xếp hàng chờ duyệt trên Edge Store nên chưa có link chính thức. Còn Chrome Web Store thì đăng ký tài khoản developer mất phí 5$ kích hoạt nên mình quyết định bỏ qua luôn cho nhẹ nợ, anh em dùng Chrome chịu khó tải file zip về rồi load unpacked dùng tạm nha 😂).*

Chúc anh em chơi game vui vẻ! 🚀
