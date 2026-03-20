---
title: "Auto game Pikachu/Pokemon - Part 2"
date: "2023-09-01"
tags: ["Cheat Engine", "Hack Game"]
description: "Phần này sẽ nặng về code hơn tí, đầu tiên là mình sẽ tạo một mảng 2 chiều có row = 11 và col = 18 để mình lưu các con pokemon lại, như..."
published: true
---

# Auto game Pikachu/Pokemon - Part 2

![Hình minh hoạ](/images/auto-game-pikachupokemon-part-2/image-01.png)

Phần này sẽ nặng về code hơn tí, đầu tiên là mình sẽ tạo một mảng 2 chiều có row = 11 và col = 18 để mình lưu các con pokemon lại, nhưng sẽ lưu vào index bắt đầu từ 1,1 đến 9,16 các cạnh viền sẽ để trống để cho thuật toán tìm đường chạy qua các ô số 0 để tìm đến cái con pokemon còn lại :D, trông nó sẽ kiểu như thế này:

```text
        00000000000
        01234567890
        01234567890
        01234567890
        00000000000
```

Đầu tiên sẽ khai báo biến:
```csharp
private const int Rows = 11;
private const int Cols = 18;
private readonly Item[,] _map = new Item[Rows, Cols];
```

Tạo một function để đọc ma trận pokemon
```csharp
private void UpdateMap()
{
    int[] idFirstValueOffset = { 0x000B6044 + _baseAddr, 0x76 };
    int addrFirstId = _memory.GetAddressFromPointer(idFirstValueOffset);

    int addrFirstDisplay = addrFirstId - 0x4;

    int currentDisplay = addrFirstDisplay;
    int currentId = addrFirstId;
    for (int i = 0; i < Rows; i++)
    {
        for (int j = 0; j < Cols; j++)
        {
            if (i == 0 || j == 0 || i == Rows - 1 || j == Cols - 1)
            {
                _map[i, j] = new Item { Id = -1, Show = 0 };
            }
            else
            {
                int valueId = _memory.ReadUShort(currentId);
                int valueDisplay = _memory.ReadUShort(currentDisplay);
                _map[i, j] = new Item { Id = valueId, Show = valueDisplay };
                //memory.WriteNumber(currentId, 25, 2);
                currentDisplay += 0x6;
                currentId += 0x6;
            }
        }

        if (i is 0 or Rows - 1)
        {
            continue;
        }

        currentDisplay = addrFirstDisplay + (0x6c * i);
        currentId = addrFirstId + (0x6c * i);
    }
}
```

Cũng là dùng cái công thức mà mình tìm hiểu từ phần 1 thôi, di chuyển đến con pokemon tiếp theo thì +0x6, còn khi đọc hết 1 row thì nhảy xuống row tiếp theo bằng cách lấy cái địa chỉ đầu tiên + (0x6C*N);

Mình lưu pokemon vào trong mảng với 2 giá trị là Id và Show, Id là mã của con pokemon, còn show thì nó có giá trị là 0 hoặc 65535;

Sau khi đã có cái ma trận lưu pokemon rồi thì mình chuyển cái thuật toán BFS từ phần 1 mình viết thử bằng Typescript sang C#;

```csharp
private bool IsValidConnectBfs(MyPoint start, MyPoint end)
{
    bool[,] visited = new bool[Rows, Cols];
    for (int i = 0; i < Rows; i++)
    {
        for (int j = 0; j < Cols; j++)
        {
            visited[i, j] = false;
        }
    }

    visited[start.Row, start.Col] = true;

    Queue<MyQueue> queues = new();
    queues.Enqueue(new MyQueue(start, 0, null));


    while (queues.Count > 0)
    {
        MyQueue queue = queues.Dequeue();
        if (queue.Redirect > 3)
        {
            //visited[queue.Position.Row, queue.Position.Col] = false;
            continue;
        }

        if (queue.Position.Col == end.Col && queue.Position.Row == end.Row)
        {
            return true;
        }

        foreach (MyPoint direction in _directions)
        {
            int newRow = queue.Position.Row + direction.Row;
            int newCol = queue.Position.Col + direction.Col;
            if (!IsValidMove(newRow, newCol, end) || visited[newRow, newCol]) continue;
            visited[newRow, newCol] = true;

            int newRedirect = queue.Redirect;
            if (
                queue.LastDirection == null ||
                queue.LastDirection.Row != direction.Row ||
                queue.LastDirection.Col != direction.Col
            )
            {
                newRedirect++; // Nếu có chuyển hướng thì tăng biến redirect
            }

            queues.Enqueue(new MyQueue(new MyPoint { Row = newRow, Col = newCol }, newRedirect, direction));
        }
    }

    return false;
}

private bool IsValidMove(int newRow, int newCol, MyPoint end)
{
    if (newRow < 0 ||
        newRow >= Rows ||
        newCol < 0 ||
        newCol >= Cols)
    {
        return false;
    }

    if (_map[newRow, newCol].Id == -1 || _map[newRow, newCol].Show == 0)
    {
        return true;
    }
    else if (_map[newRow, newCol].Id != -1 && _map[newRow, newCol].Show > 0 && newCol == end.Col &&
             newRow == end.Row)
    {
        return true;
    }

    return false;
}

private MyPoint[]? FindAPair()
{
    UpdateMap();
    for (int i = 1; i <= Rows - 2; i++)
    {
        for (int j = 1; j <= Cols - 2; j++)
        {
            if (_map[i, j].Show == 0)
            {
                continue;
            }

            MyPoint poin1 = new MyPoint { Row = i, Col = j };
            for (int k = 1; k <= Rows - 2; k++)
            {
                for (int l = 1; l <= Cols - 2; l++)
                {
                    if (i == k && j == l)
                    {
                        continue;
                    }

                    if (_map[k, l].Show == 0)
                    {
                        continue;
                    }

                    if (_map[i, j].Id != _map[k, l].Id)
                    {
                        continue;
                    }

                    MyPoint poin2 = new MyPoint { Row = k, Col = l };
                    //if (i == 2 && j == 11 && k == 4)
                    //{
                    //    Console.WriteLine("for debug");
                    //}
                    if (!IsValidConnectBfs(poin1, poin2)) continue;
                    MyPoint[] myPoints = { poin1, poin2 };
                    return myPoints;
                }
            }
        }
    }

    return null;
}
```

