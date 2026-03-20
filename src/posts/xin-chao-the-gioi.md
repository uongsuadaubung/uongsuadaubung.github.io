---
title: "Xin chào thế giới — Blog của mình bắt đầu từ đây"
date: "2026-03-20"
tags: ["giới thiệu", "svelte", "web"]
description: "Bài viết đầu tiên trên blog. Tại sao mình làm trang này, dùng công nghệ gì, và mình định sẽ chia sẻ những gì ở đây."
published: true
---

# Xin chào thế giới 👋

Đây là bài viết đầu tiên trên blog của mình. Trang này được xây dựng bằng **SvelteKit** + **SCSS** + **mdsvex**, host trên GitHub Pages.

## Tại sao làm blog?

Mình muốn có một chỗ để:

- Ghi chép lại những thứ mình học được
- Chia sẻ các project mình đang làm
- Có một "CV sống" — nơi người khác có thể thấy mình là ai và làm được gì

## Tech stack

Trang này dùng:

| Thành phần | Công nghệ |
|---|---|
| Framework | SvelteKit |
| Styling | SCSS |
| Markdown | mdsvex |
| Highlight | highlight.js |
| Hosting | GitHub Pages |

## Viết Markdown như thế nào?

Mỗi bài viết là một file `.md` trong thư mục `src/posts/`. Ví dụ:

```markdown
---
title: "Tiêu đề bài"
date: "2026-03-20"
tags: ["web", "svelte"]
description: "Mô tả ngắn"
---

Nội dung bài viết ở đây...
```

## Code block có syntax highlight

```typescript
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2)); // 3
```

```python
def hello(name: str) -> str:
    return "Xin chao, " + name + "!"

print(hello("the gioi"))
```

## Blockquote

> "Bất kỳ điều gì đủ tốt, đều đáng để viết ra."

## Checklist

- [x] Tạo trang web
- [x] Viết bài đầu tiên
- [ ] Viết thêm nhiều bài hơn
- [ ] Chia sẻ với mọi người

---

Hẹn gặp lại ở những bài tiếp theo! 🚀
