<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';

	let canvas: HTMLCanvasElement;
	let score = $state(0);
	let lives = $state(3);
	let gameOver = $state(false);
	let gameStarted = $state(false);
	let gameOverReason = $state('');

	let animationFrameId: number;
	let resetGameCallback = () => {};

	// Tạo texture "hộp sữa" bằng HTML Canvas
	function createMilkTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		// Nền trắng
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 256, 256);
		
		// Vạch xanh lam đặc trưng hộp sữa
		ctx.fillStyle = '#3b82f6';
		ctx.fillRect(0, 150, 256, 60);
		
		// Chữ SỮA
		ctx.font = 'bold 70px sans-serif';
		ctx.fillStyle = '#1e293b';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('SỮA', 128, 80);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "khối code" bằng HTML Canvas
	function createCodeTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		// Nền sáng (editor background - Light Theme)
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(0, 0, 256, 256);
		
		// Thanh header editor
		ctx.fillStyle = '#e2e8f0';
		ctx.fillRect(0, 0, 256, 50);

		// Nút điều khiển (macOS style window buttons)
		ctx.fillStyle = '#ef4444';
		ctx.beginPath(); ctx.arc(25, 25, 10, 0, Math.PI * 2); ctx.fill();
		ctx.fillStyle = '#eab308';
		ctx.beginPath(); ctx.arc(60, 25, 10, 0, Math.PI * 2); ctx.fill();
		ctx.fillStyle = '#22c55e';
		ctx.beginPath(); ctx.arc(95, 25, 10, 0, Math.PI * 2); ctx.fill();
		
		// Biểu tượng Code
		ctx.font = 'bold 90px monospace';
		ctx.fillStyle = '#059669'; // Xanh lá cây đậm để nổi bật trên nền sáng
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('</>', 128, 150);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "Tiền thưởng" (Cục tiền Đô la)
	function createBonusTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#dcfce7'; // Xanh lá siêu nhạt (màu giấy tiền)
		ctx.fillRect(0, 0, 256, 256);
		
		ctx.fillStyle = '#4ade80'; // Đai buộc xấp tiền
		ctx.fillRect(98, 0, 60, 256);
		
		// Ký hiệu $
		ctx.font = 'bold 100px sans-serif';
		ctx.fillStyle = '#166534'; // Xanh lá đậm
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('$', 128, 138);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "Màn hình Laptop"
	function createScreenTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 128;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#0f172a';
		ctx.fillRect(0, 0, 256, 128);
		
		ctx.font = 'bold 24px monospace';
		ctx.fillStyle = '#10b981';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('>_ uongsuadaubung', 128, 64);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "Phòng Server" làm background
	function createServerRoomTexture() {
		const c = document.createElement('canvas');
		c.width = 512;
		c.height = 512;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#020617'; // Nền đen sâu thẳm
		ctx.fillRect(0, 0, 512, 512);

		// Vẽ các tủ server
		for(let i=0; i<10; i++) {
			let x = i * 51 + 5;
			ctx.fillStyle = '#0f172a';
			ctx.fillRect(x, 50, 40, 462);
			
			// Đèn nhấp nháy trên server
			for(let j=0; j<20; j++) {
				// Đèn xanh (hoạt động)
				ctx.fillStyle = Math.random() > 0.3 ? '#22c55e' : '#334155';
				ctx.fillRect(x + 5, 70 + j * 20, 8, 4);
				// Đèn cam/đỏ (ổ cứng/cảnh báo)
				ctx.fillStyle = Math.random() > 0.8 ? '#f59e0b' : '#334155';
				ctx.fillRect(x + 25, 70 + j * 20, 8, 4);
			}
		}

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "Gạch lót sàn" phòng Server
	function createFloorTexture() {
		const c = document.createElement('canvas');
		c.width = 128;
		c.height = 128;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#0f172a'; // Xám xanh đen
		ctx.fillRect(0, 0, 128, 128);
		
		ctx.strokeStyle = '#1e293b'; // Viền gạch sáng hơn chút
		ctx.lineWidth = 4;
		ctx.strokeRect(0, 0, 128, 128);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set(20, 20);
		return tex;
	}

	onMount(() => {
		const scene = new THREE.Scene();
		scene.background = createServerRoomTexture() || new THREE.Color('#0f172a');
		scene.fog = new THREE.Fog('#020617', 15, 60);

		const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
		camera.position.set(0, 6, 12);
		camera.lookAt(0, 3, 0);

		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
		dirLight.position.set(10, 20, 10);
		scene.add(dirLight);

		// Ground (Sàn phòng máy bóng loáng)
		const floorGeo = new THREE.PlaneGeometry(100, 100);
		const floorMat = new THREE.MeshStandardMaterial({ 
			color: 0xaaaaaa, // Sáng lên một chút để thấy rõ viền gạch
			map: createFloorTexture(),
			roughness: 0.5,
			metalness: 0.1
		});
		const floor = new THREE.Mesh(floorGeo, floorMat);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -0.01;
		scene.add(floor);

		// Player (Laptop)
		const player = new THREE.Group();
		
		// Bàn phím / Đế laptop
		const baseGeo = new THREE.BoxGeometry(2, 0.15, 1.5);
		const baseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 }); 
		const baseMesh = new THREE.Mesh(baseGeo, baseMat);
		baseMesh.position.y = 0.075;
		
		// Màn hình laptop
		const screenGeo = new THREE.BoxGeometry(2, 1.3, 0.1);
		const screenMat = new THREE.MeshStandardMaterial({ 
			color: 0xffffff,
			map: createScreenTexture(),
			emissive: 0x111111
		});
		const screenMesh = new THREE.Mesh(screenGeo, screenMat);
		screenMesh.position.set(0, 0.7, -0.7);
		screenMesh.rotation.x = -0.15; // Ngửa màn hình ra sau một chút
		
		player.add(baseMesh);
		player.add(screenMesh);
		player.position.y = 0.5;
		scene.add(player);

		// Items array
		let items: { mesh: THREE.Mesh; type: 'milk' | 'code' | 'bonus' }[] = [];
		const milkTexture = createMilkTexture();
		const codeTexture = createCodeTexture();
		const bonusTexture = createBonusTexture();

		resetGameCallback = () => {
			// Xóa các item cũ
			items.forEach(item => scene.remove(item.mesh));
			items = [];
			// Reset player
			player.position.set(0, 0.5, 0);
			player.rotation.set(0, 0, 0);
			targetX = 0;
		};

		const spawnItem = () => {
			if (!gameStarted || gameOver) return;

			let type: 'milk' | 'code' | 'bonus' = 'code';
			const rand = Math.random();
			if (rand < 0.45) type = 'milk'; // 45% sữa
			else if (rand > 0.85) type = 'bonus'; // 15% tiền thưởng
			
			let geo, mat;
			if (type === 'milk') {
				geo = new THREE.BoxGeometry(1, 1.5, 1);
				mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: milkTexture, emissive: 0x222222 });
			} else if (type === 'code') {
				geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
				mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: codeTexture, emissive: 0x222222 });
			} else {
				geo = new THREE.BoxGeometry(1.6, 0.5, 0.8); // Hình xấp tiền (Stack of cash)
				mat = new THREE.MeshStandardMaterial({ 
					color: 0xffffff, 
					map: bonusTexture, 
					emissive: 0x022c22, // Xanh rêu rất tối
					metalness: 0.1, // Giấy thì không bóng
					roughness: 0.8
				});
			}
			
			const mesh = new THREE.Mesh(geo, mat);
			mesh.position.set((Math.random() - 0.5) * 16, 25, (Math.random() - 0.5) * 4);
			
			scene.add(mesh);
			items.push({ mesh, type });
		};

		// Spawning loop
		const spawnInterval = setInterval(spawnItem, 800);

		// Collision bounding boxes
		const playerBox = new THREE.Box3();
		const itemBox = new THREE.Box3();

		// Handle mouse movement
		let targetX = 0;
		const handleMouseMove = (e: MouseEvent) => {
			if (!gameStarted || gameOver) return;
			const rect = canvas.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			targetX = x * 10;
		};

		// Handle touch movement
		const handleTouchMove = (e: TouchEvent) => {
			if (!gameStarted || gameOver) return;
			const rect = canvas.getBoundingClientRect();
			const x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
			targetX = x * 10;
		};

		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchmove', handleTouchMove);

		const clock = new THREE.Clock();

		const animate = () => {
			animationFrameId = requestAnimationFrame(animate);
			const delta = clock.getDelta();

			if (gameStarted && !gameOver) {
				// Smoothly move player
				player.position.x += (targetX - player.position.x) * 0.15;
				player.rotation.z = (player.position.x - targetX) * 0.1; // Tilt based on speed
				
				playerBox.setFromObject(player);

				// Update items
				for (let i = items.length - 1; i >= 0; i--) {
					const item = items[i];
					item.mesh.position.y -= 6.5 * delta; // Fall speed
					item.mesh.rotation.x += delta;
					item.mesh.rotation.y += delta;

					itemBox.setFromObject(item.mesh);

					// Collision detection
					if (playerBox.intersectsBox(itemBox)) {
						if (item.type === 'milk') {
							// Drank milk -> Stomach ache -> Game Over
							gameOver = true;
							gameOverReason = 'Bạn đã lỡ uống sữa bò. Bụng sôi ùng ục! 🚽';
						} else if (item.type === 'bonus') {
							// Got bonus -> +5 score
							score += 5;
						} else {
							// Got code -> +1 score
							score += 1;
						}
						scene.remove(item.mesh);
						items.splice(i, 1);
					} else if (item.mesh.position.y < -2) {
						// Missed item
						if (item.type === 'code') {
							lives -= 1;
							if (lives <= 0) {
								gameOver = true;
								gameOverReason = 'Bạn để lọt quá nhiều code. Dự án sập! 💥';
							}
						}
						// Nếu rớt type === 'bonus' thì không bị trừ mạng
						scene.remove(item.mesh);
						items.splice(i, 1);
					}
				}
			} else if (gameOver) {
				// Spin and drop player on game over
				player.position.y -= 5 * delta;
				player.rotation.x += 2 * delta;
				player.rotation.z += 2 * delta;
			}

			renderer.render(scene, camera);
		};

		animate();

		// Handle resize
		const handleResize = () => {
			const rect = canvas.parentElement?.getBoundingClientRect();
			if (rect) {
				renderer.setSize(rect.width, rect.height);
				camera.aspect = rect.width / rect.height;
				camera.updateProjectionMatrix();
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
		handleResize();

		onDestroy(() => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			clearInterval(spawnInterval);
			cancelAnimationFrame(animationFrameId);
			resizeObserver.disconnect();
			
			// Clean up Three.js resources
			renderer.dispose();
			scene.traverse((object) => {
				if (object instanceof THREE.Mesh) {
					object.geometry.dispose();
					if (Array.isArray(object.material)) {
						object.material.forEach(m => m.dispose());
					} else {
						object.material.dispose();
					}
				}
			});
		});
	});

	function startGame() {
		score = 0;
		lives = 3;
		gameOver = false;
		gameStarted = true;
		resetGameCallback();
	}
