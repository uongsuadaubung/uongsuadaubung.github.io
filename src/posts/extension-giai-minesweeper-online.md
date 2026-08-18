---
title: "Viết Extension giải Minesweeper.online: Từ bóc tách DOM, mô phỏng bàn cờ đến thuật toán Tank CSP & Bayes"
date: "2026-08-18"
tags: ["Game & Auto", "Tool & Projects"]
description: "Hành trình xây dựng Browser Extension tính toán và giải minesweeper.online: Bóc tách DOM động, trừu tượng hóa bàn cờ bằng Adapter, giải bài toán ràng buộc Tank CSP, tính xác suất Bayes và vẽ Heatmap thời gian thực."
published: true
---

Đã lâu lắm rồi mình không còn đụng vào mấy trò hack/cheat game nữa. Dạo gần đây rảnh rỗi ngồi bấm vài ván Dò Mìn (Minesweeper) giải trí, ai dè mò vào trang **[minesweeper.online](https://minesweeper.online)** chơi thử thì gặp mấy map rộng với những thế cờ hiểm hóc làm mình toát cả mồ hôi hột. Càng chơi càng cuốn mà thua liên tục thì cay cú không chịu nổi, thế là máu tò mò và cái tính "nghề cũ tái phát" lại trỗi dậy!

Nhớ lại hồi xưa (tận năm 2020), mình cũng từng có hai bài viết [Hack Minesweeper part 1](/blog/hack-minesweeper-part-1/) và [part 2](/blog/hack-minesweeper-part-2/) dùng Cheat Engine với C# `ReadProcessMemory` chọc thẳng vào RAM của game `Winmine.exe` trên Windows XP để đọc vị trí bom. Nhưng giờ game đã chuyển hẳn lên web với hệ thống xếp hạng rank và giải đấu toàn cầu, không còn môi trường RAM nguyên thủy để chọc nữa.

Và thế là bài toán lần này được nâng cấp lên một tầm cao mới: **Làm thế nào để xây dựng một Browser Extension tự động tính toán nước đi chuẩn xác theo thời gian thực?** Một công cụ có thể tự động bóc tách trạng thái bàn cờ từ DOM web, áp dụng các thuật toán giải logic & xác suất toán học thuần túy, rồi vẽ trực tiếp bản đồ nhiệt (Heatmap) lên giao diện game mà không làm giật lag một khung hình nào.

Hôm nay, hãy cùng mình bước vào hành trình "tái xuất giang hồ" này từ con số 0 nhé! 🚀

---

## 🔍 Chặng 1: Mổ xẻ cấu trúc DOM của minesweeper.online

Muốn can thiệp vào bất kỳ web game nào, vũ khí đầu tiên luôn là tổ hợp phím bất hủ: `F12` (Chrome DevTools).

Khác với các game vẽ trên HTML5 `<canvas>` (rất khó bóc tách tọa độ trừ khi hook thẳng vào hàm render WebGL/Canvas2D), trang **minesweeper.online** dựng toàn bộ bàn cờ bằng các thẻ HTML DOM thuần túy. Đây là một lợi thế cực lớn!

```html
<!-- Cấu trúc vùng bàn cờ tại minesweeper.online -->
<div id="AreaBlock" class="unselectable">
  <div id="cell_0_0" class="cell hdd_opened hdd_type1" data-x="0" data-y="0"></div>
  <div id="cell_1_0" class="cell hdd_closed" data-x="1" data-y="0"></div>
  <div id="cell_2_0" class="cell hdd_closed hdd_flag" data-x="2" data-y="0"></div>
  <!-- Hàng trăm ô cell khác... -->
</div>
```

### 1. Giải mã hệ thống CSS Class của từng ô cờ

Sau khi soi từng phần tử `.cell`, mình đúc kết được bảng quy tắc ánh xạ trạng thái cực kỳ mạch lạc:

- **Tọa độ ô:** Lưu sẵn trong thuộc tính `data-x` (cột) và `data-y` (dòng).
- **Trạng thái đóng/mở:**
  - `hdd_opened` hoặc `opened`: Ô đã được lật mở.
  - `hdd_closed` hoặc không có `hdd_opened`: Ô đang đóng (chưa mở).
  - `hdd_flag` hoặc `flag`: Ô đã được người chơi cắm cờ.
  - `hdd_mine` / `hdd_exploded`: Ô có mìn hoặc mìn phát nổ kết thúc ván.
- **Số mìn xung quanh:** Các class từ `hdd_type0` đến `hdd_type8`. Trong đó `hdd_type0` là ô trống (số 0), `hdd_type1` là số 1 (xanh lam), `hdd_type2` là số 2 (xanh lục),...

### 2. Đọc số mìn còn lại từ màn hình LED 7 đoạn

Trên đầu bàn cờ có một cụm đồng hồ LED hiển thị số mìn còn lại gồm 3 chữ số: hàng trăm (`#top_area_mines_100`), hàng chục (`#top_area_mines_10`) và hàng đơn vị (`#top_area_mines_1`). Mỗi thẻ mang class kiểu `hdd_top-area-num{0-9}`:

```typescript
private extractDigit(id: string): number {
  const el = document.getElementById(id);
  if (!el) return 0;
  const cls = el.className;
  for (let i = 0; i <= 9; i++) {
    if (cls.includes(`hdd_top-area-num${i}`) || cls.includes(`top-area-num${i}`)) {
      return i;
    }
  }
  return 0;
}
```

Nhờ đó, tổng số mìn chưa tìm ra sẽ là: `remainingMines = m100 * 100 + m10 * 10 + m1`.

---

## 🏗️ Chặng 2: Mô phỏng lại bàn cờ & Đồng bộ Real-Time không độ trễ

Sau khi bóc tách được các phần tử DOM, việc tiếp theo là mô phỏng lại toàn bộ trạng thái bàn cờ dưới dạng ma trận dữ liệu thuần túy `BoardState`. Nhờ đó, lõi thuật toán giải có thể tập trung xử lý logic độc lập trên dữ liệu ma trận mà không cần quan tâm đến các thẻ HTML:

```typescript
export interface CellData {
  row: number;
  col: number;
  isRevealed: boolean;
  isFlagged: boolean;
  isMine?: boolean;
  neighborMines: number; // 0 đến 8
  element: HTMLElement;
}

export interface BoardState {
  rows: number;
  cols: number;
  remainingMines: number;
  grid: CellData[][];
}
```

### Bài toán đồng bộ Real-Time 3 lớp (Multi-layer Real-Time Sync)

Một ván Dò Mìn tốc độ cao có thể có đến 5–10 cú click mỗi giây. Nếu dùng `setInterval` quét DOM liên tục thì cực kỳ tốn CPU và gây giật khung hình. Ngược lại, nếu chỉ dùng một cơ chế đơn lẻ thì rất dễ bị miss (bỏ lỡ) sự kiện.

Mình giải quyết triệt để bằng **hệ thống đồng bộ 3 tầng**:

```
┌─────────────────────────────────────────────────────────────┐
│               HỆ THỐNG ĐỒNG BỘ 3 TẦNG THỜI GIAN THỰC        │
├─────────────────────────────────────────────────────────────┤
│ 👁️ Tầng 1: MutationObserver (Lắng nghe thay đổi cây DOM)    │
│            -> Bắt các biến đổi cấu trúc bàn cờ từ game      │
│                                                             │
│ 🖱️ Tầng 2: Global Pointer Listeners (Bắt cú click chuột)     │
│            -> Debounce 30ms kích hoạt tính toán ngay lập tức │
│                                                             │
│ 💓 Tầng 3: State Hash Heartbeat (Nhịp tim băm trạng thái)   │
│            -> Băm "${total}_${revealed}_${flagged}" mỗi     │
│               350ms bắt trọn mọi biến động âm thầm          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Chặng 3: Thuật toán giải — Từ logic cơ bản đến Tank CSP & Bayes

Đây chính là phần cốt lõi của toàn bộ dự án! Làm sao để từ ma trận các con số, chương trình có thể suy luận ra đâu là ô an toàn 100%, đâu là mìn 100%, và khi gặp thế bí thì ô nào có xác suất sống sót cao nhất?

Thuật toán trong `src/solver.ts` được thiết kế theo 3 tầng từ nhanh đến sâu:

```
                  ┌───────────────────────────────┐
                  │ Bắt đầu: Trích xuất ràng buộc │
                  │  Constraint: remMines = N     │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
                  ┌───────────────────────────────┐
                  │ Tầng 1: Single-Cell Logic     │
                  │ rem == count -> 100% Mìn      │
                  │ rem == 0     -> 100% An Toàn  │
                  └───────────────┬───────────────┘
                                  │ (Lan truyền & thu hẹp)
                                  ▼
                  ┌───────────────────────────────┐
                  │ Tầng 2: Subset Reduction      │
                  │ (Khử tập con A ⊆ B)           │
                  │ Giải quyết 1-2-1, 1-2-2-1     │
                  └───────────────┬───────────────┘
                                  │
                       Vẫn còn ô chưa rõ?
                       /              \
                    [CÒN]            [HẾT] ──> Trả kết quả 100%
                      │
                      ▼
        ┌──────────────────────────────────────────┐
        │ Tầng 3: TANK CSP + BAYESIAN SOLVER       │
        │ - Chia thành các Connected Components    │
        │ - Backtracking đếm tổng số nghiệm hợp lệ │
        │ - Tính Heatmap % An Toàn & Vùng hoang vu │
        └──────────────────────────────────────────┘
```

![Gợi ý nước mở đầu tại ô trung tâm](/images/extension-giai-minesweeper-online/image-01.png)

*Khi vừa vào ván và chưa mở ô nào, thuật toán tự động gợi ý mở ô trung tâm để tạo lợi thế ban đầu.*

### 1. Trích xuất ràng buộc (Constraint Extraction)

Với mỗi ô đã mở có số lớn hơn 0 (ký hiệu là `V`), ta đếm số cờ đã cắm xung quanh (`F`) và tập hợp các ô chưa mở lân cận (`U`).  
Ràng buộc toán học rất trực quan:

```text
Tổng số mìn trong các ô chưa mở (U) = Số trên ô (V) - Số cờ đã cắm (F) = remainingMines
```

### 2. Tầng 1: Single-Cell Logic (Suy luận đơn ô)

- Nếu `remainingMines == số ô chưa mở`: Tất cả các ô xung quanh chắc chắn là **Mìn 100%**!
- Nếu `remainingMines == 0`: Tất cả các ô xung quanh chắc chắn là **An toàn 100%**!

Khi phát hiện mìn hoặc ô an toàn mới, ta lập tức lan truyền (propagate) kết quả này vào tất cả các ràng buộc khác và lặp lại vòng lặp.

### 3. Tầng 2: Khử tập con (Subset Reduction: A ⊆ B)

Trong game Dò Mìn, người chơi lâu năm thường nhớ các công thức mẫu như *"thế 1-2-1"*, *"thế 1-2-2-1"*, *"thế góc tường"*. Nhưng thay vì phải viết hàng chục hàm if-else hardcode từng trường hợp, toán học tập hợp cho phép ta giải quyết tổng quát bằng **Khử tập con**:

Cho hai ràng buộc `A` và `B`. Nếu tập ô chưa mở của `A` nằm trọn trong tập ô chưa mở của `B` (tập con `A ⊆ B`):
- Số mìn nằm trong phần chênh lệch `(B trừ A)` sẽ đúng bằng: `ΔMines = remainingMines(B) - remainingMines(A)`.
- **Nếu ΔMines == 0:** Toàn bộ các ô thuộc phần chênh lệch đều **An toàn 100%**!
- **Nếu ΔMines == số ô chênh lệch:** Toàn bộ các ô thuộc phần chênh lệch đều là **Mìn 100%**!

```typescript
// Trích đoạn thuật toán Subset Reduction trong solver.ts
if (cA.unknowns.length > 0 && cA.unknowns.length < cB.unknowns.length) {
  const isSubset = cA.unknowns.every(u => cB.unknowns.includes(u));
  if (isSubset) {
    const diffUnknowns = cB.unknowns.filter(u => !cA.unknowns.includes(u));
    const diffMines = cB.remainingMines - cA.remainingMines;

    if (diffMines === 0) {
      // Toàn bộ phần chênh lệch là ô an toàn!
      diffUnknowns.forEach(u => knownSafe.add(u));
      progress = true;
    } else if (diffMines === diffUnknowns.length) {
      // Toàn bộ phần chênh lệch là mìn!
      diffUnknowns.forEach(u => knownMines.add(u));
      progress = true;
    }
  }
}
```

Chỉ với vài dòng code đại số tập hợp thanh lịch này, mọi thế cờ 1-2-1 kinh điển hay các biến thể phức tạp trên cạnh tường đều được tự động phá giải trong nháy mắt!

### 4. Tầng 3: Tank CSP & Tổ hợp xác suất Bayes (Giải quyết thế bí 50/50)

Khi cả Single-Cell lẫn Subset Reduction không tìm thêm được nước đi chắc chắn 100% nào, ván đấu rơi vào trạng thái phải suy đoán xác suất.

Nếu chạy Backtracking vét cạn trên toàn bộ bàn cờ, độ phức tạp sẽ là `O(2^N)` với `N` là số ô chưa mở — một con số khổng lồ khiến trình duyệt đơ ngay lập tức. Để giải quyết, mình áp dụng kỹ thuật **Tank CSP Solver**:

#### Bước A: Phân rã đồ thị thành các cụm liên thông độc lập (Connected Components)
Hai ô biên chỉ phụ thuộc lẫn nhau nếu chúng cùng tham gia vào ít nhất một ràng buộc chung. Ta xây dựng một đồ thị vô hướng và dùng BFS/DFS để tách các biến biên (frontier) thành các cụm độc lập nhỏ hơn. Thay vì giải `2^30` trạng thái, ta chỉ cần giải vài cụm nhỏ `2^6`, `2^8` — tốc độ xử lý tăng gấp hàng nghìn lần!

#### Bước B: Quay lui (Backtracking) có cắt tỉa (Pruning)
Với mỗi cụm, ta duyệt gán thử từng ô nhận giá trị `0` (an toàn) hoặc `1` (mìn). Hàm `isPartialAssignmentValid` sẽ kiểm tra ngay lập tức: nếu số mìn đã gán vượt quá số mìn cho phép của bất kỳ ràng buộc nào, nhánh đó bị cắt tỉa (prune) lập tức mà không cần duyệt sâu thêm.

```typescript
// Kiểm tra tính hợp lệ từng phần để cắt tỉa nhánh quay lui
private static isPartialAssignmentValid(
  assignment: number[],
  maxAssignedIdx: number,
  compConstraints: { remainingMines: number; indices: number[] }[]
): boolean {
  for (const c of compConstraints) {
    let assignedMines = 0;
    let unassignedCount = 0;

    for (const idx of c.indices) {
      if (idx <= maxAssignedIdx) {
        if (assignment[idx] === 1) assignedMines++;
      } else {
        unassignedCount++;
      }
    }

    // Cắt tỉa nếu đã thừa mìn hoặc dù gán hết ô còn lại vẫn thiếu mìn
    if (assignedMines > c.remainingMines) return false;
    if (assignedMines + unassignedCount < c.remainingMines) return false;
  }
  return true;
}
```

#### Bước C: Tính xác suất an toàn Bayes & Vùng hoang vu (Wilderness)
Sau khi tìm được `T` nghiệm hợp lệ cho một cụm, nếu ô thứ `i` có mặt trong `M_i` nghiệm chứa mìn, thì tỉ lệ an toàn của ô đó được tính:

```text
Tỉ lệ An Toàn = 1 - (Số nghiệm chứa mìn / Tổng số nghiệm hợp lệ)
```

Đối với những ô nằm sâu phía ngoài vùng hoang vu (Wilderness - các ô ẩn chưa tiếp giáp với bất kỳ ô số nào), ta ước lượng số mìn còn lại sau khi trừ đi lượng mìn kỳ vọng ở các vùng biên:

```text
Mìn còn lại ngoài biên = max(0, Tổng mìn game - Tổng mìn kỳ vọng ở các biên)
Tỉ lệ An Toàn ngoài biên = 1 - (Mìn còn lại ngoài biên / Tổng số ô hoang vu)
```

Nhờ vậy, khi gặp tình huống bế tắc bắt buộc phải đoán, thuật toán sẽ chỉ ra ngay ô có tỉ lệ an toàn cao nhất (ví dụ: **87.5% an toàn** thay vì đâm đầu vào ô 50% mìn)!

---

## 🎨 Chặng 4: Vẽ lại bản đồ & Phủ Overlay trực quan lên Game

Có dữ liệu xác suất chuẩn xác trong tay rồi, bước cuối cùng là hiển thị trực quan nó lên trên bàn cờ của người chơi.

```
┌─────────────────────────────────────────────────────────────┐
│ 🟩 100% (Xanh lục đậm)  : Ô AN TOÀN TUYỆT ĐỐI (Click ngay!) │
│ 🟥 💣   (Đỏ thẫm)       : Ô CHẮC CHẮN LÀ MÌN (Cắm cờ!)      │
│ 🟦 85%  (Xanh lam)      : Tỉ lệ an toàn rất cao (>= 75%)    │
│ 🟨 60%  (Hổ phách)      : Tỉ lệ an toàn trung bình (50-74%) │
│ 🟧 25%  (Đỏ cảnh báo)   : Nguy hiểm cao (< 50%)             │
└─────────────────────────────────────────────────────────────┘
```

![Bản đồ nhiệt Heatmap hiển thị xác suất các ô](/images/extension-giai-minesweeper-online/image-02.png)

*Sau nước mở đầu: Bàn cờ lập tức được phủ Heatmap — ô 100% an toàn (xanh lục), ô chắc chắn là mìn (đỏ có icon 💣) và các ô vùng hoang vu (xanh lam 84%).*

### 1. Tối ưu hiệu năng DOM Reconciliation

Bàn cờ chế độ Expert có 480 ô, còn map Custom có thể lên đến hàng nghìn ô. Nếu mỗi lần người chơi bấm một nước mà extension lại xóa sạch DOM rồi tạo lại hàng nghìn phần tử `div`, trang web chắc chắn sẽ giật lag.

Giải pháp là **tái sử dụng (Reconciliation)**:
1. Duy trì các thẻ nhãn xác suất (badge) có sẵn trong từng ô.
2. Dùng một `Set<Element>` đánh dấu các badge còn hiệu lực trong lượt tính toán hiện tại.
3. Chỉ cập nhật lại nội dung text và màu nền nếu ô đó vẫn chưa mở.
4. Xóa những badge của những ô vừa được lật mở.

```typescript
private renderHeatmapBadges(board: BoardState, probabilityMap: Map<string, number>) {
  const currentValidBadges = new Set<Element>();

  probabilityMap.forEach((safeProb, key) => {
    const [r, c] = key.split(',').map(Number);
    const cell = board.grid[r]?.[c];
    if (cell && !cell.isRevealed && !cell.isFlagged && cell.element) {
      let badge = cell.element.firstElementChild as HTMLElement;
      if (!badge) {
        badge = document.createElement('div');
        cell.element.style.position = 'relative';
        cell.element.appendChild(badge);
      }

      const percent = Math.round(safeProb * 100);
      badge.textContent = safeProb <= 0.0001 ? '💣' : `${percent}%`;

      currentValidBadges.add(badge);
    }
  });

  // Dọn dẹp những badge không còn hợp lệ
  // ...
}
```

![Quá trình suy luận và giải thế cờ lan truyền](/images/extension-giai-minesweeper-online/image-03.png)

*Quá trình suy luận liên hoàn: Vừa mở ô an toàn vừa tự động định vị toàn bộ mìn xung quanh theo thời gian thực.*

### 2. Bí thuật CSS: `pointer-events: none`

Một chi tiết kỹ thuật tưởng chừng nhỏ nhưng cực kỳ quan trọng: khi ta đè một lớp badge lên trên thẻ `.cell` của game, mặc định thẻ badge này sẽ "chặn" luôn cú click chuột của người dùng khiến bạn không bấm vào ô cờ được nữa!

Chỉ cần một dòng CSS định mệnh:

```css
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
pointer-events: none !important; /* Xuyên thấu toàn bộ sự kiện chuột! */
z-index: 1000 !important;
```

Thuộc tính `pointer-events: none` làm cho toàn bộ lớp phủ trở nên "vô hình" trước con trỏ chuột. Mọi thao tác click trái, click phải của bạn đều xuyên thẳng xuống phần tử gốc của game một cách mượt mà không tì vết.

---

## ⚡ Chặng 5: Đóng gói Extension với SolidJS & Bun

Để hoàn thiện sản phẩm, mình dựng thêm giao diện Popup điều khiển theo phong cách Retro Windows cổ điển bằng **SolidJS** siêu nhẹ kết hợp **Bun** và **esbuild**:

![Giao diện Popup điều khiển Minesweeper Solver](/images/extension-giai-minesweeper-online/image-04.png)

*Giao diện Popup điều khiển: Hiển thị trạng thái kết nối bàn cờ, nút bấm gợi ý nước đi và bật/tắt bản đồ nhiệt.*

- Bật/tắt hiển thị Heatmap tức thì.
- Nút bấm "Gợi Ý Nước Đi Tiếp Theo" (Trigger Hint) để highlight ngay ô nên đi.
- Hiển thị thông số kết nối trạng thái bàn cờ theo thời gian thực.

Toàn bộ quá trình build từ TypeScript, Sass sang bundle cho cả Chrome (Manifest v3) và Firefox diễn ra trong chưa đầy **50 milisecond** với Bun!

---

## 🎮 Chặng 6: Demo thực chiến — So sánh trước và sau khi giải

Dưới đây là màn so sánh thực tế giữa bàn cờ gốc và bàn cờ sau khi Extension phân tích qua các giai đoạn của ván đấu:

### 1. Tình huống Khử tập con (Subset Reduction)

| Trước khi phân tích (Thế cờ gốc) | Sau khi Extension phân tích |
| :---: | :---: |
| ![Thế cờ gốc trước khi khử tập con](/images/extension-giai-minesweeper-online/subset-before.png) | ![Extension phân tích khử tập con xác định mìn và ô an toàn](/images/extension-giai-minesweeper-online/subset-after.png) |

*So sánh trước và sau khi áp dụng Khử tập con: Tự động phát hiện 2 mìn 💣 (đỏ), 2 ô an toàn 100% (xanh lục) và các xác suất biên (59%, 75%).*

### 2. Tình huống giải tỏa cụm biên phức tạp (Tank CSP & Bayes)

| Trước khi phân tích (Cụm biên phức tạp) | Sau khi Extension giải Tank CSP & Bayes |
| :---: | :---: |
| ![Cụm biên phức tạp trước khi giải Tank CSP](/images/extension-giai-minesweeper-online/csp-before.png) | ![Extension giải tỏa cụm phức tạp bằng Tank CSP và tính xác suất Bayes](/images/extension-giai-minesweeper-online/csp-after.png) |

*So sánh trước và sau khi giải Tank CSP & Bayes: Toàn bộ cụm biên phức tạp được phân tích đồng thời, chỉ rõ các vị trí mìn 💣 và tính toán xác suất an toàn chuẩn xác từng ô.*

### 3. Tình huống hoàn tất ván đấu (Endgame trên bàn cờ lớn)

| Trước khi phân tích (Thế cờ Endgame) | Sau khi Extension giải quyết toàn bộ bàn cờ |
| :---: | :---: |
| ![Thế cờ bàn cờ lớn trước khi giải Endgame](/images/extension-giai-minesweeper-online/endgame-before.png) | ![Extension định vị toàn bộ mìn và ô an toàn giai đoạn Endgame](/images/extension-giai-minesweeper-online/endgame-after.png) |

*So sánh trước và sau ở giai đoạn Endgame: Toàn bộ mìn 💣 được khóa chặt và hàng ô an toàn 100% cuối cùng lộ diện giúp hoàn thành ván đấu trọn vẹn.*

---

## ☕ Lời kết

Hy vọng câu chuyện chia sẻ về hành trình "tái xuất giang hồ" này sẽ mang lại cho anh em chút cảm hứng để xây dựng những công cụ hay ho cho riêng mình. Hẹn gặp lại anh em ở những bài viết tiếp theo! 🚀
