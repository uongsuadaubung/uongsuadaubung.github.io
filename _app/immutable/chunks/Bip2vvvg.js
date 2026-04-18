import{a,f as l}from"./DdKyNRsu.js";import"./2eH-Kdi_.js";import{n as e}from"./D64QkPoJ.js";const p={title:"Sudoku Solver",date:"2023-09-08",tags:["Hack Game"],description:"Vài năm trước mình có tìm hiểu về thuật toán Backtracking và chả hiểu cái quần què gì hết luôn, tự nhiên thời gian gần đ...",published:!0},{title:h,date:r,tags:u,description:d,published:m}=p;var c=l(`<h1>Sudoku Solver</h1> <p><img src="/images/sudoku-solver/image-01.png" alt="Sudoku header"/></p> <p>Vài năm trước mình có tìm hiểu về thuật toán Backtracking và chả hiểu cái quần què gì hết luôn, tự nhiên thời gian gần đây chả hiểu sao tự giác ngộ được mà mình cũng chả làm gì hết (chắc do thông minh hơn :v). Vậy nên hôm nay sẽ sử dụng Backtrack để áp dụng giải sudoku.</p> <p>Lướt google search download sudoku free thì vô tình nó dẫn đến cái game Sudoku 999 trên Microsoft Store nên mình dùng luôn game này làm chuột bạch nhé.</p> <p>Nói qua một chút về mục tiêu và cách áp dụng backtrack để giải sudoku:</p> <ul><li>Đầu tiên là mình phải đọc được cái map sudoku 9x9 và lưu nó vào mảng của mình.</li> <li>Giải sudoku trên mảng của mình, <ul><li>Bước 1: đầu tiên là phải tìm đến một ô trống, nếu có ô trống thì tiếp bước 2, không còn ô trống nào thì có nghĩa là đã được giải.</li> <li>Bước 2: thử lần lượt từ 1 đến 9 trên ô trống đó, nếu số đang thử hợp lệ thì thì tiếp tục lặp lại từ bước 1, không hợp lệ thì chuyển sang số tiếp theo. nếu hết 9 số đó rồi mà vẫn không có số hợp lệ thì do game sai :V</li> <li>Bước 3 : không có bước 3, viết cho có thôi, quan trọng là phải hiểu được chứ mình cũng chả biết giải thích sao vì hồi trước cố mãi mình cũng chả thể hiểu được, rồi đến một lúc nào đó lại tự hiểu, thế mới buồn cười.</li></ul></li></ul> <p>Công cụ sử dụng:</p> <ul><li>Cheat Engine.</li> <li>C# Programing Language.</li> <li>Một cái đầu lạnh để hiểu cái mình muốn nói, hoặc không cần vì chỉ đọc cho vui.</li></ul> <h3>Tìm địa chỉ ô nhớ đầu tiên của cái map game.</h3> <p><img src="/images/sudoku-solver/image-02.png" alt="Cheat Engine"/></p> <p>Mở CE lên chọn vào game và search thôi, là số nào thì search số đó, ô trống thì là số 0. Trên máy mình thì nó là địa chỉ này: 0x1C980114064</p> <p>Khi tìm được rồi thì chuột phải vào và chọn tiếp Browse this memory region để xem thử cái map game.</p> <p><img src="/images/sudoku-solver/image-03.png" alt="Browse Memory"/></p> <p>Kết quả như sau:</p> <p><img src="/images/sudoku-solver/image-04.png" alt="Hex View 1"/></p> <p>Bên phải ô đó là số 1, nhưng mình không nhìn thấy số 1 ngay bên cạnh giá trị 0, nên là làm lại từ đầu nhưng đối với ô thứ 2, tức là cái ô này</p> <p><img src="/images/sudoku-solver/image-05.png" alt="Game Cell 2"/></p> <p>Sau vài bước tìm thì mình tìm được địa chỉ này: 0x1C98011417C</p> <p>Lấy địa chỉ sau trừ đi địa chỉ trước <code>0x1C98011417C - 0x1C980114064 = 0x118</code>, thấy hơi lạ vì không biết sao mà nó lại cách xa nhau thế, để kiểm tra xem có đúng không mình lấy <code>0x1C98011417C + 0x118 = 0x1C980114294</code> và thêm địa chỉ mình tính được vào CE bằng cách ấn Add address manually.</p> <p><img src="/images/sudoku-solver/image-06.png" alt="Hex View 2"/></p> <p>Đúng là ô tiếp theo luôn, thử tiếp vài lần và kết quả vẫn đúng. Vậy là mình sẽ tìm pointer cho cái địa chỉ đầu tiên, những cái sau sẽ dựa vào đó để tính tiếp. Sau khi tìm thấy có rất nhiều pointer trỏ đến địa chỉ đó và tất cả cái nào cũng được nên mình chọn cái ngắn nhất là</p> <p><img src="/images/sudoku-solver/image-07.png" alt="Pointers"/></p> <h3>Bắt đầu code</h3> <p>Lúc chạy thử code thì mình mới còn nhận ra một việc nữa là trước giờ toàn cheat trên mấy con game 32bit, giờ mới nhận ra cái game Sudoku này là 64bit, bảo sao cái địa chỉ ô nhớ nó lạ thế.</p> <p><img src="/images/sudoku-solver/image-08.png" alt="Address View"/></p> <p>Nên khi khởi động lên có hàm lấy baseaddress.ToInt32() nó báo lỗi, nên mình phải sửa lại kiểu dữ liệu của biến <code>_baseAddress</code> thành IntPtr và còn là đổi kiểu dữ liệu của mấy cái function khác nữa, sau khi đổi xong thì code nó mới khởi động được. Xem source ở link nhá mình không viết hết ra đây.</p> <p>Rồi xong để ý mới thấy trước giờ mấy game khác toàn là <code>abc.exe</code> ví dụ SudokuFree10.exe, mà giờ nó lại là <code>SudokuFree10.dll</code>, đành phải search google một lúc thì tìm thấy mình phải tìm đến module có tên <code>SudokuFree10.dll</code> và lấy base address từ <code>SudokuFree10.dll</code>, khác bình thường một chút thôi, sửa lại hàm trong class Mymemory</p> <p>Từ:</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">GetProcess</span>()</span>
&#123;
    Process[] processes = Process.GetProcessesByName(_processName);

    <span class="hljs-keyword">if</span> (processes.Length &gt; <span class="hljs-number">0</span>)
    &#123;
        _process = Process.GetProcessesByName(_processName)[<span class="hljs-number">0</span>];

        _processHandle = OpenProcess(ProcessAllAccess, <span class="hljs-literal">false</span>, _process.Id);
        <span class="hljs-keyword">if</span> (_process.MainModule != <span class="hljs-literal">null</span>) _baseAddress = _process.MainModule.BaseAddress.ToInt32();
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        _process = <span class="hljs-literal">null</span>;
    &#125;
&#125;</code></pre></div> <p>Thành:</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">GetProcess</span>()</span>
&#123;
    Process[] processes = Process.GetProcessesByName(_processName);

    <span class="hljs-keyword">if</span> (processes.Length &gt; <span class="hljs-number">0</span>)
    &#123;
        _process = Process.GetProcessesByName(_processName)[<span class="hljs-number">0</span>];

        _processHandle = OpenProcess(ProcessAllAccess, <span class="hljs-literal">false</span>, _process.Id);
        <span class="hljs-keyword">if</span> (_process.MainModule == <span class="hljs-literal">null</span>) <span class="hljs-keyword">return</span>;
        _baseAddress = _process.MainModule.BaseAddress;
        <span class="hljs-keyword">foreach</span> (ProcessModule module <span class="hljs-keyword">in</span> _process.Modules)
        &#123;
            <span class="hljs-keyword">if</span> (module.ModuleName != <span class="hljs-keyword">this</span>._processName + <span class="hljs-string">&quot;.dll&quot;</span>) <span class="hljs-keyword">continue</span>;
            _baseAddress = module.BaseAddress;
            <span class="hljs-keyword">break</span>;
        &#125;
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        _process = <span class="hljs-literal">null</span>;
    &#125;
&#125;</code></pre></div> <p>Thiết kế form</p> <p><img src="/images/sudoku-solver/image-09.png" alt="Form Design 1"/></p> <p>Vì có 9x9 = 81 cái ô nên mình không thêm button bằng tay mà sẽ thêm bằng code, sau đó add các button này vào mảng 2 chiều tương ứng với game luôn để mình quản lý hiển thị cho nó dễ.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-comment">//Cell.cs</span>
<span class="hljs-keyword">namespace</span> <span class="hljs-title">Sudoku_solver</span>
&#123;
    <span class="hljs-keyword">internal</span> <span class="hljs-keyword">class</span> <span class="hljs-title">Cell</span>
    &#123;
        <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-title">Cell</span>(<span class="hljs-params">Button button</span>)</span>
        &#123;
            Button = button;
        &#125;

        <span class="hljs-keyword">public</span> Button Button &#123; <span class="hljs-keyword">get</span>; &#125;
        <span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> Value &#123;  <span class="hljs-keyword">get</span>; <span class="hljs-keyword">set</span>; &#125;
    &#125;
&#125;</code></pre></div> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">InitBoard</span>()</span>
&#123;
    Button oldButton = <span class="hljs-keyword">new</span>() &#123; Location = <span class="hljs-keyword">new</span> Point &#123; X = <span class="hljs-number">0</span>, Y = <span class="hljs-number">10</span> &#125;, Width = <span class="hljs-number">0</span>, Height = <span class="hljs-number">0</span> &#125;;
    <span class="hljs-comment">// pnButton.Controls.Add(oldButton);</span>
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; GridSize; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">0</span>; j &lt; GridSize; j++)
        &#123;
            Button button = <span class="hljs-keyword">new</span>()
            &#123;
                Location = oldButton.Location <span class="hljs-keyword">with</span> &#123; X = oldButton.Location.X + oldButton.Width + (j % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> ? <span class="hljs-number">10</span> : <span class="hljs-number">0</span>) &#125;,
                Width = ButtonSize,
                Height = ButtonSize,
                <span class="hljs-comment">// Enabled = false,</span>
                Font = <span class="hljs-keyword">new</span> Font(Font.FontFamily, <span class="hljs-number">15</span>),
                BackColor = Color.White
            &#125;;
            _grid[i, j] = <span class="hljs-keyword">new</span> Cell(button);
            pnButton.Controls.Add(_grid[i, j].Button);
            oldButton = button;
        &#125;
        oldButton = <span class="hljs-keyword">new</span> Button()
        &#123;
            Location = <span class="hljs-keyword">new</span> Point &#123; X = <span class="hljs-number">0</span>, Y = oldButton.Location.Y + oldButton.Height + ((i + <span class="hljs-number">1</span>) % <span class="hljs-number">3</span> == <span class="hljs-number">0</span> ? <span class="hljs-number">10</span> : <span class="hljs-number">0</span>) &#125;,
            Width = <span class="hljs-number">0</span>,
            Height = <span class="hljs-number">0</span>
        &#125;;

    &#125;
&#125;</code></pre></div> <p>Để khi khởi động lên nó sẽ tạo ra một cái bảng giống game sudoku</p> <p><img src="/images/sudoku-solver/image-10.png" alt="Form Run"/></p> <p>Sau khi dựng được cái khung lên rồi thì đọc cái map game vào cái mảng của mình thôi.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">ImportBoard</span>()</span>
&#123;
    _empty = <span class="hljs-number">0</span>;
    <span class="hljs-built_in">long</span>[] pointer = &#123; (<span class="hljs-number">0x011B7038</span>) + _baseAddress.ToInt64(), <span class="hljs-number">0xE8</span>, <span class="hljs-number">0x58</span>, <span class="hljs-number">0x8</span>, <span class="hljs-number">0x10</span>, <span class="hljs-number">0x1c</span> &#125;;
    <span class="hljs-built_in">long</span> firstAddress = _memory.GetAddressFromPointer(pointer);
    <span class="hljs-built_in">long</span> current = firstAddress;
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; GridSize; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">0</span>; j &lt; GridSize; j++)
        &#123;
            <span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span> = _memory.ReadInt(current);
            _grid[i, j].Value = <span class="hljs-keyword">value</span>;
            _grid[i, j].Button.Text = <span class="hljs-keyword">value</span>.ToString();
            _grid[i, j].Button.Font = <span class="hljs-keyword">value</span> != <span class="hljs-number">0</span>
                ? <span class="hljs-keyword">new</span> Font(_grid[i, j].Button.Font.FontFamily, <span class="hljs-number">15</span>, FontStyle.Bold)
                : <span class="hljs-keyword">new</span> Font(_grid[i, j].Button.Font.FontFamily, <span class="hljs-number">15</span>);
            _grid[i, j].Button.Enabled = <span class="hljs-keyword">value</span> == <span class="hljs-number">0</span>;
            <span class="hljs-keyword">if</span> (<span class="hljs-keyword">value</span> == <span class="hljs-number">0</span>)
            &#123;
                _empty++;
            &#125;
            current += <span class="hljs-number">0x118</span>;
        &#125;

        current = firstAddress + (i + <span class="hljs-number">1</span>) * <span class="hljs-number">0x9d8</span>;
    &#125;
&#125;</code></pre></div> <p>Ở đây mình sẽ format cái button 1 xíu, cái nào là số có sẵn mình để in đậm hơn, còn cái nào là số mình phải điền trong game thì mình muốn hiển thị nó không đậm.</p> <p><img src="/images/sudoku-solver/image-11.png" alt="Form imported"/></p> <p>Chạy code test thấy có vẻ khá oke rồi, giờ bước tiếp theo là giải cái map đó</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">Solve</span>()</span>
&#123;
    <span class="hljs-built_in">int</span>[]? spot = FindEmptySpot();
    <span class="hljs-keyword">if</span> (spot == <span class="hljs-literal">null</span>) <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;

    <span class="hljs-built_in">int</span> x = spot[<span class="hljs-number">0</span>];
    <span class="hljs-built_in">int</span> y = spot[<span class="hljs-number">1</span>];
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span> = <span class="hljs-number">1</span>; <span class="hljs-keyword">value</span> &lt;= GridSize; <span class="hljs-keyword">value</span>++)
    &#123;
        <span class="hljs-keyword">if</span> (!IsValid(x, y, <span class="hljs-keyword">value</span>)) <span class="hljs-keyword">continue</span>;
        _grid[x, y].Value = <span class="hljs-keyword">value</span>;
        _grid[x, y].Button.Text = <span class="hljs-keyword">value</span>.ToString();
        _grid[x, y].Button.ForeColor = Color.Red;

        <span class="hljs-keyword">if</span> (Solve())
        &#123;
            <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
        &#125;
        _grid[x, y].Value = <span class="hljs-number">0</span>;
        _grid[x, y].Button.Text = <span class="hljs-string">&quot;0&quot;</span>;
    &#125;

    <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
&#125;</code></pre></div> <p>cụ thể code <code>FindEmptySpot()</code> và <code>IsValid()</code> xem trong source code nhé. Ở hàm <code>Solve()</code> này mình sẽ tô màu đỏ cho những cái ô giải được.</p> <p>Chạy code test</p> <p><img src="/images/sudoku-solver/image-12.png" alt="Form Solved"/></p> <p>YEAH!! vậy là được rồi, làm nốt phần tự động điền thì ghi ngược lại phần đã giải vào địa chỉ ô đọc bằng 0 thôi</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">FillBoard</span>()</span>
&#123;
    <span class="hljs-keyword">if</span> (FindEmptySpot() != <span class="hljs-literal">null</span>)
    &#123;
        MessageBox.Show(<span class="hljs-string">&quot;Solve it first&quot;</span>);
        <span class="hljs-keyword">return</span>;
    &#125;
    <span class="hljs-built_in">long</span>[] pointer = &#123; (<span class="hljs-number">0x011B7038</span>) + _baseAddress.ToInt64(), <span class="hljs-number">0xE8</span>, <span class="hljs-number">0x58</span>, <span class="hljs-number">0x8</span>, <span class="hljs-number">0x10</span>, <span class="hljs-number">0x1c</span> &#125;;
    <span class="hljs-built_in">long</span> firstAddress = _memory.GetAddressFromPointer(pointer);
    <span class="hljs-built_in">long</span> current = firstAddress;
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; GridSize; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">0</span>; j &lt; GridSize; j++)
        &#123;
            <span class="hljs-keyword">if</span> (_empty &lt;= <span class="hljs-number">1</span>)
            &#123;
                MessageBox.Show(<span class="hljs-string">&quot;Ok&quot;</span>);
                <span class="hljs-keyword">return</span>;
            &#125;
            <span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span> = _memory.ReadInt(current);
            <span class="hljs-keyword">if</span> (<span class="hljs-keyword">value</span> == <span class="hljs-number">0</span>)
            &#123;
                _memory.WriteNumber(current, _grid[i, j].Value, <span class="hljs-number">1</span>);
                _empty--;
            &#125;



            current += <span class="hljs-number">0x118</span>;
        &#125;

        current = firstAddress + (i + <span class="hljs-number">1</span>) * <span class="hljs-number">0x9d8</span>;
    &#125;
&#125;</code></pre></div> <p>Mình phải để dư lại 1 ô trống vì nếu giải hết game nó tự mở một màn mới luôn mà không tính win cho mình, nên là mình sẽ phải tự động điền 1 ô cuối cùng.</p> <p>Daily Challenge, tôi khiêm tốn giành top 1 thôi :))</p> <p><img src="/images/sudoku-solver/image-13.png" alt="Daily Challenge Top 1"/></p> <p>Video demo:</p> <iframe allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="518" id="BLOGGER-video-78645682fbbf1e07-10996" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dzBmpi1vYb-tHCXW_Vh66l38gp5SQ2csvxfderhnvFWNWZgY3R7ydXu5YZpJQVFaXv5Hki7cknCCOk6HypZVVcwSRoll2_s32qDiPDptjnXe9H2abNVgB5ZzT_rqeeGnqvTzY1T&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" title="Demo video" width="623"></iframe> <p>Source Code: <a href="https://github.com/uongsuadaubung/sudoku-solver" rel="nofollow">ở đây</a></p>`,1);function g(s){var n=c();e(108),a(s,n)}export{g as default,p as metadata};
