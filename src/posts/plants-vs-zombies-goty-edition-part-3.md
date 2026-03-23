---
title: "Hack Plants Vs Zombies GOTY Edition - part 3"
date: "2020-06-11"
tags: ["Hack Game"]
description: "Tiếp tục với series phá hoại game PvZ, ở phần trước mình đã tìm được địa chỉ pointer của mặt trời, xu và hồi phục nhanh cho cây. Hướng dẫn hack one hit."
published: true
---

# Hack Plants Vs Zombies GOTY Edition - part 3

![Plants vs Zombies GOTY Edition](/images/plants-vs-zombies-goty-edition-part-3/image-01.jpg)

Tiếp tục với series phá hoại game PvZ, ở phần trước mình đã tìm được địa chỉ pointer của mặt trời, xu và hồi phục nhanh cho cây. Trong phần này thì mình nghĩ là viết nhanh một bài để hướng dẫn hack one hit, cũng chả khó lắm đâu, quan trọng là phân tích logic một xíuuuuuu là được, chủ yếu là đọc assembly thôi, à mà nếu chưa đọc phần 2 thì [link ở đây nhé](./plants-vs-zombies-goty-edition-part-2).

Mở game lên và chiến nào, chơi game chán chê rồi thì mình cũng đoán được đại khái là mỗi con zombie có thể đều có một lượng máu nhất định, khi bắn hết máu thì nó sẽ chết đúng không, nhưng cụ thể bao nhiêu máu thì mình cũng chả rõ, và lúc bị bắn nó trừ đi bao nhiêu máu cũng k biết luôn, cho nên là mình sẽ tìm theo kiểu Unknown initial value, kiểu 4 bytes

Để cho nhanh thì vào game hack lấy một ít mặt trời để mua súng luôn, nhưng đợi con zombie đầu tiên xuất hiện đã, lúc đó search Unknown initial value rồi mới trồng một cái súng để bắn.

Bắn được 1 viên thì quay ra CE scan kiểu Decreased value, và lại quay lại game cho nó bắt tiếp rồi lại scan, vài lần là ra thôi, nếu sau 3 lần mà vẫn còn thấy nhiều giá trị quá thì có thể tìm kiểu Smaller than 1000 thì sẽ thấy bớt đi rất nhiều, vì con zombie vẫn chưa chết nên tìm tiếp Bigger than 0 để lọc bớt các giá trị bằng 0 đi.

![CE screen](/images/plants-vs-zombies-goty-edition-part-3/image-02.png)

Hehe thấy rồi, mỗi lần con zombie bị bắn bằng một viên đậu thì nó mất đi 20 máu, double click để lấy địa chỉ xuống và chọn Find out what writes to this address. sau đó mở game lên để cho bắn con zombie đó thêm 1 phát nữa rồi quay ra bảng sẽ thấy như sau

![Find out what writes to this address](/images/plants-vs-zombies-goty-edition-part-3/image-03.png)

Chọn Show disassembler để bắt đầu đọc code asm thôi 😂

![Show disassembler](/images/plants-vs-zombies-goty-edition-part-3/image-04.png)

Có lẽ `[edi+C8]` chính là địa chỉ lưu giá trị máu của con zombie đó, sau khi `mov [edi+C8], ebp` thì chả thấy sử dụng thanh ghi đó nữa nên mình kéo xuống 1 xíu thấy dòng này

![Assembly code block 1](/images/plants-vs-zombies-goty-edition-part-3/image-05.png)

`cmp dword ptr [edi+C8],0` // dòng này so sánh số máu của con zombie đó với 0, có vẻ đây là cái hack one hit rồi, mình không cho nó nhảy nữa mà nop luôn lệnh jg để xem thử có đúng không, quay vào game chả thấy có chuyện gì xảy ra cả, chán vl, không phải rồi, sửa lại lệnh cũ để game khỏi lỗi.

Không nản chí tiếp tục kéo từ từ xuống để tìm tất cả các thứ liên quan đến `[edi+C8]`. Kéo tít 1 đoạn xa xa lại thấy có tiếp

![Assembly code block 2](/images/plants-vs-zombies-goty-edition-part-3/image-06.png)

`cmp dword ptr [edi+C8],0` // lại là 1 lệnh so sánh máu với 0
`jg xxxxxxxx` // nếu mà lớn hơn thì nhảy đến địa chỉ xxxxxxxx và bỏ qua lệnh bên dưới nó
`mov [edi+C8],1` // ấy, sai sai sao ý, nếu nop lệnh jg thì chắc chắn là máu của con zombie sẽ biến thành 1 luôn, nhưng không phải là one hit, chắc chắn đây không phải thứ mình tìm kiếm rồi.

Lại tiếp tục tìm bên dưới

![Assembly code block 3](/images/plants-vs-zombies-goty-edition-part-3/image-07.png)

