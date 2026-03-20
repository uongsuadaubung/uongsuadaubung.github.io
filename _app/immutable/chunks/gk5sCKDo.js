import{a,f as t}from"./DdKyNRsu.js";import"./2eH-Kdi_.js";import{n as l}from"./D64QkPoJ.js";const p={title:"Auto game Pikachu/Pokemon - Part 1",date:"2023-08-31",tags:["Cheat Engine","Hack Game"],description:"Nhìn vào hai hình này chắc là biết game gì luôn đúng không nếu không nghe qua thì cũng phải nhìn thấy vì mình nghĩ nó huyền thoại cmnr...",published:!0},{title:r,date:o,tags:m,description:d,published:u}=p;var c=t(`<h1>Auto game Pikachu/Pokemon - Part 1</h1> <p><img src="/images/auto-game-pikachupokemon-part-1/image-01.png" alt="Pikachu Gameplay"/></p> <p><img src="/images/auto-game-pikachupokemon-part-1/image-02.png" alt="Pikachu UI"/></p> <p>Nhìn vào hai hình này chắc là biết game gì luôn đúng không nếu không nghe qua thì cũng phải nhìn thấy vì mình nghĩ nó huyền thoại cmnr, hồi xưa nhà nào mua máy tính cũng thấy cài sẵn cái này luôn -.-, mỗi tội hơi bối rối về cái tên thôi, người thì gọi là Pikachu, người thì gọi là Pokemon. Hồi còn bé chưa có máy tính, suốt ngày mình hay sang ngồi cạnh cô hàng xóm đóng vai trò cố vấn, chiến lược gia cấp cao giúp cho cô chiến thắng trò chơi, nhiều khi nhìn đau cả mắt chứ chả vừa :D</p> <p>Mục tiêu của bài này sẽ là làm một tool có chức năng tự động chơi game, không tập trung vào những cái khác như hack điểm…, cho nên mình sẽ liệt kê những thứ cần thiết ra đây:</p> <ul><li>Quan trọng nhất là tìm được cái ma trận để lưu các con pokemon.</li> <li>Mà cần đủ thời gian tìm thì mình phải xử lý cái thời gian của trò chơi trước đã.</li> <li>Lấy được ma trận game rồi thì làm thế nào để xác định được 2 con pokemon hợp lệ.</li> <li>Làm thế nào để tự động click được lên game.</li></ul> <p>Các công cụ cần thiết:</p> <ul><li>Cheate Engine</li> <li>Knowledge about C# Programing Language :)) (vì C/C++ khó quá mình không học nổi với lại C# làm form dễ)</li> <li>Một cái đầu lạnh :V</li></ul> <h3>1. Tìm kiếm địa chỉ lưu biến thời gian</h3> <p>Bật CE lên để search thôi, vì không rõ con số cụ thể nên sẽ phải để Scan type là Unkown initial value, Value type thì để all vì cũng chả biết nó sẽ thuộc kiểu dữ liệu gì.</p> <p>Ban đầu thì cứ nghĩ là thời gian sẽ giảm về 0 nên mình search ở những giá trị tiếp theo là Decreased Value mà nó cứ không ra, mãi lúc sau mới nhảy số để lại thành Increased Value thì tìm thấy vài giá trị, mình nghi ngờ cái biến kiểu float nên về set giá trị cho nó về 0, thế là thời gian được reset lại. vậy là tìm được địa chỉ <strong>0x004b6084</strong> là địa chỉ chứa giá trị thời gian.</p> <p><img src="/images/auto-game-pikachupokemon-part-1/image-03.png" alt="Address time"/></p> <h3>2. Tìm kiếm ma trận của trò chơi</h3> <p>Cái này tìm gian nan hơn, vì mình không biết giá trị của các con pokemon, cũng may với cái kinh nghiệm từ trước mình có tìm cái ma trận của game Minesweeper nên cuối cùng cũng tìm ra được, rồi sau đó nhanh chóng tìm Pointer cho nó vì chẳng may tắt game rồi tìm lại ốm chết luôn :((. kết quả của pointer là <code>"pikachu.exe"+000B6044 offset 76</code></p> <p><img src="/images/auto-game-pikachupokemon-part-1/image-04.png" alt="Matrix pointer"/></p> <p>Sau đó chọn Browse this memory region để xem memory</p> <p><img src="/images/auto-game-pikachupokemon-part-1/image-05.png" alt="Browse memory"/></p> <p>Thấy như sau</p> <p><img src="/images/auto-game-pikachupokemon-part-1/image-06.png" alt="Memory detail"/></p> <p>Cấu trúc của con pokemon đầu tiên là <code>FF FF 0A 00 0A 00</code>, và tất cả các con tiếp theo cũng có dạng đó gồm 6 bytes:</p> <ul><li>2 bytes đầu tiên <code>FF FF</code> là con pokmon còn hiển thị, nếu ăn mất rồi thì nó sẽ là <code>00 00</code></li> <li>2 bytes tiếp theo <code>0A 0A</code> là hình ảnh hiển thị của con pokemon đó.</li> <li>2 bytes cuối cùng <code>0A 0A</code> là mã id của con pokemon, nếu cùng mã thì ăn được kể cả khác hiển thị</li></ul> <p>Vậy nên mình sẽ tập trung vào 2 bytes đầu và 2 bytes cuối, vì nó cách nhau 4 bytes nên địa chỉ của 2 bytes đầu sẽ bằng cái Pointer mình tìm được bên trên trừ 4 Offset đi sẽ là <code>"pikachu.exe"+000B6044 Offset 72</code></p> <p>Mình đã lấy máy tính ra để tính toán 1 chút như thế này, từ địa con pokemon đầu tiên + 0x6 sẽ ra con pokemon tiếp theo</p> <table><thead><tr><th>Pokemon row 1</th><th>Offset</th><th>Add</th><th>Next Pokemon Offset</th></tr></thead><tbody><tr><td>Con đầu tiên</td><td>72</td><td>6</td><td>78</td></tr><tr><td>Con thứ 2</td><td>78</td><td>6</td><td>7E</td></tr><tr><td>Con thứ 3</td><td>7E</td><td>6</td><td>84</td></tr><tr><td>Con thứ n</td><td>…</td><td>6</td><td>…</td></tr><tr><td>Con thứ 15</td><td>C6</td><td>6</td><td>CC</td></tr><tr><td>Con thứ 16</td><td>CC</td><td>6</td><td>D2</td></tr></tbody></table> <p>Đến đây tưởng là D2 sẽ là Offset của còn đầu tiên của row2 ư? Không hề! Ban đầu mình cũng hý hửng tưởng là vậy mà chỉnh thử ở memory để cho FF FF về 00 00 nhưng mà không có gì thay đổi, mặc dù vẫn đúng cái cấu trúc 6 bytes như thế. Mình phải cộng thêm tận 2 lần nữa thì mới ra con pokemon đầu tiên ở row 2.</p> <table><thead><tr><th>Pokemon</th><th>Offset</th><th>Add</th><th>Next Pokemon Offset</th></tr></thead><tbody><tr><td>Con thứ 16</td><td>CC</td><td>6</td><td>D2</td></tr><tr><td>Con thứ 17</td><td>D2</td><td>6</td><td>D8</td></tr><tr><td>Con thứ 18</td><td>D8</td><td>6</td><td>DE</td></tr><tr><td>Con thứ 1 ở row 2</td><td>DE</td><td></td><td></td></tr></tbody></table> <p>Có vẻ như là game này không đơn giản chỉ là ma trận 9x16 mà phải là 9x18 cũng nên;</p> <p>Lấy giá trị <code>0xDE - 0x72 = 0x6C</code>. Vậy là để di chuyển đến row N thì dùng công thức <code>0x72 + 0x6c * N</code>, mình dùng cái công thức này để lúc viết code sử dụng vòng lặp kết hợp với công thức để đọc hết cái ma trận của game;</p> <h3>3. Thuật toán để tìm kiếm 2 con pokemon hợp lệ</h3> <p>Mình cũng có search để tìm kiếm thuật toán được sử dụng trong ma trận, kết quả là sử dụng BFS, nên mình cũng có thử viết code trước bằng Typescript trước xem sao;</p> <div class="code-block"><pre><code class="hljs language-typescript"><span class="hljs-keyword">interface</span> <span class="hljs-title class_">Point</span> &#123;
  <span class="hljs-attr">row</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">col</span>: <span class="hljs-built_in">number</span>;
&#125;

<span class="hljs-keyword">interface</span> <span class="hljs-title class_">IQueue</span> &#123;
  <span class="hljs-attr">point</span>: <span class="hljs-title class_">Point</span>;
  <span class="hljs-attr">redirect</span>: <span class="hljs-built_in">number</span>;
  <span class="hljs-attr">prevDirection</span>: <span class="hljs-title class_">Point</span> | <span class="hljs-literal">null</span>;
&#125;

<span class="hljs-keyword">const</span> <span class="hljs-attr">directions</span>: <span class="hljs-title class_">Point</span>[] = [
  &#123; <span class="hljs-attr">row</span>: -<span class="hljs-number">1</span>, <span class="hljs-attr">col</span>: <span class="hljs-number">0</span> &#125;, <span class="hljs-comment">// Di chuyển lên</span>
  &#123; <span class="hljs-attr">row</span>: <span class="hljs-number">1</span>, <span class="hljs-attr">col</span>: <span class="hljs-number">0</span> &#125;, <span class="hljs-comment">// Di chuyển xuống</span>
  &#123; <span class="hljs-attr">row</span>: <span class="hljs-number">0</span>, <span class="hljs-attr">col</span>: -<span class="hljs-number">1</span> &#125;, <span class="hljs-comment">// Di chuyển trái</span>
  &#123; <span class="hljs-attr">row</span>: <span class="hljs-number">0</span>, <span class="hljs-attr">col</span>: <span class="hljs-number">1</span> &#125;, <span class="hljs-comment">// Di chuyển phải</span>
];

<span class="hljs-keyword">function</span> <span class="hljs-title function_">isValidMove</span>(<span class="hljs-params">
  <span class="hljs-attr">matrix</span>: <span class="hljs-built_in">number</span>[][],
  <span class="hljs-attr">newRow</span>: <span class="hljs-built_in">number</span>,
  <span class="hljs-attr">newCol</span>: <span class="hljs-built_in">number</span>,
</span>): <span class="hljs-built_in">boolean</span> &#123;
  <span class="hljs-keyword">const</span> numRows = matrix.<span class="hljs-property">length</span>;
  <span class="hljs-keyword">const</span> numCols = matrix[<span class="hljs-number">0</span>].<span class="hljs-property">length</span>;
  <span class="hljs-keyword">return</span> (
    newRow &gt;= <span class="hljs-number">0</span> &amp;&amp;
    newRow &lt; numRows &amp;&amp;
    newCol &gt;= <span class="hljs-number">0</span> &amp;&amp;
    newCol &lt; numCols &amp;&amp;
    matrix[newRow][newCol] === <span class="hljs-number">0</span>
  );
&#125;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">isValidConnect</span>(<span class="hljs-params"><span class="hljs-attr">matrix</span>: <span class="hljs-built_in">number</span>[][], <span class="hljs-attr">start</span>: <span class="hljs-title class_">Point</span>, <span class="hljs-attr">end</span>: <span class="hljs-title class_">Point</span></span>): <span class="hljs-built_in">boolean</span> &#123;
  <span class="hljs-keyword">const</span> numRows = matrix.<span class="hljs-property">length</span>;
  <span class="hljs-keyword">const</span> numCols = matrix[<span class="hljs-number">0</span>].<span class="hljs-property">length</span>;

  <span class="hljs-keyword">const</span> <span class="hljs-attr">visited</span>: <span class="hljs-built_in">boolean</span>[][] = <span class="hljs-title class_">Array</span>.<span class="hljs-title function_">from</span>(&#123; <span class="hljs-attr">length</span>: numRows &#125;, <span class="hljs-function">() =&gt;</span>
    <span class="hljs-title class_">Array</span>(numCols).<span class="hljs-title function_">fill</span>(<span class="hljs-literal">false</span>),
  );
  visited[start.<span class="hljs-property">row</span>][start.<span class="hljs-property">col</span>] = <span class="hljs-literal">true</span>;

  <span class="hljs-keyword">const</span> <span class="hljs-attr">queue</span>: <span class="hljs-title class_">IQueue</span>[] = [&#123; <span class="hljs-attr">point</span>: start, <span class="hljs-attr">redirect</span>: <span class="hljs-number">0</span>, <span class="hljs-attr">prevDirection</span>: <span class="hljs-literal">null</span> &#125;];

  <span class="hljs-keyword">while</span> (queue.<span class="hljs-property">length</span> &gt; <span class="hljs-number">0</span>) &#123;
    <span class="hljs-keyword">const</span> &#123; point, redirect, prevDirection &#125; = queue.<span class="hljs-title function_">shift</span>()!;

    <span class="hljs-keyword">if</span> (redirect &gt; <span class="hljs-number">3</span>) <span class="hljs-keyword">continue</span>;
    <span class="hljs-keyword">if</span> (point.<span class="hljs-property">row</span> === end.<span class="hljs-property">row</span> &amp;&amp; point.<span class="hljs-property">col</span> === end.<span class="hljs-property">col</span>) &#123;
      <span class="hljs-keyword">return</span> <span class="hljs-literal">true</span>;
    &#125;

    <span class="hljs-keyword">for</span> (<span class="hljs-keyword">const</span> direction <span class="hljs-keyword">of</span> directions) &#123;
      <span class="hljs-keyword">const</span> newRow = point.<span class="hljs-property">row</span> + direction.<span class="hljs-property">row</span>;
      <span class="hljs-keyword">const</span> newCol = point.<span class="hljs-property">col</span> + direction.<span class="hljs-property">col</span>;

      <span class="hljs-keyword">if</span> (<span class="hljs-title function_">isValidMove</span>(matrix, newRow, newCol) &amp;&amp; !visited[newRow][newCol]) &#123;
        visited[newRow][newCol] = <span class="hljs-literal">true</span>;

        <span class="hljs-keyword">let</span> newRedirect = redirect;
        <span class="hljs-keyword">if</span> (
          prevDirection === <span class="hljs-literal">null</span> ||
          prevDirection.<span class="hljs-property">row</span> !== direction.<span class="hljs-property">row</span> ||
          prevDirection.<span class="hljs-property">col</span> !== direction.<span class="hljs-property">col</span>
        ) &#123;
          newRedirect++; <span class="hljs-comment">// Nếu có chuyển hướng thì tăng biến redirect</span>
        &#125;

        queue.<span class="hljs-title function_">push</span>(&#123;
          <span class="hljs-attr">point</span>: &#123; <span class="hljs-attr">row</span>: newRow, <span class="hljs-attr">col</span>: newCol &#125;,
          <span class="hljs-attr">redirect</span>: newRedirect,
          <span class="hljs-attr">prevDirection</span>: direction,
        &#125;);
      &#125;
    &#125;
  &#125;

  <span class="hljs-keyword">return</span> <span class="hljs-literal">false</span>; <span class="hljs-comment">// Không tìm thấy đường đi</span>
&#125;

<span class="hljs-keyword">const</span> <span class="hljs-attr">matrix</span>: <span class="hljs-built_in">number</span>[][] = [
  [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
  [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">1</span>],
  [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
  [<span class="hljs-number">1</span>, <span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">0</span>],
  [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
];

<span class="hljs-keyword">const</span> <span class="hljs-attr">start</span>: <span class="hljs-title class_">Point</span> = &#123; <span class="hljs-attr">row</span>: <span class="hljs-number">0</span>, <span class="hljs-attr">col</span>: <span class="hljs-number">0</span> &#125;;
<span class="hljs-keyword">const</span> <span class="hljs-attr">end</span>: <span class="hljs-title class_">Point</span> = &#123; <span class="hljs-attr">row</span>: <span class="hljs-number">3</span>, <span class="hljs-attr">col</span>: <span class="hljs-number">3</span> &#125;;

<span class="hljs-keyword">const</span> redirections = <span class="hljs-title function_">isValidConnect</span>(matrix, start, end);
<span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(redirections ? <span class="hljs-string">&#x27;Valid&#x27;</span> : <span class="hljs-string">&#x27;invalid&#x27;</span>);</code></pre></div> <p>Code minh hoạ đi từ điểm 0,0 đến 3,3, khi đi từ start đến end mà số lần chuyển hướng không quá 3 thì là hợp lệ, chạy code lên thì cũng khá là oke, nên sau đó mình sẽ chuyển sang C# để áp dụng với game sau.</p> <p>Đến đây là hết phần chuẩn bị thông tin rồi, phần sau sẽ là dựa vào những cái này để code.</p>`,1);function g(s){var n=c();l(64),a(s,n)}export{g as default,p as metadata};
