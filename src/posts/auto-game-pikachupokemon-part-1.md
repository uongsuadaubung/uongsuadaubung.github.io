---
title: "Auto game Pikachu/Pokemon - Part 1"
date: "2023-08-31"
tags: ["Cheat Engine", "Hack Game"]
description: "Nhìn vào hai hình này chắc là biết game gì luôn đúng không nếu không nghe qua thì cũng phải nhìn thấy vì mình nghĩ nó huyền thoại cmnr..."
published: true
---

# Auto game Pikachu/Pokemon - Part 1

![Pikachu Gameplay](/images/auto-game-pikachupokemon-part-1/image-01.png)

![Pikachu UI](/images/auto-game-pikachupokemon-part-1/image-02.png)

Nhìn vào hai hình này chắc là biết game gì luôn đúng không nếu không nghe qua thì cũng phải nhìn thấy vì mình nghĩ nó huyền thoại cmnr, hồi xưa nhà nào mua máy tính cũng thấy cài sẵn cái này luôn -.-, mỗi tội hơi bối rối về cái tên thôi, người thì gọi là Pikachu, người thì gọi là Pokemon. Hồi còn bé chưa có máy tính, suốt ngày mình hay sang ngồi cạnh cô hàng xóm đóng vai trò cố vấn, chiến lược gia cấp cao giúp cho cô chiến thắng trò chơi, nhiều khi nhìn đau cả mắt chứ chả vừa :D

Mục tiêu của bài này sẽ là làm một tool có chức năng tự động chơi game, không tập trung vào những cái khác như hack điểm...., cho nên mình sẽ liệt kê những thứ cần thiết ra đây:

* Quan trọng nhất là tìm được cái ma trận để lưu các con pokemon.
* Mà cần đủ thời gian tìm thì mình phải xử lý cái thời gian của trò chơi trước đã.
* Lấy được ma trận game rồi thì làm thế nào để xác định được 2 con pokemon hợp lệ.
* Làm thế nào để tự động click được lên game.

Các công cụ cần thiết:
* Cheate Engine
* Knowledge about C# Programing Language :)) (vì C/C++ khó quá mình không học nổi với lại C# làm form dễ)
* Một cái đầu lạnh :V

### 1. Tìm kiếm địa chỉ lưu biến thời gian

Bật CE lên để search thôi, vì không rõ con số cụ thể nên sẽ phải để Scan type là Unkown initial value, Value type thì để all vì cũng chả biết nó sẽ thuộc kiểu dữ liệu gì.

Ban đầu thì cứ nghĩ là thời gian sẽ giảm về 0 nên mình search ở những giá trị tiếp theo là Decreased Value mà nó cứ không ra, mãi lúc sau mới nhảy số để lại thành Increased Value thì tìm thấy vài giá trị, mình nghi ngờ cái biến kiểu float nên về set giá trị cho nó về 0, thế là thời gian được reset lại. vậy là tìm được địa chỉ **0x004b6084** là địa chỉ chứa giá trị thời gian.

![Address time](/images/auto-game-pikachupokemon-part-1/image-03.png)

### 2. Tìm kiếm ma trận của trò chơi

