---
title: "Chuyện chiếc bộ gõ tự làm: Khi mình chán cảnh sống chung với lỗi vặt"
date: "2026-10-20"
tags: ["Tool & Projects", "Rust & Backend", "Chuyện nghề & Chia sẻ"]
description: "Hành trình từ chuỗi ngày ức chế vì lỗi nhảy phím, tự động viết hoa của các bộ gõ cũ cho tới quyết định tự tay viết Kora bằng Rust với triết lý Profiles-first."
published: true
showOnResume: true
appName: "Kora Keyboard Suite"
appPeriod: "10/2026"
techStack: ["Rust", "Win32 API"]
---

Là dân ngồi gõ phím kiếm cơm mỗi ngày, chắc anh em cũng đồng ý với mình một điều: bộ gõ tiếng Việt giống như không khí vậy. Bình thường hít thở êm ru thì chẳng mấy ai để ý, nhưng chỉ cần nó hụt hơi hay "nghẹn" một nhịp thôi là cả ngày hôm đó coi như tụt hết cảm hứng làm việc.

Và câu chuyện dưới đây là hành trình mình đi tìm một chút "không khí trong lành" cho đôi bàn tay của mình.

## 1. Mối lương duyên trắc trở với các bộ gõ quen thuộc

Nói về bộ gõ trên Windows thì cái tên đầu tiên ai cũng nghĩ tới chắc chắn là **UniKey**. Đây là tượng đài gắn liền với tuổi thơ của biết bao thế hệ rồi. Mình cũng dùng UniKey suốt nhiều năm trời. Nhưng thú thật, thi thoảng gõ trên thanh địa chỉ trình duyệt hay trong mấy phần mềm mới, nó cứ hay bị nuốt chữ, mất dấu hoặc nhân đôi ký tự một cách khó hiểu. Cứ lâu lâu đang gõ bon tay lại phải backspace xóa đi gõ lại từ đầu, nghĩ cũng hơi cụt hứng.

Thấy vậy, mình chuyển qua dùng **EVKey**. Phải công nhận lúc mới sang, EVKey đem lại cảm giác hiện đại hơn hẳn: sửa được lỗi gõ thanh địa chỉ, giao diện gọn gàng, dùng khá thích. Mình đã nghĩ thôi thế này là yên ổn rồi. Ai ngờ dùng được một thời gian thì tác giả dừng phát triển. Windows thì cập nhật liên tục, các ứng dụng mới ra đời ngày một nhiều, mà công cụ không còn người bảo trì thì sớm muộn gì cũng phát sinh vấn đề.

Thế là mình lại khăn gói đi tìm bến đỗ mới. Lần này mình chọn **OpenKey** vì là mã nguồn mở, nhìn rất hứa hẹn. Nhưng ở đời đúng là "tránh vỏ dưa lại gặp vỏ dừa". Dùng được vài hôm, mình bắt đầu gặp một cái lỗi dở khóc dở cười: **tự động viết hoa khi bỏ dấu**.

Anh em cứ tưởng tượng đang nhắn tin hay viết tài liệu rất nghiêm túc, gõ chữ bình thường mà vừa ấn phím bỏ dấu một cái là nó nhảy tưng tửng thành chữ hoa, kiểu như đang quát vào mặt người ta vậy. Mỗi lần như thế, mình lại phải lụi hụi xóa đi, tắt bộ gõ, gõ lại bằng tiếng Anh rồi mới dám bật lại.

Cảm giác sống chung với những cái lỗi lắt nhắt như thế kéo dài suốt một thời gian, vừa phiền vừa ức chế.

## 2. Khi sự kiên nhẫn chạm đáy: Thôi thì tự làm lấy một bản!

Một buổi tối ngồi trước màn hình, sau khi lại vừa bị cái lỗi viết hoa kia "chơi khăm" thêm lần nữa, mình bỗng tự hỏi:

> *"Ủa, sao mình là lập trình viên mà ngày nào cũng phải chịu đựng cái lỗi này nhỉ? Tại sao không tự viết một bộ gõ cho riêng mình dùng cho vừa ý?"*

