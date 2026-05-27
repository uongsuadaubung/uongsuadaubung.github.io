import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import * as THREE from 'three';
import './MiniGame.scss';

export default function MiniGame() {
	let canvas!: HTMLCanvasElement;
	const [score, setScore] = createSignal(0);
	const [lives, setLives] = createSignal(3);
	const [gameOver, setGameOver] = createSignal(false);
	const [gameStarted, setGameStarted] = createSignal(false);
	const [gameOverReason, setGameOverReason] = createSignal('');

	let animationFrameId: number;
	let resetGameCallback = () => {};

	// Tạo texture "hộp sữa" bằng HTML Canvas
	function createMilkTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, 256, 256);
		
		ctx.fillStyle = '#3b82f6';
		ctx.fillRect(0, 150, 256, 60);
		
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
		
		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(0, 0, 256, 256);
		
		ctx.fillStyle = '#e2e8f0';
		ctx.fillRect(0, 0, 256, 50);

		ctx.fillStyle = '#ef4444';
		ctx.beginPath(); ctx.arc(25, 25, 10, 0, Math.PI * 2); ctx.fill();
		ctx.fillStyle = '#eab308';
		ctx.beginPath(); ctx.arc(60, 25, 10, 0, Math.PI * 2); ctx.fill();
		ctx.fillStyle = '#22c55e';
		ctx.beginPath(); ctx.arc(95, 25, 10, 0, Math.PI * 2); ctx.fill();
		
		ctx.font = 'bold 90px monospace';
		ctx.fillStyle = '#059669';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText('</>', 128, 150);

		const tex = new THREE.CanvasTexture(c);
		tex.colorSpace = THREE.SRGBColorSpace;
		return tex;
	}

	// Tạo texture "Tiền thưởng"
	function createBonusTexture() {
		const c = document.createElement('canvas');
		c.width = 256;
		c.height = 256;
		const ctx = c.getContext('2d');
		if (!ctx) return null;
		
		ctx.fillStyle = '#dcfce7';
		ctx.fillRect(0, 0, 256, 256);
		
		ctx.fillStyle = '#4ade80';
		ctx.fillRect(98, 0, 60, 256);
		
		ctx.font = 'bold 100px sans-serif';
		ctx.fillStyle = '#166534';
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
		
		ctx.fillStyle = '#020617';
		ctx.fillRect(0, 0, 512, 512);

		for(let i=0; i<10; i++) {
			let x = i * 51 + 5;
			ctx.fillStyle = '#0f172a';
			ctx.fillRect(x, 50, 40, 462);
			
			for(let j=0; j<20; j++) {
				ctx.fillStyle = Math.random() > 0.3 ? '#22c55e' : '#334155';
				ctx.fillRect(x + 5, 70 + j * 20, 8, 4);
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
		
		ctx.fillStyle = '#0f172a';
		ctx.fillRect(0, 0, 128, 128);
		
		ctx.strokeStyle = '#1e293b';
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

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);
		const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
		dirLight.position.set(10, 20, 10);
		scene.add(dirLight);

		const floorGeo = new THREE.PlaneGeometry(100, 100);
		const floorMat = new THREE.MeshStandardMaterial({ 
			color: 0xaaaaaa,
			map: createFloorTexture(),
			roughness: 0.5,
			metalness: 0.1
		});
		const floor = new THREE.Mesh(floorGeo, floorMat);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -0.01;
		scene.add(floor);

		const player = new THREE.Group();
		const baseGeo = new THREE.BoxGeometry(2, 0.15, 1.5);
		const baseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 }); 
		const baseMesh = new THREE.Mesh(baseGeo, baseMat);
		baseMesh.position.y = 0.075;
		
		const screenGeo = new THREE.BoxGeometry(2, 1.3, 0.1);
		const screenMat = new THREE.MeshStandardMaterial({ 
			color: 0xffffff,
			map: createScreenTexture(),
			emissive: 0x111111
		});
		const screenMesh = new THREE.Mesh(screenGeo, screenMat);
		screenMesh.position.set(0, 0.7, -0.7);
		screenMesh.rotation.x = -0.15;
		
		player.add(baseMesh);
		player.add(screenMesh);
		player.position.y = 0.5;
		scene.add(player);

		let items: { mesh: THREE.Mesh; type: 'milk' | 'code' | 'bonus' }[] = [];
		const milkTexture = createMilkTexture();
		const codeTexture = createCodeTexture();
		const bonusTexture = createBonusTexture();

		resetGameCallback = () => {
			items.forEach(item => scene.remove(item.mesh));
			items = [];
			player.position.set(0, 0.5, 0);
			player.rotation.set(0, 0, 0);
			targetX = 0;
		};

		const spawnItem = () => {
			if (!gameStarted() || gameOver()) return;

			let type: 'milk' | 'code' | 'bonus' = 'code';
			const rand = Math.random();
			if (rand < 0.45) type = 'milk';
			else if (rand > 0.85) type = 'bonus';
			
			let geo, mat;
			if (type === 'milk') {
				geo = new THREE.BoxGeometry(1, 1.5, 1);
				mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: milkTexture, emissive: 0x222222 });
			} else if (type === 'code') {
				geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
				mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: codeTexture, emissive: 0x222222 });
			} else {
				geo = new THREE.BoxGeometry(1.6, 0.5, 0.8);
				mat = new THREE.MeshStandardMaterial({ 
					color: 0xffffff, 
					map: bonusTexture, 
					emissive: 0x022c22,
					metalness: 0.1,
					roughness: 0.8
				});
			}
			
			const mesh = new THREE.Mesh(geo, mat);
			mesh.position.set((Math.random() - 0.5) * 16, 25, (Math.random() - 0.5) * 4);
			
			scene.add(mesh);
			items.push({ mesh, type });
		};

		const spawnInterval = setInterval(spawnItem, 800);

		const playerBox = new THREE.Box3();
		const itemBox = new THREE.Box3();

		let targetX = 0;
		const handleMouseMove = (e: MouseEvent) => {
			if (!gameStarted() || gameOver()) return;
			const rect = canvas.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			targetX = x * 10;
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!gameStarted() || gameOver()) return;
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

			if (gameStarted() && !gameOver()) {
				player.position.x += (targetX - player.position.x) * 0.15;
				player.rotation.z = (player.position.x - targetX) * 0.1;
				
				playerBox.setFromObject(player);

				for (let i = items.length - 1; i >= 0; i--) {
					const item = items[i];
					item.mesh.position.y -= 6.5 * delta;
					item.mesh.rotation.x += delta;
					item.mesh.rotation.y += delta;

					itemBox.setFromObject(item.mesh);

					if (playerBox.intersectsBox(itemBox)) {
						if (item.type === 'milk') {
							setGameOver(true);
							setGameOverReason('Bạn đã lỡ uống sữa bò. Bụng sôi ùng ục! 🚽');
						} else if (item.type === 'bonus') {
							setScore(s => s + 5);
						} else {
							setScore(s => s + 1);
						}
						scene.remove(item.mesh);
						items.splice(i, 1);
					} else if (item.mesh.position.y < -2) {
						if (item.type === 'code') {
							setLives(l => l - 1);
							if (lives() <= 0) {
								setGameOver(true);
								setGameOverReason('Bạn để lọt quá nhiều code. Dự án sập! 💥');
							}
						}
						scene.remove(item.mesh);
						items.splice(i, 1);
					}
				}
			} else if (gameOver()) {
				player.position.y -= 5 * delta;
				player.rotation.x += 2 * delta;
				player.rotation.z += 2 * delta;
			}

			renderer.render(scene, camera);
		};

		animate();

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

		onCleanup(() => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			clearInterval(spawnInterval);
			cancelAnimationFrame(animationFrameId);
			resizeObserver.disconnect();
			
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
		setScore(0);
		setLives(3);
		setGameOver(false);
		setGameStarted(true);
		resetGameCallback();
	}

	return (
		<div class="game-wrapper">
			<canvas ref={canvas} class="game-canvas"></canvas>
			
			<div class="game-ui">
				<Show when={!gameStarted() && !gameOver()}>
					<div class="overlay animate-fade-in-up">
						<h2>Mini Game: Né Sữa, Nhặt Code!</h2>
						<p>Bạn bị dị ứng sữa bò (uống sữa đau bụng). Hãy rê chuột để điều khiển chiếc <strong>Laptop</strong> đi hứng các <strong>Cửa sổ Code</strong> `&lt;/&gt;` và nhặt các <strong>Xấp Tiền</strong> xanh lá `$`. Tuyệt đối tránh xa các <strong>Hộp Sữa</strong> nếu không muốn dự án toang nhé!</p>
						<button class="btn btn-primary" onClick={startGame}>Chơi ngay</button>
					</div>
				</Show>

				<Show when={gameOver()}>
					<div class="overlay animate-fade-in-up">
						<h2>Game Over!</h2>
						<p>{gameOverReason()}</p>
						<p>Điểm của bạn: <strong>{score()}</strong></p>
						<button class="btn btn-primary" onClick={startGame}>Chơi lại</button>
					</div>
				</Show>

				<Show when={gameStarted() && !gameOver()}>
					<div class="score-board">
						<div class="lives">Mạng: {"❤️".repeat(lives())}</div>
						<div class="score">Code thu thập: <strong>{score()}</strong></div>
					</div>
				</Show>
			</div>
		</div>
	);
}