Hàm FindAPair để mình lấy ra 2 con pokemon có cùng Id và chưa bị ăn, sau đó gọi đến hàm IsvalidConnectBfs để kiểm tra xem 2 con đó có ăn được không, sẽ duyệt toàn bộ mảng để tìm, sau khi tìm được thì trả về toạ độ row, col của 2 con pokemon đó.

![Test GUI](/images/auto-game-pikachupokemon-part-2/image-02.png)

Mình tạo một form đơn giản như thế này, đầu tiên là mình muốn check xem thuật toán đã đúng chưa, ở Button Suggest a pair, gọi vào hàm FindAPair, nếu mà có thì sẽ show một cái message box để hiển thị toạ độ tìm được

```csharp
private void button2_Click(object sender, EventArgs e)
{
    MyPoint[]? mypoints = FindAPair();

    if (mypoints != null)
    {
        MessageBox.Show("[" + mypoints[0].Row + "," + mypoints[0].Col + "] - [" + mypoints[1].Row + "," +
                        mypoints[1].Col + "]");
    }
}
```

Và đây là kết quả: 

![Result info](/images/auto-game-pikachupokemon-part-2/image-03.png)

Hiển thị toạ độ Row=1, Col=1 và Row=9, Col=1, tương ứng với 2 con Psyduck. Vậy là thuật toán đã đúng rồi đó.

Giờ bắt đầu chuyển qua làm sao để từ toạ độ Row Col trong map tìm được mình gửi được đến game địa chỉ X,Y. Mới đầu search có vẻ dễ thấy thôi, dùng api SendMessage để gửi click. 

```csharp
[DllImport("user32.dll")]
private static extern IntPtr SendMessage(IntPtr hWnd, uint msg, IntPtr wParam, IntPtr lParam);
```

Tưởng đâu ngon ăn thì gửi thử một cái toạ độ mẫu là 500, 500 mãi không được, hoá ra là mình bị hiểu nhầm giữa `hWnd` và `hProcess` mình dùng trong việc đọc ghi memory.  Sau một buổi search google đến đau đầu như con vịt kia thì mình cũng đã tìm ra vấn đề và phải tìm thêm cả cửa sổ trò chơi nữa.

```csharp
private void GetWindow()
{
    //³s³s¬Ý2

    IntPtr parentHWnd = FindWindow("ThunderRT5Form", "³s³s¬Ý2");
    IntPtr res = IntPtr.Zero;

    while (true)
    {
        res = FindWindowEx(parentHWnd, res, "ThunderRT5PictureBox", null);
        if (res == IntPtr.Zero) break;
        _hWnd = res;
    }


}
```

Sau đó mình đã test lại gửi đến toạ độ mẫu là 500, 500 và cuối cùng cùng hoạt động.

Bước tiếp theo cũng khá là khoai, vì mình phải mò từng tí để tìm ra cái toạ độ đúng của trò chơi, nếu mà hiểu được chính xác thì là tốt hơn nhưng mà mình chịu :D

```csharp
public void ClickToCell(int row, int column, int button)
{
    int x = 120 + (80 * column);
    int y = 120 + (90 * row);

    IntPtr lpa = (IntPtr)((y << 16) | x);
    SendMessage(_hWnd, (uint)button, (IntPtr)1, lpa);
}
```

Lpa là cái giá trị lưu cả toạ độ x,y vào trong biến đó, mình xem trên mạng đó. Hàm này mình sẽ truyền row và col từ 2 con pokemon mình tìm được vào để nó tự click

Trên mới là click vào một cặp, còn để tự động chơi cả một game thì dùng vòng lặp để cho nó lặp lại thôi.

Demo:
<iframe allowfullscreen="allowfullscreen"
        title="Demo Video"
        class="b-hbp-video b-uploaded" frameborder="0" height="473" id="BLOGGER-video-5cddd32208035080-19306"
        mozallowfullscreen="mozallowfullscreen"
        src="https://www.blogger.com/video.g?token=AD6v5dzpWxmuKjc9oVy6VZW_XxEMhYCZZDFEFOZYY8p72WSgQFXXbDEi2InPjd6yOAimLjsyK10WtIcipoWQSo9P0UT9dm2EkppyPtzHXqumiJgvk0EAy2QD-K767B6d3SBgTLcpUEEF&amp;origin=uongsuadaubung.blogspot.com"
        webkitallowfullscreen="webkitallowfullscreen" width="569"></iframe>

Source code: [ở đây](https://github.com/uongsuadaubung/Picachu-trainer)

À thật ra trong video mình sửa lại thuật toán tìm kiếm rồi, đổi từ BFS thành DFS, vì cái BFS nếu có nước sai đi trước thì nó đánh visited làm cái nước đi đúng không tìm được đến đích.