Nghĩ là làm. Sẵn dịp dạo gần đây mình đang rất có hứng thú với **Rust** – một ngôn ngữ nổi tiếng về độ an toàn, nhẹ và chạy siêu nhanh – mình quyết định mở project mới và bắt tay vào gõ những dòng đầu tiên.

Ban đầu, tham vọng của mình bé tí tẹo. Trong lịch sử commit đầu tiên, mình chỉ đặt cho nó cái tên tạm là **MKey**. Mục tiêu lúc đó đơn giản đến mức không thể đơn giản hơn: làm sao gõ được tiếng Việt Telex tử tế, mượt mà, gõ trên trình duyệt không bị nhảy chữ lung tung, và quan trọng nhất là **tuyệt đối không được tự ý viết hoa khi bỏ dấu**. Chỉ cần chừng đó là mình đã mãn nguyện lắm rồi.

Giao diện MKey hồi đó trông đơn sơ và mộc mạc đúng chất Win32 truyền thống, gói gọn vỏn vẹn trong 3 tab cơ bản:

![Tab Bộ gõ MKey thời kỳ đầu](/images/kora-chuyen-tu-lam-bo-go/ui-tab-bogo.png)

*Tab "Bộ gõ" thời kỳ đầu: lúc này mới chỉ tập trung giải quyết các bài toán cốt lõi nhất gồm bảng mã, kiểu gõ và cơ chế bỏ dấu sao cho chuẩn chỉnh.*

![Tab Gõ tắt MKey thời kỳ đầu](/images/kora-chuyen-tu-lam-bo-go/ui-tab-gotat.png)

*Tab "Gõ tắt": bảng macro đơn sơ ban đầu để gõ nhanh một vài cụm từ viết tắt thường dùng.*

![Tab Hệ thống MKey thời kỳ đầu](/images/kora-chuyen-tu-lam-bo-go/ui-tab-hethong.png)

*Tab "Hệ thống": các tùy chọn quen thuộc như khởi động cùng Windows hay chạy với quyền Administrator.*

Mất vài ngày hí hoáy, bản thử nghiệm đầu tiên chạy được. Tự tay gõ từng dòng tiếng Việt trên chính công cụ mình viết ra, cảm giác nó sướng và đã tay lạ lùng. Cái cảm giác gõ chữ nào ăn chữ đó, không còn nơm nớp lo bị giật hay nhảy phím bậy bạ, đúng là nhẹ nhõm hẳn.

## 3. Nhưng dùng thực tế mới thấy: Bộ gõ đâu chỉ là để gõ chữ?

Sau khi giải quyết xong bài toán gõ dấu cơ bản, mình bắt đầu dùng nó làm bộ gõ chính hàng ngày trên máy tính. Và chính lúc này, những vấn đề thực tế trong thói quen làm việc mới bắt đầu lộ ra.

Mình nhận ra một điều mà trước đây các bộ gõ cũ chưa từng làm mình thỏa mãn: **Mỗi ứng dụng chúng ta dùng hàng ngày lại có một nhu cầu về bàn phím hoàn toàn khác nhau**.

- **Lúc vào game:** Mình chỉ muốn bộ gõ tự tắt tiếng Việt ngay lập tức. Chứ đang combat căng thẳng mà bấm di chuyển `W-A-S-D` nó lại nhảy thành chữ `Ư` hay `S` có dấu thì coi như toang. Chưa kể nhiều lúc bấm nhầm phím Windows hay CapsLock là bị văng ra màn hình desktop.
- **Lúc mở công cụ lập trình / Terminal:** Mình chủ yếu gõ lệnh và code bằng tiếng Anh, nhưng thi thoảng lại cần viết ghi chú (comment) hay tin nhắn commit bằng tiếng Việt. Nếu phím tắt bộ gõ xung đột với phím tắt của trình soạn thảo thì cực kỳ bực mình.
- **Lúc mở Telegram, trình duyệt, Word:** Lúc này mới thực sự cần gõ tiếng Việt hết công suất, kèm theo cả gõ tắt, macro từ ngữ hay dùng.

