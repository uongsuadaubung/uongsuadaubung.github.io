// Cấu hình các thư mục cần quét
const TARGET_DIRS = [
	"./src/lib/components",
	"./src/lib/views"
];

// Các từ khóa CSS chuẩn hoặc class đặc biệt cần bỏ qua không check thừa
const IGNORED_CLASSES = new Set([
	"root", "global", "mounted", "active", "open", "base", "framework", 
	"vite", "counter", "icon", "logo", "button-icon", "ticks", "spacer"
]);

async function checkDirectory(dirPath: string) {
	const files: string[] = [];
	try {
		for await (const entry of Deno.readDir(dirPath)) {
			if (entry.isFile && entry.name.endsWith(".scss")) {
				files.push(entry.name);
			}
		}
	} catch {
		return;
	}

	for (const scssFile of files) {
		const baseName = scssFile.replace(".scss", "");
		const tsxFile = `${baseName}.tsx`;
		
		const scssPath = `${dirPath}/${scssFile}`;
		const tsxPath = `${dirPath}/${tsxFile}`;

		// Kiểm tra xem có file TSX tương ứng không
		try {
			await Deno.stat(tsxPath);
		} catch {
			// Không có file TSX tương ứng, bỏ qua
			continue;
		}

		// Đọc nội dung cả 2 file
		const scssContent = await Deno.readTextFile(scssPath);
		const tsxContent = await Deno.readTextFile(tsxPath);

		// Regex trích xuất các class trong file SCSS (bắt đầu bằng dấu chấm và một ký tự hợp lệ cho tên class)
		// Tránh các pseudo-class như :hover, :active, các biến SASS, hoặc các số thập phân dạng .5s, .8rem
		const classRegex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*)(?:\s*[\{\,\:\.\s])/g;
		const foundClasses = new Set<string>();
		let match;

		while ((match = classRegex.exec(scssContent)) !== null) {
			const className = match[1];
			// Bỏ qua các class trong danh sách loại trừ hoặc class quá ngắn/chứa số vô nghĩa
			if (!IGNORED_CLASSES.has(className) && className.length > 1) {
				foundClasses.add(className);
			}
		}

		// Kiểm tra sự xuất hiện của class trong file TSX
		const unused: string[] = [];
		for (const className of foundClasses) {
			// Dùng RegExp ranh giới từ để kiểm tra chính xác sự tồn tại của class
			const usageRegex = new RegExp(`\\b${className}\\b`);
			if (!usageRegex.test(tsxContent)) {
				unused.push(className);
			}
		}

		// In báo cáo cho file hiện tại
		if (unused.length > 0) {
			console.log(`\x1b[33m[!] File: ${scssPath}\x1b[0m`);
			for (const cls of unused) {
				console.log(`  \x1b[31m- Class ".${cls}" không được sử dụng trong ${tsxFile}\x1b[0m`);
			}
			console.log();
		}
	}
}

async function main() {
	console.log("\x1b[36m⚡ Đang quét CSS thừa trong dự án...\x1b[0m\n");
	
	let hasUnused = false;
	
	// Ghi đè console.log để theo dõi xem có class thừa nào không
	const originalLog = console.log;
	console.log = function(...args) {
		if (args[0] && typeof args[0] === "string" && args[0].includes("[!] File:")) {
			hasUnused = true;
		}
		originalLog.apply(console, args);
	};

	for (const dir of TARGET_DIRS) {
		await checkDirectory(dir);
	}

	if (!hasUnused) {
		console.log("\x1b[32m✔ Tuyệt vời! Không phát hiện class CSS thừa nào trong dự án.\x1b[0m");
	} else {
		console.log("\x1b[35m💡 Gợi ý: Bạn có thể mở các file .scss trên để xóa các class thừa này để tối ưu code.\x1b[0m");
	}
}

main();
