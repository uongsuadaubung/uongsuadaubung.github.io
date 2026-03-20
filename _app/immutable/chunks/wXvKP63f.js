import{a as n,f as l}from"./DdKyNRsu.js";import"./2eH-Kdi_.js";import{n as t}from"./D64QkPoJ.js";const p={title:"Tailwind Component",date:"2024-09-06",tags:[],description:"Sau một thời gian ngắn tìm hiểu về Tailwind mình thấy cũng khá là hay, do là trước giờ mình từng làm về Vuejs hay React thì công ty đều sử...",published:!0},{title:r,date:i,tags:j,description:g,published:d}=p;var c=l(`<p><img src="/images/learn-tailwind/image-01.png" alt="minh-hoa"/></p> <p>Sau một thời gian ngắn tìm hiểu về Tailwind mình thấy cũng khá là hay, do là trước giờ mình từng làm về Vuejs hay React thì công ty đều sử dụng Vue Bootstrap hay là React Bootstrap nên mình quá quen với sự tiện lợi sẵn có của nó rồi nên khi quay ra Tailwind này không có sẵn các component, bảo là không có sẵn thì không đúng, ta hoàn toàn có thể kéo thêm UI component về nhưng mà nó lại bị phụ thuộc vào style của bên cung cấp đó, thôi cho nên mình sẽ tự tạo các component của mình ở mức đủ dùng thôi ví dụ như Table, Navigation bar, Modal, vài cái cơ bản mà hiện tại mình nghĩ đến, rồi sau này thiếu đâu làm thêm đó.</p> <h2>Modal</h2> <p>Hiện tại công ty mình đang sử dụng React Bootstrap nó cung cấp sẵn Modal nhưng có 1 vấn đề mình cực kỳ khó chịu khi sử dụng</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">function</span> <span class="hljs-title function_">Example</span>(<span class="hljs-params"></span>) &#123;
  <span class="hljs-keyword">const</span> [show, setShow] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleClose</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setShow</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleShow</span> = (<span class="hljs-params"></span>) =&gt; <span class="hljs-title function_">setShow</span>(<span class="hljs-literal">true</span>);

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;primary&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;handleShow&#125;</span>&gt;</span>
        Launch demo modal
      <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>

      <span class="hljs-tag">&lt;<span class="hljs-name">Modal</span> <span class="hljs-attr">show</span>=<span class="hljs-string">&#123;show&#125;</span> <span class="hljs-attr">onHide</span>=<span class="hljs-string">&#123;handleClose&#125;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Header</span> <span class="hljs-attr">closeButton</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Title</span>&gt;</span>Modal heading<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Title</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Header</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Body</span>&gt;</span>Woohoo, you are reading this text in a modal!<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Body</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Footer</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;secondary&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;handleClose&#125;</span>&gt;</span>
            Close
          <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;primary&quot;</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;handleClose&#125;</span>&gt;</span>
            Save Changes
          <span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Footer</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Modal</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
&#125;</code></pre></div> <p>Đó chính là thuộc tính <strong>show</strong> và <strong>onHide</strong> ừ thì chấp nhận 1 2 cái modal thì không sao nhưng mà làm ứng dụng web nên modal nó nhiều vô kể, từ những cái confirm, rồi đến cả những cái form phụ phụ nên làm nhiều modal rất cáu, lặp đi lặp lại việc xử ý <strong>show</strong> rồi <strong>handleClose</strong>.</p> <p>Tại đây mình sẽ làm 1 Modal khắc phục được cái vấn đề mình không thích, ý tưởng thì là gọi hàm showModal sau đó sẽ truyền Modal cần hiển thị lên, có thể là truyền thêm props để điều chỉnh size, title cho modal, có thể là callback nếu cần thiết :D</p> <p>Nghiên cứu 1 lúc thì thấy khả thi vì trong React có thể sử dụng Context để quản lý các modal, ta sẽ tạo 1 Provider như sau,</p> <div class="code-block"><pre><code class="hljs language-javascript">&lt;<span class="hljs-title class_">ModalContext</span>.<span class="hljs-property">Provider</span> value=&#123;&#123; showModal, hideModal &#125;&#125;&gt;
  &#123;children&#125;
  &#123;modals.<span class="hljs-title function_">map</span>(<span class="hljs-function">(<span class="hljs-params">&#123; Component, props, id &#125;</span>) =&gt;</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Component</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&#123;id&#125;</span> &#123;<span class="hljs-attr">...props</span>&#125; /&gt;</span></span>
  ))&#125;
&lt;/<span class="hljs-title class_">ModalContext</span>.<span class="hljs-property">Provider</span>&gt;</code></pre></div> <p>Phần xử lý showModal và hideModal cũng đơn giản thôi</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> [modals, setModals] = useState&lt;<span class="hljs-title class_">ModalState</span>[]&gt;([]);

<span class="hljs-keyword">const</span> showModal = (<span class="hljs-title class_">Component</span>: <span class="hljs-variable constant_">FC</span>&lt;<span class="hljs-title class_">ModalProps</span>&gt;, <span class="hljs-attr">props</span>: <span class="hljs-title class_">ModalPropsWithoutId</span>, externalId?: string): <span class="hljs-function"><span class="hljs-params">string</span> =&gt;</span> &#123;
  <span class="hljs-keyword">const</span> id = externalId || <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>().<span class="hljs-title function_">toString</span>(<span class="hljs-number">36</span>).<span class="hljs-title function_">slice</span>(<span class="hljs-number">2</span>, <span class="hljs-number">9</span>);
  <span class="hljs-title function_">setModals</span>([...modals, &#123; <span class="hljs-title class_">Component</span>, <span class="hljs-attr">props</span>: &#123; ...props, id &#125;, id &#125;]);
  <span class="hljs-keyword">return</span> id;
&#125;;

<span class="hljs-keyword">const</span> <span class="hljs-title function_">hideModal</span> = (<span class="hljs-params">id: string</span>) =&gt; &#123;
  <span class="hljs-title function_">setModals</span>(modals.<span class="hljs-title function_">filter</span>(<span class="hljs-function">(<span class="hljs-params">modal</span>) =&gt;</span> modal.<span class="hljs-property">id</span> !== id));
&#125;;</code></pre></div> <p>cụ thể là khi showModal, ta truyền 1 Modal vào thì nó sẽ được push vào mảng modals, sau đó trên giao diện sẽ được hiển thị ra, khi hideModal thì loại bỏ modal khoải mảng thì nó sẽ biến mất thôi</p> <p>Mình xây dựng Modal như sau</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> <span class="hljs-title class_">Modal</span>: <span class="hljs-variable constant_">FC</span>&lt;<span class="hljs-title class_">ModalProps</span>&gt; = <span class="hljs-function">(<span class="hljs-params">&#123; id, onClose, title, children, size=<span class="hljs-string">&quot;md&quot;</span> &#125;</span>) =&gt;</span> &#123;
  <span class="hljs-keyword">const</span> &#123;hideModal&#125; = <span class="hljs-title function_">useModal</span>()
  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> &#123;
    <span class="hljs-keyword">const</span> <span class="hljs-title function_">handleEscape</span> = (<span class="hljs-params">event: KeyboardEvent</span>) =&gt; &#123;
      <span class="hljs-keyword">if</span> (event.<span class="hljs-property">key</span> === <span class="hljs-string">&#x27;Escape&#x27;</span>) &#123;
        onClose?.();
        <span class="hljs-title function_">hideModal</span>(id);
      &#125;
    &#125;;
    <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">addEventListener</span>(<span class="hljs-string">&#x27;keydown&#x27;</span>, handleEscape);
    <span class="hljs-keyword">return</span> <span class="hljs-function">() =&gt;</span> <span class="hljs-variable language_">document</span>.<span class="hljs-title function_">removeEventListener</span>(<span class="hljs-string">&#x27;keydown&#x27;</span>, handleEscape);
  &#125;, [hideModal, id, onClose]);

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>
      <span class="hljs-attr">id</span>=<span class="hljs-string">&#123;id&#125;</span>
      <span class="hljs-attr">tabIndex</span>=<span class="hljs-string">&#123;-1&#125;</span>
      <span class="hljs-attr">aria-hidden</span>=<span class="hljs-string">&quot;true&quot;</span>
      <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50&quot;</span>
    &gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&#123;</span>\`<span class="hljs-attr">relative</span> <span class="hljs-attr">p-4</span> <span class="hljs-attr">w-full</span> $&#123;<span class="hljs-attr">sizeClasses</span>[<span class="hljs-attr">size</span>]&#125; <span class="hljs-attr">max-h-full</span>\`&#125;&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;relative bg-white rounded-lg shadow dark:bg-gray-700&quot;</span>&gt;</span>
          &#123;/* Modal header */&#125;
          <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600&quot;</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">h3</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;text-xl font-semibold text-gray-900 dark:text-white&quot;</span>&gt;</span>
              &#123;title&#125;
            <span class="hljs-tag">&lt;/<span class="hljs-name">h3</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">button</span>
              <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span>
              <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white&quot;</span>
              <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;()</span> =&gt;</span> hideModal(id)&#125;
            &gt;
              <span class="hljs-tag">&lt;<span class="hljs-name">svg</span>
                <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;w-3 h-3&quot;</span>
                <span class="hljs-attr">aria-hidden</span>=<span class="hljs-string">&quot;true&quot;</span>
                <span class="hljs-attr">xmlns</span>=<span class="hljs-string">&quot;http://www.w3.org/2000/svg&quot;</span>
                <span class="hljs-attr">fill</span>=<span class="hljs-string">&quot;none&quot;</span>
                <span class="hljs-attr">viewBox</span>=<span class="hljs-string">&quot;0 0 14 14&quot;</span>
              &gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">path</span>
                  <span class="hljs-attr">stroke</span>=<span class="hljs-string">&quot;currentColor&quot;</span>
                  <span class="hljs-attr">strokeLinecap</span>=<span class="hljs-string">&quot;round&quot;</span>
                  <span class="hljs-attr">strokeLinejoin</span>=<span class="hljs-string">&quot;round&quot;</span>
                  <span class="hljs-attr">strokeWidth</span>=<span class="hljs-string">&quot;2&quot;</span>
                  <span class="hljs-attr">d</span>=<span class="hljs-string">&quot;M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13&quot;</span>
                /&gt;</span>
              <span class="hljs-tag">&lt;/<span class="hljs-name">svg</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">span</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;sr-only&quot;</span>&gt;</span>Close modal<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
          <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
          &#123;/* Modal body */&#125;
          <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;p-4 md:p-5 space-y-4&quot;</span>&gt;</span>&#123;children&#125;<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
          &#123;/* Modal footer */&#125;
          &#123;/*Chưa có ý định làm gì với nó*/&#125;
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
&#125;;</code></pre></div> <p>Về cơ bản thì nó là một bộ khung bên ngoài chỉ có title và một nút close trên góc phải, mọi thứ bên trong sẽ là phần children, đương nhiên mình sẽ không điền luôn children vào đây vì làm thế này để có thể tái sử dụng được Modal này</p> <p>Sau đó khi muốn tạo thêm nhiều Modal với nhiều mục đích khác nhau chỉ cần gọi đến khung Modal này và truyền children vào</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> <span class="hljs-title class_">ModalHihi</span>:<span class="hljs-variable constant_">FC</span>&lt;<span class="hljs-title class_">ModalProps</span>&gt; = <span class="hljs-function">(<span class="hljs-params">props</span>)=&gt;</span>&#123;
  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Modal</span> &#123;<span class="hljs-attr">...props</span>&#125;&gt;</span>
    hahah
  <span class="hljs-tag">&lt;/<span class="hljs-name">Modal</span>&gt;</span></span>
&#125;
<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">ModalHihi</span>;</code></pre></div> <p>Để hiển thị ModalHihi mẫu của mình thì làm như sau</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> <span class="hljs-title class_">ExampleComponent</span>: <span class="hljs-title class_">React</span>.<span class="hljs-property">FC</span> = <span class="hljs-function">() =&gt;</span> &#123;
  <span class="hljs-keyword">const</span> &#123; showModal&#125; = <span class="hljs-title function_">useModal</span>();

  <span class="hljs-keyword">const</span> <span class="hljs-title function_">openModal</span> = (<span class="hljs-params"></span>) =&gt; &#123;
    <span class="hljs-title function_">showModal</span>(<span class="hljs-title class_">ModalHihi</span>, &#123;
      title :<span class="hljs-string">&quot;Hello World&quot;</span>,
      <span class="hljs-attr">size</span>: <span class="hljs-string">&quot;2xl&quot;</span>

    &#125;);
  &#125;;

  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;flex flex-col items-center justify-center min-h-screen bg-gray-100&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span>
        <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;px-4 py-2 bg-blue-500 text-white rounded&quot;</span>
        <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;openModal&#125;</span>
      &gt;</span>
        Show Modal
      <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  );
&#125;;</code></pre></div> <p>ở đây mình chỉ tạo 1 button, gọi đến hàm showModal và truyền vào Modal hihi, mình cũng có thể custom size và title.</p> <p><img src="/images/learn-tailwind/image-02.png" alt="minh-hoa"/></p> <p>kết quả hoạt động đúng với mong đợi</p> <h2>Toast</h2> <p>Cũng giống với Modal thì mình sẽ tạo thêm 1 mảng để chứa toast, nhưng trước tiên mình sẽ triển khai cái Alert trước vì nó trông cũng khá ổn, nhìn giống thông báo.</p> <p>Loay hoay tìm code về Alert thì mình cũng đóng nó thành 1 cái component như sau:</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">function</span> <span class="hljs-title function_">Alert</span>(<span class="hljs-params">props: AlertProps</span>) &#123;
  <span class="hljs-keyword">const</span> &#123;variant = <span class="hljs-string">&quot;primary&quot;</span>&#125; = props
  <span class="hljs-keyword">const</span> [visible, setVisible] = <span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);

  <span class="hljs-keyword">const</span> handleClose = <span class="hljs-title function_">useCallback</span>(<span class="hljs-function">() =&gt;</span> &#123;
    <span class="hljs-title function_">setVisible</span>(<span class="hljs-literal">false</span>);
    <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span> props.<span class="hljs-property">onClose</span>?.(), <span class="hljs-number">500</span>);
  &#125;,[props])

  <span class="hljs-title function_">useEffect</span>(<span class="hljs-function">() =&gt;</span> &#123;
    <span class="hljs-title function_">setVisible</span>(<span class="hljs-literal">true</span>);
    <span class="hljs-keyword">if</span> (props.<span class="hljs-property">isNotification</span>)&#123;
      <span class="hljs-built_in">setTimeout</span>(<span class="hljs-function">() =&gt;</span>
        <span class="hljs-title function_">handleClose</span>()
      , <span class="hljs-number">7000</span>);

    &#125;

  &#125;, [handleClose, props.<span class="hljs-property">isNotification</span>]);

  <span class="hljs-keyword">return</span> <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>
    <span class="hljs-attr">className</span>=<span class="hljs-string">&#123;</span>\`<span class="hljs-attr">rounded</span> <span class="hljs-attr">flex</span> <span class="hljs-attr">items-center</span> <span class="hljs-attr">p-4</span> <span class="hljs-attr">mb-4</span> <span class="hljs-attr">border</span> <span class="hljs-attr">dark:bg-gray-800</span> <span class="hljs-attr">transition-all</span> <span class="hljs-attr">duration-500</span> <span class="hljs-attr">ease-in-out</span> $&#123;
      <span class="hljs-attr">visible</span> ? &#x27;<span class="hljs-attr">opacity-100</span> <span class="hljs-attr">translate-y-0</span>&#x27; <span class="hljs-attr">:</span> &#x27;<span class="hljs-attr">opacity-0</span> <span class="hljs-attr">-translate-y-3</span>&#x27;&#125; \` + <span class="hljs-attr">AlertVariant</span>[<span class="hljs-attr">variant</span>]&#125;
    <span class="hljs-attr">role</span>=<span class="hljs-string">&quot;alert&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">svg</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;flex-shrink-0 w-4 h-4&quot;</span> <span class="hljs-attr">aria-hidden</span>=<span class="hljs-string">&quot;true&quot;</span> <span class="hljs-attr">xmlns</span>=<span class="hljs-string">&quot;http://www.w3.org/2000/svg&quot;</span> <span class="hljs-attr">fill</span>=<span class="hljs-string">&quot;currentColor&quot;</span>
      <span class="hljs-attr">viewBox</span>=<span class="hljs-string">&quot;0 0 20 20&quot;</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">path</span>
        <span class="hljs-attr">d</span>=<span class="hljs-string">&quot;M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z&quot;</span>/&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">svg</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;ms-3 font-medium&quot;</span>&gt;</span>
        &#123;props.title&#125;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;ms-3 text-sm font-base&quot;</span>&gt;</span>
        &#123;props.text&#125;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    &#123;
      props.showButton? (
        <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">&#123;handleClose&#125;</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;button&quot;</span>
          <span class="hljs-attr">className</span>=<span class="hljs-string">&#123;</span>&quot;<span class="hljs-attr">ms-auto</span> <span class="hljs-attr">-mx-1.5</span> <span class="hljs-attr">-my-1.5</span> <span class="hljs-attr">rounded-lg</span> <span class="hljs-attr">p-1.5</span> <span class="hljs-attr">inline-flex</span> <span class="hljs-attr">items-center</span> <span class="hljs-attr">justify-center</span> <span class="hljs-attr">h-8</span> <span class="hljs-attr">w-8</span> <span class="hljs-attr">dark:bg-gray-800</span> <span class="hljs-attr">dark:hover:bg-gray-700</span>&quot; + <span class="hljs-attr">AlertButtonColor</span>[<span class="hljs-attr">variant</span>] &#125;
          <span class="hljs-attr">data-dismiss-target</span>=<span class="hljs-string">&quot;#alert-border-1&quot;</span> <span class="hljs-attr">aria-label</span>=<span class="hljs-string">&quot;Close&quot;</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">span</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;sr-only&quot;</span>&gt;</span>Dismiss<span class="hljs-tag">&lt;/<span class="hljs-name">span</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">svg</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;w-3 h-3&quot;</span> <span class="hljs-attr">aria-hidden</span>=<span class="hljs-string">&quot;true&quot;</span> <span class="hljs-attr">xmlns</span>=<span class="hljs-string">&quot;http://www.w3.org/2000/svg&quot;</span> <span class="hljs-attr">fill</span>=<span class="hljs-string">&quot;none&quot;</span> <span class="hljs-attr">viewBox</span>=<span class="hljs-string">&quot;0 0 14 14&quot;</span>&gt;</span>
            <span class="hljs-tag">&lt;<span class="hljs-name">path</span> <span class="hljs-attr">stroke</span>=<span class="hljs-string">&quot;currentColor&quot;</span> <span class="hljs-attr">strokeLinecap</span>=<span class="hljs-string">&quot;round&quot;</span> <span class="hljs-attr">strokeLinejoin</span>=<span class="hljs-string">&quot;round&quot;</span> <span class="hljs-attr">strokeWidth</span>=<span class="hljs-string">&quot;2&quot;</span>
              <span class="hljs-attr">d</span>=<span class="hljs-string">&quot;m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6&quot;</span>/&gt;</span>
          <span class="hljs-tag">&lt;/<span class="hljs-name">svg</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
      ) : null
    &#125;

  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
&#125;</code></pre></div> <p>Về cơ bản chúng nó trông như sau</p> <p><img src="/images/learn-tailwind/image-03.png" alt="minh-hoa"/></p> <p>Trong trường hợp là 1 Alert bình thường thì nó vẫn cứ ở đó, nhưng nếu nó được coi là 1 toast thì sẽ xuất hiện bên góc phải màn hình và luôn có nút ấn tắt, mặc định 7 giây tự ẩn</p> <p><img src="/images/learn-tailwind/image-04.png" alt="minh-hoa"/></p> <p>Triển khai cũng gần giống với Modal, mình tận dụng luôn Context làm Modal để quản lý Toast ở đây luôn</p> <div class="code-block"><pre><code class="hljs language-javascript"><span class="hljs-keyword">const</span> [alerts, setAlerts] = useState&lt;<span class="hljs-title class_">AlertState</span>[]&gt;([]);

<span class="hljs-keyword">const</span> <span class="hljs-title function_">showAlert</span> = (<span class="hljs-params">variant: AlertProps[<span class="hljs-string">&#x27;variant&#x27;</span>], props: ToastProps</span>) =&gt; &#123;
  <span class="hljs-keyword">const</span> id = <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>().<span class="hljs-title function_">toString</span>(<span class="hljs-number">36</span>).<span class="hljs-title function_">slice</span>(<span class="hljs-number">2</span>, <span class="hljs-number">9</span>);
  <span class="hljs-title function_">setAlerts</span>(<span class="hljs-function"><span class="hljs-params">prevState</span> =&gt;</span> [...prevState, &#123; id, variant, props &#125;]);
&#125;;
<span class="hljs-keyword">const</span> <span class="hljs-title function_">hideAlert</span> = (<span class="hljs-params">id: string</span>) =&gt; &#123;
  <span class="hljs-title function_">setAlerts</span>(<span class="hljs-function"><span class="hljs-params">prevState</span> =&gt;</span> prevState.<span class="hljs-title function_">filter</span>(<span class="hljs-function">(<span class="hljs-params">alert</span>) =&gt;</span> alert.<span class="hljs-property">id</span> !== id));
&#125;;
<span class="hljs-keyword">const</span> toast = &#123;
  <span class="hljs-attr">info</span>: <span class="hljs-function">(<span class="hljs-params">text: string, props?: ToastProps</span>) =&gt;</span> <span class="hljs-title function_">showAlert</span>(<span class="hljs-string">&#x27;info&#x27;</span>, &#123;...props, text&#125;),
  <span class="hljs-attr">success</span>: <span class="hljs-function">(<span class="hljs-params"> text: string, props?: ToastProps</span>) =&gt;</span> <span class="hljs-title function_">showAlert</span>(<span class="hljs-string">&#x27;success&#x27;</span>, &#123;...props, text&#125;),
  <span class="hljs-attr">warning</span>: <span class="hljs-function">(<span class="hljs-params"> text: string, props?: ToastProps</span>) =&gt;</span> <span class="hljs-title function_">showAlert</span>(<span class="hljs-string">&#x27;warning&#x27;</span>, &#123;...props, text&#125;),
  <span class="hljs-attr">danger</span>: <span class="hljs-function">(<span class="hljs-params">text: string, props?: ToastProps</span>) =&gt;</span> <span class="hljs-title function_">showAlert</span>(<span class="hljs-string">&#x27;danger&#x27;</span>, &#123;...props, text&#125;),
  <span class="hljs-attr">primary</span>: <span class="hljs-function">(<span class="hljs-params">text: string, props?: ToastProps</span>) =&gt;</span> <span class="hljs-title function_">showAlert</span>(<span class="hljs-string">&#x27;primary&#x27;</span>, &#123;...props, text&#125;),
&#125;;

<span class="hljs-keyword">return</span> (
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">UIContext.Provider</span> <span class="hljs-attr">value</span>=<span class="hljs-string">&#123;&#123;showModal,</span> <span class="hljs-attr">hideModal</span>, <span class="hljs-attr">toast</span>&#125;&#125;&gt;</span>
    &#123;children&#125;
    &#123;modals.map((&#123;Component, props, id&#125;) =&gt; (
      <span class="hljs-tag">&lt;<span class="hljs-name">Component</span> <span class="hljs-attr">key</span>=<span class="hljs-string">&#123;id&#125;</span> &#123;<span class="hljs-attr">...props</span>&#125; /&gt;</span>
    ))&#125;
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md w-full&quot;</span>&gt;</span>
      &#123;alerts.map((&#123;id, variant, props: &#123;title, text&#125;&#125;) =&gt; (
        <span class="hljs-tag">&lt;<span class="hljs-name">Alert</span>
          <span class="hljs-attr">key</span>=<span class="hljs-string">&#123;id&#125;</span>
          <span class="hljs-attr">variant</span>=<span class="hljs-string">&#123;variant&#125;</span>
          <span class="hljs-attr">title</span>=<span class="hljs-string">&#123;title&#125;</span>
          <span class="hljs-attr">text</span>=<span class="hljs-string">&#123;text&#125;</span>
          <span class="hljs-attr">onClose</span>=<span class="hljs-string">&#123;()</span> =&gt;</span> hideAlert(id)&#125;
          isNotification=&#123;true&#125;
          showButton=&#123;true&#125;
        /&gt;
      ))&#125;
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">UIContext.Provider</span>&gt;</span></span>
);
&#125;;</code></pre></div>`,1);function u(s){var a=c();t(62),n(s,a)}export{u as default,p as metadata};