Ở các bộ gõ truyền thống, giải pháp duy nhất là: **tự làm bằng tay**. Cứ mỗi lần chuyển giữa game, trình duyệt và phần mềm làm việc, mình lại phải nhớ bấm tổ hợp phím chuyển chế độ Anh - Việt. Ngày chuyển qua lại cả trăm lần, vừa mất tập trung vừa mệt mỏi. Phím tắt thì bị cố định, không thể tùy biến sâu theo ý thích cá nhân.

Thế là mình nhận ra: Nếu chỉ làm một bộ gõ đơn thuần để bỏ dấu tiếng Việt thì chưa đủ. Thứ mình thực sự cần là một công cụ hiểu được ngữ cảnh mình đang làm gì trên màn hình.

## 4. "Quay xe" sang triết lý: Profiles First

Nghĩ thông suốt điều đó, mình quyết định tái cấu trúc lại toàn bộ dự án và chuyển hướng sang mô hình **Profiles First**. Đồng thời, cái tên **Kora** chính thức ra đời.

Ý tưởng cốt lõi của Kora rất đơn giản và tự nhiên:

Mọi thứ sẽ bắt đầu từ một **Profile Root** (cấu hình gốc). Đây là nơi chứa toàn bộ thiết lập mặc định của bạn: kiểu gõ bạn thích, phím tắt quen thuộc, tốc độ gõ...

Từ Profile Root đó, mỗi ứng dụng bạn dùng sẽ là một **Profile con**:
- Mặc định, profile con sẽ **kế thừa toàn bộ** những gì mà root đang có.
- Ứng dụng nào có nhu cầu đặc biệt thì bạn chỉ việc **ghi đè (override)** đúng phần cài đặt đó mà thôi.

Chẳng hạn:
- Với game: Profile con chỉ cần ghi đè một dòng duy nhất: *Mặc định tiếng Anh, khóa phím Windows*. Còn lại mọi thứ khác cứ để nguyên.
- Với IDE lập trình: Ghi đè tổ hợp phím chuyển nhanh hoặc bật chế độ gõ thông minh riêng.
- Khi bạn chuyển cửa sổ làm việc: Kora sẽ tự động nhận diện ứng dụng đang mở để áp dụng cấu hình tương ứng, nhẹ nhàng và âm thầm như thể chưa từng có sự can thiệp nào.

Không còn cảnh phải nhớ bật tắt phím bằng tay, không còn lo bấm nhầm phím khi đang chơi game, mọi thứ cứ tự động vận hành trơn tru theo đúng thói quen của mình.

![Giao diện mới của Kora với hệ thống Profiles](/images/kora-chuyen-tu-lam-bo-go/kora-ui-bogo.png)

*Bảng điều khiển mới của Kora: thanh bên trái là danh sách các Profile theo từng app (như PowerShell, Firefox...), bên phải là các thiết lập gõ tương ứng.*

### Tinh tế đến từng ô text: Bấm `Ctrl + ~` là xong chuyện

Sau khi làm xong hệ thống Profiles theo từng app, mình tưởng như mọi chuyện đã viên mãn. Nhưng dùng thực tế một thời gian, lại lòi ra một tình huống trớ trêu: **Ngay trong cùng một ứng dụng, không phải ô nhập liệu nào cũng có "tính nết" giống nhau!**

Điển hình nhất là mấy ông trình duyệt như Chrome hay Firefox:
- Lúc bạn gõ tài liệu trên Google Docs hay gõ bình luận Facebook thì êm ru, mượt mà không có gì để chê.
- Nhưng hễ vừa trỏ chuột lên thanh địa chỉ (URL) hay thanh tìm kiếm để gõ là y như rằng dở chứng: do trình duyệt có tính năng tự động gợi ý và bôi đen từ khóa, bộ gõ bỏ dấu một cái là rất dễ bị nuốt chữ hoặc nhân đôi ký tự (kiểu gõ "gõ" nó lại thành "ggõ").
- Hay trong một số game, cửa sổ dòng lệnh và phần mềm đồ họa đặc thù: ô nhập liệu của họ lại khá "kén" phím, gõ kiểu thông thường không ăn mà phải dùng phương pháp sao chép rồi dán (Clipboard paste) thì mới hiển thị trọn vẹn tiếng Việt.

