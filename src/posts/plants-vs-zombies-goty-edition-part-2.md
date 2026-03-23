---
title: "Hack Plants Vs Zombies GOTY Edition - part 2"
date: "2020-06-10"
tags: ["Hack Game"]
description: "Phần 1 không có quan trọng lắm vì nó chỉ mang tính chất giới thiệu và viết lại class MyMemory để code tối ưu hơn, phần 2 sẽ hướng dẫn tìm pointer của mặt trời."
published: true
---

# Hack Plants Vs Zombies GOTY Edition - part 2

![Plants vs Zombies GOTY Edition](/images/plants-vs-zombies-goty-edition-part-2/image-01.jpg)

Phần 1 không có quan trọng lắm vì nó chỉ mang tính chất giới thiệu và viết lại class MyMemory để code tối ưu hơn nên nếu muốn xem lại thì ấn vào [link này nhé](plants-vs-zombies-goty-edition-part-1).

Lẽ ra định làm toàn bộ hướng dẫn CE search trong phần 2 này thui nhưng mà chợt nhận ra thấy nó dài vl nên mình nghĩ sẽ tách ra thành 3 4 phần gì đó để viết cho đỡ dài quá và hướng dẫn được chi tiết hơn, còn nếu gộp được lại thì mình sẽ cố.

Phải đính chính lại là mình sẽ sử dụng bản Plants Vs Zombies Game of the Year Edition và mình mua trên Steam hồi nó giảm giá còn 14k, bạn có tải bản khác trên mạng cũng oke thôi vì cũng chả khác gì nhau lắm đâu, khác mấy cái địa chỉ là cùng chứ cách làm mình sẽ hướng dẫn.

Đầu tiên là mình sẽ hướng dẫn tìm pointer của mặt trời, bắt đầu 1 ván game như bình thường và dùng CE search là ra thôi, khi lấy được địa chỉ rồi thì chuột phải vào nó và chọn Pointer scan for this address

![Pointer scan for this address](/images/plants-vs-zombies-goty-edition-part-2/image-02.png)

Nó hỏi lưu thì đặt một cái tên bất kì nào cũng được, sau đó nó sẽ hiện ra một bảng mấy nghìn có khi mấy chục nghìn kết quả kiểu như này

![Kết quả pointer scan](/images/plants-vs-zombies-goty-edition-part-2/image-03.png)

Kệ nó chả sao, thay đổi giá trị của mặt trời đi, sau đó ta chọn Pointer scanner -> Rescan memory .... 

![Rescan memory](/images/plants-vs-zombies-goty-edition-part-2/image-04.png)

Đến đây thì có 2 tùy chọn chính là Address to find và Value to find, vì mình thay đổi giá trị nên dùng luôn giá trị để lọc. Giờ giảm được kha khá rồi, vẫn giữ bảng này lại, tắt game đi và mở lại, nhớ phải cho CE attack vào game đã rồi lọc theo giá trị tiếp, càng nhiều lần thì càng chính xác, thậm chí khởi động lại máy luôn :v, khi còn lại vài chục đến vài trăm thì chọn lấy bừa một cái bằng cách double click vào nó, nó sẽ lưu vào bảng giá trị, mình dùng pointer này

![Chọn 1 pointer](/images/plants-vs-zombies-goty-edition-part-2/image-05.png)

Tiếp theo là tìm xu, có một thứ khá hay ho là giá trị thực của xu lại bằng giá trị trong game / 10, tức là bỏ đi một số 0, chắc là 1 cách đơn giản để chống hack. Tìm giá trị xong tìm pointer cho xu thì cách làm cũng như bên trên, lặp đi lặp lại mất công 1 xíu. Mình sử dụng giá trị này

![Pointer xu](/images/plants-vs-zombies-goty-edition-part-2/image-06.png)

