---
title: "Tự viết Chrome Extension dọn dẹp Newsfeed Facebook"
date: "2021-10-23"
tags: ["Lập Trình", "Tool & Extension", "Trải Nghiệm"]
description: "Chán cảnh mở Facebook lên toàn rác, gợi ý linh tinh với quảng cáo, mình quyết định tự code một chiếc extension để dọn dẹp, nhưng thực tế gian truân hơn mình tưởng nhiều."
published: true
---

# Tự viết Chrome Extension dọn dẹp Newsfeed Facebook

Những năm gần đây mình bắt đầu có một nỗi sợ nhè nhẹ mỗi khi gõ vòng vòng trên thanh địa chỉ chữ `facebook.com`. Mở màn hình lên, thay vì được xem cập nhật của bạn bè người thân, đập vào mặt mình chỉ rặt một mớ "Gợi ý cho bạn", "Sponsor", rồi thì ba cái Reels xàm xí từ những trang không quen biết. 

Rõ ràng thuật toán của Facebook ngày càng giống một cái máy nhồi nhét nội dung thập cẩm, còn mình thì chỉ muốn một không gian mạng mộc mạc và sạch sẽ. Cơn giận tích tụ làm mình lóe lên ý tưởng: "Tại sao không tự viết một cái Chrome Extension thu dọn đống rác này?". Hý hửng mở IDE lên, cứ đinh ninh chỉ cần vài dòng Regex là nhẹ gánh, ai ngờ đâu Facebook lại chuẩn bị sẵn đủ thứ oái oăm để hành hạ mấy gã táy máy biểu thức DOM như mình.

## 1. Hành trình đi dọn rác cơ bản

Khảo sát nhanh bộ mặt DOM của Facebook, mình phát hiện mọi thứ được render bằng React, và các bài đăng trên Newsfeed đều để lại dấu vết ở thuộc tính `data-pagelet^="FeedUnit_"`. Tư duy ban đầu rất đơn giản, mình lập một danh sách các từ khóa ám tiễn:

```javascript
let stringAds = [
    "Post you may like",
    "Suggested for you",
    "Sponsored",
    "Videos just for you",
    "People You May Know",
    "Gợi ý cho bạn"
]
```

Xong chỉ việc vác vòng lặp đi tìm các phần tử, chém sạch những thằng nào chứa từ khóa. Để tối ưu tài nguyên rà quét, mình khéo léo gắn thêm một class `done` để đánh dấu những phần tử đã duyệt qua.

```javascript
let notScanned = document.querySelectorAll('div:not(.done)[data-pagelet^="FeedUnit_"]');
for (const ele of notScanned) {
    ele.classList.add("done");
    if (stringAds.some(ads => ele.innerText.includes(ads))){
        ele.remove() // Tiễn vong
        console.log("Đã xoá quảng cáo: ", ele.innerText.slice(0, 20))
    }
}
```

Mọi thứ có vẻ rất hoàn hảo vào lúc ban đầu, cho đến khi mình lướt qua thẻ Watch...

## 2. Nỗi ám ảnh trùng lặp Video và Hàm băm cyrb53

Mạng xã hội hiển thị cơ chế nhồi nhét bài viết quá tàn nhẫn, khi mình cuộn chuột trong phần `/watch`, thuật toán liên tục tải lại các đoạn video mình vừa mới lướt qua không lâu trước đó. Cảm giác vô cùng ức chế vì nội dung nghèo nàn.

Để giải quyết, mình phải đi sâu vào nội dung của từng cấu trúc Video card (`div.j83agx80.cbu4d94t`). Bài toán đặt ra là: Làm sao để máy tính nhận diện được đâu là video đã xem rồi mà không làm đơ trình duyệt?

Ngồi debug mờ cả mắt, cuối cùng mình quyết định sử dụng giải pháp băm chuỗi nội dung văn bản (Hash) của từng post thành một con số duy nhất, bằng giải thuật băm **cyrb53** trứ danh.

```javascript
// Hàm băm nội dung để tạo con dấu riêng biệt cho mỗi bài đăng
function cyrb53 (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

// Bên trong vòng quét
let split = ele.innerText.split('\n');
// Chỉ lấy phần chữ làm dữ kiện để tạo hash
let hash = cyrb53(split.slice(0, split.length - 10).join());

if (!loadedPost.includes(hash)) {
    loadedPost.push(hash);
} else {
    // Tìm thấy mã băm trùng lặp, tự động gỡ bài đăng
    ele.remove();
}
```

