---
title: "Sudoku Solver"
date: "2023-09-08"
tags: ["Cheat Engine", "Hack Game"]
description: "Vài năm trước mình có tìm hiểu về thuật toán Backtracking và chả hiểu cái quần què gì hết luôn, tự nhiên thời gian gần đ..."
published: true
---

# Sudoku Solver

![Sudoku header](/images/sudoku-solver/image-01.png)

Vài năm trước mình có tìm hiểu về thuật toán Backtracking và chả hiểu cái quần què gì hết luôn, tự nhiên thời gian gần đây chả hiểu sao tự giác ngộ được mà mình cũng chả làm gì hết (chắc do thông minh hơn :v). Vậy nên hôm nay sẽ sử dụng Backtrack để áp dụng giải sudoku. 

Lướt google search download sudoku free thì vô tình nó dẫn đến cái game Sudoku 999 trên Microsoft Store nên mình dùng luôn game này làm chuột bạch nhé.

Nói qua một chút về mục tiêu và cách áp dụng backtrack để giải sudoku:

* Đầu tiên là mình phải đọc được cái map sudoku 9x9 và lưu nó vào mảng của mình. 
* Giải sudoku trên mảng của mình,
  * Bước 1: đầu tiên là phải tìm đến một ô trống, nếu có ô trống thì tiếp bước 2, không còn ô trống nào thì có nghĩa là đã được giải.
  * Bước 2: thử lần lượt từ 1 đến 9 trên ô trống đó, nếu số đang thử hợp lệ thì thì tiếp tục lặp lại từ bước 1, không hợp lệ thì chuyển sang số tiếp theo. nếu hết 9 số đó rồi mà vẫn không có số hợp lệ thì do game sai :V 
  * Bước 3 : không có bước 3, viết cho có thôi, quan trọng là phải hiểu được chứ mình cũng chả biết giải thích sao vì hồi trước cố mãi mình cũng chả thể hiểu được, rồi đến một lúc nào đó lại tự hiểu, thế mới buồn cười. 

Công cụ sử dụng:

* Cheat Engine.
* C# Programing Language.
* Một cái đầu lạnh để hiểu cái mình muốn nói, hoặc không cần vì chỉ đọc cho vui. 

### Tìm địa chỉ ô nhớ đầu tiên của cái map game.

![Cheat Engine](/images/sudoku-solver/image-02.png)

Mở CE lên chọn vào game và search thôi, là số nào thì search số đó, ô trống thì là số 0. Trên máy mình thì nó là địa chỉ này: 0x1C980114064

Khi tìm được rồi thì chuột phải vào và chọn tiếp Browse this memory region để xem thử cái map game.

![Browse Memory](/images/sudoku-solver/image-03.png)

Kết quả như sau:

![Hex View 1](/images/sudoku-solver/image-04.png)

Bên phải ô đó là số 1, nhưng mình không nhìn thấy số 1 ngay bên cạnh giá trị 0, nên là làm lại từ đầu nhưng đối với ô thứ 2, tức là cái ô này

![Game Cell 2](/images/sudoku-solver/image-05.png)

Sau vài bước tìm thì mình tìm được địa chỉ này: 0x1C98011417C

Lấy địa chỉ sau trừ đi địa chỉ trước `0x1C98011417C - 0x1C980114064 = 0x118`, thấy hơi lạ vì không biết sao mà nó lại cách xa nhau thế, để kiểm tra xem có đúng không mình lấy `0x1C98011417C + 0x118 = 0x1C980114294` và thêm địa chỉ mình tính được vào CE bằng cách ấn Add address manually.

![Hex View 2](/images/sudoku-solver/image-06.png)

Đúng là ô tiếp theo luôn, thử tiếp vài lần và kết quả vẫn đúng. Vậy là mình sẽ tìm pointer cho cái địa chỉ đầu tiên, những cái sau sẽ dựa vào đó để tính tiếp. Sau khi tìm thấy có rất nhiều pointer trỏ đến địa chỉ đó và tất cả cái nào cũng được nên mình chọn cái ngắn nhất là

![Pointers](/images/sudoku-solver/image-07.png)

### Bắt đầu code

