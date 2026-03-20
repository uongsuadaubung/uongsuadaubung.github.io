---
title: "Chrome extension"
date: "2025-05-14"
tags: ["Coding"]
description: "Tôi từng nhìn thấy một video trên Tiktok hay là Facebook gì đó đại loại nội dung video là trong 1 phòng thi thì có một sinh viên sử d..."
published: true
---

![minh-hoa](/images/chrome-extension/image-01.png)

Tôi từng nhìn thấy một video trên Tiktok hay là Facebook gì đó đại loại nội dung video là trong 1 phòng thi thì có một sinh viên sử dụng một chương trình nào đó tôi không rõ sử dụng chức năng chụp ảnh màn hình phần câu hỏi và ngay sau đó có luôn đáp án hiển thị và người đó nhanh chóng hoàn thành bài thi. Trông rất là tà đạo và ma giáo nhưng tôi cũng khá thích ý tưởng đó nên tôi cũng muốn làm 1 cái cho riêng mình. Sau đây thì tôi sẽ kể lại quá trình phát triển 1 extension nhỏ như cái mắt muỗi mà gian nan vcl.

Tôi cũng từng cùng 1 người anh làm 1 ứng dụng có sử dụng AI bằng 1 cái api chọc lậu nhưng giờ không dùng được nữa vì nó đã được làm bảo mật hơn, nó cũng không hẳn là vấn đề vì định hướng của ông ấy là không bỏ ra 1 đồng nào còn tôi thì cũng đã tìm ra cách để bypass api đó lần 2 rồi, chỉ là mất hơi nhiều thời gian của tôi và nó vẫn không khả thi trong định hướng của ông ý nên là tôi dùng cho extension lần này của mình.

Tôi dù đã từng làm chơi chơi được 1 vài cái extension nhưng không hề tìm hiểu chuyên sâu về nó, chỉ cố gắng code cho xong và chạy được thôi cho nên lần này tôi muốn code 1 cách cẩn thận và tử tế hơn nên chắc chắn phải code bằng Typescript, tôi đã lên Youtube search cách tạo Chrome Extension bằng typescript thì đương nhiên là cũng có kết quả, họ hướng dẫn tạo bằng Vite, demo bằng cách sửa trang defaut popup thêm 1 cái button click bắn ra thông báo, code thì typescript khá đúng ý tôi rồi nên tôi bắt đầu bắt tay vào project github của dự án đó vào xem code, nói chung tưởng chừng thuận lợi nhưng mà vẫn chẳng như mơ, rắc rối kéo đến ngay sau đó.

Giới thiệu qua 1 chút thì 1 project chrome extension nó có cấu trúc gồm các file

- **manifest.json**: Đây là file cấu hình chính của extension, nơi chứa các thông tin cần thiết như tên, phiên bản, quyền truy cập, và các thành phần khác của extension.
- **content script**: Đây là các script được gắn vào trang web mà người dùng truy cập. Chúng cho phép bạn tương tác với nội dung của trang và thực hiện các thay đổi cần thiết.
- **background script**: Đây là các script chạy ngầm, không liên kết trực tiếp với giao diện người dùng. Chúng có thể xử lý các tác vụ như quản lý trạng thái, lắng nghe các sự kiện, và thực hiện các chức năng mà không cần sự tương tác trực tiếp từ người dùng.
- **default_popup**: Đây là giao diện hiển thị khi người dùng nhấp vào biểu tượng của extension trên thanh công cụ của trình duyệt. Nó thường chứa thông tin hoặc các tùy chọn mà người dùng có thể tương tác.

Ý tưởng của cái extension tôi sắp làm cùng đơn giản thôi, chọn 1 phần text trên trang web sau đó sẽ hiện lên 1 toolbox nhỏ có chứa vài chức năng như dịch, tóm tắt, trả lời câu hỏi và 1 chức năng cho nhập promt tự do. Sau khi chọn xong chức năng sẽ call api đến cái api lậu mà tôi có, sau đó nó sẽ thực hiện yêu cầu và trả về kết quả cho mình.

