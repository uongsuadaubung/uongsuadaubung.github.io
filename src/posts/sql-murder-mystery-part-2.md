---
title: "Tập tành làm thám tử với SQL Murder Mystery - Part 2: Truy quét trùm cuối"
date: "2023-07-30"
tags: ["Hack Game", "Lập Trình"]
description: "Hành trình giăng bẫy bắt trùm cuối trong SQL Murder Mystery. Vận dụng kĩ năng Join đa bảng cực gắt chỉ trong 1 nốt nhạc."
published: true
---

# Tập tành làm thám tử với SQL Murder Mystery - Part 2: Truy quét trùm cuối

Tiếp nối phần trước còn đang dang dở. Sau khi tóm được thằng bé sát thủ đâm thuê chém mướn Jeremy Bowers ở Part 1, hệ thống nó gáy kháy mình là phía sau còn có chủ mưu rùng rợn hơn. Lần này, game nó còn xúi "Nếu tự tin kĩ năng SQL thì dùng không quá 2 câu lệnh thôi". 

IQ 40 của con dân chả sợ thách thức ba cái trò này, triển luôn hý hửng lôi cổ thằng Jeremy Bowers (id: 67318) ra hỏi cung.

## 1. Mò cung khẩu sát thủ

Mình moi cái `transcript` của hắn từ bảng `interview`:

```sql
select * from interview where person_id = 67318;
```

Kết quả lấy được lời khai cực xịn:
> Tôi đã được một phụ nữ nhiều tiền thuê. Không biết tên bả là gì nhưng bả cao tầm 5'5" (65") hoặc 5'7" (67"). Tóc đỏ và lái một chiếc Tesla Model S. Tôi biết bả từng đi tham gia sự kiện SQL Symphony Concert tới tận 3 lần vào tháng 12 năm 2017.

## 2. Câu truy vấn thần thánh giải quyết mọi vấn đề

Vậy là tốn cmn mất 1 câu lệnh gõ tay rồi. Giờ chỉ còn dùng 1 cú lệnh duy nhất để moi ra thủ phạm này thôi. Rà lại các thông tin:
*   Là nữ (`gender = 'female'`)
*   Lái Tesla Model S (`car_make = 'Tesla' and car_model = 'Model S'`)
*   Tóc đỏ (`hair_color = 'red'`)
*   Cao cỡ 65 - 67 inches, thu nhập cao. Dữ kiện này có thể chả cần dùng vì Tesla đỏ chắc cả thành phố có vài mống.
*   Đi sự kiện tên là 'SQL Symphony Concert'

Để tóm cổ bà sếp ngầm này, mình phải thực hiện join... hẳn 4 cái bảng với nhau bạo lực vãi chưởng: `person` để lấy họ tên, `drivers_license` để lọc xe/tóc, `facebook_event_checkin` để check sự kiện và ngó qua luôn `income` xem cho ngầu.

```sql
select p.id, p.name, dl.gender, p.license_id, i.annual_income, dl.age, dl.height, dl.hair_color, dl.car_make, dl.car_model
from person p 
left join drivers_license dl on p.license_id = dl.id
left join income i on p.ssn = i.ssn
left join facebook_event_checkin fec on p.id = fec.person_id
where dl.car_make = 'Tesla' 
  and dl.car_model = 'Model S' 
  and dl.gender = 'female' 
  and dl.hair_color = 'red'
  and fec.event_name = 'SQL Symphony Concert';
```

Hit Enter, màn hình chớp cái hiển thị đúng 3 dòng trả về giống y sì đúc rập khuôn, chứng tỏ bả check-in 3 lần sự kiện là chuẩn cơm mẹ nấu rồi. Tên bả là **Miranda Priestly** (income tới tận $310k lận, quá đã).

## 3. Tổng kết án

Chốt kèo gõ cái tên nộp lên phòng xử án:

```sql
INSERT INTO solution VALUES (1, 'Miranda Priestly');
SELECT value FROM solution;
```

Kết quả:
> Xin chúc mừng! Bạn đã tìm ra bộ óc đứng sau vụ án! Mọi người suy tôn bạn là thám tử SQL vĩ đại nhất... Mở sâm banh thôi!

Xong game! Phá án ez với kĩ thuật join chắp vá =)). Mấy cái này nhìn dài chứ code thực tế cũng tàm tạm, làm nhiều nó quen tay tự nảy số ý mà. Bạn nào mới học thì lên chơi cái này công nhận cuốn phết. Hẹn mọi người ở một seri game dev dị hợm khác nhé! :v
