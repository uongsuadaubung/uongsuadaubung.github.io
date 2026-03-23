---
title: "Cách giải mã blogger template JavaScript"
date: "2020-06-15"
tags: ["Hack Game"]
description: "Chỉ cần search trên google là có thể tìm thấy hàng nghìn cái template cho blogger, bài viết này review cách decode những đoạn script obfuscate trong template."
published: true
---

# Cách giải mã blogger template JavaScript

![Blogger template JS](/images/cach-giai-ma-blogger-template-javascript/image-01.jpg)

Chỉ cần search trên google là có thể tìm thấy hàng nghìn cái template cho blogger, mình cũng hay thay đổi template suốt ấy chứ, khổ nỗi tất cả mọi cái mình dùng đều nó đều có 1 dạng footer được đánh dấu chủ quyền kiểu như thế này

![Footer copyright](/images/cach-giai-ma-blogger-template-javascript/image-02.png)

Trông nó thật xấu xí và nó tạo cảm giác như mình đang làm nô lệ cho người ta vậy 🤦‍♀️🤦‍♀️. Đầu tiên là mình có thử tìm cách dùng Developer tools của trình duyệt để thêm 1 cái css nhằm ẩn cái thứ xấu xí kia đi

```css
display: none;
```

Bùmmmmmmmm, blog của mình đột nhiên dẫn mình đến hẳn trang mà cái thứ xấu xí kia nó luôn hiện

![Redirected](/images/cach-giai-ma-blogger-template-javascript/image-03.png)

Chuyện gì thế này??? Tôi là ai??? Đây là đâu??? Tại sao lại như vậy??? Ngậm ngùi quay lại template và tìm đến đoạn code html đó xóa thẳng luôn nhưng kết quả vẫn như vậy.

Rồi thì mình để ý đoạn cuối của template có 2 đoạn JavasScript được mã hóa, và bên trên mỗi đoạn được comment rất là tử tế: "`<!-- Pagination Scripts -->`" và "`<!-- Theme Functions JS -->`", Pagination mình nghĩ là nó dành cho việc phân trang rồi còn Theme Functions JS trông có vẻ đáng nghi hơn vì nó dài vl mà còn liên quan đến cái theme nữa chứ.

Đầu tiên mình xóa thử cái đoạn Script đó đi nhưng blog của mình thì trông xấu tệ, mất hết các menu, giao diện mobile hỏng bét, cái nút search không dùng được, thật là tồi tệ, nhưng mà mình đã tạm thời đạt được mục đích rồi

![Broken layout](/images/cach-giai-ma-blogger-template-javascript/image-04.png)

Mình đã ẩn được, thay đổi được nội dung của dòng chữ xấu xí kia, chỉ có điều là lại làm hỏng blog của mình thôi.
Không chịu đầu hàng, mình quyết định tìm cách giải mã đoạn script đó để xem nó viết cái gì, nhìn vào đống nội dung: "`\x65\x76\x61\x6c\x28\x66\x75\x6e\x63\x74\x69...`" nên mình đoán nó là mã hex nên mình lên google search "decode hex javascript", dán đoạn mã vào đó và ấn decode thì kết quả thu được như sau

![Decode hex](/images/cach-giai-ma-blogger-template-javascript/image-05.png)

Trời đất, lại cái gì nữa vậy? Nhưng ít ra vẫn có hướng đúng vì mấy dòng đầu của đoạn script vẫn đọc được, vậy là có vẻ tác giả sử dụng mã hóa lồng, nhìn vào mấy dòng đầu "`function(p,a,c,k,e,d)`" có vẻ như là một loại nén nào đó packed mà :v, vậy là mình lại search google "unpack javascript" vào một trang và nhập nội dung của đống tùm lum kia lại, ấn unpack và kết quả như sau

![Unpack js](/images/cach-giai-ma-blogger-template-javascript/image-06.png)

Trời má lại nữa? Chơi gì kì vậy trời? Mã hóa tận 3 lần liền! Mình kéo xuống xem qua một chút thì thấy

![Another packed](/images/cach-giai-ma-blogger-template-javascript/image-07.png)

Ô đây chắc là "Trùm cuối" rồi 😂😂, tất cả tên biến đều mã hóa đi theo cách nhìn cho nó giống với mã hex, chứ còn lại các từ khóa của JS như là function, setInterval, hay thậm chí `$` của jQuery nữa kìa, trông có vẻ tất cả mọi thứ đều tập trung vào cái mảng `_0xcb61` chắc đây có thể là 1 kiểu mã hóa nào đó liên quan đến mảng, mình lại search tiếp cách decode thì......

![Decoded array obfuscation](/images/cach-giai-ma-blogger-template-javascript/image-08.png)

Lạy chúa ra rồi 😁😁, nhẹ nhõm vl, bắt đầu đọc hiểu code 1 xíu nào.

```javascript
$(document).ready(function () { 
    setInterval(function () { 
        if (!$("#mycontent:visible").length) { 
            window.location.href = "http://www.way2xxxxxxx.com/" 
        } 
    }, 3000) 
});
```

Đây rồi, thì ra là tại con lợn này nó chuyển hướng cái blog của mình đến trang chủ của template, rõ ràng nó là 1 cái chả cần thiết, nên xóaaaaaaaaaaaa....

```javascript
window.onload = function () { 
    var _0xd079x1 = document.getElementById("mycontent"); 
    _0xd079x1.setAttribute("href", "http://www.way2xxxxxx.com/"); 
    _0xd079x1.setAttribute("rel", "dofollow"); 
    _0xd079x1.setAttribute("title", "Free Blogger Themes"); 
    _0xd079x1.setAttribute("style", "display: inline-block!important; font-size: inherit!important; color: #0be6af!important; visibility: visible!important;z-index:99!important; opacity: 1!important;"); 
    _0xd079x1.innerHTML = "Way2xxxxx" 
}; 
```

Cái đoạn này như là khẳng định lại chủ quyền hay sao ý, ai mà không dám mạnh tay xóa thẳng trong template mà chỉ sửa lại liên kết hay tên trang thì đoạn script này có tác dụng là reset lại nội dung,,, các bạn chơi chắc kèo vl ý 🤦‍♀️🤦‍♀️. Xóaaaaaaaaaaaaaaaaaaaa....

Còn tất cả những đoạn còn lại đều là dùng cho giao diện thôi, mình đọc hết rồi không còn gì để chọc ngoáy vào được nữa, công việc còn lại là chèn lại đoạn script đc giải mã và chỉnh sửa vào cái cũ và hy vọng nó hoạt động 😂😂.

![Success](/images/cach-giai-ma-blogger-template-javascript/image-09.png)

Thành công rồi, thay đổi nội dung thành công và không bị chuyển hướng đến trang kia nữa, sau đó mình cũng thử với đoạn script mã hóa còn lại nhưng đúng như mình nghĩ ban đầu, nó chỉ để phân trang thôi nên chả có gì hay cả, giờ thì mình đã gọi là làm chủ được blog của mình rồi 👌👌