Cái vấn đề tôi gặp phải đầu tiên muốn nói chính là cái ví dụ mà người ta hướng dẫn cho mình thì nó chỉ là phần **defaut_popup** thôi, nhưng tiện ích của tôi làm thì 90% nó đều xử lý hết trên **content script**, không lẽ tôi lại phải viết hết code bằng javascript ư? may quá không phải khổ thế vì tôi thấy trong project github kia họ có cấu hình phần vite.config có phần build

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input:{
        background: resolve(__dirname, 'background.ts'),
        popup: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "content.ts"),
      },
      output:{
        entryFileNames:'[name].js',
        assetFileNames: 'assets/[name].[ext]' // Xuất file CSS riêng

      }

    }
  }
```

ít nhất thì không còn phải viết code thuần js nữa vì tôi rất sợ type của js nó tùm lum fix rất mệt, chỉ có vấn đề là tôi không làm được bằng React Component mà phải viết DOM query hơi khổ.

Tôi đã thực sự làm xong hết toàn bộ giao diện trong 1 buổi chiều, tưởng ngon ăn lắm rồi cho đến khi ghép api vào thì mới nhận ra 1 vấn đề nghiêm trọng nữa là chrome manifest v3 nó hoàn toàn chặn hàm **eval**, hàm đó là hàm mà tôi thực sự cần để giải mã script function mà api trả về, thử rất nhiều cách như dùng iframe vì tôi search bằng Chatgpt nó kêu thực thi trong sandbox được nên là tôi lại phải viét lại code gửi mã từ background ra đến iframe, nói thì bằng 1 câu nhưng nếu ai thực sự làm rồi thì sẽ hiểu nó rất là lòng vòng..... Mất công mất sức chán chê đủ các kiểu cuối cùng Chatgpt nó kêu tôi là không có cách nào -.- nghe mà muốn đấm cho vài cái vì cách nó đưa ra, làm xong rồi không được thì mới kêu không có cách nào khác, tưởng chừng dự án kết thúc thì tôi phát hiện ra manifest v2 có hỗ trợ hàm eval và phải xin quyền.

![minh-hoa](/images/chrome-extension/image-02.png)

Chạy thành công mĩ mãn luôn, nhưng vì chuyển về v2 nên tôi lại tự tạo cho mình thêm 1 vấn đề khác đó chính là Google Chrome nó không support manifest v2 nữa cho nên nó luôn cảnh báo, tự động tắt extension của tôi đi thực sự rất phiền, đồng thời tôi cũng đối mặt với 1 cái vấn đề khác nữa, vì tôi inject css và html vào trang web nên nó đồng nghĩa với việc global css của trang cũng sẽ ảnh hưởng tới các phần của tôi, ví dụ font chữ, font size to nhỏ, màu nền đủ các vấn đề...

Lại hỏi Chatgpt nó đưa ra 2 giải pháp 1 là dùng iframe, 2 là dùng shadow root, tôi lại viết lại code của mình nhưng làm xong thì nhận ra việc gửi và nhận dữ liệu giữa extension và iframe nó rất khó, rất là cồng kềnh, sau đó lại phải sửa lại code về dùng shadow, vẫn là lại nói mồm thì nhanh chứ sửa đi sửa lại mệt ẻ. Đến tận thời điểm này thì code của tôi mới đem ra cho tester đi kiểm thử phiên bản đầu tiên.

![minh-hoa](/images/chrome-extension/image-03.png)

Vậy đó, từ ngày 13/4 (sinh nhật tôi :V) đến ngày 22/4 tôi mới hoàn thành được giai đoạn 1 đó mới là gồm làm cho api hoạt động và chỉnh sửa giao diện để hoàn thiện ở mức chạy được

Sau đó tôi chuyển sang giai đoạn 2, ở giai đoạn này tôi muốn làm thêm chức năng chụp ảnh màn hình thì thì nó hoàn toàn không thể thực hiện đơn thuần trên trình duyệt được nữa mà cần có 1 backend để thực hiện OCR, tôi chuyển hết request về BE của tôi và tôi sẽ dùng BE này để gọi api đến AI, đồng nghĩa với việc giải quyết được vấn đề eval ở trình duyệt và nâng lại manifest version lên 3. Xử lý BE này thì đơn giản hơn xíu nên không gặp vấn đề gì lắm, cái vấn đề thực sự mà tôi gặp phải là việc cắt ảnh ở phía extension thôi.

Tại phiên bản cut ảnh đầu tiên nó cũng hoạt động khá là ổn, khá là ổn vì lúc ý tôi cũng chưa nhận ra được vấn đề thôi, tôi gửi ảnh về BE, cắt ảnh theo vùng chọn, OCR đọc chữ trong ảnh, trả chữ về client. dùng kết quả đó gửi đến BE tiếp để cho thực thi yêu cầu tới AI. vấn đề nằm ở chỗ buổi sáng tôi code trên máy công ty độn phân giải full hd, tối về dùng máy của mình độ phân giải 2k, scale 200%, cái bước cắt ảnh sai tùm lum, sửa công thức đi đi lại lại bao nhiêu lần mới đúng

Tôi nhận ra được là ở FE dùng canvas cut ảnh luôn được không cần phải dùng đến BE nên tôi sửa lại luôn vì nếu cắt ở BE thì sẽ phải gửi full ảnh gốc lên kèm toạ độ bắt đầu, width, height phần cut, độ phân giải màn hình cao thì phần gửi lên BE sẽ rất nặng, cắt trước mới gửi thì sẽ nhẹ hơn nhiều, sau đó gửi ảnh lên BE thì chỉ còn mỗi bước OCR nữa là xong.

![minh-hoa](/images/chrome-extension/image-04.png)

Trong giai đoạn này tôi hoàn thành thêm cả move và resize popup

<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="266" id="BLOGGER-video-8b416ca65fb90dc3-11025" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dxhHECDoQGTj2Pj6S6m24oMVyCjt0csRkWc_0sZ9hRrTehsIYoH6MPWWrQRHoksl5wdPZ5zO7pGuzutyMjpg0n_4eqjCibHUl9LtQhXTgC8zYpf2P_zmvoRyLmMFaVu3Jpohdqx&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="530"></iframe>
<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="266" id="BLOGGER-video-b321ee9d51abc947-8444" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dwB41tbdAoIyqN5459uGF0j2FpTMNMipJ1nm9-YHPZi0UaxPFtWk9NkShXfsO6HAJQvEauzxa0XviAZhkt8eABAYYlMaCuLQb4HbUOWSzbcwz2e6LmAQyxGX76sq8CwhIkv3-o&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="526"></iframe>

Sang giai đoạn 3, tôi nhận ra tôi hoàn toàn có thể code file content.ts, background.ts bằng react và thậm chí còn chả cần thiết phải dùng đến vite, đầu óc quay cuồng choáng váng vl luôn, làm bao nhiêu lâu thì cũng nhận ra được cái sự thật nhảm nhí này

Tôi cấu trúc lại dự án file viết 1 file script để copy những file tĩnh trong thư mục public gồm file manifest.json và hình ảnh vào thư mục dist, build file scss sang css và đưa vào dist, build file ts sang js đại loại như sau 

```javascript
const sourceDir = path.join(__dirname , "src", 'public');
const destDir = path.join(__dirname, 'dist');
const cssAssetDir = path.join(__dirname, 'dist', 'assets');
const popupScss = path.join(__dirname, 'src', 'css', 'popup.scss');
const contentScss = path.join(__dirname, 'src', 'css', 'content.scss');


