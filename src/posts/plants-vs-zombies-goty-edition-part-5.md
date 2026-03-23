---
title: "Hack Plants Vs Zombies GOTY Edition - part 5"
date: "2020-06-14"
tags: ["Hack Game"]
description: "Phần 5: Tổng hợp lại thành tool hoàn chỉnh viết bằng C# (Winform)."
published: true
---

# Hack Plants Vs Zombies GOTY Edition - part 5

![Plants vs Zombies GOTY Edition](/images/plants-vs-zombies-goty-edition-part-5/image-01.jpg)

Lạy chúa đến phần cuối rồi, mình lười viết kinh khủng nhưng vì hôm nay là ngày chủ nhật và trời đang mưa to vl, thời tiết rất mát mẻ nên mình ngồi viết nốt, ở phần 2, 3 và 4 mình đã tìm được địa chỉ quan trọng để dùng cho phần cuối này đó là viết tools, có lẽ sau series PvZ này mình sẽ chả làm hướng dẫn viết tool nữa vì cái chính nó vẫn nằm ở CE có tìm được địa chỉ ô nhớ hay không thôi, mà nếu còn làm tiếp thì thì mình đang nghĩ tới thứ làm auto gì đó chứ không phải hack như này.

Bắt đầu nào, mở Visual Studio lên, tạo một project winform và tạo một cái giao diện đơn giản như sau.

![Giao dien tool](/images/plants-vs-zombies-goty-edition-part-5/image-02.png)

C# có cái form này kéo thả dễ vl, chứ bảo làm bằng C++ chắc ốm mất (được nhé, nhưng nó khó vl ý, mình không biết làm thôi).

Danh sách địa chỉ và tất cả giá trị mình tìm được khai báo hết ra nhé.

```csharp
MyMemory memory;
private const int autoAddress = 0x004352F2;
private const int fastRechargeAddress = 0x004958C5;
private const int nomalZombieAddress = 0x0054626C;
private const int hatZombieAddress = 0x00545B36;
private const int shieldZombieAddress = 0x00545781;

private const int AUTO = 0xEB;
private const int NOTAUTO = 0x75;
private const int FASTRECHARGE = 0x9090;
private const int NOTFASTRECHARGE = 0x147E;
private const int ONEHIT = 0x9090;
private const int NOMALNOTONEHIT = 0x1D7F;
private const int HEADNOTONEHIT = 0x1175;
private const int GUARDNOTONEHIT = 0x1875;
private int baseAddr;
```

Còn giá trị tại sao là như vậy tẹo làm đến mình sẽ nói, à quên phải tạo thêm class mình nói ở phần 1 mình có code lại rồi nữa nhé, mình đặt tên nó là MyMemory.
Xong code sẽ trông thế này.

![Full code screen](/images/plants-vs-zombies-goty-edition-part-5/image-03.png)

Để chương trình tự load game khi vừa chạy thì mình tạo thêm 1 hàm Init() như sau, gọi hàm thì đặt ở vị trí như ảnh trên nhé.

```csharp
private void Init()
{
    memory = new MyMemory("popcapgame1");
    if (memory.isOK())
    {
        int auto = memory.ReadByte(autoAddress);
        if (auto == AUTO)
        {
            cbAtuto.Checked = true;
        }

        int fast = memory.ReadUShort(fastRechargeAddress);
        if (fast == FASTRECHARGE)
        {
            cbTime.Checked = true;
        }
        int onehit = memory.ReadUShort(nomalZombieAddress);
        if (onehit == ONEHIT)
        {
            cbOnehit.Checked = true;
        }
        button3.Visible = false; // sorry vì có mấy nút mình lười không đặt lại tên, nó là nút load game
        baseAddr = memory.GetBaseAddress();
        //MessageBox.Show("Load game oke");
    }
    else
    {
        MessageBox.Show("mở game lên trước");
        //Environment.Exit(1);
    }
}
```

