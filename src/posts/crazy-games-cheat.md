---
title: "Crazy Games cheat"
date: "2025-10-11"
tags: ["Hack Game"]
description: "Gần cuối dự án nên mình cũng rảnh hơn một chút, nên lên hỏi Chatgpt về game Idle nào hay để chơi giải trí một tí không, được nó đưa đến tr..."
published: true
---

![minh-hoa](/images/crazy-games-cheat/image-01.png)

Gần cuối dự án nên mình cũng rảnh hơn một chút, nên lên hỏi Chatgpt về game Idle nào hay để chơi giải trí một tí không, được nó đưa đến trang Crazy Games, giới thiệu qua 1 chút để có nhiều chữ thì "Crazy Games là một nền tảng chơi game trực tuyến miễn phí, cung cấp hàng nghìn trò chơi đa dạng từ hành động, mô phỏng, giải đố, đến thể thao. Người dùng có thể chơi ngay trên trình duyệt mà không cần tải về, rất tiện lợi và phù hợp cho mọi lứa tuổi.", tôi vừa copy từ AI ra

Tôi chọn thử 1 game Mage Tower Idle Defense để chơi thì thấy nó cũng ổn chơi cũng vui 

![minh-hoa](/images/crazy-games-cheat/image-02.png)

> Mage Tower Idle Defense là một game chiến thuật nhàn rỗi trên Crazy Games, nơi bạn nhập vai pháp sư bảo vệ tòa tháp khỏi những đợt quái vật tấn công. Người chơi có thể mở khóa phép thuật mạnh mẽ, nâng cấp rune và kỹ năng, hoàn thành nhiệm vụ hàng ngày để tăng sức mạnh ngay cả khi không trực tuyến. Game được phát triển bởi JellyBeans Studios, chơi trực tiếp trên trình duyệt, không cần tải về.​

Biết là chơi game trong giờ làm việc là không đúng, nhưng hôm nay ở đây chúng ta trao đổi học thuật, cụ thể là cheat vì cái game này nếu chơi tử tế phải cày cuốc cực kì mệt nên là mình không đủ kiên nhẫn mặc dù là game Idle 😢

![minh-hoa](/images/crazy-games-cheat/image-03.png)

Sau khi chơi vài ván thì theo thói quen nghề nghiệp mình mở Inspect lên để nghiên cứu qua qua 1 chút về trò chơi thì thấy như sau

![minh-hoa](/images/crazy-games-cheat/image-04.png)

Game chạy trong 1 cái domain khác "play.jellybeansstudios.com" qua iframe, nó tải thêm 

- `https://sdk.crazygames.com/crazygames-sdk-v3.js`
- `https://play.jellybeansstudios.com/crazygames/magetower/16227719/assets/MageTower.82b9a147.loader.js`
- `https://play.jellybeansstudios.com/crazygames/magetower/16227719/assets/MageTower.82b9a147.framework.js`

sau đó refresh trang 1 lần để tìm kiếm thông tin thấy

một thông báo ở console 

![minh-hoa](/images/crazy-games-cheat/image-05.png)

vậy có nghĩa là data của game đã được tải ngay khi mình vừa load lại trang rồi

dò đến request tìm kiếm thử thì thấy có 1 request 

![minh-hoa](/images/crazy-games-cheat/image-06.png)
![minh-hoa](/images/crazy-games-cheat/image-07.png)

tôi copy url đó dùng fetch trong console để xem thử nội dung

![minh-hoa](/images/crazy-games-cheat/image-08.png)
![minh-hoa](/images/crazy-games-cheat/image-09.png)

Bên Storage thì thế này

![minh-hoa](/images/crazy-games-cheat/image-10.png)

Giải mã base64 thì sẽ có nội dung đọc được nhưng ta sẽ chỉ tập trung vào mấy trường như `gold`, `souls`, `gems` ở đây thôi nhé

```json
{"Id":"gold","Type":"Currency","Balance":"AAAAA"},{"Id":"souls","Type":"Currency","Balance":"BBBBB"},{"Id":"xp","Type":"Experience","Balance":CCCCC},{"Id":"gems","Type":"Currency","Balance":"DDDDD"},{"Id":"level","Type":"Experience","Balance":EEEEE},}
```

Giờ phân tích lên kế hoạch gian lận 1 chút nào: trước mắt thì mình thấy có 2 cách, 

- Cách 1 là đặt break point bên trong javascript code để từ đó ghi đè dữ liệu vào bộ nhớ game khi game vừa chạy.
- Cách thứ 2 là dùng 1 cái proxy bắt request chỉnh sửa trước trước khi dữ liệu nhận hoặc gửi đi giữa game và server

Mình sẽ làm bằng cách 1 trước, bằng 1 chút nghiệp vụ mày mò, mình vào xem file game sdk trước

![minh-hoa](/images/crazy-games-cheat/image-11.png)

Đọc được vài thông tin "Cloud data missing but has local data, initialize with local data", "Cloud data and local data missing, initialize with empty data", mình đoán được sơ sơ phần if bên trên liên quan đến data của game nên mình đặt breakpoint ở đó và khởi động lại game

sau khi dừng ở breakpoint, mình kiểm tra trước 

![minh-hoa](/images/crazy-games-cheat/image-12.png)

copy phần base64 ra decode sau đó sửa souls thành 999667327 rồi decode base64 lại và copy chuỗi đó

![minh-hoa](/images/crazy-games-cheat/image-13.png)

Tiếp theo gán lại giá trị vào bộ nhớ, sau đó cho chạy

![minh-hoa](/images/crazy-games-cheat/image-14.png)

![minh-hoa](/images/crazy-games-cheat/image-15.png)

Chúc mừng, game đã bị cheat thành công, và hoàn toàn được đồng bộ vào dữ liệu, tương tự thì mấy giá trị còn lại thì làm tương tự

Cách 2 để cheat thì đơn giản hơn, không cần mày mò code để hiểu vì một lúc sẽ có 1 request gửi dữ liệu đồng bộ với server

![minh-hoa](/images/crazy-games-cheat/image-16.png)

Ta sẽ dùng công cụ để bắt request đó, sửa nó trước khi nó được gửi đi, ở đây mình dùng Burp Suite, bật Intercept chỉnh sửa request đó, sau khi sửa xong và ấn Forward thế là hoàn thành 

![minh-hoa](/images/crazy-games-cheat/image-17.png)

Mình cũng đã làm được với vài game khác bằng cả 2 cách 

![minh-hoa](/images/crazy-games-cheat/image-18.png)

tại mình chỉ chơi game idle nên chỉ có thu thập rồi nâng cấp không nên cũng chả có gì 

![minh-hoa](/images/crazy-games-cheat/image-19.png)
