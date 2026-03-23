---
title: "Hôm nay ăn gì: Ứng dụng dẹp bỏ cơn đau đầu mỗi tối"
date: "2026-03-13"
tags: ["Lập Trình", "Tool & Extension", "Trải Nghiệm"]
description: "Phát triển app Random món ăn để trị bệnh lười suy nghĩ bữa tối. Tưởng dễ mà cũng phải vận nội công xử lý đủ thứ từ logic vòng quay đến lỗi CORS."
published: true
---

# Hôm nay ăn gì: Ứng dụng dẹp bỏ cơn đau đầu mỗi tối

Không biết các bạn thế nào, chứ mình thấy cứ tầm 5 - 6 giờ chiều là y như rằng có một câu hỏi kinh điển vang lên: "Tối nay ăn gì?". Cứ nghĩ mãi, list đi list lại quanh quẩn cũng chỉ có luộc, kho, chiên... nghĩ thôi cũng thấy mệt. Đỉnh điểm là có những hôm đói meo nhưng hai anh em cứ ngồi nhìn nhau đùn đẩy vì lười suy nghĩ.

Thế là quyết định xắn tay áo hý hửng viết một chiếc app nhỏ bằng Svelte kết hợp Tauri để quay ngẫu nhiên trực tiếp trên màn hình máy tính cho tiết kiệm thời gian. Tưởng làm cái vòng quay cho vui là dễ, ai ngờ đâm đầu vào mới thấy phát sinh một mớ vấn đề... 

![Màn hình chính của ứng dụng](/images/hom-nay-an-gi/man-hinh-chinh.png)
*Giao diện màn hình chính của ứng dụng với chiếc vòng quay định mệnh.*

## 1. Nỗi đau nạp Dữ liệu & Sự cố CORS

Tiêu chí ban đầu là ứng dụng phải thực dụng, món ăn phải có Món chính và Món rau. Nếu chỉ code cứng (hard-code) vài món vào file thì quá chán, nên mình mở ChatGPT lên, nhờ AI xuất ngay một danh sách 50 món Việt Nam kèm công thức nấu, rồi chép vào thẳng Google Sheet (Excel). Mình định dùng trang Sheet đó làm cơ sở dữ liệu luôn.

Nhưng cuộc đời không như mơ, ngay bước đầu gọi lệnh `fetch()` để kéo data từ Google Sheet về, trình duyệt ném thẳng vào mặt mình một dòng text đỏ rực: `CORS Policy Error`. Ngồi debug lú luôn mất cả buổi chiều để tìm cách xử lý header, nhưng Google Sheet không hỗ trợ mở CORS dễ dàng như API thông thường.

Cuối cùng, mình nhớ ra một mẹo cổ đại từ thời các tiền bối đi trước: xử lý qua cơ chế **JSONP**. Ý tưởng là chèn một thẻ `<script>` vào DOM để trình duyệt tự tải dữ liệu thay vì dùng hàm fetch, như sau:

```typescript
// Hàm fetch danh sách món ăn + cách nấu qua JSONP để vượt mức rào CORS
export function fetchMenuFromGoogleSheet(scriptUrl: string): Promise<{mains: FoodItem[], vegs: FoodItem[]}> {
  return new Promise((resolve, reject) => {
    // Tạo 1 tên hàm callback ngẫu nhiên để tránh đụng độ
    const callbackName = 'jsonpCallback_' + Math.round(100000 * Math.random());
    const script = document.createElement('script');

    // Chờ Google Sheet gọi ngược lại hàm này
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName]; // Chạy xong thì xóa luôn cho gọn
      document.body.removeChild(script);

      try {
        const recipesMap: Record<string, Recipe[]> = data.recipes || {};
        
        // Nhào nặn dữ liệu ra mảng món chính
        const mains: FoodItem[] = (data.mains || []).map((item: any, idx: number) => ({
          id: idx + 1,
          name: item.name,
          color: item.color,
          recipes: recipesMap[item.name] || undefined,
        }));
        
        resolve({ mains, vegs: [] /* code rút gọn */ });
      } catch (err) {
        reject(err);
      }
    };

    // Nối tham số callback vào link Script và thả vào body
    const urlWithParams = `${scriptUrl}?callback=${callbackName}`;
    script.src = urlWithParams;
    document.body.appendChild(script);
  });
}
```

Cách này nhìn có vẻ đi đường vòng nhưng nó xử lý dứt điểm luôn bài toán lấy dữ liệu mà không cần phải cài web server trung gian phức tạp.