Chẳng lẽ vì một thanh địa chỉ bị lỗi mà mình lại phải đổi phương pháp gõ cho nguyên cả cái trình duyệt? Như thế thì quá bất tiện.

Để giải quyết cái sự "ẩm ương" này, Kora tiến thêm một bước: **chăm sóc và thiết lập phương pháp gửi phím riêng cho từng ô text cụ thể**.

Và để không biến việc này thành một cực hình kỹ thuật (bắt người dùng đi tìm mã định danh hay cấu hình lằng nhằng), mình thiết kế nó hoạt động cực kỳ trực quan chỉ qua 3 bước:
1. Nhấp con trỏ chuột vào ô text đang "khó ở" (như thanh địa chỉ trình duyệt).
2. Bấm nhẹ tổ hợp phím tắt (mặc định là `Ctrl + ~`).
3. Bùm! Kora lập tức tự động "bắt trọn" ô text đó, thêm ngay vào danh sách ngoại lệ của ứng dụng (nếu app đó chưa có Profile riêng, Kora sẽ tự tạo luôn một Profile mới kèm thông báo nhỏ xinh ở góc màn hình).

Từ đây, bạn chỉ việc chọn phương pháp gửi phím tương ứng: ô này cần cơ chế chống nuốt chữ khi gợi ý tự động, hay cần gửi qua khay nhớ tạm (clipboard). Chọn xong là xong, từ lần sau cứ mỗi khi con trỏ chuột nhảy vào đúng ô đó, Kora sẽ tự động chuyển sang phương pháp gửi phím tối ưu nhất, còn ra ngoài các ô văn bản khác thì mọi thứ vẫn vận hành theo kiểu tiêu chuẩn siêu tốc.

![Tab Gõ tắt trên giao diện mới](/images/kora-chuyen-tu-lam-bo-go/kora-ui-go-tat.png)

*Tab Gõ tắt cũng được thiết kế lại gọn gàng, cho phép gõ tắt linh hoạt ngay cả khi đang để chế độ tiếng Anh.*

## 5. Chuyện chiếc "Tab Quản Lý Phím": Từ một nút bấm nhỏ đến trung tâm điều khiển

Nếu nhìn lại lịch sử các bản cập nhật của dự án, có một khu vực làm mình tốn không ít tâm sức nhưng cũng mang lại nhiều sự thỏa mãn nhất: **Tab Quản lý phím**.

Ban đầu, mọi thứ xuất phát từ một nhu cầu rất nhỏ bé: mình ghét việc bị ép dùng các tổ hợp phím chuyển Anh - Việt cố định như `Ctrl + Shift` hay `Alt + Z`. Thế là mình làm một hộp thoại nhỏ xíu để tự do gán phím tắt chuyển chế độ theo ý mình thích.

Nhưng một khi đã bước chân vào con đường "tùy biến", lòng tham của một kẻ ngồi máy tính cả ngày bắt đầu trỗi dậy:
- Mình thấy phím `Caps Lock` trên bàn phím gần như chẳng bao giờ dùng tới, trong khi chiếm một vị trí cực kỳ đắc địa. Sao không đổi nó thành phím `Ctrl` hoặc `Esc` cho tiện tay khi code? Thế là tính năng **Đổi phím (Remap)** ra đời.
- Lúc vào game, phím `Windows` hay phím `Insert` là kẻ thù số một vì bấm nhầm một phát là văng game hoặc đè chữ. Vậy là tính năng **Khóa phím (Key Blocker)** xuất hiện.

