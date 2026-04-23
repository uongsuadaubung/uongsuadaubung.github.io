import{a as n,f as l}from"./CU_Tu6Mf.js";import"./BiabzJe8.js";import{n as p}from"./DwHbYvjF.js";const t={title:"Hack Plants Vs Zombies GOTY Edition - part 1",date:"2020-06-09",tags:["Hack Game"],description:"Plants Vs. Zombies từ trước đến nay vẫn luôn là tượng đài của thể loại phòng thủ tháp được rất nhiều người chơi yêu thích. Hướng dẫn viết tool hack trên Winform.",published:!0},{title:r,date:o,tags:d,description:j,published:u}=t;var e=l(`<h1>Hack Plants Vs Zombies GOTY Edition - part 1</h1> <p><img src="/images/plants-vs-zombies-goty-edition-part-1/image-01.jpg" alt="Plants vs Zombies GOTY Edition"/></p> <p>Plants Vs. Zombies từ trước đến nay vẫn luôn là tượng đài của thể loại phòng thủ tháp được rất nhiều người chơi yêu thích. Nó có giá rất rẻ thôi, có 14k mua trên steam lúc giảm giá, mua ủng hộ tác giả, link ở <a href="https://store.steampowered.com/app/3590/Plants_vs_Zombies_GOTY_Edition/" rel="nofollow">đây</a></p> <p>Ở phần này thì mình sẽ làm trên Winform để trông nó đẹp ngầu hơn là nhìn màn hình màu đen trên Console, một vài chức năng mà mình sẽ làm là</p> <ol><li>Hack tăng số lượng mặt trời và xu</li> <li>Hack tự động nhặt mặt trời / xu</li> <li>Hack thời gian hồi cây</li> <li>Hack one hit</li></ol> <p>Ừ thì có thể sẽ có ai đó nghĩ: “việc quái gì phải hướng dẫn, search 1 cái là ra”… đúng thế, với xu thì là đúng thế thật, đặt vài tỉ thì chả bao giờ tiêu hết. Nhưng với mặt trời mỗi game xong mình lại phải làm lại, lặp đi lặp lại thế đương nhiên chán vl, không kể các chế độ khác nữa chứ,,, mình sẽ hướng dẫn tìm 1 lần mà dùng mãi mãi, đó là tìm pointer. Nhưng mà mục đích cuối cùng đứng trên tất cả vẫn là viết tool 😁😁, các bạn sẽ học được cách làm việc với pointer như thế nào.</p> <p>Nhưng mà việc đầu tiên là phải khắc phục vấn đề còn tồn đọng ở bài hack game winsweeper lần trước đã. Vấn đề mắc phải là code đọc ghi bộ nhớ nó không được tối ưu tí nào, vì là bài đầu tiên nên mình chỉ làm đơn giản thế để tìm hiểu thôi, giờ sẽ viết lại thành một file class để có thể tái sử dụng được cho mọi game.</p> <p>Mình đặt tên class là <code>MyMemory</code>, còn bạn đặt khác cũng được, nhớ lúc dùng gọi cho đúng.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">class</span> <span class="hljs-title">MyMemory</span>
&#123;
    <span class="hljs-keyword">private</span> IntPtr processHandle;
    <span class="hljs-keyword">private</span> Process process;
    <span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> PROCESS_ALL_ACCESS = <span class="hljs-number">0x1F0FFF</span>;

    <span class="hljs-comment">//const int PROCESS_WM_READ = 0x0010;</span>
    [<span class="hljs-meta">DllImport(<span class="hljs-string">&quot;kernel32.dll&quot;</span>)</span>]
    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">extern</span> IntPtr <span class="hljs-title">OpenProcess</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> dwDesiredAccess, <span class="hljs-built_in">bool</span> bInheritHandle, <span class="hljs-built_in">int</span> dwProcessId</span>)</span>;

    [<span class="hljs-meta">DllImport(<span class="hljs-string">&quot;kernel32.dll&quot;</span>)</span>]
    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">extern</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">ReadProcessMemory</span>(<span class="hljs-params">IntPtr hProcess, <span class="hljs-built_in">int</span> lpBaseAddress, <span class="hljs-built_in">byte</span>[] lpBuffer, <span class="hljs-built_in">int</span> dwSize, <span class="hljs-keyword">ref</span> <span class="hljs-built_in">int</span> lpNumberOfBytesRead</span>)</span>;

    [<span class="hljs-meta">DllImport(<span class="hljs-string">&quot;kernel32.dll&quot;</span>, SetLastError = true)</span>]
    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-keyword">extern</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">WriteProcessMemory</span>(<span class="hljs-params">IntPtr hProcess, <span class="hljs-built_in">int</span> lpBaseAddress, <span class="hljs-built_in">byte</span>[] lpBuffer, <span class="hljs-built_in">int</span> dwSize, <span class="hljs-keyword">ref</span> <span class="hljs-built_in">int</span> lpNumberOfBytesWritten</span>)</span>;

    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-built_in">byte</span>[] <span class="hljs-title">ReadBytes</span>(<span class="hljs-params">IntPtr Handle, <span class="hljs-built_in">int</span> Address, <span class="hljs-built_in">int</span> size</span>)</span>
    &#123;
        <span class="hljs-built_in">int</span> bytesRead = <span class="hljs-number">0</span>;
        <span class="hljs-built_in">byte</span>[] buffer = <span class="hljs-keyword">new</span> <span class="hljs-built_in">byte</span>[size];
        ReadProcessMemory(Handle, Address, buffer, size, <span class="hljs-keyword">ref</span> bytesRead);
        <span class="hljs-keyword">return</span> buffer;
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> <span class="hljs-title">GetBaseAddress</span>()</span>
    &#123;
        <span class="hljs-keyword">return</span> process.MainModule.BaseAddress.ToInt32();
    &#125;

    <span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">static</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">WriteBytes</span>(<span class="hljs-params">IntPtr Handle, <span class="hljs-built_in">int</span> Address,<span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span>, <span class="hljs-built_in">int</span> size</span>)</span>
    &#123;
        <span class="hljs-built_in">int</span> BytesWrite = <span class="hljs-number">0</span>;
        <span class="hljs-built_in">byte</span>[] buffer = BitConverter.GetBytes(<span class="hljs-keyword">value</span>);
        <span class="hljs-keyword">return</span> WriteProcessMemory(Handle, Address, buffer, size, <span class="hljs-keyword">ref</span> BytesWrite);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-title">MyMemory</span>(<span class="hljs-params"><span class="hljs-built_in">string</span> processName</span>)</span>
    &#123;
        <span class="hljs-keyword">try</span>
        &#123;
            process = Process.GetProcessesByName(processName)[<span class="hljs-number">0</span>];
            processHandle = OpenProcess(PROCESS_ALL_ACCESS, <span class="hljs-literal">false</span>, process.Id);
        &#125;
        <span class="hljs-keyword">catch</span>
        &#123;
            process = <span class="hljs-literal">null</span>;
        &#125;
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> <span class="hljs-title">ReadInt</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>	
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToInt32(ReadBytes(processHandle, Address, <span class="hljs-number">4</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">uint</span> <span class="hljs-title">ReadUInt</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToUInt32(ReadBytes(processHandle, Address, <span class="hljs-number">4</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">short</span> <span class="hljs-title">ReadShort</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToInt16(ReadBytes(processHandle, Address, <span class="hljs-number">2</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">ushort</span> <span class="hljs-title">ReadUShort</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToUInt16(ReadBytes(processHandle, Address, <span class="hljs-number">2</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">byte</span> <span class="hljs-title">ReadByte</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> ReadBytes(processHandle, Address, <span class="hljs-number">1</span>)[<span class="hljs-number">0</span>];
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">double</span> <span class="hljs-title">ReadDouble</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToDouble(ReadBytes(processHandle, Address, <span class="hljs-number">8</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">float</span> <span class="hljs-title">ReadFloat</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>
    &#123;
        <span class="hljs-keyword">return</span> BitConverter.ToSingle(ReadBytes(processHandle, Address, <span class="hljs-number">4</span>), <span class="hljs-number">0</span>);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">WriteNumber</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address,<span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span>, <span class="hljs-built_in">int</span> length = <span class="hljs-number">4</span></span>)</span>
    &#123;
        WriteBytes(processHandle, Address, <span class="hljs-keyword">value</span>, length);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">string</span> <span class="hljs-title">ReadString</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address, <span class="hljs-built_in">int</span> length = <span class="hljs-number">32</span></span>)</span>
    &#123;
        <span class="hljs-built_in">string</span> temp3 = Encoding.Unicode.GetString(ReadBytes(processHandle, Address, length));
        <span class="hljs-built_in">string</span>[] temp3str = temp3.Split(<span class="hljs-string">&#x27;\\0&#x27;</span>);
        <span class="hljs-keyword">return</span> temp3str[<span class="hljs-number">0</span>];
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">WriteString</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address,<span class="hljs-built_in">string</span> <span class="hljs-keyword">value</span>, <span class="hljs-built_in">uint</span> length = <span class="hljs-number">32</span></span>)</span>
    &#123;
        <span class="hljs-built_in">int</span> bytesWritten = <span class="hljs-number">0</span>;
        <span class="hljs-built_in">byte</span>[] buffer = Encoding.Unicode.GetBytes(<span class="hljs-keyword">value</span>+<span class="hljs-string">&quot;\\0&quot;</span>); <span class="hljs-comment">// &#x27;\\0&#x27; marks the end of string</span>

        <span class="hljs-comment">// replace 0x0046A3B8 with your address</span>
        WriteProcessMemory(processHandle, Address, buffer, buffer.Length, <span class="hljs-keyword">ref</span> bytesWritten);
    &#125;
    
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">isOK</span>()</span>
    &#123;
        <span class="hljs-keyword">return</span> process != <span class="hljs-literal">null</span> &amp;&amp; !process.HasExited;
    &#125;
&#125;</code></pre></div> <p>Vậy là từ giờ để sử dụng, khởi tạo bằng lệnh, ví dụ game PvZ luôn nhé.</p> <div class="code-block"><pre><code class="hljs language-csharp">	MyMemory memory = <span class="hljs-keyword">new</span> MyMemory(<span class="hljs-string">&quot;popcapgame1&quot;</span>);</code></pre></div> <p>Các hàm mình viết sẵn là:</p> <p>Kiểm tra:</p> <div class="code-block"><pre><code class="hljs language-csharp">	<span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">isOK</span>()</span>&#123;&#125; <span class="hljs-comment">// kiểm tra xem chương trình có chạy không, nếu true thì mới sử dụng những hàm còn lại mới chính xác</span></code></pre></div> <p>Đọc giá trị là số:</p> <div class="code-block"><pre><code class="hljs language-csharp">    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> <span class="hljs-title">ReadInt</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>&#123;&#125;
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> <span class="hljs-title">ReadShort</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>&#123;&#125;
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span> <span class="hljs-title">ReadUShort</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>&#123;&#125;
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">double</span> <span class="hljs-title">ReadDouble</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>&#123;&#125;
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">double</span> <span class="hljs-title">ReadFloat</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address</span>)</span>&#123;&#125;</code></pre></div> <p>Ghi giá trị vào địa chỉ:</p> <div class="code-block"><pre><code class="hljs language-csharp">	<span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">WriteNumber</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address,<span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span>, <span class="hljs-built_in">int</span> length = <span class="hljs-number">4</span></span>)</span>&#123;&#125;</code></pre></div> <p>Đọc ghi giá trị string: // chưa có cơ hội dùng nên chả biết đúng sai thế nào :v, tại cái đi copy được ở một trang web khác</p> <div class="code-block"><pre><code class="hljs language-csharp">	<span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">string</span> <span class="hljs-title">ReadString</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address, <span class="hljs-built_in">int</span> length = <span class="hljs-number">32</span></span>)</span>&#123;&#125;
    <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">WriteString</span>(<span class="hljs-params"><span class="hljs-built_in">int</span> Address,<span class="hljs-built_in">string</span> <span class="hljs-keyword">value</span>, <span class="hljs-built_in">uint</span> length = <span class="hljs-number">32</span></span>)</span>&#123;&#125;</code></pre></div> <p>Thôi lười quá rồi tạm dừng ở đây, phần 2 mình sẽ làm về CE để search và phân tích, sau đó đến phần 3 mới code.</p>`,1);function b(s){var a=e();p(40),n(s,a)}export{b as default,t as metadata};
