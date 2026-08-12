import { readdir, stat, writeFile, readFile } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import os from "node:os";
import sharp from "sharp";

const MAX_SIZE_BYTES = 50 * 1024; // 50 KB = 51,200 bytes
const IMAGES_DIR = join(process.cwd(), "public/images");
const CONCURRENCY = Math.max(4, os.cpus().length * 2); // Tận dụng tối đa CPU multi-core

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".tif", ".tiff"]);

async function getAllImageFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	let files: string[] = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files = files.concat(await getAllImageFiles(fullPath));
		} else if (entry.isFile()) {
			const ext = extname(entry.name).toLowerCase();
			if (IMAGE_EXTENSIONS.has(ext)) {
				files.push(fullPath);
			}
		}
	}

	return files;
}

async function compressSingleImage(filePath: string): Promise<{ relPath: string; originalKB: string; newKB: string; savedKB: string; savedBytes: number } | null> {
	const fileStat = await stat(filePath);
	if (fileStat.size <= MAX_SIZE_BYTES) return null;

	const originalBuffer = await readFile(filePath);
	const relPath = relative(process.cwd(), filePath);
	const originalKB = (fileStat.size / 1024).toFixed(1);

	const metadata = await sharp(originalBuffer).metadata();
	let currentWidth = metadata.width || 1200;
	let currentHeight = metadata.height || 800;

	// Dự đoán tỉ lệ thu nhỏ ban đầu dựa trên dung lượng file
	// Nếu file > 500KB, thu nhỏ trước kích thước để tăng tốc độ nén x5-x10 lần
	let maxDim = Math.max(currentWidth, currentHeight);
	let scale = 1.0;

	if (fileStat.size > 500 * 1024) {
		maxDim = Math.min(maxDim, 1000);
		scale = 0.7;
	} else if (fileStat.size > 200 * 1024) {
		maxDim = Math.min(maxDim, 1200);
		scale = 0.85;
	}

	const ext = extname(filePath).toLowerCase();
	let bestBuffer: Buffer | null = null;

	// Vòng lặp thử nhanh các mức scale & quality
	while (scale >= 0.15) {
		const targetWidth = Math.max(1, Math.round(currentWidth * scale));
		const targetHeight = Math.max(1, Math.round(currentHeight * scale));

		// Thử chất lượng 75 -> 50 -> 30 (chỉ thử 3 mốc để tiết kiệm CPU)
		for (const quality of [75, 50, 30, 15]) {
			let pipeline = sharp(originalBuffer).resize(targetWidth, targetHeight, { fit: "inside", withoutEnlargement: true });

			if (ext === ".png") {
				pipeline = pipeline.png({
					quality,
					palette: true,
					effort: 3, // Effort=3 cực nhanh so với Effort=7
					compressionLevel: 9,
				});
			} else if (ext === ".jpg" || ext === ".jpeg") {
				pipeline = pipeline.jpeg({ quality, mozjpeg: true });
			} else if (ext === ".webp") {
				pipeline = pipeline.webp({ quality, effort: 3 });
			} else if (ext === ".avif") {
				pipeline = pipeline.avif({ quality, effort: 2 });
			} else if (ext === ".gif") {
				pipeline = pipeline.gif({ colors: Math.max(16, Math.floor((quality / 100) * 256)) });
			} else {
				pipeline = pipeline.toFormat((metadata.format || "png") as any, { quality });
			}

			const buf = await pipeline.toBuffer();
			if (buf.length <= MAX_SIZE_BYTES) {
				bestBuffer = buf;
				break;
			}
			// Lưu lại bản nén nhỏ nhất nếu vẫn chưa < 50KB
			if (!bestBuffer || buf.length < bestBuffer.length) {
				bestBuffer = buf;
			}
		}

		if (bestBuffer && bestBuffer.length <= MAX_SIZE_BYTES) {
			break;
		}

		scale -= 0.2; // Giảm kích thước ảnh xuống và thử lại
	}

	if (bestBuffer && bestBuffer.length < fileStat.size) {
		await writeFile(filePath, bestBuffer);
		const newKB = (bestBuffer.length / 1024).toFixed(1);
		const savedBytes = fileStat.size - bestBuffer.length;
		const savedKB = (savedBytes / 1024).toFixed(1);
		return { relPath, originalKB, newKB, savedKB, savedBytes };
	}

	return null;
}

// Xử lý bất đồng bộ theo batch (Parallel Limit Pool)
async function mapConcurrent<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
	const results: R[] = [];
	let index = 0;

	async function worker() {
		while (index < items.length) {
			const i = index++;
			results[i] = await fn(items[i]);
		}
	}

	const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
	await Promise.all(workers);
	return results;
}

async function compressImages() {
	const startTime = Date.now();
	console.log(`⚡ [NÉN HÌNH] Bắt đầu quét & nén hình ảnh với ${CONCURRENCY} luồng song song...`);
	const files = await getAllImageFiles(IMAGES_DIR);

	const fileStats = await Promise.all(files.map(async (f) => ({ path: f, stat: await stat(f) })));
	const targets = fileStats.filter((f) => f.stat.size > MAX_SIZE_BYTES);

	console.log(`📊 Tổng số ảnh: ${files.length} | Số ảnh cần nén (> 50KB): ${targets.length}`);

	if (targets.length === 0) {
		console.log(`✨ Tất cả ảnh đều đã <= 50KB. Bỏ qua! (${Date.now() - startTime}ms)`);
		return;
	}

	const results = await mapConcurrent(targets.map((t) => t.path), CONCURRENCY, compressSingleImage);

	let compressedCount = 0;
	let totalSavedBytes = 0;

	for (const res of results) {
		if (res) {
			compressedCount++;
			totalSavedBytes += res.savedBytes;
			console.log(`⚡ ${res.relPath}: ${res.originalKB}KB -> ${res.newKB}KB (Giảm ${res.savedKB}KB)`);
		}
	}

	const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
	const totalSavedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
	console.log(`\n✅ Hoàn thành trong ${elapsed}s! Đã nén ${compressedCount}/${targets.length} ảnh (> 50KB). Tiết kiệm tổng cộng: ${totalSavedMB} MB.`);
}

compressImages();
