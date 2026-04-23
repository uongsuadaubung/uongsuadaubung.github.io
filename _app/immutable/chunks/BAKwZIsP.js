import{a as n,f as t}from"./CU_Tu6Mf.js";import"./BiabzJe8.js";import{n as p}from"./DwHbYvjF.js";const l={title:"Nextjs",date:"2024-09-07",tags:["Chuyện Nghề"],description:"Kế hoạch có chút thay đổi, vì hiện tại mình đang làm việc trên công ty khá bận và còn kèm thêm cả dự án với người anh nữa nên chả thể...",published:!0},{title:h,date:r,tags:j,description:d,published:g}=l;var c=t(`<p><img src="/images/learn-nextjs/image-01.png" alt="minh-hoa"/></p> <p>Kế hoạch có chút thay đổi, vì hiện tại mình đang làm việc trên công ty khá bận và còn kèm thêm cả dự án với người anh nữa nên chả thể làm cái series này theo cái mình nghĩ được, nhưng mà vẫn sẽ tiếp tục tìm hiểu và thay đổi mấy cái mình không ưa ở cái dự án công ty mình đang làm.</p> <p>Thiệt ra thì front-end dự án công ty đang làm bằng Nextjs và cũng thật sự thì mình không được làm từ đầu mà công ty thuê mấy ông Ấn Độ làm, có 1 cái vấn đề mà mình thấy không ưng cho lắm là lộ hết cả đống api ra trông không được bảo mật cho lắm, cho nên trong bài này mình sẽ thử cách không gọi api gốc xem có khó triển khai hơn không.</p> <p>Hiện tại project công ty đang gọi api ở phía client</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> &#123;
  <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">fetchPosts</span>(<span class="hljs-params"></span>) &#123;
    <span class="hljs-keyword">let</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;https://api.vercel.app/blog&#x27;</span>)
    <span class="hljs-keyword">let</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>()
    <span class="hljs-title function_">setPosts</span>(data)
  &#125;
  <span class="hljs-title function_">fetchPosts</span>()
&#125;, [])</code></pre></div> <p>điều mình mong muốn là không lộ domain của api tránh nhỡ ai đó xấu tính DDOS sập backend chẳng hạn</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> &#123;
  <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">fetchPosts</span>(<span class="hljs-params"></span>) &#123;
    <span class="hljs-keyword">let</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;/api/blog&#x27;</span>)
    <span class="hljs-keyword">let</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>()
    <span class="hljs-title function_">setPosts</span>(data)
  &#125;
  <span class="hljs-title function_">fetchPosts</span>()
&#125;, [])</code></pre></div> <p>mình sẽ lấy ví dụ bằng json placeholder với api <code>https://jsonplaceholder.typicode.com/posts</code></p> <p>Trong Nextjs tại phần docs ở Routing > Route Handlers thì ta hoàn toàn có thể làm được như này</p> <p>tạo một file route.ts tại đường dẫn <code>app/api/posts/route.ts</code></p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">import</span> &#123;<span class="hljs-title class_">NextResponse</span>&#125; <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;next/server&quot;</span>;
<span class="hljs-keyword">import</span> postsService <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../../../../services/postsService&quot;</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">async</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">GET</span>(<span class="hljs-params">request: Request</span>) &#123;
    <span class="hljs-keyword">const</span> &#123;searchParams&#125; = <span class="hljs-keyword">new</span> <span class="hljs-title function_">URL</span>(request.<span class="hljs-property">url</span>);
    <span class="hljs-keyword">const</span> userId = searchParams.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;userId&#x27;</span>) || <span class="hljs-literal">undefined</span>;
    <span class="hljs-keyword">const</span> page = searchParams.<span class="hljs-title function_">get</span>(<span class="hljs-string">&#x27;page&#x27;</span>) || <span class="hljs-literal">undefined</span>;
    <span class="hljs-keyword">const</span> limit = searchParams.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;limit&quot;</span>) || <span class="hljs-literal">undefined</span>;
    <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> postsService.<span class="hljs-title function_">getPosts</span>(&#123;userId, page, limit&#125;);
    <span class="hljs-keyword">return</span> <span class="hljs-title class_">NextResponse</span>.<span class="hljs-title function_">json</span>(&#123;<span class="hljs-attr">data</span>: data&#125;);
&#125;</code></pre></div> <p>và đây là nội dung file postsService</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">import</span> axios <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;axios&quot;</span>;
<span class="hljs-keyword">import</span> &#123;<span class="hljs-title class_">PostModel</span>&#125; <span class="hljs-keyword">from</span> <span class="hljs-string">&quot;../models/PostModel&quot;</span>;

type <span class="hljs-title class_">GetPostProps</span> =&#123;
    userId?: string | string[],
    page?: string | string[],
    limit?: string | string[]
&#125;


<span class="hljs-keyword">const</span> <span class="hljs-title function_">getPosts</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">&#123;userId, page, limit&#125;: GetPostProps</span>) =&gt; &#123;
    <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;https://jsonplaceholder.typicode.com/posts&quot;</span>, &#123;
        <span class="hljs-attr">params</span>: &#123;
            <span class="hljs-attr">userId</span>: userId,
            <span class="hljs-attr">_page</span>: page,
            <span class="hljs-attr">_limit</span>: limit
        &#125;
    &#125;).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">res</span> =&gt;</span> res.<span class="hljs-property">data</span>) <span class="hljs-keyword">as</span> <span class="hljs-title class_">PostModel</span>[];
&#125;

<span class="hljs-keyword">const</span> postsService = &#123;getPosts&#125;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> postsService;</code></pre></div> <p>Chỉ có như vậy thôi, giờ việc gọi api sẽ là</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> <span class="hljs-title function_">getPosts</span> = <span class="hljs-keyword">async</span> (<span class="hljs-params">&#123;page, limit&#125;: &#123;page: string, limit: string&#125;</span>) =&gt; &#123;
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> axios.<span class="hljs-title function_">get</span>(<span class="hljs-string">&quot;/api/posts&quot;</span>, &#123;<span class="hljs-attr">params</span>: &#123;page, limit&#125;&#125;).<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">res</span> =&gt;</span> res.<span class="hljs-property">data</span>.<span class="hljs-property">data</span>)
&#125;</code></pre></div> <p>Kết quả sẽ thay đổi như sau:</p> <p><img src="/images/learn-nextjs/image-02.png" alt="minh-hoa"/> bị lộ api gốc</p> <p>thành</p> <p><img src="/images/learn-nextjs/image-03.png" alt="minh-hoa"/></p> <p>Nó sẽ đem lại kết quả tương đương nhưng lại bảo mật hơn nếu muốn giấu các thông tin nhạy cảm kiểu như domain, API KEY, hoặc đơn giản hơn và hay dùng có lẽ là từ frontend gọi api khác domain sẽ bị CORS thì làm như này sẽ được</p>`,1);function m(s){var a=c();p(38),n(s,a)}export{m as default,l as metadata};