## 2. Bài toán thiết kế vòng quay (Lucky Wheel)

Data đã có, giờ đến khâu làm cái vòng quay. Mình thiết kế giao diện bằng Svelte. Lúc đầu mình định chia vòng quay theo đúng số lượng món ăn, nhưng nếu có 50 món thì mỗi ô trên vòng quay trông như que tăm, rất xấu. Thế là mình thống nhất chỉ hiển thị 10 ô cố định (vẽ bằng CSS `conic-gradient`), điền chữ `?` bí ẩn vào vòng quay. Quay xong mới bốc thăm món.

Và đây là đoạn nhức não nhất: Tính góc xoay (`rotation`). Để vòng quay chạy trơn tru, mình phải kết hợp một chút toán học vào hàm Svelte state.

```html
<script lang="ts">
  const WHEEL_SLICES = 10;
  const sliceAngle = 360 / WHEEL_SLICES;
  
  // Trạng thái Reactive của Svelte
  let isSpinning = $state(false);
  let rotation = $state(0);
  
  // Áp dụng CSS transition dài 8s để vòng quay chậm dần
  let wheelStyles = $derived(
    `transform: rotate(${rotation}deg); transition: transform ${isSpinning ? '8s cubic-bezier(0.2, 0.8, 0.2, 1)' : '0s'};`
  );

  function spin() {
    if (isSpinning) return;
    isSpinning = true;

    // Tính toán góc quay cộng dồn
    const extraSpins = 8 + Math.floor(Math.random() * 5); // quay 8 - 12 vòng
    const targetSlice = Math.floor(Math.random() * WHEEL_SLICES);
    const targetAngle = targetSlice * sliceAngle + sliceAngle / 2;
    
    // reset offset và cộng thêm góc để bánh xe quay tự nhiên nhất
    const baseRotation = rotation % 360;
    const spinsNeeded  = 360 * extraSpins;
    const offset       = 360 - targetAngle;

    rotation = rotation - baseRotation + spinsNeeded + offset;

    // Chờ 8.1 giây cho animation CSS kết thúc rồi mới xổ kết quả
    setTimeout(() => {
      isSpinning = false;
      const mains = $mainMenu;
      // Bốc đại 1 món từ kho lưu trữ Google Sheet
      const pickedMain = mains[Math.floor(Math.random() * mains.length)];
      
      selectedMain.set(pickedMain);
      appState.set('result');
    }, 8100);
  }
</script>

<!-- Giao diện vòng quay -->
<div class="relative w-[300px] h-[300px] rounded-full overflow-hidden" style={wheelStyles}>
    <!-- Các thẻ chia ô gradient... -->
</div>
<button onclick={spin} disabled={isSpinning}>QUAY</button>
```

Khúc đau đầu nhất là tìm được đường cong `cubic-bezier(0.2, 0.8, 0.2, 1)`. Chỉnh đi chỉnh lại bao nhiêu lần thì nó mới có cảm giác "quay nhanh dần đều rồi nảy thắng từ từ vắt ngang qua mốc" giống hệt vòng quay chiếc nón kỳ diệu hồi xưa. Quả thực gõ code thì ít mà ngồi tinh chỉnh giao diện mất thời gian dã man.

## 3. Tổng kết

Mất đâu đó vài buổi tối hì hục, ứng dụng cũng gói gọn thành file chạy trên Desktop. Giờ cứ chiều đến trước lúc về, anh em lại bật app lên quay xạch xạch xem tối nay về phải đi ăn món gì. Ấn vào kết quả nó còn hiển thị thêm "Cách nấu: Xào tỏi / Nướng than" từ data AI cung cấp khá là trực quan. 

![Chốt đơn bữa tối](/images/hom-nay-an-gi/chon-xong-mon.png)
*Quay xong là ứng dụng tự động hiển thị món ăn (cả món mặn lẫn rau) may mắn của ngày.*

![Xem công thức nấu ăn](/images/hom-nay-an-gi/xem-cong-thuc-nau.png)
*Bấm vào kết quả để xem ngay công thức do AI hướng dẫn.*

Thấy làm mấy cái phần mềm cá nhân nhỏ nhỏ dọn gọn gàng nhu cầu thế này công nhận giúp ích được rất nhiều. Bạn nào cũng lười vắt óc suy luận giống mình, có hứng thì ghé qua repo Github lấy mã nguồn về trổ tài thử nhé. Hẹn mọi người ở một dự án tự build khác!
