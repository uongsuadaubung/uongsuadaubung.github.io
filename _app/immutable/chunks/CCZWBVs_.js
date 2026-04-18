import{a,f as l}from"./DdKyNRsu.js";import"./2eH-Kdi_.js";import{n as p}from"./D64QkPoJ.js";const e={title:"Auto game Pikachu/Pokemon - Part 2",date:"2023-09-01",tags:["Hack Game"],description:"Phần này sẽ nặng về code hơn tí, đầu tiên là mình sẽ tạo một mảng 2 chiều có row = 11 và col = 18 để mình lưu các con pokemon lại, như...",published:!0},{title:r,date:h,tags:u,description:d,published:m}=e;var t=l(`<h1>Auto game Pikachu/Pokemon - Part 2</h1> <p><img src="/images/auto-game-pikachupokemon-part-2/image-01.png" alt="Hình minh hoạ"/></p> <p>Phần này sẽ nặng về code hơn tí, đầu tiên là mình sẽ tạo một mảng 2 chiều có row = 11 và col = 18 để mình lưu các con pokemon lại, nhưng sẽ lưu vào index bắt đầu từ 1,1 đến 9,16 các cạnh viền sẽ để trống để cho thuật toán tìm đường chạy qua các ô số 0 để tìm đến cái con pokemon còn lại :D, trông nó sẽ kiểu như thế này:</p> <div class="code-block"><pre><code class="hljs language-text">        00000000000
        01234567890
        01234567890
        01234567890
        00000000000</code></pre></div> <p>Đầu tiên sẽ khai báo biến:</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> Rows = <span class="hljs-number">11</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> Cols = <span class="hljs-number">18</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">readonly</span> Item[,] _map = <span class="hljs-keyword">new</span> Item[Rows, Cols];</code></pre></div> <p>Tạo một function để đọc ma trận pokemon</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">UpdateMap</span>()</span>
&#123;
    <span class="hljs-built_in">int</span>[] idFirstValueOffset = &#123; <span class="hljs-number">0x000B6044</span> + _baseAddr, <span class="hljs-number">0x76</span> &#125;;
    <span class="hljs-built_in">int</span> addrFirstId = _memory.GetAddressFromPointer(idFirstValueOffset);

    <span class="hljs-built_in">int</span> addrFirstDisplay = addrFirstId - <span class="hljs-number">0x4</span>;

    <span class="hljs-built_in">int</span> currentDisplay = addrFirstDisplay;
    <span class="hljs-built_in">int</span> currentId = addrFirstId;
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; Rows; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">0</span>; j &lt; Cols; j++)
        &#123;
            <span class="hljs-keyword">if</span> (i == <span class="hljs-number">0</span> || j == <span class="hljs-number">0</span> || i == Rows - <span class="hljs-number">1</span> || j == Cols - <span class="hljs-number">1</span>)
            &#123;
                _map[i, j] = <span class="hljs-keyword">new</span> Item &#123; Id = <span class="hljs-number">-1</span>, Show = <span class="hljs-number">0</span> &#125;;
            &#125;
            <span class="hljs-keyword">else</span>
            &#123;
                <span class="hljs-built_in">int</span> valueId = _memory.ReadUShort(currentId);
                <span class="hljs-built_in">int</span> valueDisplay = _memory.ReadUShort(currentDisplay);
                _map[i, j] = <span class="hljs-keyword">new</span> Item &#123; Id = valueId, Show = valueDisplay &#125;;
                <span class="hljs-comment">//memory.WriteNumber(currentId, 25, 2);</span>
                currentDisplay += <span class="hljs-number">0x6</span>;
                currentId += <span class="hljs-number">0x6</span>;
            &#125;
        &#125;

        <span class="hljs-keyword">if</span> (i <span class="hljs-keyword">is</span> <span class="hljs-number">0</span> <span class="hljs-keyword">or</span> Rows - <span class="hljs-number">1</span>)
        &#123;
            <span class="hljs-keyword">continue</span>;
        &#125;

        currentDisplay = addrFirstDisplay + (<span class="hljs-number">0x6c</span> * i);
        currentId = addrFirstId + (<span class="hljs-number">0x6c</span> * i);
    &#125;
&#125;</code></pre></div> <p>Cũng là dùng cái công thức mà mình tìm hiểu từ phần 1 thôi, di chuyển đến con pokemon tiếp theo thì +0x6, còn khi đọc hết 1 row thì nhảy xuống row tiếp theo bằng cách lấy cái địa chỉ đầu tiên + (0x6C*N);</p> <p>Mình lưu pokemon vào trong mảng với 2 giá trị là Id và Show, Id là mã của con pokemon, còn show thì nó có giá trị là 0 hoặc 65535;</p> <p>Sau khi đã có cái ma trận lưu pokemon rồi thì mình chuyển cái thuật toán BFS từ phần 1 mình viết thử bằng Typescript sang C#;</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">IsValidConnectBfs</span>(<span class="hljs-params">MyPoint start, MyPoint end</span>)</span>
&#123;
    <span class="hljs-built_in">bool</span>[,] visited = <span class="hljs-keyword">new</span> <span class="hljs-built_in">bool</span>[Rows, Cols];
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; Rows; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">0</span>; j &lt; Cols; j++)
        &#123;
            visited[i, j] = <span class="hljs-literal">false</span>;
        &#125;
    &#125;

    visited[start.Row, start.Col] = <span class="hljs-literal">true</span>;

    Queue&lt;MyQueue&gt; queues = <span class="hljs-keyword">new</span>();
    queues.Enqueue(<span class="hljs-keyword">new</span> MyQueue(start, <span class="hljs-number">0</span>, <span class="hljs-literal">null</span>));


    <span class="hljs-keyword">while</span> (queues.Count &gt; <span class="hljs-number">0</span>)
    &#123;
        MyQueue queue = queues.Dequeue();
        <span class="hljs-keyword">if</span> (queue.Redirect &gt; <span class="hljs-number">3</span>)
        &#123;
            <span class="hljs-comment">//visited[queue.Position.Row, queue.Position.Col] = false;</span>
            <span class="hljs-keyword">continue</span>;
        &#125;

        <span class="hljs-keyword">if</span> (queue.Position.Col == end.Col &amp;&amp; queue.Position.Row == end.Row)
        &#123;
            <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
        &#125;

        <span class="hljs-keyword">foreach</span> (MyPoint direction <span class="hljs-keyword">in</span> _directions)
        &#123;
            <span class="hljs-built_in">int</span> newRow = queue.Position.Row + direction.Row;
            <span class="hljs-built_in">int</span> newCol = queue.Position.Col + direction.Col;
            <span class="hljs-keyword">if</span> (!IsValidMove(newRow, newCol, end) || visited[newRow, newCol]) <span class="hljs-keyword">continue</span>;
            visited[newRow, newCol] = <span class="hljs-literal">true</span>;

            <span class="hljs-built_in">int</span> newRedirect = queue.Redirect;
            <span class="hljs-keyword">if</span> (
                queue.LastDirection == <span class="hljs-literal">null</span> ||
                queue.LastDirection.Row != direction.Row ||
                queue.LastDirection.Col != direction.Col
            )
            &#123;
                newRedirect++; <span class="hljs-comment">// Nếu có chuyển hướng thì tăng biến redirect</span>
            &#125;

            queues.Enqueue(<span class="hljs-keyword">new</span> MyQueue(<span class="hljs-keyword">new</span> MyPoint &#123; Row = newRow, Col = newCol &#125;, newRedirect, direction));
        &#125;
    &#125;

    <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
&#125;

<span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">IsValidMove</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> newRow, <span class="hljs-built_in">int</span> newCol, MyPoint end</span>)</span>
&#123;
    <span class="hljs-keyword">if</span> (newRow &lt; <span class="hljs-number">0</span> ||
        newRow &gt;= Rows ||
        newCol &lt; <span class="hljs-number">0</span> ||
        newCol &gt;= Cols)
    &#123;
        <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
    &#125;

    <span class="hljs-keyword">if</span> (_map[newRow, newCol].Id == <span class="hljs-number">-1</span> || _map[newRow, newCol].Show == <span class="hljs-number">0</span>)
    &#123;
        <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
    &#125;
    <span class="hljs-keyword">else</span> <span class="hljs-keyword">if</span> (_map[newRow, newCol].Id != <span class="hljs-number">-1</span> &amp;&amp; _map[newRow, newCol].Show &gt; <span class="hljs-number">0</span> &amp;&amp; newCol == end.Col &amp;&amp;
             newRow == end.Row)
    &#123;
        <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
    &#125;

    <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
&#125;

<span class="hljs-keyword">private</span> MyPoint[]? FindAPair()
&#123;
    UpdateMap();
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">1</span>; i &lt;= Rows - <span class="hljs-number">2</span>; i++)
    &#123;
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = <span class="hljs-number">1</span>; j &lt;= Cols - <span class="hljs-number">2</span>; j++)
        &#123;
            <span class="hljs-keyword">if</span> (_map[i, j].Show == <span class="hljs-number">0</span>)
            &#123;
                <span class="hljs-keyword">continue</span>;
            &#125;

            MyPoint poin1 = <span class="hljs-keyword">new</span> MyPoint &#123; Row = i, Col = j &#125;;
            <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> k = <span class="hljs-number">1</span>; k &lt;= Rows - <span class="hljs-number">2</span>; k++)
            &#123;
                <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> l = <span class="hljs-number">1</span>; l &lt;= Cols - <span class="hljs-number">2</span>; l++)
                &#123;
                    <span class="hljs-keyword">if</span> (i == k &amp;&amp; j == l)
                    &#123;
                        <span class="hljs-keyword">continue</span>;
                    &#125;

                    <span class="hljs-keyword">if</span> (_map[k, l].Show == <span class="hljs-number">0</span>)
                    &#123;
                        <span class="hljs-keyword">continue</span>;
                    &#125;

                    <span class="hljs-keyword">if</span> (_map[i, j].Id != _map[k, l].Id)
                    &#123;
                        <span class="hljs-keyword">continue</span>;
                    &#125;

                    MyPoint poin2 = <span class="hljs-keyword">new</span> MyPoint &#123; Row = k, Col = l &#125;;
                    <span class="hljs-comment">//if (i == 2 &amp;&amp; j == 11 &amp;&amp; k == 4)</span>
                    <span class="hljs-comment">//&#123;</span>
                    <span class="hljs-comment">//    Console.WriteLine(&quot;for debug&quot;);</span>
                    <span class="hljs-comment">//&#125;</span>
                    <span class="hljs-keyword">if</span> (!IsValidConnectBfs(poin1, poin2)) <span class="hljs-keyword">continue</span>;
                    MyPoint[] myPoints = &#123; poin1, poin2 &#125;;
                    <span class="hljs-keyword">return</span> myPoints;
                &#125;
            &#125;
        &#125;
    &#125;

    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
&#125;</code></pre></div> <p>Hàm FindAPair để mình lấy ra 2 con pokemon có cùng Id và chưa bị ăn, sau đó gọi đến hàm IsvalidConnectBfs để kiểm tra xem 2 con đó có ăn được không, sẽ duyệt toàn bộ mảng để tìm, sau khi tìm được thì trả về toạ độ row, col của 2 con pokemon đó.</p> <p><img src="/images/auto-game-pikachupokemon-part-2/image-02.png" alt="Test GUI"/></p> <p>Mình tạo một form đơn giản như thế này, đầu tiên là mình muốn check xem thuật toán đã đúng chưa, ở Button Suggest a pair, gọi vào hàm FindAPair, nếu mà có thì sẽ show một cái message box để hiển thị toạ độ tìm được</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">button2_Click</span>(<span class="hljs-params"><span class="hljs-built_in">object</span> sender, EventArgs e</span>)</span>
&#123;
    MyPoint[]? mypoints = FindAPair();

    <span class="hljs-keyword">if</span> (mypoints != <span class="hljs-literal">null</span>)
    &#123;
        MessageBox.Show(<span class="hljs-string">&quot;[&quot;</span> + mypoints[<span class="hljs-number">0</span>].Row + <span class="hljs-string">&quot;,&quot;</span> + mypoints[<span class="hljs-number">0</span>].Col + <span class="hljs-string">&quot;] - [&quot;</span> + mypoints[<span class="hljs-number">1</span>].Row + <span class="hljs-string">&quot;,&quot;</span> +
                        mypoints[<span class="hljs-number">1</span>].Col + <span class="hljs-string">&quot;]&quot;</span>);
    &#125;
&#125;</code></pre></div> <p>Và đây là kết quả:</p> <p><img src="/images/auto-game-pikachupokemon-part-2/image-03.png" alt="Result info"/></p> <p>Hiển thị toạ độ Row=1, Col=1 và Row=9, Col=1, tương ứng với 2 con Psyduck. Vậy là thuật toán đã đúng rồi đó.</p> <p>Giờ bắt đầu chuyển qua làm sao để từ toạ độ Row Col trong map tìm được mình gửi được đến game địa chỉ X,Y. Mới đầu search có vẻ dễ thấy thôi, dùng api SendMessage để gửi click.</p> <div class="code-block"><pre><code class="hljs language-csharp">[<span class="hljs-meta">DllImport(<span class="hljs-string">&quot;user32.dll&quot;</span>)</span>]
<span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">extern</span> IntPtr <span class="hljs-title">SendMessage</span>(<span class="hljs-params">IntPtr hWnd, <span class="hljs-built_in">uint</span> msg, IntPtr wParam, IntPtr lParam</span>)</span>;</code></pre></div> <p>Tưởng đâu ngon ăn thì gửi thử một cái toạ độ mẫu là 500, 500 mãi không được, hoá ra là mình bị hiểu nhầm giữa <code>hWnd</code> và <code>hProcess</code> mình dùng trong việc đọc ghi memory.  Sau một buổi search google đến đau đầu như con vịt kia thì mình cũng đã tìm ra vấn đề và phải tìm thêm cả cửa sổ trò chơi nữa.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">GetWindow</span>()</span>
&#123;
    <span class="hljs-comment">//³s³s¬Ý2</span>

    IntPtr parentHWnd = FindWindow(<span class="hljs-string">&quot;ThunderRT5Form&quot;</span>, <span class="hljs-string">&quot;³s³s¬Ý2&quot;</span>);
    IntPtr res = IntPtr.Zero;

    <span class="hljs-keyword">while</span> (<span class="hljs-literal">true</span>)
    &#123;
        res = FindWindowEx(parentHWnd, res, <span class="hljs-string">&quot;ThunderRT5PictureBox&quot;</span>, <span class="hljs-literal">null</span>);
        <span class="hljs-keyword">if</span> (res == IntPtr.Zero) <span class="hljs-keyword">break</span>;
        _hWnd = res;
    &#125;


&#125;</code></pre></div> <p>Sau đó mình đã test lại gửi đến toạ độ mẫu là 500, 500 và cuối cùng cùng hoạt động.</p> <p>Bước tiếp theo cũng khá là khoai, vì mình phải mò từng tí để tìm ra cái toạ độ đúng của trò chơi, nếu mà hiểu được chính xác thì là tốt hơn nhưng mà mình chịu :D</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">ClickToCell</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> row, <span class="hljs-built_in">int</span> column, <span class="hljs-built_in">int</span> button</span>)</span>
&#123;
    <span class="hljs-built_in">int</span> x = <span class="hljs-number">120</span> + (<span class="hljs-number">80</span> * column);
    <span class="hljs-built_in">int</span> y = <span class="hljs-number">120</span> + (<span class="hljs-number">90</span> * row);

    IntPtr lpa = (IntPtr)((y &lt;&lt; <span class="hljs-number">16</span>) | x);
    SendMessage(_hWnd, (<span class="hljs-built_in">uint</span>)button, (IntPtr)<span class="hljs-number">1</span>, lpa);
&#125;</code></pre></div> <p>Lpa là cái giá trị lưu cả toạ độ x,y vào trong biến đó, mình xem trên mạng đó. Hàm này mình sẽ truyền row và col từ 2 con pokemon mình tìm được vào để nó tự click</p> <p>Trên mới là click vào một cặp, còn để tự động chơi cả một game thì dùng vòng lặp để cho nó lặp lại thôi.</p> <p>Demo:</p> <iframe allowfullscreen="allowfullscreen" title="Demo Video" class="b-hbp-video b-uploaded" frameborder="0" height="473" id="BLOGGER-video-5cddd32208035080-19306" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dzpWxmuKjc9oVy6VZW_XxEMhYCZZDFEFOZYY8p72WSgQFXXbDEi2InPjd6yOAimLjsyK10WtIcipoWQSo9P0UT9dm2EkppyPtzHXqumiJgvk0EAy2QD-K767B6d3SBgTLcpUEEF&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="569"></iframe> <p>Source code: <a href="https://github.com/uongsuadaubung/Picachu-trainer" rel="nofollow">ở đây</a></p> <p>À thật ra trong video mình sửa lại thuật toán tìm kiếm rồi, đổi từ BFS thành DFS, vì cái BFS nếu có nước sai đi trước thì nó đánh visited làm cái nước đi đúng không tìm được đến đích.</p>`,1);function j(s){var n=t();p(62),a(s,n)}export{j as default,e as metadata};
