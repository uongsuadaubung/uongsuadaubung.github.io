---
title: "Tự code tool tải tài liệu Slideshare và đóng gói thành Web App"
date: "2025-02-19"
tags: ["Lập Trình", "Tool & Extension", "Trải Nghiệm"]
description: "Hành trình từ một script chống cháy tải PDF giúp người nhà, cho đến lúc vã mồ hôi hột đóng gói thành một trang Web hoàn chỉnh chạy đa luồng."
published: true
---

# Tự code tool tải tài liệu Slideshare và đóng gói thành Web App

Chuyện là hôm nọ, đang mổ cò hì hục fix bug thì tự dưng bà chị gái nhắn tin nhờ tải hộ cái tài liệu trên Slideshare. Chị bảo lướt thấy hay quá mà lại ngại đăng ký tài khoản lằng nhằng, nhờ mình tải hộ file PDF về xem cho tiện. Mình lẩm bẩm trong miệng đoạn lên Google gõ 'Slideshare downloader' xem có rổ web tự động nào không.

Tìm đại một công cụ tải trực tuyến rồi dán link vào, nhưng trong lúc ngồi đợi mòn mỏi server của họ tải file, cơn tò mò nghề nghiệp nổi lên. Mình bật tính năng F12 lên xem các công cụ online này sử dụng mánh khóe gì để bóc tách tệp.

Ngồi khảo sát cấu trúc DOM của trang tải, sau đó lượn sang đọc DOM gốc của trang Slideshare thì mình chợt nhận ra... đáp án nằm ngay trước mắt!

## 1. Phát hiện cơ chế và Script đầu tay

Hóa ra thay vì bóc tách API ngầm quá cao siêu, hệ thống Slideshare xử lý mặt tiền khá đơn giản: họ nén nguyên tất cả các link ảnh của từng slide vào ngay bên trong một thẻ `div` bí mật mang ID `#new-player`. Không những thế, ảnh còn được chia sẵn ra 3 kích thước để lựa chọn: `320w`, `638w`, và rõ nét `2048w`.

Các công cụ downloader trực tuyến thực tế chỉ làm nghiệp vụ cạo dữ liệu DOM (scrape) để gom toàn bộ danh sách link ảnh này lại, tải về và nén lại thành 1 file PDF nguyên xi.

Thấy quy trình này quá ư là dễ đoán, mình mở ngay con IDE lên, viết một đoạn Script bằng Puppeteer + Typescript với tư duy thực dụng để lách luật. Khởi động Puppeteer chạy headless, trỏ đến URL của tài liệu, chờ thẻ `#new-player` xuất hiện rồi bắt đầu dùng Regex chọc lấy hết các đuôi phân giải `2048w`.

