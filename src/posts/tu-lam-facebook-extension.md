---
title: "Viết Chrome Extension dọn dẹp Newsfeed Facebook"
date: "2021-10-23"
tags: ["Lập Trình", "Tool & Extension", "Trải Nghiệm"]
description: "Chán cảnh mở Facebook lên toàn tin gợi ý và quảng cáo, mình quyết định tự viết một chiếc extension để dọn dẹp và tối ưu hóa không gian hiển thị."
published: true
---

# Viết Chrome Extension dọn dẹp Newsfeed Facebook

Những năm gần đây mình bắt đầu cảm thấy hơi phiền mỗi khi truy cập `facebook.com`. Mở màn hình lên, thay vì được xem cập nhật của bạn bè người thân, giao diện hiển thị khá nhiều phần "Gợi ý cho bạn", "Sponsor", rồi cả các đoạn Reels từ những trang không theo dõi.

Để giải quyết sự bất tiện này, mình quyết định viết một cái Chrome Extension nhằm lọc bớt các nội dung thừa cho sạch sẽ. Ban đầu cứ nghĩ chỉ cần vài dòng regex là xong, ai ngờ thực tế DOM của Facebook lại phức tạp hơn nhiều.

## 1. Lọc các nội dung quảng cáo cơ bản

Khảo sát nhanh cấu trúc DOM của Facebook, mình phát hiện mọi thứ được render bằng React, và các bài đăng trên Newsfeed đều có thuộc tính `data-pagelet^="FeedUnit_"`. Tư duy ban đầu rất đơn giản, mình lập một danh sách các từ khóa cần lọc:

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

Xong chỉ việc chạy vòng lặp tìm các phần tử chứa từ khóa và ẩn đi. Để tránh quét lại các phần tử đã xử lý, mình gắn thêm một class `done`:

```javascript
let notScanned = document.querySelectorAll('div:not(.done)[data-pagelet^="FeedUnit_"]');
for (const ele of notScanned) {
    ele.classList.add("done");
    if (stringAds.some(ads => ele.innerText.includes(ads))){
        ele.remove() // Ẩn phần tử
        console.log("Đã xoá quảng cáo: ", ele.innerText.slice(0, 20))
    }
}
```

Mọi thứ hoạt động ổn định ở trang chủ, cho đến khi mình chuyển sang tab Watch...

## 2. Loại bỏ video trùng lặp bằng hàm băm cyrb53

Khi cuộn chuột trong phần `/watch`, thuật toán liên tục tải lại các đoạn video mình vừa mới lướt qua không lâu trước đó, khá mất thời gian và gây loãng nội dung.

Để giải quyết, mình phải đi sâu vào cấu trúc của từng thẻ Video card (`div.j83agx80.cbu4d94t`). Bài toán đặt ra là: Làm sao để nhận diện được video đã xem trước đó một cách nhanh chóng?

Giải pháp là băm chuỗi nội dung văn bản (Hash) của từng post thành một con số duy nhất bằng giải thuật băm **cyrb53**:

```javascript
// Hàm băm nội dung để tạo mã nhận diện riêng biệt cho mỗi bài đăng
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

Trình duyệt giờ đã có thể tự động lọc và loại bỏ các video trùng lặp một cách nhanh chóng.

## 3. Xử lý trên Single Page Application (SPA) để ngụy trang tên Chat

Khi ngồi ở văn phòng, mình muốn ngụy trang danh sách liên hệ ở cột bên phải để tăng tính riêng tư. Ý tưởng ban đầu là hoán đổi ngẫu nhiên ký tự trong tên để ngụy trang:

```javascript
function encryptName(name) {
    return name.split('').sort(() => 0.5 - Math.random()).join('');
}
```

Mình chèn trực tiếp dòng đó để thay tên người liên hệ, ấn Save và reload web. Mọi tên đều được đảo lộn thành công.

Tuy nhiên, khi có người mới online hoặc trạng thái thay đổi, React sẽ re-render phần tử DOM. Tên người dùng lập tức quay về giá trị ban đầu. Việc lắng nghe sự thay đổi DOM (Mutation Observer) vẫn không bắt kịp tốc độ cập nhật Virtual DOM của React.

Để giải quyết, mình áp dụng giải pháp trực tiếp là sử dụng `setInterval` để kiểm tra và áp lại tên mã hóa liên tục:

```javascript
nodeDiv.backupName ??= name.innerText
nodeDiv.encrypt ??= encryptName(nodeDiv.backupName)

name.innerText = nodeDiv.encrypt // Đổi sang tên ngẫu nhiên

// Thiết lập khoảng thời gian lặp để kiểm tra và đè dữ liệu
let ms = 1; 
name.clearcheck ??= setInterval(repeatcheck, ms);
let time = 0;

function repeatcheck() {
    if (name.innerText !== nodeDiv.encrypt) {
        // Hễ React cập nhật lại tên cũ, ta cập nhật lại tên mã hóa
        name.innerText = nodeDiv.encrypt;
        clearInterval(name.clearcheck); 
        
        time += ms;
        // Giới hạn thời gian chạy để tránh treo trình duyệt
        if (time > maxInterval) {
            clearInterval(name.clearcheck);
        }
    }
}
```

Ngoài ra mình còn lắng nghe sự kiện `mouseover` và `mouseout` để hiển thị lại tên thật mỗi lúc di chuột vào dòng liên hệ đó.

## 4. Tổng Kết

Kết quả thu được là một giao diện sạch sẽ hơn, không quảng cáo, không video trùng lặp và tên danh sách chat được ẩn đi. Qua quá trình này, mình cũng hiểu rõ hơn về cách thức hoạt động của các Single Page Application hiện đại.

Những trải nghiệm thực tế này mang lại khá nhiều bài học bổ ích về thao tác DOM. Bạn nào quan tâm có thể ghé qua repo `facebook-ext` của mình để tải về và tùy chỉnh thêm nhé!