Lúc chạy thử code thì mình mới còn nhận ra một việc nữa là trước giờ toàn cheat trên mấy con game 32bit, giờ mới nhận ra cái game Sudoku này là 64bit, bảo sao cái địa chỉ ô nhớ nó lạ thế.

![Address View](/images/sudoku-solver/image-08.png)

Nên khi khởi động lên có hàm lấy baseaddress.ToInt32() nó báo lỗi, nên mình phải sửa lại kiểu dữ liệu của biến `_baseAddress` thành IntPtr và còn là đổi kiểu dữ liệu của mấy cái function khác nữa, sau khi đổi xong thì code nó mới khởi động được. Xem source ở link nhá mình không viết hết ra đây.

Rồi xong để ý mới thấy trước giờ mấy game khác toàn là `abc.exe` ví dụ SudokuFree10.exe, mà giờ nó lại là `SudokuFree10.dll`, đành phải search google một lúc thì tìm thấy mình phải tìm đến module có tên `SudokuFree10.dll` và lấy base address từ `SudokuFree10.dll`, khác bình thường một chút thôi, sửa lại hàm trong class Mymemory

Từ:
```csharp
private void GetProcess()
{
    Process[] processes = Process.GetProcessesByName(_processName);

    if (processes.Length > 0)
    {
        _process = Process.GetProcessesByName(_processName)[0];

        _processHandle = OpenProcess(ProcessAllAccess, false, _process.Id);
        if (_process.MainModule != null) _baseAddress = _process.MainModule.BaseAddress.ToInt32();
    }
    else
    {
        _process = null;
    }
}
```

Thành:
```csharp
private void GetProcess()
{
    Process[] processes = Process.GetProcessesByName(_processName);

    if (processes.Length > 0)
    {
        _process = Process.GetProcessesByName(_processName)[0];

        _processHandle = OpenProcess(ProcessAllAccess, false, _process.Id);
        if (_process.MainModule == null) return;
        _baseAddress = _process.MainModule.BaseAddress;
        foreach (ProcessModule module in _process.Modules)
        {
            if (module.ModuleName != this._processName + ".dll") continue;
            _baseAddress = module.BaseAddress;
            break;
        }
    }
    else
    {
        _process = null;
    }
}
```

Thiết kế form

![Form Design 1](/images/sudoku-solver/image-09.png)

Vì có 9x9 = 81 cái ô nên mình không thêm button bằng tay mà sẽ thêm bằng code, sau đó add các button này vào mảng 2 chiều tương ứng với game luôn để mình quản lý hiển thị cho nó dễ.

```csharp
//Cell.cs
namespace Sudoku_solver
{
    internal class Cell
    {
        public Cell(Button button)
        {
            Button = button;
        }

        public Button Button { get; }
        public int Value {  get; set; }
    }
}
```

```csharp
private void InitBoard()
{
    Button oldButton = new() { Location = new Point { X = 0, Y = 10 }, Width = 0, Height = 0 };
    // pnButton.Controls.Add(oldButton);
    for (int i = 0; i < GridSize; i++)
    {
        for (int j = 0; j < GridSize; j++)
        {
            Button button = new()
            {
                Location = oldButton.Location with { X = oldButton.Location.X + oldButton.Width + (j % 3 == 0 ? 10 : 0) },
                Width = ButtonSize,
                Height = ButtonSize,
                // Enabled = false,
                Font = new Font(Font.FontFamily, 15),
                BackColor = Color.White
            };
            _grid[i, j] = new Cell(button);
            pnButton.Controls.Add(_grid[i, j].Button);
            oldButton = button;
        }
        oldButton = new Button()
        {
            Location = new Point { X = 0, Y = oldButton.Location.Y + oldButton.Height + ((i + 1) % 3 == 0 ? 10 : 0) },
            Width = 0,
            Height = 0
        };

    }
}
```

Để khi khởi động lên nó sẽ tạo ra một cái bảng giống game sudoku

![Form Run](/images/sudoku-solver/image-10.png)

Sau khi dựng được cái khung lên rồi thì đọc cái map game vào cái mảng của mình thôi.

