---
title: "Tự code thiệp cưới xịn xò: Trận chiến Google Apps Script và Deploy chia 2 họ"
date: "2026-02-24"
tags: ["Lập Trình", "Trải Nghiệm", "Chuyện Nghề"]
description: "Cứ tưởng tự viết cái thiệp cưới ném lên mạng là nhanh gọn lẹ, ai ngờ đâm đầu vào mới thấy muôn vàn rắc rối từ vụ vượt rào CORS của Google đến bài toán tách Web nhà trai - nhà gái."
published: true
---

# Tự code thiệp cưới xịn xò: Trận chiến Google Apps Script và Deploy chia 2 họ

Chuyện là ngày trọng đại chuẩn bị đến, vợ chồng mình ngồi lướt chán chê các mẫu thiệp cưới số trên mạng. Nhìn thì đẹp thật đấy, nhưng dùng mấy nền tảng dựng sẵn (builder) cứ có cảm giác rập khuôn thế nào ấy, lại còn hay dính quảng cáo hay giới hạn băng thông. 

Vốn tính dân IT không thích xài hàng có sẵn, mình vỗ ngực dõng dạc bảo vợ: "Ba cái web HTML tĩnh này để anh múa phím một đêm là xong, cần gì phải mua!". Nhưng đúng là câu nói đi trước, cái bước lết theo sau. Bắt tay vào làm mới thấy một mớ góc khuất mà chỉ lúc cạy code ra mới thấu được.

## 1. Nỗi đau lưu trữ dữ liệu với Google Apps Script (GAS)

Làm trang tĩnh (Static site) hiển thị thông tin rạp cưới, ảnh cô dâu chú rể thì quá dễ. Nhưng cái thiệp cưới thời 4.0 bắt buộc phải có mục "Gửi lời chúc" (Wish Wall) để anh em bạn bè điền form lưu lại. Vấn đề là: Web tĩnh thì lấy đâu ra Database để lưu? Mua hẳn một con máy chủ hay xài Firebase chỉ để host thiệp cưới xài vài tuần thì nghe quá... phí tiền.

Thế là mình nảy số: Tại sao không tận dụng Google Sheets làm Database, và dùng **Google Apps Script (GAS)** làm "API nội bộ"? Mình hỳ hục viết một đoạn script trên Google Drive nhận request POST để ghi thẳng lời chúc vào file Excel.

Hý hửng vào trang web, nhập lời chúc mẫu, bấm GỬI... BÙM! Trình duyệt báo đỏ lừ: `CORS Policy Error`. Mọi nỗ lực gọi hàm `fetch` bình thường bằng `application/json` đều bị Google chặn đứng từ vòng gửi xe (Preflight Request). Bế tắc, lên mạng rảo bước hết các diễn đàn, cuối cùng mình cũng mò ra được một "thủ thuật hắc ám": Chuyển đổi Content-Type sang dạng thô để đánh lừa trình duyệt!

Dưới đây là tuyệt chiêu xử lý AJAX "vượt rào" đẫm nước mắt của mình:

```javascript
// Gửi dữ liệu dưới dạng text/plain để lách Preflight check của CORS
$.ajax({
    url: API_URL,
    method: 'POST',
    data: JSON.stringify({ name, message }),
    contentType: 'text/plain; charset=utf-8', 
    success: function (response) {
        UIkit.notification({ message: 'Đã gửi lời chúc! ❤️', status: 'success' });
        setTimeout(loadWishes, 1500);
    },
    error: function (err) {
        // Nỗi đau thứ 2: GAS ghi dữ liệu thành công nhưng lại văng ra Redirect 302.
        // Trình duyệt coi đó là lỗi. Kệ nó, mình cứ quất luôn thông báo Success!
        UIkit.notification({ message: 'Cảm ơn bạn đã gửi lời chúc! ❤️', status: 'success' });
        setTimeout(loadWishes, 1500);
    }
});
```