Ồ hố, mình đọc hết cả 1 function luôn rồi, có return quay về này, nhưng mà để ý
`cmp dword ptr[edi+C8], 0` // lại so sánh máu với 0
`jg xxxxxxxx` // máu lớn hơn 0 thì bỏ qua đoạn bên dưới
.....
`mov [edi+C8],0` // có lẽ nào là nó, trong trường hợp mà máu con zombie &lt; 0 thì sẽ đặt lại bằng 0, rồi call 2 hàm khác rồi sau đó khôi phục giá trị cho các thanh ghi và quay về...

Rất có khả năng là đây rồi. nop cái lệnh jg và quay lại game xem kết quả....

Hehe vậy là thật luôn, bắn đúng 1 phát chết, lưu lại địa chỉ lệnh jg này: `0x0054626C`

Ây thế mà chơi 1 xíu sau mới phát hiện ra con zombie có mũ nó không chết luôn, có lẽ nào là do cái mũ, mình lại dùng CE scan tiếp khi bé đậu bắn vào con có mũ như cách search ban đầu mình nói, cũng ra được địa chỉ máu và Find out what writes to this address tiếp.

![Assembly code block 4](/images/plants-vs-zombies-goty-edition-part-3/image-08.png)

Một hàm khá ngắn, thấy return luôn rồi, phân tích xíu như sau

```assembly
mov [ebp+D0], ecx // có thể là lưu máu của cái mũ vào  [ebp+D0]
test bl,04
je xxxxxxxx //    
...........
mov ecx,[ebp+D0] // dù câu lệnh je ở  trên có nhảy hay không thì vẫn là lưu giá trị của [ebp+D0] vào thanh ghi ecx;
test ecx,ecx // lệnh test này để dựng cờ ZF, nếu ecx == 0 thì ZF = 1 và ngược lại
jne xxxxxxxx // nhảy nếu cờ ZF == 0
```

Đến đây chắc có thể sẽ có anh em đau não rồi đúng không, thôi thì mình nói ngắn gọi lại đại loại là kiểm tra máu của cái mũ có bằng 0 hay không, nếu khác 0 tức ZF lúc này = 0, thì nó nhảy bỏ qua đoạn lệnh, mà trông đoạn code thế thì có vẻ là mình muốn nó không nhảy nữa và vào trong để return cơ, cho nên nop lệnh jne này lại, sau khi nop xong thì quay vào game và....................... bùm chiu, bắn phát rụng mũ luôn nhé, lưu lại địa chỉ của của mũ: `0x00545B36`.

Chợt nhận ra không chỉ có mỗi con mũ vải mà con mũ inox hay là con zombie bóng bầu dục cũng 1 phát tung mũ luôn, hên quá 😁😁

Mình nghĩ là sau khi return về thì mình sẽ quay lại đoạn code kiểm tra xem zombie có mũ không, có thì trừ máu mũ tức là cái hàm hiện tại của mình đang đọc này, không thì trừ máu zombie (mà nãy làm hack one hit zombie rồi đó),,,, nhưng mà thôi lười lắm chả tìm hiểu nữa, anh em nào mà hiểu thì làm thử theo hướng đó để bỏ qua đoạn bắn rụng mũ mà đến thẳng chỗ bắn chết con zombie luôn cũng được. dù sao thì giờ cũng chả quan trọng nữa vì cũng chỉ bắn thêm 1 phát bọ, mình theo cách hoạt động của game thui.

Chơi thêm 1 lúc lại nhận ra còn có con zombie có cái khiên che trước ngực không bị chết luôn, vậy là lại tìm theo cách trên ta được như sau

![Assembly code block 5](/images/plants-vs-zombies-goty-edition-part-3/image-09.png)

Trông cũng gần giống với cái mũ, cũng là 1 hàm ngắn, nhưng bên trên jne là một hàm mov mà mình không nghĩ mov lại có thể làm thay đổi giá trị của thanh ghi ZF được nên có thể nó so sánh từ lệnh cmp tận bên trên cơ, nhưng sao so sánh xong mời trừ , khó hiểu vl, mình cũng chả hiểu nhưng mà nop thử lệnh jne này xong quay lại game thì bắn một phát vẫn rụng khiên thật .🤦‍♀️🤦‍♀️

Lưu địa chỉ của cái khiên lại: `0x00545781`

Cảm thấy đến đây là đủ rồi, nghiên cứu mấy cái assembly này hại não lắm nên nghỉ ngơi thui.

Phần sau mình sẽ hướng dẫn các bạn tìm chỗ auto nhặt mặt trời cho game, và còn có gì hay ho để chọc ngoáy phá phách thì mình sẽ làm nốt, đến khi nào nát game thì thôi. Hẹn gặp lại các bạn phần sau.
