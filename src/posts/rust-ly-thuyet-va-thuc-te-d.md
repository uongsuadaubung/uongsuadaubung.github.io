---
title: "Rust, lý thuyết và thực tế :D"
date: "2025-10-25"
tags: []
description: "Từng học qua nhiều ngôn ngữ lập trình từ thời đại học như C++, Java, C#... rồi đi làm thì code Nodejs, mình thấy mỗi ngôn ngữ đều có cái h..."
published: true
---

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-01.png)

Từng học qua nhiều ngôn ngữ lập trình từ thời đại học như C++, Java, C#... rồi đi làm thì code Nodejs, mình thấy mỗi ngôn ngữ đều có cái hay và dở riêng. Mới học thì thấy thú vị, nhưng sau một thời gian lại phát hiện ra điểm mình không thích, nên rảnh rỗi lại nhảy qua học cái mới (học vì tò mò, không phải fomo đâu :V).

Mình luôn thích viết tool, tuy là quen với Nodejs nhất nhưng Nodejs thì cái node_modules phình to quá đem thành quả lên máy khác để khoe thì không được, run lại thì lại sợ lộ code mà cũng phải cấu hình nodejs trên máy kia nữa làm mình nản, còn C++ thì mình lại thấy hơi khó học, nên vẫn đang tìm hướng nào gọn nhẹ, dễ triển khai mà vẫn hiệu quả. Tìm hiểu thấy có Go và Rust là build single file ra mã máy luôn nên mình mới nhắm đến 2 cái này.

Lần mình học Go, thích cách nó bắt buộc phải xử lý lỗi — nhìn thì rối vì chỗ nào cũng if err != nil, nhưng nhờ đó mà lập trình viên không thể bỏ qua lỗi được. Sau này mình còn mang cách viết đó áp dụng vào C# trong sản phẩm công ty. Giải 41 bài trên LeetCode bằng Go xong thì lại thấy không hợp lắm, mà IDE Goland của JetBrains cũng không còn miễn phí nên mình chuyển sang học Rust vì có cái RustRover miễn phí (và không thích xài VSCode).

Công nhận thì Rust cũng khó khó học hơn thật, cũng vì không tập trung vào học tại khi rảnh mới đá qua tí, sử dụng IDE Rust Rover có sẵn cái khóa học free của JetBrain dạng như tour, có tracking quá trình nên ít nhiều quá trình học cũng đỡ vất vả hơn là phải đi kiếm khóa học lậu :D

Cống hiến cho Leetcode 78 problems thì mình thấy nó vẫn quá lí thuyết nên tính bắt tay làm cái gì đó cho thực tế 1 chúc, vì mình sử dụng Burp Suite lậu nên quyết định làm 1 cái tool cli viết bằng rust, nghĩ qua qua cho nó vài cái chức năng như sau

- Tải Jdk
- Tải BurpSuite
- Tải loader
- Quản lý phiên bản cho đống đấy
- Chạy phiên bản đang lựa chọn

Chắc gian nan nhất là phần tải Jdk, vì là lần đầu mình code thực tế, đùng 1 phát chả hiểu quần què gì phải làm việc với api, xử lý file, giải nén zip, regex xử lý văn bản.... đại loại quá trình như sau

Truy cập google để tìm kiếm nơi tải Jdk mà phải có bản zip thì thấy đề xuất nhiều nhất là ở adoptium.net 

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-02.png)

Bên Operating System và Architecture mở Inspect lên thì thấy có api nhưng Version thì không có, loay hoay tìm mãi mà không thấy nó ở đâu nhưng sao website lại hiện thì cuối cùng mới tìm thấy nó nằm trong html, phần script

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-03.png)

thấy nó rồi thì cũng lại phải tìm cách lấy nó ra bằng cách dùng regex lấy phần json ra. 

Sau đó thì mình cũng muốn cái cli của mình nó đẹp hơn chút, có tính tương tác lựa chọn thì cũng phải nghiên cứu làm thêm (mất nhiều công thôi có crate sẵn rồi cũng không khó dùng)

Kết hợp mấy cái lựa chọn đó xong thì tổng hợp lại để gọi api lấy danh sách phiên bản để tải về.

Khi tải xong sẽ ra file zip, xử lý giải nén zip rồi lưu vào cấu hình đang sử dụng bản nào để có thể dùng cho bước chạy phía sau.

Đến phần tải Burp cũng tương tự, mà nó đơn giản hơn chỉ cần gọi api là được không phải xử lý cầu kì mấy

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-04.png)

Đây là mấy cái api mình mở inspect lên xem được

```rust
pub const API_LIST_OS: &str = "https://api.adoptium.net/v3/types/operating_systems";
pub const API_LIST_ARCH: &str = "https://api.adoptium.net/v3/types/architectures";
pub const API_LIST_VERSIONS_JDK: &str = "https://adoptium.net/temurin/releases";
pub const API_LIST_VERSIONS_BURP: &str = "https://portswigger.net/burp/releases/data?previousLastId=-1&lastId=-1&t={TIMESTAMP}&pageSize=15";
pub const API_LIST_DETAIL: &str = "https://api.adoptium.net/v3/assets/latest/{VERSION}/hotspot?os={OS}&architecture={ARCHITECTURE}";
pub const API_DOWNLOAD_BURP: &str = "https://portswigger.net/burp/releases/download?product={PRODUCT}&version={VERSION}&type={TYPE}";
```

Loader thì hồi trước vô tình thấy share ở trên mạng nên mình tải về rồi tự dùng, thấy mấy project share bị sập hết rồi

Để tăng thêm độ khó thì mình cũng thử làm song ngữ, tuy không có chính thống nhưng thôi vẫn gọi là làm được.

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-05.png)
![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-06.png)

Nói vài dòng ngắn ngủi thế thôi chứ mất 11 ngày mình mới làm xong, tuy không phải toàn thời gian, chỉ là lúc rảnh mới code thôi :D

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-07.png)

Config thì lưu kiểu này

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-08.png)

Viết thêm 2 file bin phụ nữa có chức năng chạy burp và chạy loader bằng cách đọc cấu hình từ file đó

![minh-hoa](/images/rust-ly-thuyet-va-thuc-te-d/image-09.png)

Kết quả

<iframe title="video"  allowfullscreen="allowfullscreen" class="b-hbp-video b-uploaded" frameborder="0" height="445" id="BLOGGER-video-3b21770972a2a526-12177" mozallowfullscreen="mozallowfullscreen" src="https://www.blogger.com/video.g?token=AD6v5dwns0wdukQyKLFdrff8hfwr0M7Lcz0jsnTibeKsNNVEf3EkRZZY4mvlIKtlt5I_hukUcjLvUtAXHPx9tLBjMjT33s77HuljUyL31Ofaq9oH5AsKprvmotevUdZHfHYQzG6buxaT&amp;origin=uongsuadaubung.blogspot.com" webkitallowfullscreen="webkitallowfullscreen" width="688"></iframe>