</script>

<div class="game-wrapper">
	<canvas bind:this={canvas} class="game-canvas"></canvas>
	
	<div class="game-ui">
		{#if !gameStarted && !gameOver}
			<div class="overlay animate-fade-in-up">
				<h2>Mini Game: Né Sữa, Nhặt Code!</h2>
				<p>Bạn bị dị ứng sữa bò (uống sữa đau bụng). Hãy rê chuột để điều khiển chiếc <strong>Laptop</strong> đi hứng các <strong>Cửa sổ Code</strong> `&lt;/&gt;` và nhặt các <strong>Xấp Tiền</strong> xanh lá `$`. Tuyệt đối tránh xa các <strong>Hộp Sữa</strong> nếu không muốn dự án toang nhé!</p>
				<button class="btn btn-primary" onclick={startGame}>Chơi ngay</button>
			</div>
		{:else if gameOver}
			<div class="overlay animate-fade-in-up">
				<h2>Game Over!</h2>
				<p>{gameOverReason}</p>
				<p>Điểm của bạn: <strong>{score}</strong></p>
				<button class="btn btn-primary" onclick={startGame}>Chơi lại</button>
			</div>
		{:else}
			<div class="score-board">
				<div class="lives">Mạng: {"❤️".repeat(lives)}</div>
				<div class="score">Code thu thập: <strong>{score}</strong></div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.game-wrapper {
		position: relative;
		width: 100%;
		height: 600px;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--border);
		background: #0f172a;
	}

	.game-canvas {
		width: 100% !important;
		height: 100% !important;
		display: block;
	}

	.game-ui {
		position: absolute;
		inset: 0;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.overlay {
		pointer-events: auto;
		background: rgba(15, 23, 42, 0.9);
		backdrop-filter: blur(8px);
		padding: var(--space-8);
		border-radius: var(--radius-xl);
		border: 1px solid var(--border);
		text-align: center;
		max-width: 400px;
		color: #fff;
		box-shadow: var(--shadow-2xl);

		h2 {
			font-size: 1.5rem;
			margin-bottom: var(--space-4);
			background: var(--accent-gradient);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		p {
			font-size: 0.95rem;
			line-height: 1.6;
			margin-bottom: var(--space-6);
			color: var(--text-muted);
		}
	}

	.score-board {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		background: rgba(15, 23, 42, 0.8);
		backdrop-filter: blur(4px);
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-lg);
		border: 1px solid var(--accent-1);
		color: #fff;
		font-weight: 500;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-align: right;

		.lives {
			font-size: 1.1rem;
		}
	}

	.btn-primary {
		pointer-events: auto;
		background: var(--accent-gradient);
		color: white;
		border: none;
		padding: var(--space-3) var(--space-8);
		border-radius: var(--radius-full);
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s;

		&:hover {
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}
	}
</style>