Đầu tiên là kiểm tra game đã mở chưa, nếu mở rồi thì kiểm tra xem ở những địa chỉ như auto, fast recharge hay onehit có được kích hoạt chưa thì đặt dấu check cho mấy cái checkbox, thật ra nó chả cần thiết lắm mà chủ yếu do mình làm màu thôi, cái chính là mở được chương trình lên thì lấy được base address của game là chính,,,, còn trong trường hợp game chưa chạy thì hiện cái thông báo lên cho mình biết thôi chứ cũng chả có gì ghê gớm.

Mình cũng viết thêm một hàm nữa đặt tên nó là GameisRunning() tác dụng là để kiểm tra xem game còn chạy nữa không, nhằm tránh những lỗi nào đó có thể xảy khi mình ấn chức năng nhưng game đã bị tắt mất rồi thôi.

```csharp
private bool GameisRunning()
{
    if (memory.isOK())
    {
        return true;
    }
    else
    {
        MessageBox.Show("Game đã bị tắt");
        button3.Visible = true;
        return false;
    }
}
```

Double click vào cái checkbox auto collect đi, làm cái này trước, nó sẽ tạo ra một hàm sự kiện, viết vào bên trong như sau.

```csharp
if (GameisRunning())
{
    if (cbAtuto.Checked)
    {
        memory.WriteNumber(autoAddress, AUTO, 1);
    }
    else
    {
        memory.WriteNumber(autoAddress, NOTAUTO, 1);
    }
}
```

Giải thích một xíu, hàm WriteNumber trong class memory mình viết có tham số truyền vào như sau WriteMemory(địa chỉ ô nhớ, giá trị muốn ghi vào, số bytes). Địa chỉ thì không nói rồi, đến giá trị ghi vào mà số bytes thì sao, mở CE lên, bấm vào địa chỉ đã lưu chọn Disassemble this memory region

![Disassemble this memory region](/images/plants-vs-zombies-goty-edition-part-5/image-04.png)

Thấy lệnh này có 2 bytes `75 09`

![Lệnh assembly 2 bytes](/images/plants-vs-zombies-goty-edition-part-5/image-05.png)

Sửa thành jne thành jmp thì 75 chuyển thành EB

![Sửa jne thành jmp](/images/plants-vs-zombies-goty-edition-part-5/image-06.png)

Vậy là chỉ có 1 byte thay đổi giá trị khi không auto là `0x75` còn auto thì là `0xEB`, vì sửa 1 byte nên hàm WriteNumber truyền giá trị là 1. đó là tất cả lý do đó :v

Đến với phần hồi nhanh cây trồng, ta có địa chỉ như sau

![Địa chỉ hồi nhanh](/images/plants-vs-zombies-goty-edition-part-5/image-07.png)

2 bytes là `7E 14`, giờ không cần nó luôn nhảy nữa mà là không cho nó nhảy, nên đây mình sẽ phải nop lệnh jle này lại

![Nop lệnh jle](/images/plants-vs-zombies-goty-edition-part-5/image-08.png)

Lệnh nop chỉ có giá trị là 1 byte, còn lệnh cũ là 2 bytes, nên để bảo toàn chương trình sẽ bù thêm vào để đủ là 2 bytes, cho nên biến của fastrecharge của mình có giá trị là `0x9090`, mặc định là `0x147E`, nhớ để ý nó phải viết ngược lại.

Double click vào cái check box fast recharge và viết lệnh như sau.

```csharp
if (GameisRunning())
{
    if (cbTime.Checked)
    {
        memory.WriteNumber(fastRechargeAddress, FASTRECHARGE, 2);
    }
    else
    {
        memory.WriteNumber(fastRechargeAddress, NOTFASTRECHARGE, 2);
    }
}
```

Vì là chỉnh sửa đến 2 bytes nên phải truyền 2 vào nhé, tương tự với 4 cũng thế.

Tương tự thì code của one hit như sau, có 3 loại zombie nên viết chung hết vào

