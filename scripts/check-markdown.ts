import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const POSTS_DIR = "./src/posts";

const ALLOWED_TAGS = new Set([
	"Game & Auto",
	"Tool & Projects",
	"Rust & Backend",
	"Web Dev",
	"Chuyện nghề & Chia sẻ"
]);

interface ValidationError {
	file: string;
	message: string;
}

function parseFrontMatter(rawMarkdown: string): { metadata: Record<string, any>; content: string } | null {
	const match = rawMarkdown.match(/^---\r?\n([\s\S]+?)\r?\n---/);
	if (!match) return null;

	const frontMatterBlock = match[1];
	const content = rawMarkdown.slice(match[0].length).trim();
	const metadata: Record<string, any> = {};

	frontMatterBlock.split("\n").forEach((line) => {
		const colonIndex = line.indexOf(":");
		if (colonIndex > 0) {
			const key = line.slice(0, colonIndex).trim();
			let val = line.slice(colonIndex + 1).trim();

			// Remove surrounding quotes
			if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
				val = val.slice(1, -1);
			}

			if (key === "tags" || key === "techStack") {
				try {
					metadata[key] = JSON.parse(val.replace(/'/g, '"'));
				} catch {
					metadata[key] = val.split(",").map((t) => t.trim().replace(/[\[\]"']/g, ""));
				}
			} else if (key === "published" || key === "isApp" || key === "showOnResume") {
				metadata[key] = val === "true";
			} else {
				metadata[key] = val;
			}
		}
	});

	return { metadata, content };
}

function normalizeForComparison(str: string): string {
	return str
		.replace(/^[#*\s_`>]+|[#*\s_`>]+$/g, "")
		.replace(/[^\w\sàáảãạăắằẳẵặâấầnẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/gi, "")
		.toLowerCase()
		.trim();
}

async function validateMarkdownFiles() {
	const errors: ValidationError[] = [];
	let totalFiles = 0;

	try {
		const files = await readdir(POSTS_DIR);
		const mdFiles = files.filter((f) => f.endsWith(".md"));
		totalFiles = mdFiles.length;

		for (const file of mdFiles) {
			const filePath = join(POSTS_DIR, file);
			const rawContent = await readFile(filePath, "utf-8");

			// 1. Check Frontmatter syntax
			const parsed = parseFrontMatter(rawContent);
			if (!parsed) {
				errors.push({
					file,
					message: "Thiếu phần Frontmatter YAML mở đầu với cặp thẻ '---'."
				});
				continue;
			}

			const { metadata, content } = parsed;

			// 2. Check required fields
			if (!metadata.title || typeof metadata.title !== "string" || metadata.title.trim() === "") {
				errors.push({ file, message: "Thiếu trường 'title' hoặc title rỗng." });
			}

			if (!metadata.date || typeof metadata.date !== "string" || metadata.date.trim() === "") {
				errors.push({ file, message: "Thiếu trường 'date' hoặc date rỗng." });
			}

			if (!metadata.description || typeof metadata.description !== "string" || metadata.description.trim() === "") {
				errors.push({ file, message: "Thiếu trường 'description' hoặc description rỗng." });
			}

			if (metadata.published === undefined) {
				errors.push({ file, message: "Thiếu trường boolean 'published'." });
			}

			// Validate fixed allowed tags
			if (!metadata.tags) {
				errors.push({ file, message: "Thiếu trường 'tags'." });
			} else {
				const tagsList = Array.isArray(metadata.tags) ? metadata.tags : [metadata.tags];
				if (tagsList.length === 0) {
					errors.push({ file, message: "Mảng 'tags' rỗng, cần có ít nhất 1 tag." });
				}
				for (const tag of tagsList) {
					if (!ALLOWED_TAGS.has(tag)) {
						errors.push({
							file,
							message: `Tag "${tag}" không nằm trong danh sách tag cố định cho phép [${Array.from(ALLOWED_TAGS).map(t => `"${t}"`).join(", ")}].`
						});
					}
				}
			}

			// 3. Check App SSOT fields if isApp = true
			if (metadata.isApp === true) {
				if (!metadata.appName) {
					errors.push({ file, message: "Bài viết có isApp: true nhưng thiếu 'appName'." });
				}
				if (!metadata.appIcon) {
					errors.push({ file, message: "Bài viết có isApp: true nhưng thiếu 'appIcon'." });
				}
				if (!metadata.liveUrl || !metadata.liveUrl.startsWith("/")) {
					errors.push({ file, message: "Bài viết có isApp: true nhưng thiếu 'liveUrl' hoặc liveUrl không bắt đầu bằng '/'." });
				}
				if (!metadata.techStack || (Array.isArray(metadata.techStack) && metadata.techStack.length === 0)) {
					errors.push({ file, message: "Bài viết có isApp: true nhưng thiếu 'techStack'." });
				}
			}

			// 4. Check Resume SSOT fields if showOnResume = true
			if (metadata.showOnResume === true) {
				if (!metadata.appName && !metadata.title) {
					errors.push({ file, message: "Bài viết có showOnResume: true nhưng không có 'appName' hoặc 'title'." });
				}
				if (!metadata.techStack || (Array.isArray(metadata.techStack) && metadata.techStack.length === 0)) {
					errors.push({ file, message: "Bài viết có showOnResume: true nhưng thiếu 'techStack'." });
				}
			}

			// 5. Check Double H1 Header or Duplicate Title at the start of body
			// Strip code blocks first to avoid false positives inside code examples
			const bodyWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
			const lines = bodyWithoutCodeBlocks.split("\n").map(l => l.trim()).filter(l => l.length > 0);

			// Check H1 anywhere in body
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i];
				if (line.startsWith("# ")) {
					errors.push({
						file,
						message: `Phát hiện H1 Header rủ rê lặp lại trong bài viết ("${line}"). Hãy xóa H1 này vì PostView đã tự động render tiêu đề H1 từ title frontmatter.`
					});
				}
			}

			// Check if first non-empty line duplicates frontmatter title (even without #, e.g. ##, ###, **, or plain text)
			if (lines.length > 0 && metadata.title) {
				const firstLineRaw = lines[0];
				// Skip if it's an image ![alt](url) or HTML block
				if (!firstLineRaw.startsWith("!") && !firstLineRaw.startsWith("<")) {
					const normTitle = normalizeForComparison(metadata.title);
					const normFirstLine = normalizeForComparison(firstLineRaw);

					if (normTitle && normFirstLine && (normTitle === normFirstLine || normFirstLine.startsWith(normTitle) || normTitle.startsWith(normFirstLine))) {
						errors.push({
							file,
							message: `Phát hiện tiêu đề bị lặp lại ở dòng đầu tiên của bài viết ("${firstLineRaw}"). Hãy xóa dòng này vì PostView đã tự động hiển thị tiêu đề từ frontmatter!`
						});
					}
				}
			}
		}
	} catch (err) {
		console.error("❌ Lỗi khi đọc thư mục posts:", err);
		process.exit(1);
	}

	if (errors.length > 0) {
		console.error("\n❌ [MARKDOWN CHECK FAILED] Phát hiện các lỗi cấu trúc file Markdown:\n");
		for (const err of errors) {
			console.error(`  - [${err.file}]: ${err.message}`);
		}
		console.error(`\nTổng cộng: ${errors.length} lỗi trong ${totalFiles} file Markdown.`);
		console.error("Vui lòng sửa các lỗi trên trước khi khởi động dev server!\n");
		process.exit(1);
	} else {
		console.log(`✅ [MARKDOWN CHECK PASSED] Đã kiểm tra ${totalFiles} file Markdown chuẩn cấu trúc, không bị lặp tiêu đề bài viết!`);
	}
}

validateMarkdownFiles();
