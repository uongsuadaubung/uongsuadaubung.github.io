import{a,f as l}from"./CU_Tu6Mf.js";import"./BiabzJe8.js";import{n as e}from"./DwHbYvjF.js";const h={title:"Hack Plants Vs Zombies GOTY Edition - part 5",date:"2020-06-14",tags:["Hack Game"],description:"Phần 5: Tổng hợp lại thành tool hoàn chỉnh viết bằng C# (Winform).",published:!0},{title:r,date:o,tags:m,description:d,published:u}=h;var p=l(`<h1>Hack Plants Vs Zombies GOTY Edition - part 5</h1> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-01.jpg" alt="Plants vs Zombies GOTY Edition"/></p> <p>Lạy chúa đến phần cuối rồi, mình lười viết kinh khủng nhưng vì hôm nay là ngày chủ nhật và trời đang mưa to vl, thời tiết rất mát mẻ nên mình ngồi viết nốt, ở phần 2, 3 và 4 mình đã tìm được địa chỉ quan trọng để dùng cho phần cuối này đó là viết tools, có lẽ sau series PvZ này mình sẽ chả làm hướng dẫn viết tool nữa vì cái chính nó vẫn nằm ở CE có tìm được địa chỉ ô nhớ hay không thôi, mà nếu còn làm tiếp thì thì mình đang nghĩ tới thứ làm auto gì đó chứ không phải hack như này.</p> <p>Bắt đầu nào, mở Visual Studio lên, tạo một project winform và tạo một cái giao diện đơn giản như sau.</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-02.png" alt="Giao dien tool"/></p> <p>C# có cái form này kéo thả dễ vl, chứ bảo làm bằng C++ chắc ốm mất (được nhé, nhưng nó khó vl ý, mình không biết làm thôi).</p> <p>Danh sách địa chỉ và tất cả giá trị mình tìm được khai báo hết ra nhé.</p> <div class="code-block"><pre><code class="hljs language-csharp">MyMemory memory;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> autoAddress = <span class="hljs-number">0x004352F2</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> fastRechargeAddress = <span class="hljs-number">0x004958C5</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> nomalZombieAddress = <span class="hljs-number">0x0054626C</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> hatZombieAddress = <span class="hljs-number">0x00545B36</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> shieldZombieAddress = <span class="hljs-number">0x00545781</span>;

<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> AUTO = <span class="hljs-number">0xEB</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> NOTAUTO = <span class="hljs-number">0x75</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> FASTRECHARGE = <span class="hljs-number">0x9090</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> NOTFASTRECHARGE = <span class="hljs-number">0x147E</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> ONEHIT = <span class="hljs-number">0x9090</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> NOMALNOTONEHIT = <span class="hljs-number">0x1D7F</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> HEADNOTONEHIT = <span class="hljs-number">0x1175</span>;
<span class="hljs-keyword">private</span> <span class="hljs-keyword">const</span> <span class="hljs-built_in">int</span> GUARDNOTONEHIT = <span class="hljs-number">0x1875</span>;
<span class="hljs-keyword">private</span> <span class="hljs-built_in">int</span> baseAddr;</code></pre></div> <p>Còn giá trị tại sao là như vậy tẹo làm đến mình sẽ nói, à quên phải tạo thêm class mình nói ở phần 1 mình có code lại rồi nữa nhé, mình đặt tên nó là MyMemory.
Xong code sẽ trông thế này.</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-03.png" alt="Full code screen"/></p> <p>Để chương trình tự load game khi vừa chạy thì mình tạo thêm 1 hàm Init() như sau, gọi hàm thì đặt ở vị trí như ảnh trên nhé.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-keyword">void</span> <span class="hljs-title">Init</span>()</span>
&#123;
    memory = <span class="hljs-keyword">new</span> MyMemory(<span class="hljs-string">&quot;popcapgame1&quot;</span>);
    <span class="hljs-keyword">if</span> (memory.isOK())
    &#123;
        <span class="hljs-built_in">int</span> auto = memory.ReadByte(autoAddress);
        <span class="hljs-keyword">if</span> (auto == AUTO)
        &#123;
            cbAtuto.Checked = <span class="hljs-literal">true</span>;
        &#125;

        <span class="hljs-built_in">int</span> fast = memory.ReadUShort(fastRechargeAddress);
        <span class="hljs-keyword">if</span> (fast == FASTRECHARGE)
        &#123;
            cbTime.Checked = <span class="hljs-literal">true</span>;
        &#125;
        <span class="hljs-built_in">int</span> onehit = memory.ReadUShort(nomalZombieAddress);
        <span class="hljs-keyword">if</span> (onehit == ONEHIT)
        &#123;
            cbOnehit.Checked = <span class="hljs-literal">true</span>;
        &#125;
        button3.Visible = <span class="hljs-literal">false</span>; <span class="hljs-comment">// sorry vì có mấy nút mình lười không đặt lại tên, nó là nút load game</span>
        baseAddr = memory.GetBaseAddress();
        <span class="hljs-comment">//MessageBox.Show(&quot;Load game oke&quot;);</span>
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        MessageBox.Show(<span class="hljs-string">&quot;mở game lên trước&quot;</span>);
        <span class="hljs-comment">//Environment.Exit(1);</span>
    &#125;
&#125;</code></pre></div> <p>Đầu tiên là kiểm tra game đã mở chưa, nếu mở rồi thì kiểm tra xem ở những địa chỉ như auto, fast recharge hay onehit có được kích hoạt chưa thì đặt dấu check cho mấy cái checkbox, thật ra nó chả cần thiết lắm mà chủ yếu do mình làm màu thôi, cái chính là mở được chương trình lên thì lấy được base address của game là chính,,,, còn trong trường hợp game chưa chạy thì hiện cái thông báo lên cho mình biết thôi chứ cũng chả có gì ghê gớm.</p> <p>Mình cũng viết thêm một hàm nữa đặt tên nó là GameisRunning() tác dụng là để kiểm tra xem game còn chạy nữa không, nhằm tránh những lỗi nào đó có thể xảy khi mình ấn chức năng nhưng game đã bị tắt mất rồi thôi.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-function"><span class="hljs-keyword">private</span> <span class="hljs-built_in">bool</span> <span class="hljs-title">GameisRunning</span>()</span>
&#123;
    <span class="hljs-keyword">if</span> (memory.isOK())
    &#123;
        <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        MessageBox.Show(<span class="hljs-string">&quot;Game đã bị tắt&quot;</span>);
        button3.Visible = <span class="hljs-literal">true</span>;
        <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>;
    &#125;
&#125;</code></pre></div> <p>Double click vào cái checkbox auto collect đi, làm cái này trước, nó sẽ tạo ra một hàm sự kiện, viết vào bên trong như sau.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">if</span> (GameisRunning())
&#123;
    <span class="hljs-keyword">if</span> (cbAtuto.Checked)
    &#123;
        memory.WriteNumber(autoAddress, AUTO, <span class="hljs-number">1</span>);
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        memory.WriteNumber(autoAddress, NOTAUTO, <span class="hljs-number">1</span>);
    &#125;
&#125;</code></pre></div> <p>Giải thích một xíu, hàm WriteNumber trong class memory mình viết có tham số truyền vào như sau WriteMemory(địa chỉ ô nhớ, giá trị muốn ghi vào, số bytes). Địa chỉ thì không nói rồi, đến giá trị ghi vào mà số bytes thì sao, mở CE lên, bấm vào địa chỉ đã lưu chọn Disassemble this memory region</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-04.png" alt="Disassemble this memory region"/></p> <p>Thấy lệnh này có 2 bytes <code>75 09</code></p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-05.png" alt="Lệnh assembly 2 bytes"/></p> <p>Sửa thành jne thành jmp thì 75 chuyển thành EB</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-06.png" alt="Sửa jne thành jmp"/></p> <p>Vậy là chỉ có 1 byte thay đổi giá trị khi không auto là <code>0x75</code> còn auto thì là <code>0xEB</code>, vì sửa 1 byte nên hàm WriteNumber truyền giá trị là 1. đó là tất cả lý do đó :v</p> <p>Đến với phần hồi nhanh cây trồng, ta có địa chỉ như sau</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-07.png" alt="Địa chỉ hồi nhanh"/></p> <p>2 bytes là <code>7E 14</code>, giờ không cần nó luôn nhảy nữa mà là không cho nó nhảy, nên đây mình sẽ phải nop lệnh jle này lại</p> <p><img src="/images/plants-vs-zombies-goty-edition-part-5/image-08.png" alt="Nop lệnh jle"/></p> <p>Lệnh nop chỉ có giá trị là 1 byte, còn lệnh cũ là 2 bytes, nên để bảo toàn chương trình sẽ bù thêm vào để đủ là 2 bytes, cho nên biến của fastrecharge của mình có giá trị là <code>0x9090</code>, mặc định là <code>0x147E</code>, nhớ để ý nó phải viết ngược lại.</p> <p>Double click vào cái check box fast recharge và viết lệnh như sau.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">if</span> (GameisRunning())
&#123;
    <span class="hljs-keyword">if</span> (cbTime.Checked)
    &#123;
        memory.WriteNumber(fastRechargeAddress, FASTRECHARGE, <span class="hljs-number">2</span>);
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        memory.WriteNumber(fastRechargeAddress, NOTFASTRECHARGE, <span class="hljs-number">2</span>);
    &#125;
&#125;</code></pre></div> <p>Vì là chỉnh sửa đến 2 bytes nên phải truyền 2 vào nhé, tương tự với 4 cũng thế.</p> <p>Tương tự thì code của one hit như sau, có 3 loại zombie nên viết chung hết vào</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">if</span> (GameisRunning())
&#123;
    <span class="hljs-keyword">if</span> (cbOnehit.Checked)
    &#123;
        memory.WriteNumber(nomalZombieAddress, ONEHIT, <span class="hljs-number">2</span>);
        memory.WriteNumber(hatZombieAddress, ONEHIT, <span class="hljs-number">2</span>);
        memory.WriteNumber(shieldZombieAddress, ONEHIT, <span class="hljs-number">2</span>);
    &#125;
    <span class="hljs-keyword">else</span>
    &#123;
        memory.WriteNumber(nomalZombieAddress, NOMALNOTONEHIT, <span class="hljs-number">2</span>);
        memory.WriteNumber(hatZombieAddress, HEADNOTONEHIT, <span class="hljs-number">2</span>);
        memory.WriteNumber(shieldZombieAddress, GUARDNOTONEHIT, <span class="hljs-number">2</span>);
    &#125;
&#125;</code></pre></div> <p>Giờ là hack tăng mặt trời, lần trước mình tìm được pointer rồi ý, giờ mình sẽ chỉ cách dùng. Double click vào button Add sun và viết lệnh như sau</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">if</span> (GameisRunning())
&#123;
    <span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span> = <span class="hljs-number">0</span>;
    <span class="hljs-built_in">int</span>[] sunOffset = &#123; <span class="hljs-number">0x0032F3F4</span> + baseAddr, <span class="hljs-number">0x68</span>, <span class="hljs-number">0x320</span>, <span class="hljs-number">0x18</span>, <span class="hljs-number">0x4</span>, <span class="hljs-number">0x4</span>, <span class="hljs-number">0x8</span>, <span class="hljs-number">0x5578</span> &#125;;
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; sunOffset.Length - <span class="hljs-number">1</span>; i++)
    &#123;
        <span class="hljs-keyword">value</span> = memory.ReadInt(sunOffset[i] + <span class="hljs-keyword">value</span>);
    &#125;
    <span class="hljs-built_in">int</span> addr = <span class="hljs-keyword">value</span> + sunOffset[sunOffset.Length - <span class="hljs-number">1</span>];
    <span class="hljs-keyword">value</span> = memory.ReadInt(addr);
    <span class="hljs-built_in">bool</span> isnumber = <span class="hljs-built_in">int</span>.TryParse(textBox1.Text, <span class="hljs-keyword">out</span> <span class="hljs-built_in">int</span> num);
    <span class="hljs-keyword">if</span> (isnumber)
    &#123;
        memory.WriteNumber(addr, <span class="hljs-keyword">value</span> + num, <span class="hljs-number">4</span>);
    &#125;
&#125;</code></pre></div> <p>Nếu chạy hết Length thì value sẽ là giá trị của mặt trời luôn nhưng mình không cần cái đó, mình cần địa chỉ của nó cơ để có thể thực hiện được cả đọc và ghi nên chỉ chạy đến Length -1 thôi, rồi từ đó lấy ra địa chỉ bằng cách cộng value với phần tử cuối trong mảng, sau khi có địa chỉ rồi thì đọc ghi như bình thường thôi.</p> <p>Với xu cũng như vậy nhé, Cái khác ở đây là xu chỉ có giá trị bằng 1/10 nên chia cho 10 trc khi cộng thôi.</p> <div class="code-block"><pre><code class="hljs language-csharp"><span class="hljs-keyword">if</span> (GameisRunning())
&#123;
    <span class="hljs-built_in">int</span> <span class="hljs-keyword">value</span> = <span class="hljs-number">0</span>;
    <span class="hljs-built_in">int</span>[] coinOffset = &#123; <span class="hljs-number">0x0032E77C</span> + baseAddr, <span class="hljs-number">0x18</span>, <span class="hljs-number">0x10</span>, <span class="hljs-number">0x14</span>, <span class="hljs-number">0x10</span>, <span class="hljs-number">0x4</span>, <span class="hljs-number">0x4</span>, <span class="hljs-number">0x84</span> &#125;;
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; coinOffset.Length - <span class="hljs-number">1</span>; i++)
    &#123;
        <span class="hljs-keyword">value</span> = memory.ReadInt(coinOffset[i] + <span class="hljs-keyword">value</span>);
    &#125;
    <span class="hljs-built_in">int</span> addr = <span class="hljs-keyword">value</span> + coinOffset[coinOffset.Length - <span class="hljs-number">1</span>];
    <span class="hljs-keyword">value</span> = memory.ReadInt(addr);
    <span class="hljs-built_in">bool</span> isnumber = <span class="hljs-built_in">int</span>.TryParse(textBox1.Text, <span class="hljs-keyword">out</span> <span class="hljs-built_in">int</span> num);
    <span class="hljs-keyword">if</span> (isnumber)
    &#123;
        memory.WriteNumber(addr, <span class="hljs-keyword">value</span> + num / <span class="hljs-number">10</span>, <span class="hljs-number">4</span>);

    &#125;
&#125;</code></pre></div> <p>Trước đó thì mình có tìm hiểu trên mạng thì người ta viết khá là chuối</p> <p><img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEHHtjbFjRKcWtndJbqSmQJu849ktWFpBoDLjkseOnFEFT28PF8goclMZYyolSkm8Z-7t6JxY16KBGTlCbAia9RXtRcvL_g7wFnm9FtVJRpqhaRRwWNjsdxwJtSkd0pCu05RoB6KO30IQh/s917/2020-06-14_183908.png" alt="Cách viết chuối"/></p> <p>Bao nhiêu offset bấy nhiêu biến, nó không sai nhưng nhìn sida vl ý.</p> <p>Lười quá tổng kết thôi.</p> <p>Toàn bộ khóa học đến đây là kết thúc 😁😁</p> <iframe title="pvz hack result" allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="500" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dzWc4v9XQeZprmkmDc35tkXeLsbb5w0SPax1NvnaTPsM7LuoxY0Wd9qkoQEjHM5a2qEVnmo1nx14R2hLt_jcCgP2ggTCXo2fjCiN4f84r_ziZoqjOatRY_6MhbXEQSMmURQTgk&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="750"></iframe> <p>Chơi game mà hack thì đúng là nó nhàm chán vl ý, nhưng thui mình chỉ chia sẻ cách lập trình là chính thôi chứ mục đích của blog này không phải là hack game đâu nhé, baibai anh em.</p> <p>Link <a href="https://github.com/uongsuadaubung/Plants-Vs-Zombies-GOTY-trainer" rel="nofollow">download ở đây nhé</a>. file ăn sẵn nằm ở trong thư mục <code>/bin/Release/netcoreapp3.1/publish/</code></p>`,1);function b(s){var n=p();e(92),a(s,n)}export{b as default,h as metadata};