```csharp
private void ImportBoard()
{
    _empty = 0;
    long[] pointer = { (0x011B7038) + _baseAddress.ToInt64(), 0xE8, 0x58, 0x8, 0x10, 0x1c };
    long firstAddress = _memory.GetAddressFromPointer(pointer);
    long current = firstAddress;
    for (int i = 0; i < GridSize; i++)
    {
        for (int j = 0; j < GridSize; j++)
        {
            int value = _memory.ReadInt(current);
            _grid[i, j].Value = value;
            _grid[i, j].Button.Text = value.ToString();
            _grid[i, j].Button.Font = value != 0
                ? new Font(_grid[i, j].Button.Font.FontFamily, 15, FontStyle.Bold)
                : new Font(_grid[i, j].Button.Font.FontFamily, 15);
            _grid[i, j].Button.Enabled = value == 0;
            if (value == 0)
            {
                _empty++;
            }
            current += 0x118;
        }

        current = firstAddress + (i + 1) * 0x9d8;
    }
}
```

Ở đây mình sẽ format cái button 1 xíu, cái nào là số có sẵn mình để in đậm hơn, còn cái nào là số mình phải điền trong game thì mình muốn hiển thị nó không đậm.

![Form imported](/images/sudoku-solver/image-11.png)

Chạy code test thấy có vẻ khá oke rồi, giờ bước tiếp theo là giải cái map đó

```csharp
private bool Solve()
{
    int[]? spot = FindEmptySpot();
    if (spot == null) return true;

    int x = spot[0];
    int y = spot[1];
    for (int value = 1; value <= GridSize; value++)
    {
        if (!IsValid(x, y, value)) continue;
        _grid[x, y].Value = value;
        _grid[x, y].Button.Text = value.ToString();
        _grid[x, y].Button.ForeColor = Color.Red;

        if (Solve())
        {
            return true;
        }
        _grid[x, y].Value = 0;
        _grid[x, y].Button.Text = "0";
    }

    return false;
}
```

cụ thể code `FindEmptySpot()` và `IsValid()` xem trong source code nhé. Ở hàm `Solve()` này mình sẽ tô màu đỏ cho những cái ô giải được.

Chạy code test

![Form Solved](/images/sudoku-solver/image-12.png)

YEAH!! vậy là được rồi, làm nốt phần tự động điền thì ghi ngược lại phần đã giải vào địa chỉ ô đọc bằng 0 thôi

```csharp
private void FillBoard()
{
    if (FindEmptySpot() != null)
    {
        MessageBox.Show("Solve it first");
        return;
    }
    long[] pointer = { (0x011B7038) + _baseAddress.ToInt64(), 0xE8, 0x58, 0x8, 0x10, 0x1c };
    long firstAddress = _memory.GetAddressFromPointer(pointer);
    long current = firstAddress;
    for (int i = 0; i < GridSize; i++)
    {
        for (int j = 0; j < GridSize; j++)
        {
            if (_empty <= 1)
            {
                MessageBox.Show("Ok");
                return;
            }
            int value = _memory.ReadInt(current);
            if (value == 0)
            {
                _memory.WriteNumber(current, _grid[i, j].Value, 1);
                _empty--;
            }



            current += 0x118;
        }

        current = firstAddress + (i + 1) * 0x9d8;
    }
}
```

Mình phải để dư lại 1 ô trống vì nếu giải hết game nó tự mở một màn mới luôn mà không tính win cho mình, nên là mình sẽ phải tự động điền 1 ô cuối cùng.

Daily Challenge, tôi khiêm tốn giành top 1 thôi :))

![Daily Challenge Top 1](/images/sudoku-solver/image-13.png)

Video demo:
<iframe allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="518" id="BLOGGER-video-78645682fbbf1e07-10996" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dzBmpi1vYb-tHCXW_Vh66l38gp5SQ2csvxfderhnvFWNWZgY3R7ydXu5YZpJQVFaXv5Hki7cknCCOk6HypZVVcwSRoll2_s32qDiPDptjnXe9H2abNVgB5ZzT_rqeeGnqvTzY1T&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" title="Demo video" width="623"></iframe>

Source Code: [ở đây](https://github.com/uongsuadaubung/sudoku-solver)
