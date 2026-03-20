---
title: "Nextjs"
date: "2024-09-07"
tags: []
description: "Kế hoạch có chút thay đổi, vì hiện tại mình đang làm việc trên công ty khá bận và còn kèm thêm cả dự án với người anh nữa nên chả thể..."
published: true
---

![minh-hoa](/images/learn-nextjs/image-01.png)

Kế hoạch có chút thay đổi, vì hiện tại mình đang làm việc trên công ty khá bận và còn kèm thêm cả dự án với người anh nữa nên chả thể làm cái series này theo cái mình nghĩ được, nhưng mà vẫn sẽ tiếp tục tìm hiểu và thay đổi mấy cái mình không ưa ở cái dự án công ty mình đang làm.

Thiệt ra thì front-end dự án công ty đang làm bằng Nextjs và cũng thật sự thì mình không được làm từ đầu mà công ty thuê mấy ông Ấn Độ làm, có 1 cái vấn đề mà mình thấy không ưng cho lắm là lộ hết cả đống api ra trông không được bảo mật cho lắm, cho nên trong bài này mình sẽ thử cách không gọi api gốc xem có khó triển khai hơn không.

Hiện tại project công ty đang gọi api ở phía client

```javascript
useEffect(() => {
  async function fetchPosts() {
    let res = await fetch('https://api.vercel.app/blog')
    let data = await res.json()
    setPosts(data)
  }
  fetchPosts()
}, [])
```

điều mình mong muốn là không lộ domain của api tránh nhỡ ai đó xấu tính DDOS sập backend chẳng hạn 

```javascript
useEffect(() => {
  async function fetchPosts() {
    let res = await fetch('/api/blog')
    let data = await res.json()
    setPosts(data)
  }
  fetchPosts()
}, [])
```

mình sẽ lấy ví dụ bằng json placeholder với api `https://jsonplaceholder.typicode.com/posts`

Trong Nextjs tại phần docs ở Routing > Route Handlers thì ta hoàn toàn có thể làm được như này

tạo một file route.ts tại đường dẫn `app/api/posts/route.ts`

```javascript
import {NextResponse} from "next/server";
import postsService from "../../../../services/postsService";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;
    const page = searchParams.get('page') || undefined;
    const limit = searchParams.get("limit") || undefined;
    const data = await postsService.getPosts({userId, page, limit});
    return NextResponse.json({data: data});
}
```

và đây là nội dung file postsService

```javascript
import axios from "axios";
import {PostModel} from "../models/PostModel";

type GetPostProps ={
    userId?: string | string[],
    page?: string | string[],
    limit?: string | string[]
}


const getPosts = async ({userId, page, limit}: GetPostProps) => {
    return await axios.get("https://jsonplaceholder.typicode.com/posts", {
        params: {
            userId: userId,
            _page: page,
            _limit: limit
        }
    }).then(res => res.data) as PostModel[];
}

const postsService = {getPosts}

export default postsService;
```

Chỉ có như vậy thôi, giờ việc gọi api sẽ là 

```javascript
const getPosts = async ({page, limit}: {page: string, limit: string}) => {
  return await axios.get("/api/posts", {params: {page, limit}}).then(res => res.data.data)
}
```

Kết quả sẽ thay đổi như sau:

![minh-hoa](/images/learn-nextjs/image-02.png)
bị lộ api gốc

thành

![minh-hoa](/images/learn-nextjs/image-03.png)

Nó sẽ đem lại kết quả tương đương nhưng lại bảo mật hơn nếu muốn giấu các thông tin nhạy cảm kiểu như domain, API KEY, hoặc đơn giản hơn và hay dùng có lẽ là từ frontend gọi api khác domain sẽ bị CORS thì làm như này sẽ được