Trải nghiệm quả thực cực kỳ lôi cuốn! Trình duyệt giờ mượt mà lọc từng mã bài trùng lặp bay màu trong tích tắc.

## 3. Khắc tinh Single Page Application (SPA): Cuộc chiến giành bảo mật Chat

Một trong những động lực viết Extension của mình là có tính năng ngụy trang danh sách tên liên hệ ở thanh cột phải `RightRail`. Nhiều khi đi làm, mình ghét cảm giác ai đó đi qua ngước thẳng vào nhìn xem mình đang nhắn tin với ai. Ý tưởng ban đầu chỉ là cắt vụn dãy tên đó, rồi hoán đổi vị trí đảo lộn (random) để nguỵ trang, nghe rất xịn xò:

```javascript
function encryptName(name) {
    return name.split('').sort(() => 0.5 - Math.random()).join('');
}
```

Mình hý hửng chèn trực tiếp dòng đó để thay tên người liên hệ, ấn Save, Reload web. Mọi tên đều được đảo lộn. Tưởng thế là đã thành công mỹ mãn... 

Nhưng cuộc đời không tha cho dân coder. Sau nháy mắt có người mới online, React phía nền móng của Facebook quét luồng Re-render (tải lại dữ liệu DOM không qua làm mới trang). Tất cả các tên bị đảo lộn mà mình khổ nhọc tạo ra tự nhiên bật thẳng về trạng thái tên tĩnh gốc ban đầu. Facebook React đã nghiền nát luồng ép tên ảo của mình! Mình gục ngã hoàn toàn với mớ hỗn độn này khi cố gắng lắng nghe bắt sự kiện biến thiên (Mutation Observer) mà vẫn chậm hơn tốc độ Virtual DOM của họ.

Cuối cùng, sau những giờ phút bế tắc đỏ cả màn Console, mình đành áp dụng giải pháp "trâu cày" nhất nhưng hiệu quả nhất: **Lên lịch ép ngược thời gian siêu nhạy**. Mình tạo một hàm setInterval đếm 1ms để đè lập tức lại tên đã mã hoá, liên tục ép chết hiển thị:

```javascript
nodeDiv.backupName ??= name.innerText
nodeDiv.encrypt ??= encryptName(nodeDiv.backupName)

name.innerText = nodeDiv.encrypt // đổi ngay thành tên lạ

// Đoạn code vật lộn đẻ ra setInterval rào dữ liệu SPA
let ms = 1; 
name.clearcheck ??= setInterval(repeatcheck, ms);
let time = 0;

function repeatcheck() {
    if (name.innerText !== nodeDiv.encrypt) {
        // Hễ React có nỗ lực đổi về chữ cũ, mình đập lại tên mã hoá
        name.innerText = nodeDiv.encrypt;
        clearInterval(name.clearcheck); // giải phóng tiến trình
        
        time += ms;
        // Chạy tối đa maxInterval rồi nghỉ để tránh treo Browser
        if (time > maxInterval) {
            clearInterval(name.clearcheck);
        }
    }
}
```

Ngoài ra mình còn cạp thêm 2 EventListener lắng nghe `mouseover` và `mouseout` để trả về tên thật mỗi lúc mình chủ động trỏ chuột vào dòng liên hệ ấy.

## 4. Tổng Kết

Được tận mắt quan sát thành quả: một chiếc màn hình sạch sẽ, không quảng cáo, mất biệt luôn Video trùng lặp và tên chat loạn cào cào mã hóa, đây cảm giác thoả mãn cực độ. Nhưng đổi lại là bao nhiêu phen trầm ngâm, bế tắc debug các dòng biến số, rồi mới thấu hiểu sự chặt chẽ khó lường của hệ thống Single Page Applications hiện đại.

Mảnh ghép kỹ năng học được qua trải nghiệm đổ mồ hôi này chắc chắn xứng đáng hơn nhiều việc đọc sách. Bạn nào đang tìm kiếm giải pháp cho đôi mắt và muốn vọc vạch sâu hơn tư duy phân tích DOM, mời tạc sang kho github của mình tại repo `facebook-ext` kéo về dùng và tự nghịch thiết lập nhé. Hẹn chia sẻ ở bài viết tốn calo khác!