Giờ thì có tắt game hay gì đi nữa mở lại là sẽ có đúng địa chỉ và giá trị thôi, cái này đơn giản vc nên thui chuyển sang cái khác hay ho hơn 1 tí đó là,,, đọc và phân tích assembly (chứ chưa chắc là sẽ hiểu 😅😅).

Bắt đầu là mình sẽ hack cái thời gian hồi cây.

Liên quan đến thời gian thì hay đòi hỏi chính xác đến milli giây, nên nó rất hay là số thực kiểu float hay là double ý, ban đầu có cái cục Wall-nut hồi cũng lâu lâu nên mình nhắm vào nó là mục tiêu, search tới search lui thì mình phát hiện ra khi nó đang hồi thì giá trị của nó sẽ tăng lên, còn lên bao nhiêu mình chả rõ đâu, mọi thứ rất là mơ hồ thế này nên là search theo kiểu Unknow initial value và giá trị để kiểu Float nhé, vừa bắt đầu game 1 cái là ấn ra ngoài luôn để game dừng lại, sau đó mới search lần đầu tiên, mà nhớ phải đem hạt Wall-nut theo vì mình tập trung vào cái này, tại mình thích thôi :v,

Cứ quay lại game để cục đó hồi lên 1 xíuuuuuuuuu thì quay ra CE tìm Increased value, lặp đi lặp lại vài lần cho đến khi cục Óc chó hồi xong thì dừng ấn tìm Increased value nhé.

Khi nó hồi xong thì giá trị của nó là 0, hên vl là 0 nhìn 1 phát đoán ra ngay được, để chắc chắn hơn thì sau khi lấy giá trị đó xuống rồi thì mình tiếp tục trồng 1 hạt óc chó xuống, giá trị lập tức thay đổi ngay, kiểu kiểu 1.17709071E-43. Vậy là không còn nghi ngờ gì nữa, sang bước tiếp theo :v

Chuột phải vào giá trị chọn Find out what writes to this address, mở game lên xong quay lại bảng

![Find out what writes to this address](/images/plants-vs-zombies-goty-edition-part-2/image-07.png)

Tiếp theo chọn Show disassembler

![Show disassembler](/images/plants-vs-zombies-goty-edition-part-2/image-08.png)

Phân tích bừa 1 xíu này, `[edi+24]` có thể là địa chỉ lưu giá trị cho quả óc chó,

```assembly
inc [edi+24] // tăng giá trị của địa chỉ lên 1
mov eax,[edi+24] // lưu giá trị vào thanh ghi eax
cmp eax,[edi+28] // so sánh giá trị hiện tại với 1 giá trị nào đó, mình đoán là thời gian yêu cầu của hạt óc chó đó
jle 004958DB // jle có nghĩa là jump if less or equal, có lẽ là nhảy nếu giá trị của hạt óc chó nhỏ hơn hoặc bằng với thời gian yêu cầu của hạt
```

Code có thể sẽ là thế này

```csharp
thoiGian[i]++;
if(thoiGian[i] <= thoiGianYeuCau[i])
{
  ///làm gì đó
}
else
{
  //làm gì đó khác
}
```

Theo như mình thấy thì jle sẽ luôn nhảy thôi, vì đã hồi xong đâu,,, Chuyện gì sẽ xảy ra nếu như mình không muốn nó nhảy nữa khi chưa hồi xong nhỉ, nop lệnh jle

![nop lệnh jle](/images/plants-vs-zombies-goty-edition-part-2/image-09.png)

Và quay lại game

![Quay lại game](/images/plants-vs-zombies-goty-edition-part-2/image-10.png)

Vừa mới trồng xong và hạt óc chó nó đã hồi ngay lập tức, thử với những cây khác đều có kết quả tương tự, vậy là thành công rồi nhé, lưu địa chỉ của lệnh jle lại `0x004958C5`

Tạm thời dừng lại đây thôi lười quá chả viết nổi nữa, hẹn gặp lại phần sau.
