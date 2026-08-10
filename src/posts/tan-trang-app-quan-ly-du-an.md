---
title: "Dọn dẹp tàn dư: Tân trang ứng dụng quản lý dự án nội bộ"
date: "2026-07-10"
tags: ["Tool & Projects"]
description: "Một ngày đẹp trời, sếp giao cho mình nhiệm vụ tân trang lại giao diện ứng dụng quản lý dự án nội bộ mà người cũ để lại. Không chỉ thay áo mới cho UI, mình còn tiện tay đập đi xây lại phần phân trang ở Backend để cải thiện hiệu năng và UX."
published: true
---

Chuyện là dạo gần đây, một ông anh dev kỳ cựu trong team mình quyết định dứt áo ra đi tìm bến đỗ mới. Sự ra đi của ông ấy để lại cho mình một "di sản" khá cồng kềnh: con app quản lý dự án nội bộ của team. 

Lúc sếp gọi mình vào và giao nhiệm vụ: *"Kiên ơi, em xem tân trang lại giao diện con app này hộ anh nhé, chứ nhìn nó hơi... cổ điển quá"*. Mình mở app lên chạy thử và... ôi vãi! Giao diện cũ trông đúng nghĩa "thời tiền sử", các nút bấm lệch lạc, bảng biểu khô khan, màu sắc nhức mắt và bố cục thì rối rắm thôi rồi. 

Thế là mình quyết định dành vài ngày rảnh rỗi ở công ty để "lột xác" cho con app này. Nhưng khi bắt đầu mò vào code, mình phát hiện ra vấn đề không chỉ nằm ở vẻ bề ngoài. Phần backend cũng đang hoạt động theo một cách cực kỳ cồng kềnh.

---

## 🎨 Trận chiến thay đổi diện mạo (UI/UX)

Để anh em dễ hình dung sự khác biệt giữa "thời tiền sử" và "thời hiện đại", mình đã chụp lại vài màn hình so sánh trước và sau khi tân trang dưới đây. Thiệt ra thì ngoài mấy màn này ra còn có thêm mấy trang quản lý Admin nữa, cơ mà nhiều quá với lại mình lười chụp cmnr nên thui bỏ qua đi nhé, xem tạm mấy màn chính này là đủ thấy sự khác biệt rồi. Ở bản mới này, mình chuyển tông màu chủ đạo sang gam màu tối (dark mode) hiện đại, tinh gọn lại các khoảng cách và sử dụng font chữ Inter nhìn cho sang chảnh.

### 1. Trang danh sách dự án (Project List)
Màn hình chính hiển thị các dự án của team. Ở bản cũ, mọi thứ được dàn trải đều bằng các đường viền xám xịt và font chữ mặc định trông rất thô. Mình đã gom chúng lại thành các thẻ (cards) bo góc mượt mà, phân cấp thông tin rõ ràng và thêm chút hiệu ứng hover.

**Giao diện cũ:**
![Project Main Old](/images/tan-trang-app-quan-ly-du-an/project-main-old.png)

**Giao diện mới:**
![Project Main New](/images/tan-trang-app-quan-ly-du-an/project-main-new.png)

---

### 2. Trang chi tiết dự án (Project Detail)
Trang chi tiết dự án cũ trông cực kỳ trống trải và thiếu điểm nhấn. Sau khi sửa lại, giao diện mới nhìn trực quan hơn nhiều với các tabs phân chia thông tin khoa học, bố cục thông số hiển thị gọn gàng bên góc.

**Giao diện cũ:**
![Project Detail Old](/images/tan-trang-app-quan-ly-du-an/project-detail-old.png)

**Giao diện mới:**
![Project Detail New](/images/tan-trang-app-quan-ly-du-an/project-detail-new.png)

---