```typescript
// Trích xuất đoạn mã chứa link
const htmlContent = await page.$eval('#new-player', el => el.innerHTML?.trim());

// Quăng regex vô tìm toàn bộ link jpg siêu nét
const regex = new RegExp(`https?:\\/\\/[^\\s"]+\\.jpg(?=\\s${job.size}w)`, "g");
const matches: string[] = htmlContent.match(regex) || [];
```

Sau khi có link ảnh, mình lôi thư viện `pdf-lib` và `sharp` ra để sắp xếp ảnh thành một trang PDF. Nhồi buffer ảnh vào trang PDF rồi lưu lại thế là xong, vứt file ném trả bà chị. Quá đơn giản... nếu câu chuyện chỉ dừng lại ở đây.

## 2. Nỗi ám ảnh "Giao diện người dùng"

Code xong script chạy terminal rẹt rẹt ra file, mình tự dưng thấy ngứa nghề. Công cụ hay thế này mà khóa chặt trong màn hình dòng lệnh thì hơi phí, ngoài mình ra chẳng ai xài được. Mình nảy số tự hỏi: "Tại sao không bọc nó lại thành một trang web giao diện thân thiện nhỉ?". Thế là mình quyết định chơi lớn: **Nâng cấp trực tiếp nó thành một Web App thực thụ** để cộng đồng mạng hay bất kỳ ai có link đều dễ dàng dán vào tải được luôn.

Mình dựng vội cái server Express, dùng EJS làm giao diện nhập URL, và kết nối MongoDB để lưu trạng thái tải file của từng user. Cứ tưởng ném cái hàm tạo PDF hôm qua vào trong Router của Express là xong bài. Mình hý hửng gõ lệnh chạy thử, mở 2 tab lên test tính năng tải song song.

BÙM. Màn hình console đỏ lừ, tab trình duyệt quay mòng mòng, server giật lag không phản hồi. 

Ngồi debug mờ cả mắt, mãi lúc sau mới nhảy số phát hiện ra vấn đề oái oăm: Quá trình dùng `sharp` để convert Buffer ảnh và `pdf-lib` để vẽ lại file PDF là một **tác vụ ngốn CPU cực tàn bạo!** Vì Node.js vốn chạy đơn luồng (Single Thread), nên khi luồng chính đang gồng mình xử lý tạo PDF cho tab thứ nhất, nó block luôn toàn bộ luồng request, làm tab thứ hai và tất cả người dùng khác kẹt cứng không truy cập được server.

## 3. Quá trình vật lộn với Worker Threads

Nhận ra lỗi sai tai hại về thiết kế hệ thống, mình tức tốc lao vào tái cấu trúc. Bài toán giờ đây là phải đưa toàn bộ khâu tải ảnh và nhào nặn PDF ra một luồng riêng. Lời giải xuất hiện: `worker_threads`.

Mình ném đoạn code tạo PDF sang một file độc lập tên là `pdfWorker.ts`. Tuy nhiên, nếu có 100 người vào nhập link cùng lúc mà gọi ra 100 Worker thì chắc xẹp luôn cả con máy chủ RAM 1GB của mình. Mình bắt buộc phải code thêm một lớp **WorkerPool** ngầm để giới hạn số luồng hoạt động. 

Đây là đoạn code xương máu đã ra đời trong khoảnh khắc bế tắc đó:

```typescript
import { Worker } from 'worker_threads';
// ...

class WorkerPool {
  private pool: Worker[] = [];
  private readonly maxWorkers: number = 5; // Chỉ cho phép chạy tối đa 5 luồng tải PDF
  
  async createPdf(imageUrls: string[], job: DownloadItemModel) {
    // Nếu số luồng đang bận chạm ngưỡng, bắt request đợi nghỉ một lát
    if (this.pool.length >= this.maxWorkers) {
      await this.waitForAvailableWorker();
    }
    
    // Khởi tạo luồng thợ phụ
    const workerPath = path.resolve(__dirname, "../worker/pdfWorker.js");
    const worker = new Worker(workerPath, {
      workerData: { job, imageUrls },
    });
    
    this.pool.push(worker);
    
    worker.on("exit", (code) => {
      // Chạy xong, đá nó ra khỏi Pool để nhường chỗ cho request khác
      this.pool = this.pool.filter(w => w !== worker);
    });
  }
  
  private waitForAvailableWorker(): Promise<void> {
    return new Promise(resolve => {
      const interval = setInterval(() => { // Tái kiểm tra mỗi 100ms
        if (this.pool.length < this.maxWorkers) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
}
```

Mỗi User gửi request xong, server lập tức đẩy dữ liệu ID xuống MongoDB và đưa công việc vào hàng chờ của WorkerPool. Người dùng chỉ việc nhìn trang Web hiển thị thông báo "Đang xử lý PDF..." lặp lại sau mỗi 2 giây, trong khi ở dưới hầm máy rầm rập chạy. Xong xuôi, database cập nhật `isDone = true` và quăng nút tải về cho người dùng nhấn.

## 4. Chốt sổ

Gửi luôn một cái link web public sang cho bà chị dùng, thấy bả thao tác mượt mà tải file sầm sập mà lòng vui như trúng số. Thật ra cái hành trình từ một dòng Script ăn xổi, đắp thịt dần qua mô hình bất đồng bộ và tối ưu đa luồng bằng Worker là thứ tốn không ít nơ-ron thần kinh, nhưng cái cảm giác thấy server mình chịu tải trơn tru xứng đáng đến từng phút đồng hồ mày mò.

Tất cả code dự án Server + Worker này, anh em nào tò mò cách setup Express bắt tay với Puppeteer và MongoDB thì cứ sang repo Github tài khoản của mình mà tham khảo nhé. Cứ clone về, điền URI MongoDB vô là chạy phe phé. Hành trình cày cuốc công cụ cào mạng này xin khép lại, hẹn anh em ở một bài vật lộn hệ thống kế tiếp :v!