Càng làm, số lượng phím cần quản lý càng phình to. Để tránh màn hình cài đặt biến thành một mớ hỗn độn, mình quyết định tách hẳn thành một **Tab Phím riêng biệt**. Tại đây, mọi thứ được nâng cấp lên một nấc mới:
- Cho phép gán cả **chuỗi phím tự động (Macro)**: bấm một nút là nó tự thực hiện một chuỗi thao tác lặp đi lặp lại.
- Mỗi quy tắc đổi phím hay khóa phím đều có thể **Bật / Tắt linh hoạt theo từng ứng dụng**. Ở ngoài màn hình chung thì bật khóa phím Windows, nhưng vào Photoshop cần dùng phím Windows thì cấu hình con tự tắt quy tắc đó đi mà không làm ảnh hưởng đến cấu hình gốc.

Và rồi... "tai nạn" xảy ra!

Khi bạn gán quá nhiều thứ: phím chuyển tiếng Việt, phím đổi chức năng, phím khóa, phím macro... thì đến một ngày, chúng bắt đầu **"đá nhau" chan chát**. Có những lúc bấm một phím mà nó không chạy, hoặc nó kích hoạt cùng lúc hai chức năng khác nhau mà mình chẳng hiểu tại sao. Ngồi mò xem phím nào đang đè lên phím nào làm mình toát cả mồ hôi hột.

Thế là mình lại ngồi làm thêm một màn hình **Chẩn đoán & Phát hiện xung đột phím**. Mở tab phím ra là có ngay một bảng tổng quan: phím nào đang gán cho cái gì, quy tắc nào kế thừa từ đâu, và đặc biệt là nếu có hai phím đang dẫm chân lên nhau thì hệ thống sẽ giơ biển cảnh báo ngay lập tức. 

![Bảng tổng quan và chẩn đoán xung đột phím](/images/kora-chuyen-tu-lam-bo-go/kora-ui-quan-ly-phim.png)

*Màn hình chẩn đoán phím tắt: liệt kê toàn bộ phím vật lý, chức năng, nguồn gốc toàn cục hay theo app, và trạng thái tối ưu 0 xung đột.*

Từ một ý định cỏn con là đổi phím tắt chuyển ngôn ngữ, tab phím đã âm thầm tiến hóa thành một "trung tâm điều khiển" thực thụ cho toàn bộ bàn phím của mình.

## 6. Thêm một chút gia vị cho vui tai

Trong quá trình hoàn thiện, mình còn tiện tay thêm vào một vài tính năng nho nhỏ để phục vụ sở thích cá nhân. Điển hình là tính năng giả lập âm thanh phím cơ.

Nhiều hôm ngồi làm việc ở văn phòng hay quán cà phê, dùng bàn phím laptop gõ êm quá đôi lúc cũng thấy thiêu thiếu cảm giác. Thế là mình tích hợp luôn bộ phát âm thanh phím cơ vào Kora, chọn được cả chục loại switch khác nhau. Đeo tai nghe vào gõ cọc cạch vui tai phết, vừa có nhịp điệu làm việc mà lại không làm phiền người xung quanh.

![Tab Giả lập âm thanh gõ phím cơ](/images/kora-chuyen-tu-lam-bo-go/kora-ui-am-thanh.png)

*Tab Âm thanh gõ: tích hợp sẵn cả bộ switch nổi tiếng (Holy Panda, Cherry MX...), có cả nút nghe thử và chỉnh âm lượng trực tiếp.*

## Lời kết

Nhìn lại cả hành trình, từ một buổi tối bực mình vì cái lỗi tự động viết hoa của bộ gõ cũ, cho đến bây giờ khi đã có một công cụ vừa vặn cho riêng mình mỗi ngày, mình thấy rất vui.

Kora sinh ra không phải để cạnh tranh hay so kè với bất kỳ tượng đài nào. Nó đơn giản là câu trả lời cho nhu cầu của chính bản thân mình: một bộ công cụ bàn phím gọn gàng, chạy mượt mà, hiểu được từng ứng dụng mình dùng và trên hết là không bao giờ làm phiền dòng suy nghĩ khi đang gõ phím.

Đôi khi, giải pháp tốt nhất cho bản thân lại chính là thứ do chính tay mình tạo ra.