### 3. Trang quản lý công việc (Task List & Task Detail)
Task list và Task detail là nơi team tương tác nhiều nhất hàng ngày. Ở giao diện cũ, các thẻ task nằm sát sàn sạt nhau, màu sắc phân biệt trạng thái nhạt nhẽo và khó nhìn. Bản mới đã được tăng độ tương phản, các thẻ task nhìn tách bạch và phần chi tiết task bên phải mở ra mượt mà như một ngăn kéo (drawer) gọn gàng.

**Giao diện danh sách cũ:**
![Task Main Old](/images/tan-trang-app-quan-ly-du-an/task-main-old.png)

**Giao diện danh sách mới:**
![Task Main New](/images/tan-trang-app-quan-ly-du-an/task-main-new.png)

**Giao diện chi tiết cũ:**
![Task Detail Old](/images/tan-trang-app-quan-ly-du-an/task-detail-old.png)

**Giao diện chi tiết mới:**
![Task Detail New](/images/tan-trang-app-quan-ly-du-an/task-detail-new.png)

---

### 4. Quy trình làm việc (Process List & Process Detail)
Phần quản lý quy trình (Process) cũng được thiết kế lại theo phong cách tối giản. Các khối quy trình ở bản cũ khá thô cứng, nay đã được vẽ lại thanh thoát hơn với các bước (steps) rõ ràng.

**Giao diện quy trình cũ:**
![Process Main Old](/images/tan-trang-app-quan-ly-du-an/process-main-old.png)

**Giao diện quy trình mới:**
![Process Main New](/images/tan-trang-app-quan-ly-du-an/process-main-new.png)

**Giao diện chi tiết quy trình cũ:**
![Process Detail Old](/images/tan-trang-app-quan-ly-du-an/process-detail-old.png)

**Giao diện chi tiết quy trình mới:**
![Process Detail New](/images/tan-trang-app-quan-ly-du-an/process-detail-new.png)

---

### 5. Trang báo cáo tổng quan (Report)
Cuối cùng là phần báo cáo. Bản cũ chỉ hiển thị một vài biểu đồ đơn điệu dạng cột phẳng lì. Bản mới đã được tích hợp thư viện chart hiện đại, phối màu gradient bắt mắt và bổ sung thêm các số liệu thống kê nhanh ở phía trên để sếp dễ theo dõi tình hình sức khỏe của dự án.

**Giao diện cũ:**
![Report Main Old](/images/tan-trang-app-quan-ly-du-an/report-main-old.png)

**Giao diện mới:**
![Report Main New](/images/tan-trang-app-quan-ly-du-an/report-main-new.png)

---

## 🛠️ Đập đi xây lại hệ thống phân trang ở Backend

Sau khi tạm thời "mông má" xong vẻ bề ngoài, mình bắt đầu ngồi test thử hiệu năng và cảm thấy có gì đó sai sai. Mỗi lần click vào trang danh sách dự án hay task, trình duyệt lại đơ ra khoảng gần 1 giây trước khi hiển thị dữ liệu. 

Bật F12 lên kiểm tra, mình suýt ngã ngửa. Hoá ra ở backend, API lấy danh sách đang code theo kiểu: **Đọc sạch sành sanh toàn bộ records từ Database lên, nhét vào một cái mảng khổng lồ rồi trả nguyên si cục JSON bự chà bá đó về cho Frontend tự phân trang (Client-side Pagination)!**

> *"Dữ liệu lúc app mới chạy thì ít nên chả ai phát hiện ra. Đến lúc chạy thực tế vài năm, số lượng task và project lên đến hàng nghìn record thì Frontend bắt đầu ăn cmn hành."*

Để giải quyết quả bom nổ chậm này, mình quyết định đập sạch phần code cũ đi và triển khai **Server-side Pagination** (Phân trang ở Backend). 

### 1. Thay đổi truy vấn từ Stored Procedure sang LINQ ở C# Backend

