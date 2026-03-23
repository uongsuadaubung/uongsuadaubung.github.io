---
title: "Hack Plants Vs Zombies GOTY Edition - part 1"
date: "2020-06-09"
tags: ["Hack Game"]
description: "Plants Vs. Zombies từ trước đến nay vẫn luôn là tượng đài của thể loại phòng thủ tháp được rất nhiều người chơi yêu thích. Hướng dẫn viết tool hack trên Winform."
published: true
---

# Hack Plants Vs Zombies GOTY Edition - part 1

![Plants vs Zombies GOTY Edition](/images/plants-vs-zombies-goty-edition-part-1/image-01.jpg)

Plants Vs. Zombies từ trước đến nay vẫn luôn là tượng đài của thể loại phòng thủ tháp được rất nhiều người chơi yêu thích. Nó có giá rất rẻ thôi, có 14k mua trên steam lúc giảm giá, mua ủng hộ tác giả, link ở [đây](https://store.steampowered.com/app/3590/Plants_vs_Zombies_GOTY_Edition/)

Ở phần này thì mình sẽ làm trên Winform để trông nó đẹp ngầu hơn là nhìn màn hình màu đen trên Console, một vài chức năng mà mình sẽ làm là

1. Hack tăng số lượng mặt trời và xu
2. Hack tự động nhặt mặt trời / xu
3. Hack thời gian hồi cây
4. Hack one hit

Ừ thì có thể sẽ có ai đó nghĩ: "việc quái gì phải hướng dẫn, search 1 cái là ra"... đúng thế, với xu thì là đúng thế thật, đặt vài tỉ thì chả bao giờ tiêu hết. Nhưng với mặt trời mỗi game xong mình lại phải làm lại, lặp đi lặp lại thế đương nhiên chán vl, không kể các chế độ khác nữa chứ,,, mình sẽ hướng dẫn tìm 1 lần mà dùng mãi mãi, đó là tìm pointer. Nhưng mà mục đích cuối cùng đứng trên tất cả vẫn là viết tool 😁😁, các bạn sẽ học được cách làm việc với pointer như thế nào.

Nhưng mà việc đầu tiên là phải khắc phục vấn đề còn tồn đọng ở bài hack game winsweeper lần trước đã. Vấn đề mắc phải là code đọc ghi bộ nhớ nó không được tối ưu tí nào, vì là bài đầu tiên nên mình chỉ làm đơn giản thế để tìm hiểu thôi, giờ sẽ viết lại thành một file class để có thể tái sử dụng được cho mọi game.

Mình đặt tên class là `MyMemory`, còn bạn đặt khác cũng được, nhớ lúc dùng gọi cho đúng.

```csharp
class MyMemory
{
    private IntPtr processHandle;
    private Process process;
    private const int PROCESS_ALL_ACCESS = 0x1F0FFF;

    //const int PROCESS_WM_READ = 0x0010;
    [DllImport("kernel32.dll")]
    private static extern IntPtr OpenProcess(int dwDesiredAccess, bool bInheritHandle, int dwProcessId);

    [DllImport("kernel32.dll")]
    private static extern bool ReadProcessMemory(IntPtr hProcess, int lpBaseAddress, byte[] lpBuffer, int dwSize, ref int lpNumberOfBytesRead);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool WriteProcessMemory(IntPtr hProcess, int lpBaseAddress, byte[] lpBuffer, int dwSize, ref int lpNumberOfBytesWritten);

    private static byte[] ReadBytes(IntPtr Handle, int Address, int size)
    {
        int bytesRead = 0;
        byte[] buffer = new byte[size];
        ReadProcessMemory(Handle, Address, buffer, size, ref bytesRead);
        return buffer;
    }
    
    public int GetBaseAddress()
    {
        return process.MainModule.BaseAddress.ToInt32();
    }

    private static bool WriteBytes(IntPtr Handle, int Address,int value, int size)
    {
        int BytesWrite = 0;
        byte[] buffer = BitConverter.GetBytes(value);
        return WriteProcessMemory(Handle, Address, buffer, size, ref BytesWrite);
    }
    
    public MyMemory(string processName)
    {
        try
        {
            process = Process.GetProcessesByName(processName)[0];
            processHandle = OpenProcess(PROCESS_ALL_ACCESS, false, process.Id);
        }
        catch
        {
            process = null;
        }
    }
    
    public int ReadInt(int Address)	
    {
        return BitConverter.ToInt32(ReadBytes(processHandle, Address, 4), 0);
    }
    
    public uint ReadUInt(int Address)
    {
        return BitConverter.ToUInt32(ReadBytes(processHandle, Address, 4), 0);
    }
    
    public short ReadShort(int Address)
    {
        return BitConverter.ToInt16(ReadBytes(processHandle, Address, 2), 0);
    }
    
    public ushort ReadUShort(int Address)
    {
        return BitConverter.ToUInt16(ReadBytes(processHandle, Address, 2), 0);
    }
    
    public byte ReadByte(int Address)
    {
        return ReadBytes(processHandle, Address, 1)[0];
    }
    
    public double ReadDouble(int Address)
    {
        return BitConverter.ToDouble(ReadBytes(processHandle, Address, 8), 0);
    }
    
    public float ReadFloat(int Address)
    {
        return BitConverter.ToSingle(ReadBytes(processHandle, Address, 4), 0);
    }
    
    public void WriteNumber(int Address,int value, int length = 4)
    {
        WriteBytes(processHandle, Address, value, length);
    }
    
    public string ReadString(int Address, int length = 32)
    {
        string temp3 = Encoding.Unicode.GetString(ReadBytes(processHandle, Address, length));
        string[] temp3str = temp3.Split('\0');
        return temp3str[0];
    }
    
    public void WriteString(int Address,string value, uint length = 32)
    {
        int bytesWritten = 0;
        byte[] buffer = Encoding.Unicode.GetBytes(value+"\0"); // '\0' marks the end of string

        // replace 0x0046A3B8 with your address
        WriteProcessMemory(processHandle, Address, buffer, buffer.Length, ref bytesWritten);
    }
    
    public bool isOK()
    {
        return process != null && !process.HasExited;
    }
}
```

Vậy là từ giờ để sử dụng, khởi tạo bằng lệnh, ví dụ game PvZ luôn nhé.

```csharp
	MyMemory memory = new MyMemory("popcapgame1");
```

Các hàm mình viết sẵn là:

Kiểm tra:

```csharp
	public bool isOK(){} // kiểm tra xem chương trình có chạy không, nếu true thì mới sử dụng những hàm còn lại mới chính xác
```

Đọc giá trị là số:

```csharp
    public int ReadInt(int Address){}
    public int ReadShort(int Address){}
    public int ReadUShort(int Address){}
    public double ReadDouble(int Address){}
    public double ReadFloat(int Address){}
```

Ghi giá trị vào địa chỉ:

```csharp
	public void WriteNumber(int Address,int value, int length = 4){}
```

Đọc ghi giá trị string: // chưa có cơ hội dùng nên chả biết đúng sai thế nào :v, tại cái đi copy được ở một trang web khác

```csharp
	public string ReadString(int Address, int length = 32){}
    public void WriteString(int Address,string value, uint length = 32){}
```

Thôi lười quá rồi tạm dừng ở đây, phần 2 mình sẽ làm về CE để search và phân tích, sau đó đến phần 3 mới code.