Cái này tìm gian nan hơn, vì mình không biết giá trị của các con pokemon, cũng may với cái kinh nghiệm từ trước mình có tìm cái ma trận của game Minesweeper nên cuối cùng cũng tìm ra được, rồi sau đó nhanh chóng tìm Pointer cho nó vì chẳng may tắt game rồi tìm lại ốm chết luôn :((. kết quả của pointer là `"pikachu.exe"+000B6044 offset 76`

![Matrix pointer](/images/auto-game-pikachupokemon-part-1/image-04.png)

Sau đó chọn Browse this memory region để xem memory

![Browse memory](/images/auto-game-pikachupokemon-part-1/image-05.png)

Thấy như sau

![Memory detail](/images/auto-game-pikachupokemon-part-1/image-06.png)

Cấu trúc của con pokemon đầu tiên là `FF FF 0A 00 0A 00`, và tất cả các con tiếp theo cũng có dạng đó gồm 6 bytes:
* 2 bytes đầu tiên `FF FF` là con pokmon còn hiển thị, nếu ăn mất rồi thì nó sẽ là `00 00`
* 2 bytes tiếp theo `0A 0A` là hình ảnh hiển thị của con pokemon đó.
* 2 bytes cuối cùng `0A 0A` là mã id của con pokemon, nếu cùng mã thì ăn được kể cả khác hiển thị

Vậy nên mình sẽ tập trung vào 2 bytes đầu và 2 bytes cuối, vì nó cách nhau 4 bytes nên địa chỉ của 2 bytes đầu sẽ bằng cái Pointer mình tìm được bên trên trừ 4 Offset đi sẽ là `"pikachu.exe"+000B6044 Offset 72`

Mình đã lấy máy tính ra để tính toán 1 chút như thế này, từ địa con pokemon đầu tiên + 0x6 sẽ ra con pokemon tiếp theo

| Pokemon row 1 | Offset | Add | Next Pokemon Offset |
|---|---|---|---|
| Con đầu tiên | 72 | 6 | 78 |
| Con thứ 2 | 78 | 6 | 7E |
| Con thứ 3 | 7E | 6 | 84 |
| Con thứ n | ... | 6 | ... |
| Con thứ 15 | C6 | 6 | CC |
| Con thứ 16 | CC | 6 | D2 |

Đến đây tưởng là D2 sẽ là Offset của còn đầu tiên của row2 ư? Không hề! Ban đầu mình cũng hý hửng tưởng là vậy mà chỉnh thử ở memory để cho FF FF về 00 00 nhưng mà không có gì thay đổi, mặc dù vẫn đúng cái cấu trúc 6 bytes như thế. Mình phải cộng thêm tận 2 lần nữa thì mới ra con pokemon đầu tiên ở row 2.

| Pokemon | Offset | Add | Next Pokemon Offset |
|---|---|---|---|
| Con thứ 16 | CC | 6 | D2 |
| Con thứ 17 | D2 | 6 | D8 |
| Con thứ 18 | D8 | 6 | DE |
| Con thứ 1 ở row 2 | DE | | |

Có vẻ như là game này không đơn giản chỉ là ma trận 9x16 mà phải là 9x18 cũng nên;

Lấy giá trị `0xDE - 0x72 = 0x6C`. Vậy là để di chuyển đến row N thì dùng công thức `0x72 + 0x6c * N`, mình dùng cái công thức này để lúc viết code sử dụng vòng lặp kết hợp với công thức để đọc hết cái ma trận của game;

### 3. Thuật toán để tìm kiếm 2 con pokemon hợp lệ

Mình cũng có search để tìm kiếm thuật toán được sử dụng trong ma trận, kết quả là sử dụng BFS, nên mình cũng có thử viết code trước bằng Typescript trước xem sao;

```typescript
interface Point {
  row: number;
  col: number;
}

interface IQueue {
  point: Point;
  redirect: number;
  prevDirection: Point | null;
}

const directions: Point[] = [
  { row: -1, col: 0 }, // Di chuyển lên
  { row: 1, col: 0 }, // Di chuyển xuống
  { row: 0, col: -1 }, // Di chuyển trái
  { row: 0, col: 1 }, // Di chuyển phải
];

function isValidMove(
  matrix: number[][],
  newRow: number,
  newCol: number,
): boolean {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  return (
    newRow >= 0 &&
    newRow < numRows &&
    newCol >= 0 &&
    newCol < numCols &&
    matrix[newRow][newCol] === 0
  );
}

function isValidConnect(matrix: number[][], start: Point, end: Point): boolean {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const visited: boolean[][] = Array.from({ length: numRows }, () =>
    Array(numCols).fill(false),
  );
  visited[start.row][start.col] = true;

  const queue: IQueue[] = [{ point: start, redirect: 0, prevDirection: null }];

  while (queue.length > 0) {
    const { point, redirect, prevDirection } = queue.shift()!;

    if (redirect > 3) continue;
    if (point.row === end.row && point.col === end.col) {
      return true;
    }

    for (const direction of directions) {
      const newRow = point.row + direction.row;
      const newCol = point.col + direction.col;

      if (isValidMove(matrix, newRow, newCol) && !visited[newRow][newCol]) {
        visited[newRow][newCol] = true;

        let newRedirect = redirect;
        if (
          prevDirection === null ||
          prevDirection.row !== direction.row ||
          prevDirection.col !== direction.col
        ) {
          newRedirect++; // Nếu có chuyển hướng thì tăng biến redirect
        }

        queue.push({
          point: { row: newRow, col: newCol },
          redirect: newRedirect,
          prevDirection: direction,
        });
      }
    }
  }

  return false; // Không tìm thấy đường đi
}

const matrix: number[][] = [
  [0, 1, 0, 0],
  [0, 0, 1, 1],
  [0, 0, 0, 0],
  [1, 0, 1, 0],
  [0, 0, 0, 0],
];

const start: Point = { row: 0, col: 0 };
const end: Point = { row: 3, col: 3 };

const redirections = isValidConnect(matrix, start, end);
console.log(redirections ? 'Valid' : 'invalid');
```

Code minh hoạ đi từ điểm 0,0 đến 3,3, khi đi từ start đến end mà số lần chuyển hướng không quá 3 thì là hợp lệ, chạy code lên thì cũng khá là oke, nên sau đó mình sẽ chuyển sang C# để áp dụng với game sau.

Đến đây là hết phần chuẩn bị thông tin rồi, phần sau sẽ là dựa vào những cái này để code.
