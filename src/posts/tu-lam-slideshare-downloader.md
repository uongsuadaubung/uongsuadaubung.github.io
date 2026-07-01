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

## 2. Thiết kế giao diện web

Sau khi code xong script chạy trên terminal, mình muốn đóng gói nó thành một giao diện web đơn giản để dễ sử dụng hơn thay vì gõ dòng lệnh. Mình quyết định dựng một Web App nhỏ để bất kỳ ai có link đều dễ dàng dán vào và tải được luôn.

Mình dựng server Express, dùng EJS làm giao diện nhập URL, và kết nối MongoDB để lưu trạng thái tải file của từng user. Cứ tưởng ném cái hàm tạo PDF hôm qua vào trong Router của Express là xong. Mình chạy thử và mở 2 tab lên test tính năng tải song song.

Tuy nhiên, khi thử tải song song ở 2 tab khác nhau, server lập tức phản hồi rất chậm.

Sau khi tìm hiểu, mình phát hiện ra vấn đề: quá trình dùng `sharp` để convert Buffer ảnh và `pdf-lib` để vẽ lại file PDF là một tác vụ nặng ngốn nhiều tài nguyên CPU. Vì Node.js chạy đơn luồng (Single Thread), nên khi luồng chính xử lý tạo PDF cho tab thứ nhất, nó sẽ chặn luồng request của các tab khác, khiến người dùng khác không thể truy cập được server.

## 3. Áp dụng Worker Threads

Để giải quyết vấn đề nghẽn tiến trình, mình tiến hành tái cấu trúc. Bài toán giờ đây là phải đưa toàn bộ khâu tải ảnh và tạo PDF ra một luồng riêng. Lời giải xuất hiện: `worker_threads`.

Mình ném đoạn code tạo PDF sang một file độc lập tên là `pdfWorker.ts`. Tuy nhiên, nếu có quá nhiều người dùng gọi tạo PDF cùng lúc, hệ thống sẽ dễ bị quá tải. Mình thiết lập một lớp **WorkerPool** để giới hạn số luồng hoạt động. 

Dưới đây là cách mình triển khai WorkerPool:

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

Gửi luôn cái link web public sang cho bà chị dùng, thấy bả thao tác tải file mượt mà là thấy vui rồi. Hành trình phát triển từ một dòng script đơn giản đến mô hình xử lý bất đồng bộ và tối ưu bằng Worker tuy mất chút thời gian tìm tòi, nhưng đổi lại hệ thống hoạt động ổn định và hiệu quả hơn.

Tất cả code dự án Server + Worker này, anh em nào quan tâm cách setup Express với Puppeteer và MongoDB thì cứ sang repo Github của mình tham khảo nhé. Cứ clone về, điền URI MongoDB vô là chạy được ngay. Hẹn anh em ở một chia sẻ hệ thống kế tiếp :v!