Hóa ra lúc chạy xong lệnh ghi dữ liệu, Google Apps Script luôn tự tạt một cái Redirect 302 chứ không thèm trả về mã 200 JSON cho đàng hoàng. Mình đành cắn răng đưa logic thành công vào luôn cả nhánh `error`. Cốt sao dữ liệu vào được bảng Excel là ăn mừng!

## 2. Bài toán nhức não: Một Source Code, Hai Nhà Gái - Trai

Tưởng chừng xong xuôi, vợ mình lại dặn: *"Thiệp bên nhà gái phải để tên nhà gái trước, stk của em, bản đồ nhà em. Thiệp nhà trai phải stk của anh, bản đồ nhà anh nhé!"*.

Nếu làm theo tư duy thông thường, mình có thể tạo một đống câu lệnh IF ELSE vướng víu trong mã nguồn, dựa vào URL có param `?side=nhatrai` để chuyển giao diện. Nhưng như thế cái đuôi URL gửi cho người lớn rất xấu. Hoặc copy ra thành 2 project riêng biệt? Lúc code lại hay sửa ảnh thì lại phải chép qua chép lại à? KHÔNG BAO GIỜ! Tổ nghề không cho phép mình lặp lại mã (Don't Repeat Yourself).

Để giữ cho thư mục làm việc luôn chỉ là 1 source code gốc duy nhất, mình quyết định viết một file thần thánh `deploy.js` ở tầng Build bằng NodeJS. File script này sẽ thay mình tự động đóng gói toàn bộ và đập thẳng lên **2 repository hoàn toàn khác nhau** trên Github.

```javascript
const folders = ['groom', 'bride'];
const folderConfig = {
    'groom': 'https://github.com/uongsuadaubung/nha-trai.git',
    'bride': 'https://github.com/uongsuadaubung/nha-gai.git',
};

async function deploy() {
    for (const folder of folders) {
        const folderPath = path.join(buildDir, folder);
        const remoteUrl = folderConfig[folder];

        console.log(`\n--- Vận công Deploy: ${folder.toUpperCase()} ---`);
        
        // Tuyệt kĩ: Đập bỏ thư mục git cũ để commit đè lên như mới khởi tạo
        if (await fs.pathExists(path.join(folderPath, '.git'))) {
            await fs.remove(path.join(folderPath, '.git'));
        }

        const commands = [
            'git init -b main',
            'git config user.name "uongsuadaubung"',
            `git remote add origin ${remoteUrl}`,
            'git add .',
            `git commit -m "Deploy ${folder} - Lên đồ!"`,
            'git push -f origin main' // Ép văng hết dữ liệu repos cũ
        ];

        for (const cmd of commands) {
            execSync(cmd, { cwd: folderPath, stdio: 'inherit' });
        }
    }
}
```

Bây giờ mỗi lúc cần cập nhật thiết kế hay đổi ảnh cưới, mình chỉ việc gõ đúng một lệnh `npm run deploy` trên Terminal. Node.js tự động build ra folder `groom` và `bride`, cài riêng các biến môi trường cấu hình, chạy `git init` tạo kho mới tại chỗ và `git push -f` dập thẳng lên Github Pages. Chạy rẹt rẹt cực sướng, đố cần phân vân copy - paste nhầm thư mục nữa!

## 3. Tổng kết

Mặc dù chỉ là chiếc thiệp cưới được chắp vá trong vỏn vẹn vài buổi tối bớt xén giờ nghỉ ngơi, nhưng cảm giác đem những thứ tự code ra ứng dụng thực vào đời sống thực tế sướng rần rần. 

Thế mới thấy, công nghệ sinh ra cốt yếu là để giải quyết các vấn đề thực tiễn của chính bản thân. Bạn chuẩn bị tổ chức đám cưới, hay muốn làm một trang sự kiện nhanh gọn không dính Database cồng kềnh, cứ mạnh dạn vào Github kéo bộ code `my-wedding` của mình về và tham khảo nhé. Chúc anh em fix lỗi mướt mát!
