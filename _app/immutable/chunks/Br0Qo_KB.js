import{a,f as l}from"./CU_Tu6Mf.js";import"./BiabzJe8.js";import{n as t}from"./DwHbYvjF.js";const c={title:"Hôm nay ăn gì: Ứng dụng dẹp bỏ cơn đau đầu mỗi tối",date:"2026-03-13",tags:["Lập Trình","Tool & Extension","Trải Nghiệm"],description:"Phát triển app Random món ăn để trị bệnh lười suy nghĩ bữa tối. Tưởng dễ mà cũng phải vận nội công xử lý đủ thứ từ logic vòng quay đến lỗi CORS.",published:!0},{title:o,date:r,tags:g,description:m,published:u}=c;var p=l(`<h1>Hôm nay ăn gì: Ứng dụng dẹp bỏ cơn đau đầu mỗi tối</h1> <p>Không biết các bạn thế nào, chứ mình thấy cứ tầm 5 - 6 giờ chiều là y như rằng có một câu hỏi kinh điển vang lên: “Tối nay ăn gì?“. Cứ nghĩ mãi, list đi list lại quanh quẩn cũng chỉ có luộc, kho, chiên… nghĩ thôi cũng thấy mệt. Đỉnh điểm là có những hôm đói meo nhưng hai anh em cứ ngồi nhìn nhau đùn đẩy vì lười suy nghĩ.</p> <p>Thế là quyết định xắn tay áo hý hửng viết một chiếc app nhỏ bằng Svelte kết hợp Tauri để quay ngẫu nhiên trực tiếp trên màn hình máy tính cho tiết kiệm thời gian. Tưởng làm cái vòng quay cho vui là dễ, ai ngờ đâm đầu vào mới thấy phát sinh một mớ vấn đề…</p> <p><img src="/images/hom-nay-an-gi/man-hinh-chinh.png" alt="Màn hình chính của ứng dụng"/> <em>Giao diện màn hình chính của ứng dụng với chiếc vòng quay định mệnh.</em></p> <h2>1. Nỗi đau nạp Dữ liệu & Sự cố CORS</h2> <p>Tiêu chí ban đầu là ứng dụng phải thực dụng, món ăn phải có Món chính và Món rau. Nếu chỉ code cứng (hard-code) vài món vào file thì quá chán, nên mình mở ChatGPT lên, nhờ AI xuất ngay một danh sách 50 món Việt Nam kèm công thức nấu, rồi chép vào thẳng Google Sheet (Excel). Mình định dùng trang Sheet đó làm cơ sở dữ liệu luôn.</p> <p>Nhưng cuộc đời không như mơ, ngay bước đầu gọi lệnh <code>fetch()</code> để kéo data từ Google Sheet về, trình duyệt ném thẳng vào mặt mình một dòng text đỏ rực: <code>CORS Policy Error</code>. Ngồi debug lú luôn mất cả buổi chiều để tìm cách xử lý header, nhưng Google Sheet không hỗ trợ mở CORS dễ dàng như API thông thường.</p> <p>Cuối cùng, mình nhớ ra một mẹo cổ đại từ thời các tiền bối đi trước: xử lý qua cơ chế <strong>JSONP</strong>. Ý tưởng là chèn một thẻ <code>&lt;script&gt;</code> vào DOM để trình duyệt tự tải dữ liệu thay vì dùng hàm fetch, như sau:</p> <div class="code-block"><pre><code class="hljs language-typescript"><span class="hljs-comment">// Hàm fetch danh sách món ăn + cách nấu qua JSONP để vượt mức rào CORS</span>
<span class="hljs-keyword">export</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">fetchMenuFromGoogleSheet</span>(<span class="hljs-params"><span class="hljs-attr">scriptUrl</span>: <span class="hljs-built_in">string</span></span>): <span class="hljs-title class_">Promise</span>&lt;&#123;<span class="hljs-attr">mains</span>: <span class="hljs-title class_">FoodItem</span>[], <span class="hljs-attr">vegs</span>: <span class="hljs-title class_">FoodItem</span>[]&#125;&gt; &#123;
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">Promise</span>(<span class="hljs-function">(<span class="hljs-params">resolve, reject</span>) =&gt;</span> &#123;
    <span class="hljs-comment">// Tạo 1 tên hàm callback ngẫu nhiên để tránh đụng độ</span>
    <span class="hljs-keyword">const</span> callbackName = <span class="hljs-string">&#x27;jsonpCallback_&#x27;</span> + <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">round</span>(<span class="hljs-number">100000</span> * <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>());
    <span class="hljs-keyword">const</span> script = <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">createElement</span>(<span class="hljs-string">&#x27;script&#x27;</span>);

    <span class="hljs-comment">// Chờ Google Sheet gọi ngược lại hàm này</span>
    (<span class="hljs-variable language_">window</span> <span class="hljs-keyword">as</span> <span class="hljs-built_in">any</span>)[callbackName] = <span class="hljs-function">(<span class="hljs-params"><span class="hljs-attr">data</span>: <span class="hljs-built_in">any</span></span>) =&gt;</span> &#123;
      <span class="hljs-title function_">delete</span> (<span class="hljs-variable language_">window</span> <span class="hljs-keyword">as</span> <span class="hljs-built_in">any</span>)[callbackName]; <span class="hljs-comment">// Chạy xong thì xóa luôn cho gọn</span>
      <span class="hljs-variable language_">document</span>.<span class="hljs-property">body</span>.<span class="hljs-title function_">removeChild</span>(script);

      <span class="hljs-keyword">try</span> &#123;
        <span class="hljs-keyword">const</span> <span class="hljs-attr">recipesMap</span>: <span class="hljs-title class_">Record</span>&lt;<span class="hljs-built_in">string</span>, <span class="hljs-title class_">Recipe</span>[]&gt; = data.<span class="hljs-property">recipes</span> || &#123;&#125;;
        
        <span class="hljs-comment">// Nhào nặn dữ liệu ra mảng món chính</span>
        <span class="hljs-keyword">const</span> <span class="hljs-attr">mains</span>: <span class="hljs-title class_">FoodItem</span>[] = (data.<span class="hljs-property">mains</span> || []).<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params"><span class="hljs-attr">item</span>: <span class="hljs-built_in">any</span>, <span class="hljs-attr">idx</span>: <span class="hljs-built_in">number</span></span>) =&gt;</span> (&#123;
          <span class="hljs-attr">id</span>: idx + <span class="hljs-number">1</span>,
          <span class="hljs-attr">name</span>: item.<span class="hljs-property">name</span>,
          <span class="hljs-attr">color</span>: item.<span class="hljs-property">color</span>,
          <span class="hljs-attr">recipes</span>: recipesMap[item.<span class="hljs-property">name</span>] || <span class="hljs-literal">undefined</span>,
        &#125;));
        
        <span class="hljs-title function_">resolve</span>(&#123; mains, <span class="hljs-attr">vegs</span>: [] <span class="hljs-comment">/* code rút gọn */</span> &#125;);
      &#125; <span class="hljs-keyword">catch</span> (err) &#123;
        <span class="hljs-title function_">reject</span>(err);
      &#125;
    &#125;;

    <span class="hljs-comment">// Nối tham số callback vào link Script và thả vào body</span>
    <span class="hljs-keyword">const</span> urlWithParams = <span class="hljs-string">\`<span class="hljs-subst">$&#123;scriptUrl&#125;</span>?callback=<span class="hljs-subst">$&#123;callbackName&#125;</span>\`</span>;
    script.<span class="hljs-property">src</span> = urlWithParams;
    <span class="hljs-variable language_">document</span>.<span class="hljs-property">body</span>.<span class="hljs-title function_">appendChild</span>(script);
  &#125;);
&#125;</code></pre></div> <p>Cách này nhìn có vẻ đi đường vòng nhưng nó xử lý dứt điểm luôn bài toán lấy dữ liệu mà không cần phải cài web server trung gian phức tạp.</p> <h2>2. Bài toán thiết kế vòng quay (Lucky Wheel)</h2> <p>Data đã có, giờ đến khâu làm cái vòng quay. Mình thiết kế giao diện bằng Svelte. Lúc đầu mình định chia vòng quay theo đúng số lượng món ăn, nhưng nếu có 50 món thì mỗi ô trên vòng quay trông như que tăm, rất xấu. Thế là mình thống nhất chỉ hiển thị 10 ô cố định (vẽ bằng CSS <code>conic-gradient</code>), điền chữ <code>?</code> bí ẩn vào vòng quay. Quay xong mới bốc thăm món.</p> <p>Và đây là đoạn nhức não nhất: Tính góc xoay (<code>rotation</code>). Để vòng quay chạy trơn tru, mình phải kết hợp một chút toán học vào hàm Svelte state.</p> <div class="code-block"><pre><code class="hljs language-html"><span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">lang</span>=<span class="hljs-string">&quot;ts&quot;</span>&gt;</span><span class="language-javascript">
  <span class="hljs-keyword">const</span> <span class="hljs-variable constant_">WHEEL_SLICES</span> = <span class="hljs-number">10</span>;
  <span class="hljs-keyword">const</span> sliceAngle = <span class="hljs-number">360</span> / <span class="hljs-variable constant_">WHEEL_SLICES</span>;
  
  <span class="hljs-comment">// Trạng thái Reactive của Svelte</span>
  <span class="hljs-keyword">let</span> isSpinning = $state(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">let</span> rotation = $state(<span class="hljs-number">0</span>);
  
  <span class="hljs-comment">// Áp dụng CSS transition dài 8s để vòng quay chậm dần</span>
  <span class="hljs-keyword">let</span> wheelStyles = $derived(
    <span class="hljs-string">\`transform: rotate(<span class="hljs-subst">$&#123;rotation&#125;</span>deg); transition: transform <span class="hljs-subst">$&#123;isSpinning ? <span class="hljs-string">&#x27;8s cubic-bezier(0.2, 0.8, 0.2, 1)&#x27;</span> : <span class="hljs-string">&#x27;0s&#x27;</span>&#125;</span>;\`</span>
  );

  <span class="hljs-keyword">function</span> <span class="hljs-title function_">spin</span>(<span class="hljs-params"></span>) &#123;
    <span class="hljs-keyword">if</span> (isSpinning) <span class="hljs-keyword">return</span>;
    isSpinning = <span class="hljs-literal">true</span>;

    <span class="hljs-comment">// Tính toán góc quay cộng dồn</span>
    <span class="hljs-keyword">const</span> extraSpins = <span class="hljs-number">8</span> + <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">floor</span>(<span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>() * <span class="hljs-number">5</span>); <span class="hljs-comment">// quay 8 - 12 vòng</span>
    <span class="hljs-keyword">const</span> targetSlice = <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">floor</span>(<span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>() * <span class="hljs-variable constant_">WHEEL_SLICES</span>);
    <span class="hljs-keyword">const</span> targetAngle = targetSlice * sliceAngle + sliceAngle / <span class="hljs-number">2</span>;
    
    <span class="hljs-comment">// reset offset và cộng thêm góc để bánh xe quay tự nhiên nhất</span>
    <span class="hljs-keyword">const</span> baseRotation = rotation % <span class="hljs-number">360</span>;
    <span class="hljs-keyword">const</span> spinsNeeded  = <span class="hljs-number">360</span> * extraSpins;
    <span class="hljs-keyword">const</span> offset       = <span class="hljs-number">360</span> - targetAngle;

    rotation = rotation - baseRotation + spinsNeeded + offset;

    <span class="hljs-comment">// Chờ 8.1 giây cho animation CSS kết thúc rồi mới xổ kết quả</span>
    <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> &#123;
      isSpinning = <span class="hljs-literal">false</span>;
      <span class="hljs-keyword">const</span> mains = $mainMenu;
      <span class="hljs-comment">// Bốc đại 1 món từ kho lưu trữ Google Sheet</span>
      <span class="hljs-keyword">const</span> pickedMain = mains[<span class="hljs-title class_">Math</span>.<span class="hljs-title function_">floor</span>(<span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>() * mains.<span class="hljs-property">length</span>)];
      
      selectedMain.<span class="hljs-title function_">set</span>(pickedMain);
      appState.<span class="hljs-title function_">set</span>(<span class="hljs-string">&#x27;result&#x27;</span>);
    &#125;, <span class="hljs-number">8100</span>);
  &#125;
</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>

<span class="hljs-comment">&lt;!-- Giao diện vòng quay --&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">&quot;relative w-[300px] h-[300px] rounded-full overflow-hidden&quot;</span> <span class="hljs-attr">style</span>=<span class="hljs-string">&#123;wheelStyles&#125;</span>&gt;</span>
    <span class="hljs-comment">&lt;!-- Các thẻ chia ô gradient... --&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onclick</span>=<span class="hljs-string">&#123;spin&#125;</span> <span class="hljs-attr">disabled</span>=<span class="hljs-string">&#123;isSpinning&#125;</span>&gt;</span>QUAY<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span></code></pre></div> <p>Khúc đau đầu nhất là tìm được đường cong <code>cubic-bezier(0.2, 0.8, 0.2, 1)</code>. Chỉnh đi chỉnh lại bao nhiêu lần thì nó mới có cảm giác “quay nhanh dần đều rồi nảy thắng từ từ vắt ngang qua mốc” giống hệt vòng quay chiếc nón kỳ diệu hồi xưa. Quả thực gõ code thì ít mà ngồi tinh chỉnh giao diện mất thời gian dã man.</p> <h2>3. Tổng kết</h2> <p>Mất đâu đó vài buổi tối hì hục, ứng dụng cũng gói gọn thành file chạy trên Desktop. Giờ cứ chiều đến trước lúc về, anh em lại bật app lên quay xạch xạch xem tối nay về phải đi ăn món gì. Ấn vào kết quả nó còn hiển thị thêm “Cách nấu: Xào tỏi / Nướng than” từ data AI cung cấp khá là trực quan.</p> <p><img src="/images/hom-nay-an-gi/chon-xong-mon.png" alt="Chốt đơn bữa tối"/> <em>Quay xong là ứng dụng tự động hiển thị món ăn (cả món mặn lẫn rau) may mắn của ngày.</em></p> <p><img src="/images/hom-nay-an-gi/xem-cong-thuc-nau.png" alt="Xem công thức nấu ăn"/> <em>Bấm vào kết quả để xem ngay công thức do AI hướng dẫn.</em></p> <p>Thấy làm mấy cái phần mềm cá nhân nhỏ nhỏ dọn gọn gàng nhu cầu thế này công nhận giúp ích được rất nhiều. Bạn nào cũng lười vắt óc suy luận giống mình, có hứng thì ghé qua repo Github lấy mã nguồn về trổ tài thử nhé. Hẹn mọi người ở một dự án tự build khác!</p>`,1);function j(s){var n=p();t(38),a(s,n)}export{j as default,c as metadata};