Ở backend (viết bằng C# / ASP.NET Core), code cũ của người tiền nhiệm chuyên sử dụng các Stored Procedure kiểu `EXEC GetTasks` để lôi đầu toàn bộ dữ liệu ra. Sau đó thì bê nguyên cục dữ liệu thô ấy trả về qua API.

Mình quyết định dẹp tiệm Stored Procedure cồng kềnh đó, chuyển sang sử dụng LINQ (Entity Framework Core) để viết các câu truy vấn phân trang rõ ràng và thực thi trực tiếp trên database. API sẽ nhận hai tham số `page` (trang hiện tại) và `limit` (số bản ghi trên mỗi trang), từ đó dùng các hàm `.Skip()` và `.Take()` quen thuộc của LINQ:

```csharp
// API phân trang mới viết bằng C# & LINQ
[HttpGet("api/tasks")]
public async Task<IActionResult> GetTasks(int page = 1, int limit = 10)
{
    var skip = (page - 1) * limit;
    
    // Tạo query với IQueryable để tối ưu hoá việc thực thi ở Database
    var query = _context.Tasks.AsNoTracking();
    
    // Lấy tổng số lượng bản ghi và lọc dữ liệu của trang hiện tại
    var totalItems = await query.CountAsync();
    var data = await query
        .OrderByDescending(t => t.CreatedAt)
        .Skip(skip)
        .Take(limit)
        .ToListAsync();

    return Ok(new {
        data = data,
        pagination = new {
            currentPage = page,
            totalPages = (int)Math.Ceiling((double)totalItems / limit),
            totalItems = totalItems
        }
    });
}
```

Nhờ vậy, thay vì bắt Frontend tải về cả chục Megabyte dữ liệu, giờ đây backend chỉ trả về đúng 10 records cho mỗi trang kèm theo thông tin metadata của phân trang. Tốc độ API giảm từ ~800ms xuống còn chưa đầy 30ms! Khớp cmn lệnh!

### 2. Refactor Frontend fetch dữ liệu

Ở Frontend, mình viết lại logic gọi API. Mỗi lần người dùng click nút chuyển trang hoặc thay đổi bộ lọc, Frontend sẽ gửi request kèm theo param `page` mới lên backend để lấy dữ liệu trang tiếp theo:

```javascript
// Fetch dữ liệu theo từng trang trên Frontend
async function fetchTasks(page = 1) {
  loading.value = true;
  try {
    const res = await fetch(`/api/tasks?page=${page}&limit=10`);
    const result = await res.json();
    
    tasks.value = result.data;
    pagination.value = result.pagination;
  } catch (error) {
    console.error("Lỗi fetch data rồi anh em ơi:", error);
  } finally {
    loading.value = false;
  }
}
```

---

## 🔒 Bảo mật JWT: Chuyển từ LocalStorage sang HttpOnly Cookie

Đang đà dọn dẹp đống code backend, mình tiện tay ngó qua luôn cơ chế authentication (đăng nhập) của con app này và phát hiện ra một vấn đề bảo mật cực kỳ cơ bản. 

Code cũ của ông anh dev để lại đang thực hiện việc gửi token JWT về cho Frontend sau khi đăng nhập thành công. Frontend sẽ nhận token đó và lưu trữ vô tư trong `localStorage`. Mỗi lần gọi API, Frontend lại lôi token ra và đính kèm vào header `Authorization: Bearer <token>`.

> *"Cách làm này tuy nhanh gọn lẹ nhưng lại là miếng mồi ngon cho các cuộc tấn công XSS (Cross-Site Scripting). Chỉ cần hacker chèn được một đoạn mã độc Javascript vào trang web (ví dụ qua một thư viện npm dính mã độc), họ có thể dễ dàng dùng lệnh `localStorage.getItem('token')` để lôi cổ token của user về server của họ."*

Để bịt lỗ hổng này, mình đã refactor lại cơ chế đăng nhập. Ở backend ASP.NET Core, thay vì trả token JWT trực tiếp trong body JSON của API response, mình chuyển sang ghi thẳng token đó vào Cookie của trình duyệt với tuỳ chọn `HttpOnly`:

```csharp
// Thiết lập HttpOnly Cookie để lưu token bảo mật ở Backend C#
Response.Cookies.Append("token", jwtToken, new CookieOptions
{
    HttpOnly = true,   // Chặn đứng Javascript truy cập vào cookie (XSS-proof!)
    Secure = true,     // Chỉ truyền qua giao thức HTTPS bảo mật
    SameSite = SameSiteMode.Strict, // Chống tấn công CSRF
    Expires = DateTime.UtcNow.AddDays(7)
});
```

Phía Frontend lúc này nhàn tênh, chả cần phải viết code lưu trữ token hay đính kèm header thủ công mỗi lần gọi API nữa. Trình duyệt sẽ tự động quản lý và đính kèm Cookie này lên mỗi request gửi về backend. 

Bảo mật tăng lên một tầm cao mới mà code FE lại còn sạch sẽ đi bao nhiêu!

### 🔄 Xử lý hết hạn session thông minh hơn

Một hạt sạn nhỏ khác liên quan đến JWT: ở phiên bản cũ, khi token hết hạn (status `401 Unauthorized`), hệ thống không hề thông báo cho người dùng biết là họ cần đăng nhập lại. Nó chỉ hiện lên Frontend một câu thông báo lỗi chung chung và vô hồn kiểu: *"Gửi request thất bại"* hoặc *"Có lỗi xảy ra khi truyền dữ liệu"*. Người dùng cứ thế click nút mỏi tay mà chả hiểu tại sao app bỗng dưng không phản hồi.

Để khắc phục trải nghiệm gây khó chịu này, mình viết thêm một hàm wrapper cho fetch client ở Frontend để tự động bắt lỗi `401`:

```javascript
// Tự động bắt lỗi 401 để yêu cầu người dùng đăng nhập lại
async function securedFetch(url, options = {}) {
  const res = await fetch(url, options);
  
  if (res.status === 401) {
    // Xóa session, thông báo rõ ràng và redirect về trang Login
    auth.logout(); 
    showToast("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!", "warning");
    router.push("/login");
    throw new Error("Unauthorized");
  }
  
  return res;
}
}
```

Từ nay, mỗi khi token hết hạn, người dùng sẽ được chuyển về trang login một cách lịch sự kèm thông báo rõ ràng, thay vì phải ngồi tự hỏi xem server đang bị sập hay mạng bị lỗi.

Tuy nhiên, nếu chỉ làm như vậy thì vẫn chưa thực sự hoàn hảo. Hãy tưởng tượng người dùng đang cặm cụi gõ một mô tả công việc hay điền biểu mẫu dự án siêu dài, bỗng dưng đến lúc bấm nút lưu thì token hết hạn, thế là họ bị "đá" ra ngoài và mất sạch sành sanh dữ liệu vừa nhập. Trải nghiệm kiểu đó thì ức chế thôi rồi!

Để giải quyết tận gốc vấn đề này, mình đã triển khai thêm một cơ chế **Silent Token Refresh (Làm mới token âm thầm)**:
- Mỗi khi người dùng truy cập ứng dụng hoặc chuyển đổi qua lại giữa các màn hình chính, Frontend sẽ kiểm tra thời hạn session hoạt động.
- Nếu token vẫn còn hạn, Frontend sẽ tự động gửi một request chạy ngầm lên API `/api/auth/refresh` ở Backend.
- Backend sẽ kiểm tra tính hợp lệ của token cũ, tạo ra một token mới với thời hạn được gia hạn thêm (ví dụ thêm 7 ngày nữa) rồi ghi đè cookie HttpOnly mới về trình duyệt.

Nhờ cơ chế này, chỉ cần người dùng còn đang tích cực hoạt động trên hệ thống, phiên làm việc của họ sẽ liên tục được gia hạn một cách êm ái mà không bao giờ lo bị ngắt quãng giữa chừng khi đang làm việc.

Dưới đây là cách mình gọi request làm mới token ngầm ở Frontend mỗi khi đổi Route:

```javascript
// Tự động làm mới session ngầm khi đổi trang nếu token vẫn hợp lệ
async function checkAndRefreshToken() {
  try {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (res.ok) {
      console.log("Gia hạn phiên làm việc thành công!");
    }
  } catch (err) {
    console.warn("Không thể làm mới token ngầm:", err);
  }
}

router.onRouteChanged(() => {
  checkAndRefreshToken();
});
```

Và phía C# Backend xử lý yêu cầu làm mới Cookie:

```csharp
[HttpPost("api/auth/refresh")]
public async Task<IActionResult> RefreshToken()
{
    // Đọc token hiện tại từ HttpOnly Cookie
    var currentToken = Request.Cookies["token"];
    if (string.IsNullOrEmpty(currentToken) || !ValidateToken(currentToken))
    {
        return Unauthorized();
    }

    // Tạo token mới gia hạn thêm thời gian hoạt động
    var newToken = RegenerateTokenWithNewExpiry(currentToken);
    
    Response.Cookies.Append("token", newToken, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddDays(7)
    });

    return Ok();
}
```

---

## ⚡ Những cải tiến UX nhỏ nhưng đáng giá khác

Bên cạnh đống thay đổi to bự ở trên, mình cũng tiện tay tối ưu thêm vài chi tiết nhỏ để trải nghiệm sử dụng ngon lành cành đào hơn:

*   **Skeleton Loading:** Thay vì để màn hình trống trơn hoặc quay vòng tròn nhàm chán khi đợi load API, mình thêm hiệu ứng Skeleton Loading giúp người dùng có cảm giác trang web tải nhanh và mượt mà hơn.
*   **Debounce Search:** Ở tính năng tìm kiếm dự án, bản cũ cứ mỗi ký tự người dùng gõ vào là nó lại gửi một request API lên server (gây quá tải backend). Mình thêm `debounce` khoảng 300ms, đợi user gõ xong hẳn mới thực hiện gửi request tìm kiếm.
*   **Responsive Layout:** Bản cũ khi mở trên điện thoại hay tablet là giao diện nát bét. Mình đã viết lại CSS Grid/Flexbox để giao diện tự co giãn ngon nghẻ trên mọi thiết bị.

---

## 🚀 Kết quả

Thiệt ra thì trong quá trình dọn dẹp đống "di sản" này, mình còn phát hiện ra kha khá thứ lặt vặt bất ổn khác nữa, cơ mà lười quá chả buồn kể hết ra ở đây làm gì. Mình chỉ lọc ra vài cái lỗi tiêu biểu nhất ở trên — những vấn đề tưởng chừng như rất cơ bản nhưng ngặt nỗi ngay cả những anh em dev có nhiều năm kinh nghiệm vẫn hoàn toàn có thể mắc phải khi code vội hoặc thiếu chú ý.

Sau một tuần miệt mài dọn dẹp, con app nội bộ của team mình nhìn đã hiện đại, bóng bẩy và tốc độ tải trang thì nhanh như gió. Sếp vào dùng thử thấy mượt mà quá liền khen nức nở, làm mình cũng thấy sướng rơn cả người. 

Đúng là đôi khi làm dev không chỉ là code tính năng mới, mà việc tối ưu lại những thứ cũ kỹ, dọn dẹp đống rác công nghệ để lại cũng mang lại cảm giác cực kỳ thỏa mãn và đáng tiền bát gạo.

Đến đây thì cũng mỏi tay gõ phím cmnr. Thui lười quá chả viết nữa, mình đi uống sữa đây cho đỡ đau bụng! 🚀
