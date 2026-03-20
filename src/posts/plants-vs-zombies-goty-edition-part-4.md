---
title: "Hack Plants Vs Zombies GOTY Edition - part 4"
date: "2020-06-12"
tags: ["Cheat Engine", "Hack Game"]
description: "Phần 4: Hướng dẫn các bạn cách làm auto nhặt mặt trời và tự động nhặt xu."
published: true
---

# Hack Plants Vs Zombies GOTY Edition - part 4

![Plants vs Zombies GOTY Edition](/images/plants-vs-zombies-goty-edition-part-4/image-01.jpg)

Sang phần 4 mình sẽ hướng dẫn các bạn cách làm auto nhặt mặt trời, chơi game mục đích giải trí thui nhưng mà tại hack làm mình thấy chán game dần đều rồi, nên cố viết nốt cái series này xong là chuyển sang game mới, hoặc dừng luôn vì ban đầu mục đích mình tạo blog này là muốn chia sẻ về lập trình là chính chứ không phải hack game.

Vì cũng là lập trình viên nên mình cũng nghĩ đến việc hack game theo cách mình lập trình, đại loại là sau khi người chơi ấn vào mặt trời thì nó sẽ bay về góc bên trái và mới tăng số lượng mặt trời lên, để tìm dần đến chỗ mình mặt trời mình click thì phải lật ngược lại từ lúc tăng tiền,,,, mà hên vl CE có sẵn công cụ làm việc này.

Bắt tay vào việc thôi, đầu tiên là bắt đầu game và search giá trị mặt trời, sau đó lại Find out what writes to this address để tìm đến lệnh game thao tác đến giá trị. Nhặt một mặt trời nữa và quay ra nhìn bảng

![Find out what writes to this address](/images/plants-vs-zombies-goty-edition-part-4/image-02.png)

Chọn Show disassembler để xem code.

![Show disassembler](/images/plants-vs-zombies-goty-edition-part-4/image-03.png)

Tại hàm đó ta chuột phải chọn Break and trace instructions, bấm oke để hiện ra bảng trace.
Quay lại game nhặt một cái mặt trời nữa để CE bắt đầu trace, sẽ hơi lag 1 tí đó. Kết quả như sau:

![Trace instructions](/images/plants-vs-zombies-goty-edition-part-4/image-04.png)

Dòng đầu tiên là nơi ta bắt đầu trace, đương nhiên lùm xùm 1 đống code asm mình cũng chả hiểu đâu, chỉ là mình muốn tìm đến nơi call cái hàm này để tìm ngược lại cái vị trí kiểm tra có click vào mặt trời hay không thôi,.
Double click lần lượt vào những lệnh lồi ra bên ngoài ý, vì nó nằm sau lệnh call gọi tới những hàm nhỏ bên trong này, ý tưởng giờ là tìm những điều kiện nằm bên trên lệnh call để patch cho nó luôn nhảy vào, đại loại là nếu click vào mặt trời thì mới tăng tiền ý, mình không cho nó nhảy tới trường hợp khi mình không click nữa nên mặt trời sẽ luôn tự nhặt, toàn bộ ý tưởng của mình đó. Việc còn lại là đi tìm thôi.

![Trace results 2](/images/plants-vs-zombies-goty-edition-part-4/image-05.png)

Double click vào hàm jmp để tìm lại hàm gọi đến hàm bên trên nó, nhìn lên lệnh `mov ecx, 19` (19 hex tức là 25), trông nó có vẻ khá là đúng với giá trị của mặt trời được cộng, mà sau lệnh call là `add [eax+5578], ecx` luôn nữa chứ, chả lẫn đi đâu được. Đến đây có một sự lựa chọn khác là sửa giá trị kia to hơn một tí để nhặt mặt trời được nhiều hơn, nhưng mình chả thích.
Bên trên call có một lệnh jne có khả năng là bỏ qua việc cộng tiền, để không cho nó nhảy nữa thì mình nop lệnh jne này lại và vào lại game xem, nhưng không có gì xảy ra cả. sửa lại như cũ và tiếp tục với cái khác.

![Try hook jne](/images/plants-vs-zombies-goty-edition-part-4/image-06.png)

Thử cái tiếp theo, nhưng không có gì thay đổi cả. Mở cái sau luôn

![Try hook another jne](/images/plants-vs-zombies-goty-edition-part-4/image-07.png)

Có lệnh jne nhảy đến này, trường hợp này hơi khác nên sửa thành jmp mới nhảy đến được, quay lại game xem thử đúng là tự nhặt được rồi. Lưu lại địa chỉ của lệnh jne: `0x004352F2`.
Tình cờ là nó còn nhặt luôn cả xu cơ, tiện vl.
Hẹn gặp lại vào phần 5, mình sẽ code trên Winform với 4 hack chính như giới thiệu ở phần 1 nhé.
