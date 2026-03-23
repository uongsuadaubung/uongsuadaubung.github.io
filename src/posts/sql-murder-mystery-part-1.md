---
title: "Tập tành làm thám tử với SQL Murder Mystery - Part 1: Truy tìm hung thủ"
date: "2023-07-20"
tags: ["Hack Game", "Lập Trình"]
description: "Trải nghiệm phá án giết người bằng SQL cực cuốn. Hóa thân thành thám tử xịn xò dùng não to để truy vết hung thủ từ những manh mối nhỏ nhất."
published: true
---

# Tập tành làm thám tử với SQL Murder Mystery - Part 1: Truy tìm hung thủ

Đợt này tự dưng lướt mạng thấy anh em IT đồn thổi cái game [SQL Murder Mystery](https://mystery.knightlab.com/) cuốn lắm. Game này cho mình đóng vai thám tử, đi phá một vụ án mạng nhưng thay vì dùng kính lúp soi dấu vân tay thì mình dùng... lệnh SQL. Thấy cũng hay hay nên mình quyết định thử dùng IQ 40 của mình để phá án xem sao.

Câu chuyện bắt đầu bằng một thông tin úp mở: *Vào ngày 15 tháng 1 năm 2018, đã xảy ra một vụ giết người ở Thành phố SQL.* 

Chỉ có thế thôi, không có gì thêm. Đùng 1 phát thả mình vào đống database bự chà bá chả hiểu quần què gì. Nhưng thôi, cứ từ từ bóc tách.

## 1. Tìm manh mối từ hiện trường
Đầu tiên, phải đọc báo cáo án mạng. Dựa vào ngày tháng và địa điểm, mình moi cái bảng `crime_scene_report` ra soi:

```sql
select * from crime_scene_report
where city = "SQL City" and 
      type = "murder" and 
      date = 20180115;
```

Kết quả trả về một đoạn mô tả đáng đồng tiền bát gạo:
> Các hình ảnh an ninh cho thấy có 2 nhân chứng. Nhân chứng đầu tiên sống tại căn nhà cuối cùng trên đường "Northwestern Dr". Nhân chứng thứ hai, có tên là Annabel, sống ở một nơi nào đó trên đường "Franklin Ave".

Ok, vậy là có 2 người làm chứng. Giờ thì phải đi lùng xem 2 nhân vật này mặt mũi ra sao.

## 2. Truy tìm nhân chứng

Phân tích 1 xíu nhé: với dữ kiện của nhân chứng 1 là "nhà cuối cùng", tức là số nhà lớn nhất trên đường *Northwestern Dr*. Mình dùng luôn lệnh `max` số nhà. Nhân chứng 2 thì có tên "Annabel" và đường *Franklin Ave*. Dễ xơi!

```sql
-- Tìm nhân chứng 1
select * from person
where address_street_name = "Northwestern Dr" and
      address_number in (select max(address_number) from person);

-- Tìm nhân chứng 2
select * from person 
where name like "%Annabel%" and 
      address_street_name = "Franklin Ave";
```

Bùm! Lòi ra id của 2 nhân vật: ông nội **Morty Schapiro** (id: 14887) và cô nàng **Annabel Miller** (id: 16371).

## 3. Lấy cung nhân chứng

Có id rồi thì lôi cổ lên vắt áo... à nhầm, lôi lên lấy lời khai từ bảng `interview`. Để nhanh thì mình join cái bảng `person` với `interview` luôn cho nó nóng:

```sql
select person.name, interview.person_id, interview.transcript 
from person left join interview
on person.id = interview.person_id
where person.id = 14887 or person.id = 16371;
```

Lời khai lấy được như sau:
*   **Morty Schapiro:** Tôi nghe thấy tiếng súng rồi thấy một gã đàn ông chạy ra. Hắn có cái túi của phòng gym "Get Fit Now Gym", số thành viên trên túi bắt đầu bằng "48Z" (chỉ có thành viên thẻ Vàng mới có). Gã đó tẩu thoát trên con ô tô có biển số chứa "H42W".
*   **Annabel Miller:** Tôi thấy án mạng, xong nhận ra tên sát nhân học cùng phòng gym với tôi hồi tuần trước, ngày 9 tháng 1.

Quá ngon! Kẻ sát nhân là nam, là thành viên thẻ *gold* tập gym lúc ngày *20180109*, mã thành viên chứa cú pháp `48Z%` và có biển số xe chứa `H42W`.

## 4. Bắt giữ hung thủ

Giờ thì vác mấy ông thẻ Vàng của phòng gym ra tra khảo là ra ngay. Ghép thẻ gym và lịch check-in:

```sql
select c.membership_id, m.person_id, m.name, c.check_in_date, c.check_in_time, c.check_out_time
from get_fit_now_member m left join get_fit_now_check_in c 
on m.id = c.membership_id and c.check_in_date = 20180109
where membership_status = 'gold' and id like '48Z%';
```

Ra được 2 nghi phạm là **Joe Germuska** và **Jeremy Bowers**. Giờ vòng tiếp qua bảng bằng lái xe xem cha nào đi cái xe có biển  `H42W`:

```sql
-- So trùng với ID của 2 tên trên bằng cách join ngầm
select dl.*, p.name from drivers_license dl 
join person p on p.license_id = dl.id
where (p.id = 28819 or p.id = 67318) and dl.plate_number like '%H42W%';
```

Khớp cmn lệnh! Chỉ có **Jeremy Bowers** là có biển xe chứa ký tự trên do đi con Chevrolet Spark LS. Mình hý hửng Submit kết quả vào game thì nó báo:
> Xin chúc mừng! Bạn đã tìm thấy kẻ giết người! Nhưng... hãy thử truy vấn bản ghi phỏng vấn của hắn ta để tìm ra tên tội phạm thực sự đứng sau...

Ôi vãi, hóa ra thằng này chỉ là dân đâm thuê chém mướn, sau nó còn có Trùm Cuối.

Đến đây cũng mỏi tay gõ phím cmnr. Thui lười quá chả viết nữa, để lúc khác khỏe khỏe thì mình tung nốt Part 2 truy tìm con Boss đứng sau nhé :v
