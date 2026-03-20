---
title: "Hack Minesweeper - part 2"
date: "2020-06-06"
tags: ["Cheat Engine", "Chọc ngoáy", "Hack Game"]
description: "Hướng dẫn đọc bộ nhớ game Minesweeper bằng C# và hiển thị map bom ra console."
published: true
---

# Hack Minesweeper - part 2

Nếu chưa xem phần 1 thì có thể xem lại tại [đây](https://uongsuadaubung.blogspot.com/2020/06/hack-minesweeper-part-1.html).
Mình sẽ sử dụng C# để code, mình cũng có đọc ở đâu đó trên vài trang nước ngoài thấy nhiều người nói là để viết mấy cái tool hack này nọ thì nên viết bằng C++ và mình cũng có tìm hiểu qua C++ nhưng thấy nó khó vãi, hoặc do mình tiếp xúc với C# nhiều hơn và sớm hơn nên quen hơn. Nói sơ sơ qua thì công việc cũng chỉ là đọc ghi giá trị từ địa chỉ ô nhớ trong game thui.

![Giao diện Minesweeper](/images/hack-minesweeper-part-2/image-01.png)

## Đọc bộ nhớ game

Đầu tiên chúng ta phải khai báo vài cái hàm API của Win32. Nếu ai chưa biết mấy hàm này thì có thể tìm hiểu thêm về DllImport nhé.

```csharp
[DllImport("kernel32.dll")]
public static extern IntPtr OpenProcess(int dwDesiredAccess, bool bInheritHandle, int dwProcessId);
[DllImport("kernel32.dll")]
public static extern bool ReadProcessMemory(int hProcess, int lpBaseAddress, byte[] lpBuffer, int dwSize, ref int lpNumberOfBytesRead);
```

Khi một tiến trình được mở, ta phải chỉ định quyền truy cập mong muốn (với game Minesweeper thì mình chỉ muốn đọc giá trị thui nên yêu cầu quyền truy cập để đọc bộ nhớ), vì vậy hằng số này là cần thiết:

```csharp
const int PROCESS_VM_READ = 0x0010;
```

Giới thiệu thêm:

```csharp
const int PROCESS_VM_WRITE = 0x0020; // yêu cầu quyền truy cập để ghi vào bộ nhớ
const int PROCESS_ALL_ACCESS = 0x1F0FFF; // đọc và ghi
```

## Ghi vào bộ nhớ game

```csharp
[DllImport("kernel32.dll")]
public static extern IntPtr OpenProcess(int dwDesiredAccess, bool bInheritHandle, int ProcessId);
[DllImport("kernel32.dll", SetLastError = true)]
public static extern bool WriteProcessMemory(int hProcess, int lpBaseAddress, byte[] lpBuffer, int dwSize, out int lpNumberOfBytesWritten);
```

Một chương trình có cả đọc và viết thì dùng OpenProcess một lần là được.

## Bắt tay vào code thôi!!!

Theo lý thuyết bên trên thì ban đầu phải import cái hàm đọc bộ nhớ vào, bài này mình chỉ đọc bộ nhớ thôi sang bài sau với game khác mình sẽ làm đủ cả đọc ghi.

![Khai báo import](/images/hack-minesweeper-part-2/image-02.png)

Đầu tiên phải khai báo một số biến hay ho ra trước, gồm mấy cái địa chỉ mà ở phần 1 mình tìm được:

```csharp
int widthAddr = 0x010056AC; // chiều rộng map
int heightAddr = 0x010056A8; // chiều cao map
int firstAddr = 0x01005361; // ô mìn đầu tiên map[0][0]
int opendAddr = 0x010057A4; // số ô đã mở
byte[] buffer = new byte[4]; // buffer là cái mà hàm yêu cầu, để nó lưu giá trị đọc được từ bộ nhớ vào buffer này, byte[4] là do tất cả các giá trị tìm được có kiểu lớn nhất 4bytes
int mywidth = 0, myheight = 0, myopend = 0; // đọc được giá trị ra thì phải lưu vào để sử dụng
int mycurr = 0;
int reads = 0; // cái này cũng do hàm yêu cầu thôi, tạo cho đủ
```

Tiếp theo để mở tiến trình thì làm như sau:

```csharp
Process process = Process.GetProcessesByName("Winmine__XP")[0];
IntPtr processHandle = OpenProcess(PROCESS_WM_READ, false, process.Id);
```

Cả đống nó sau thì sẽ trông thế này:

![Khai báo biến](/images/hack-minesweeper-part-2/image-03.png)

Phân tích tiếp, mình sẽ đọc giá trị liên tục để update lại lên màn hình, cho nên sẽ sử dụng một vòng lặp như sau:

![Vòng lặp chính](/images/hack-minesweeper-part-2/image-04.png)

Từ đây đọc các giá trị chiều rộng, chiều cao, và số ô đã mở đầu tiên:

```csharp
ReadProcessMemory(processHandle, widthAddr, buffer, 1, ref reads);
mywidth = BitConverter.ToInt32(buffer, 0);
ReadProcessMemory(processHandle, heightAddr, buffer, 1, ref reads);
myheight = BitConverter.ToInt32(buffer, 0);
ReadProcessMemory(processHandle, opendAddr, buffer, 1, ref reads);
myopend = BitConverter.ToInt32(buffer, 0);
```

Tại sao đọc số ô đã mở thì là do sau khi mình ấn mở ô đầu tiên xong thì game nó mới tạo map, cho nên là phát click đầu tiên không bao giờ dẫm phải bom đâu. Đến đây thì suy luận xíu là đc, nếu chưa mở ô nào thì vẽ cái map mặc định toàn dấu `-` (gạch ngang), còn nếu mở rồi thì mới đọc giá trị của map để vẽ ra ô nào là bom ô nào không.

```csharp
if (myopend == 0) // số ô đã mở == 0 tức là chưa mở ô nào
{
    for (int i = 0; i < myheight; i++)
    {
        for (int j = 0; j < mywidth; j++)
        {
            Console.Write("- ");
        }
        Console.WriteLine();
    }
}
else // ngược lại thì là đã mở
{
    //// sẽ phân tích tiếp bên dưới
}
```

Đến đây chạy thử sẽ có kết quả thế này:

![Kết quả chưa mở ô](/images/hack-minesweeper-part-2/image-05.png)

![Kết quả sau khi mở ô](/images/hack-minesweeper-part-2/image-06.png)

Trông có vẻ khá chính xác 😅😅

Còn trong trường hợp là đã mở một ô và map được tạo thì sao? Mở CE lên và vào đó tìm hiểu một xíu:

![CE xem vùng nhớ](/images/hack-minesweeper-part-2/image-07.png)

Ấn Ctrl+B để mở xem vùng nhớ tại địa chỉ đó. Đặt vài cái cờ sẽ thấy giá trị của mấy địa chỉ liền kề nhau thay đổi, suy ra là với hàng ngang thì mỗi ô nó cách nhau 1 byte thôi, nên để đọc giá trị ô bên cạnh thì lấy địa chỉ hiện tại **+1** là được.

![Kiểm tra hàng ngang](/images/hack-minesweeper-part-2/image-08.png)

Thế còn khi hết hàng ngang và xuống hàng mới?

![Kiểm tra xuống hàng](/images/hack-minesweeper-part-2/image-09.png)

Nhìn ta thấy thì nó cách nhau một khoảng cố định là **0x20**, không tin thì lấy máy tính bấm giá trị sau trừ đi giá trị trước là ra.

![Tính khoảng cách](/images/hack-minesweeper-part-2/image-10.png)

Vậy để di chuyển đến dòng thứ `i` thì mình có công thức thế này `firstAddr + 0x20 * i`, ví dụ để nhảy đến dòng 5: `0x01005361 + 0x20*5 = 01005401`.

![Kiểm tra công thức](/images/hack-minesweeper-part-2/image-11.png)

Đó, địa chỉ có thật nhé, đúng công thức luôn. À ý mình là hàng thứ 6 nếu là trong game, cái hàng đầu tiên coi là hàng 0, nếu bạn có học về mảng rồi thì sẽ hiểu.

Oke, đến đây bắt tay code nốt đoạn còn lại:

```csharp
int current = firstAddr;
for (int i = 0; i < myheight; i++)
{
    for (int j = 0; j < mywidth; j++)
    {
        ReadProcessMemory(processHandle, current, buffer, 1, ref reads);
        mycurr = BitConverter.ToInt32(buffer, 0);
        if (mycurr == 0x8F || mycurr == 0x8E || mycurr == 0x8A) // 0x8F là bom, 0x8E là đặt cờ, 0x8A là bom mở ra sau khi kết thúc game
        {
            Console.Write("x ");
        }
        else if (mycurr == 0xCC) // 0xCC là quả bom lúc ấn vào nó nổ
        {
            Console.Write("0 ");
        }
        else if (mycurr == 0x0F) // 0x0F là ô mặc định chưa mở hoặc chưa đặt cờ
        {
            Console.Write("- ");
        }
        else
        {
            Console.Write("  ");
        }
        current++; // đi đến ô tiếp theo
    }
    current = (firstAddr + 0x20 * (i + 1)); // 0x20 là giá trị mỗi hàng cách nhau
    Console.WriteLine();
}
```

Và đây là thành quả đạt được:

<iframe allowfullscreen="allowfullscreen" frameborder="0" height="500" src="https://www.blogger.com/video.g?token=AD6v5dxvxh7AJb5Rzuc9rAPgfmjFtp6py17I-LWYFwhh_IQkZGLCQIPojELMYJjTiBkQTFpqbsiGmQwpsDpHeZlrle-dznWNYn8-5fgQp98t2OjsdRDc_Wh-Oro1cApctn4YOfHPsVY&origin=uongsuadaubung.blogspot.com" width="500"></iframe>

Full code mình sẽ update tại [đây](https://github.com/uongsuadaubung/Hack-Minesweeper-csharp).

Điều này trái ngược với tư duy logic của game đề ra, nhưng thui dù sao mình cũng tư duy theo cách của mình mà nhỉ, học hỏi thêm được cái khác hay ho hơn là ngồi đếm số thui đúng không :V
