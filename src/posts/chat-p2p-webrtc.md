---
title: "Làm cái app chat P2P với WebRTC và Svelte 5"
date: "2026-04-18"
tags: ["WebRTC", "Svelte 5", "P2P", "Chat"]
description: "Chia sẻ về cách mình làm một cái app chat trực tiếp giữa hai trình duyệt, không cần server lưu tin nhắn, dùng Svelte 5 cho mượt."
published: true
---

![App Chat P2P](/images/chat-p2p/hero.png)

Chào mọi người, dạo này mình có ngồi vọc làm một cái app chat P2P (kiểu chat trực tiếp giữa 2 máy với nhau mà không qua server trung gian). Ý tưởng là để tin nhắn riêng tư hơn, không ai đọc trộm được vì nó chẳng lưu ở đâu ngoài máy mình và máy người kia. 

Tiện thể mình dùng luôn Svelte 5 xem nó có gì hay ho. Sau đây là mấy cái mình thấy đáng chú ý trong lúc làm.

### 1. Gửi tin nhắn sao cho không bị lỗi (Atomic Transactions)

Trong môi trường chat trực tiếp (WebRTC), mạng đôi khi nó chập chờn. Nếu bạn đang sửa tin nhắn hay thả icon mà mạng rớt phát là coi như máy mình một kiểu, máy kia một kiểu.

Để giải quyết, mình làm một cái bộ quản lý hành động. Khi bạn bấm nút:
1.  Máy sẽ lưu lại trạng thái cũ.
2.  Hiện kết quả lên màn hình luôn cho nhanh (Optimistic).
3.  Lưu vào một cái "hàng chờ" ở máy mình (IndexedDB).
4.  Gửi đi. Nếu gửi lỗi, nó sẽ tự động trả lại trạng thái cũ và đợi lúc nào có mạng thì tự gửi lại sau.

```typescript
// Ví dụ đoạn code xử lý trả lại trạng thái cũ nếu lỗi
private rollbackUIState(action: AtomicAction, originalState: OriginalState): void {
    const m = ctx.messages;
    const roomMsgs = m[action.roomId] || [];
    const idx = roomMsgs.findIndex((m) => m.id === action.messageId);

    if (idx === -1) return;

    const updated = [...roomMsgs];
    // Trả lại nội dung cũ nếu không gửi được
    switch (action.type) {
        case 'edit':
            updated[idx] = { ...updated[idx], text: (originalState as any).text };
            break;
    }
    ctx.messages = { ...m, [action.roomId]: updated };
}
```

### 2. Gửi file lớn mà không bị đứng máy

Gửi file qua WebRTC nếu cứ tống cả cục vào là trình duyệt nó đơ luôn. Mình phải chia nhỏ file ra từng mẩu (chunk) tầm 16KB hay 32KB gì đó rồi gửi dần.

Cái khó là phải biết lúc nào thì nên gửi tiếp, lúc nào nên dừng lại chờ bên kia nhận xong (Backpressure). Mình dùng cái hàm `onbufferedamountlow` của trình duyệt. Đại loại là khi nào bộ đệm của trình duyệt nó vơi đi thì mình mới nhồi thêm mẩu tiếp theo vào. 

```typescript
// Chờ cho bộ đệm vơi bớt rồi mới gửi tiếp
export function waitForBufferDrain(targetPeers: Set<string>): Promise<void> {
  return new Promise((resolve) => {
    ch.onbufferedamountlow = () => {
      ch.onbufferedamountlow = null;
      resolve();
    };
    // Đợi tối đa 0.5s nếu không thấy báo gì thì cũng cứ chạy tiếp
    setTimeout(resolve, 500);
  });
}
```

### 3. Svelte 5 dùng khá là sướng

Svelte 5 có mấy cái "Rune" mới như `$state` giúp quản lý dữ liệu rất nhàn. Mình tạo một cái file chứa toàn bộ dữ liệu chung của app, chỗ nào cần thì gọi ra dùng, dữ liệu thay đổi là giao diện tự cập nhật theo, không cần phải dùng mấy cái Store loằng ngoằng như bản cũ.

### 4. Nhấn F5 vẫn không mất tin nhắn

Vì không có server lưu tin nhắn nên mình dùng luôn cái database trong trình duyệt (IndexedDB) để lưu lịch sử. 
*   Mỗi lần có tin nhắn mới là mình lưu vào máy luôn.
*   Khi bạn nhấn F5 hoặc load lại trang, app sẽ đọc từ máy ra hiển thị lại.
*   Khi kết nối lại với bạn bè, hai bên sẽ hỏi nhau: "Ông có thiếu tin nhắn nào không?" để gửi bù cho nhau.

### 5. Một vài cái râu ria khác

Mình cũng làm thêm mấy cái hiệu ứng trong suốt (Glassmorphism) nhìn cho nó hiện đại tí, rồi cả gọi video, chia sẻ màn hình nữa. Nói chung là làm cái này học được khá nhiều về cách mạng hoạt động.

### 6. Demo giao diện

Đây là giao diện thực tế của app khi chạy:

![Demo app chat](/images/chat-p2p/demo.png)

### Trải nghiệm thử

Các bạn có thể vào đây để nghịch thử nhé: [https://uongsuadaubung.github.io/chat/](https://uongsuadaubung.github.io/chat/)

Cảm ơn các bạn đã đọc bài chia sẻ ngắn gọn này của mình!