```csharp
if (GameisRunning())
{
    if (cbOnehit.Checked)
    {
        memory.WriteNumber(nomalZombieAddress, ONEHIT, 2);
        memory.WriteNumber(hatZombieAddress, ONEHIT, 2);
        memory.WriteNumber(shieldZombieAddress, ONEHIT, 2);
    }
    else
    {
        memory.WriteNumber(nomalZombieAddress, NOMALNOTONEHIT, 2);
        memory.WriteNumber(hatZombieAddress, HEADNOTONEHIT, 2);
        memory.WriteNumber(shieldZombieAddress, GUARDNOTONEHIT, 2);
    }
}
```

Giờ là hack tăng mặt trời, lần trước mình tìm được pointer rồi ý, giờ mình sẽ chỉ cách dùng. Double click vào button Add sun và viết lệnh như sau

```csharp
if (GameisRunning())
{
    int value = 0;
    int[] sunOffset = { 0x0032F3F4 + baseAddr, 0x68, 0x320, 0x18, 0x4, 0x4, 0x8, 0x5578 };
    for (int i = 0; i < sunOffset.Length - 1; i++)
    {
        value = memory.ReadInt(sunOffset[i] + value);
    }
    int addr = value + sunOffset[sunOffset.Length - 1];
    value = memory.ReadInt(addr);
    bool isnumber = int.TryParse(textBox1.Text, out int num);
    if (isnumber)
    {
        memory.WriteNumber(addr, value + num, 4);
    }
}
```

Nếu chạy hết Length thì value sẽ là giá trị của mặt trời luôn nhưng mình không cần cái đó, mình cần địa chỉ của nó cơ để có thể thực hiện được cả đọc và ghi nên chỉ chạy đến Length -1 thôi, rồi từ đó lấy ra địa chỉ bằng cách cộng value với phần tử cuối trong mảng, sau khi có địa chỉ rồi thì đọc ghi như bình thường thôi.

Với xu cũng như vậy nhé, Cái khác ở đây là xu chỉ có giá trị bằng 1/10 nên chia cho 10 trc khi cộng thôi.

```csharp
if (GameisRunning())
{
    int value = 0;
    int[] coinOffset = { 0x0032E77C + baseAddr, 0x18, 0x10, 0x14, 0x10, 0x4, 0x4, 0x84 };
    for (int i = 0; i < coinOffset.Length - 1; i++)
    {
        value = memory.ReadInt(coinOffset[i] + value);
    }
    int addr = value + coinOffset[coinOffset.Length - 1];
    value = memory.ReadInt(addr);
    bool isnumber = int.TryParse(textBox1.Text, out int num);
    if (isnumber)
    {
        memory.WriteNumber(addr, value + num / 10, 4);

    }
}
```

Trước đó thì mình có tìm hiểu trên mạng thì người ta viết khá là chuối

![Cách viết chuối](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEHHtjbFjRKcWtndJbqSmQJu849ktWFpBoDLjkseOnFEFT28PF8goclMZYyolSkm8Z-7t6JxY16KBGTlCbAia9RXtRcvL_g7wFnm9FtVJRpqhaRRwWNjsdxwJtSkd0pCu05RoB6KO30IQh/s917/2020-06-14_183908.png)

Bao nhiêu offset bấy nhiêu biến, nó không sai nhưng nhìn sida vl ý.

Lười quá tổng kết thôi.

Toàn bộ khóa học đến đây là kết thúc 😁😁

<iframe title="pvz hack result" allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="500" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dzWc4v9XQeZprmkmDc35tkXeLsbb5w0SPax1NvnaTPsM7LuoxY0Wd9qkoQEjHM5a2qEVnmo1nx14R2hLt_jcCgP2ggTCXo2fjCiN4f84r_ziZoqjOatRY_6MhbXEQSMmURQTgk&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="750"></iframe>

Chơi game mà hack thì đúng là nó nhàm chán vl ý, nhưng thui mình chỉ chia sẻ cách lập trình là chính thôi chứ mục đích của blog này không phải là hack game đâu nhé, baibai anh em.

Link [download ở đây nhé](https://github.com/uongsuadaubung/Plants-Vs-Zombies-GOTY-trainer). file ăn sẵn nằm ở trong thư mục `/bin/Release/netcoreapp3.1/publish/`