// Sao chép thư mục tĩnh
function copyDirectory(source: string, destination: string) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach(file => {
    const curSource = path.join(source, file);
    const curDest = path.join(destination, file);

    if (fs.lstatSync(curSource).isDirectory()) {
      copyDirectory(curSource, curDest); // Đệ quy sao chép thư mục
    } else {
      fs.copyFileSync(curSource, curDest); // Sao chép file
      console.log("Copied file:", curDest);
    }
  });
}

function buildSass(cssPath: string, fileName: string) {
  if (!fs.existsSync(cssAssetDir)) {
    fs.mkdirSync(cssAssetDir, { recursive: true });
  }
  const result = sass.compile(cssPath);
  fs.writeFileSync(path.join(__dirname, 'dist', 'assets', `${fileName}.css`), result.css);
  console.log("Builded css:", path.join(__dirname, 'dist', 'assets', `${fileName}.css`));
}

copyDirectory(sourceDir, destDir);
buildSass(popupScss, 'popup');
buildSass(contentScss, 'content');


await build({
  entrypoints: ['src/popup.tsx', 'src/background.ts', "src/content.tsx"],
  outdir: 'dist',
  target: 'browser',
  minify: true,
});
```

![minh-hoa](/images/chrome-extension/image-05.png)

Phần build ra rất gọn gàng mà giờ k phải phụ thuộc vào cái vite nữa, cần gì tự build đó luôn.

content script hiện tại được viết lại bằng react, chia hết ra các component nhỏ xíu để tôi dễ quản lý code hơn

```javascript
return (
  <>
   <link rel="stylesheet" href={chrome.runtime.getURL("assets/content.css")}/>
   <PopupMenu runCustomPrompt={runCustomPrompt}/>
   <IconBox handleIconClick={handleIconClick}/>
   <ScreenshotCanvas />
  </>
);
```

![minh-hoa](/images/chrome-extension/image-06.png)

Trong phần này tôi chọn bun vì tôi lười cài thêm package thôi chứ muốn build thì cài thêm esbuild cũng được, hơn nữa do ban đầu tôi định bundle sang file exe để giấu mã nguồn backend của mình nữa.

Sau khoảng 1 tháng từ 13/4 đến 13/5 tính cả nghỉ lễ :V, cuối cùng tôi cũng hoàn thiện được extension AI của mình, kể ra cũng học được rất nhiều thứ dù chả phải là dự án gì ghê gớm lắm nhưng nói chung khá là đáng nhớ

Đây là demo AI, tuy không đúng 100 % nhưng mà nó cũng giúp được trả lời nhanh :D

<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="266" id="BLOGGER-video-152e1b4a13c1cdce-11281" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dwb2r1Rupy8x94MCP_WN6pyKQbgp9U_zWigutmKGf8TyTRJr5-bsRIt0S08loFJItOl34C4mEPge9Qk-GZZexEgy6L-UjqgDAAF2dMRZ0XdBW4sYQlXZD8VkK0a-dlMMIUS-nSX&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="570"></iframe>
<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="266" id="BLOGGER-video-425f44ae6217dd42-7879" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dyrV0fib16RPXTd7oa0ZcjVcqCmxvkxwSR4J0qOc7rjlMO-jBFUTexVDGHpxYK-hoZ_kH286fSssaDztWATG_VsXY-6AopkRMMTPgsnQA0PTIhiaAvY0b3GHK3FEQJ-y1U7B-w&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="587"></iframe>
<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="266" id="BLOGGER-video-02df5dbbef88858a-15080" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dwtLXjzrTmOEoHJc2Jj9hzzMO5e_9_hya7kVjVp4aNd8oZIJ2Z5rcfHjr8MzeulaLvAa9yKMpRWJl1V-coyO0POgX4MDbP2TYyPmiPL12TgpsuKkQ-FEDdXCqU39gB_-tk5hRZz&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="586"></iframe>
