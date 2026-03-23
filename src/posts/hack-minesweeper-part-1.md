---
title: "Hack Minesweeper - part 1"
date: "2020-06-05"
tags: ["Hack Game"]
description: "Hướng dẫn viết hack game Minesweeper. Hướng dẫn làm game trainer. Chia sẻ kinh nghiệm lập trình."
published: true
---

# Hack Minesweeper - part 1

Cái game này chắc chả xa lạ gì với mọi người rồi đúng không, mình bắt đầu chơi từ thời nó còn ở trên Windows XP hồi đó mình còn lớp 7 lớp 8 gì đó tầm khoảng năm 2010. Éc éc, 10 năm rồi đó, nếu có ai hỏi tại sao lại là game này mà không phải game gì ghê gớm hơn thì bài học đầu tiên mà, làm những thứ đơn giản trước đã.

Phần đầu này mình sẽ hướng dẫn sơ sơ cách để hack và tìm địa chỉ của các ô nhớ, sang đến phần sau sẽ là code.

**Công cụ**: [Cheat Engine](https://www.cheatengine.org/)

**Game**: [Winmine](http://www.minesweeper.info/downloads/WinmineXP.html)

Bắt đầu thui........

![Giao diện huyền thoại thân quen](/images/hack-minesweeper-part-1/image-01.png)

*Giao diện huyền thoại thân quen :v*

## Tìm số bom

Mở CE lên tìm với giá trị bom hiện tại là 10.

![Tìm số bom bước 1](/images/hack-minesweeper-part-1/image-02.png)

Ra 1 đống giá trị xong sau đó mở Winmine lên chuyển sang chế độ khác để thay đổi số bom và tiếp tục lọc.

![Tìm số bom bước 2](/images/hack-minesweeper-part-1/image-03.png)

Sau khi next scan thì được 3 địa chỉ màu xanh lá, đó là địa chỉ static, tức là nó sẽ không bị thay đổi sau khi tắt game và mở lại.
Thử thay đổi giá trị của 3 địa chỉ vừa nhận được thì thấy địa chỉ **0x010056A4** là địa chỉ cần tìm.

## Tìm thời gian

Cũng search tương tự nhé vị làm cũng y xì thui mình lười chụp và up ảnh :v

Địa chỉ cần tìm là: **0x0100579C**

## Tìm map game

Dùng IQ 40 của mình phân tích 1 xíu nhé:

- Chế độ Beginner gồm 9x9 = 81 ô
- Chế độ Intermediate gồm 16x16 = 256 ô
- Và chế độ Expert gồm 30x16 = 480 ô

Nhân vào cho vui chứ tổng số ô chả quan trọng đâu, quan trọng là chiều rộng và chiều cao của map game cơ, cũng thay đổi chế độ và search thì sẽ ra.

- Địa chỉ chiều rộng: **0x010056AC**
- Địa chỉ chiều cao: **0x010056A8**

Để tìm được map thì phải hiểu 1 xíu về mảng 2 chiều, vì mình cũng từng code cái game dò mìn này rồi nên mình nói qua qua cho các bạn hiểu là với mỗi ô đó là 1 địa chỉ ô nhớ, mà giá trị của nó do người lập trình quy định thui, đợt mình code cái game đó mình quy định ô nào mà là bom thì giá trị của nó là -1, xung quanh của ô mà có bom thì giá trị của ô đó là số bom.

![Minh họa mảng 2 chiều](/images/hack-minesweeper-part-1/image-04.png)

*Ví dụ minh họa vậy thui chứ game này nó khác :v, nói ví dụ để ai hiểu thì tốt mà chả hiểu thì thui,,, chỉ cần biết là mỗi ô nó mang 1 giá trị còn có cái căn cứ mà tìm.*

Để cho nhanh thì mình cung cấp sẵn vài giá trị:

- **0x8F**: là bom
- **0x8E**: là đặt cờ
- **0xCC**: là quả bom lúc ấn vào nó nổ
- **0x0F**: là ô mặc định chưa mở hoặc chưa đặt cờ

Vì làm việc với memory nên địa chỉ hay là giá trị mình xin viết thành giá trị hex hết nhé.
Muốn tự tìm thì phải search theo kiểu Unknow initial value, sẽ ra thui nhưng hơi mất thời gian.
Tấn công vào ô đầu tiên thui, nếu search 4 bytes thì chắc chắn k ra đâu, search 1 byte thì mới ra, mình làm rồi nên mình biết. Kinh nghiệm search thì làm nhiều quen thui chứ chả ai dạy, trên youtube cũng có vài cái video hướng dẫn dùng CE nhưng chả có tác dụng gì mấy.

Giá trị tìm được là **0x01005361**, mình có tình cờ tìm thấy 1 cái địa chỉ lưu số ô đã mở nữa, và đây là tổng tất cả những thứ tìm được:

![Tổng kết các địa chỉ](/images/hack-minesweeper-part-1/image-05.png)

Thui lười quá chả viết nữa, để lúc khác viết phần 2, sẽ động chạm vào code để làm màu cho nó ngầu xíu :V
