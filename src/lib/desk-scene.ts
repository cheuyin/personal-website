import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PAPER = 0xf1f0e8;
const MUTED = 0x5c6358;
const ACCENT = 0x3d6b4f;
const SHELL = 0x58595d;
const SHELL_DARK = 0x58595d;
const LOGO = 0x3f4044;
const LOGO_DARK = 0x3f4044;
const BIC_BLUE = 0x1e5f9e;
const BIC_INK = 0x14325c;

function mat(color: number, extras: THREE.MeshStandardMaterialParameters = {}): THREE.MeshStandardMaterial {
	return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.35, ...extras });
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	if (ctx) {
		draw(ctx);
	}

	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.anisotropy = 8;
	return texture;
}

function keyboardTexture(): THREE.CanvasTexture {
	return canvasTexture(1024, 640, (ctx) => {
		ctx.fillStyle = '#2a2b2e';
		ctx.fillRect(0, 0, 1024, 640);
		const rows = [14, 14, 13, 12, 3];
		const rowY = [36, 148, 260, 372, 500];
		const keyH = 88;

		ctx.fillStyle = '#1a1b1d';
		rows.forEach((count, row) => {
			const gap = 10;
			const usable = 1024 - 48;
			const keyW = row === 4 ? 220 : (usable - gap * (count - 1)) / count;
			let x = 24;

			if (row === 4) {
				x = (1024 - (keyW * 3 + gap * 2)) / 2;
			}

			for (let i = 0; i < count; i += 1) {
				const width = row === 4 && i === 1 ? keyW * 1.8 : keyW;
				ctx.beginPath();
				ctx.roundRect(x, rowY[row], width, keyH, 10);
				ctx.fill();
				x += width + gap;
			}
		});
	});
}

function screenTexture(): THREE.CanvasTexture {
	return canvasTexture(1280, 800, (ctx) => {
		ctx.fillStyle = '#1a1e1a';
		ctx.fillRect(0, 0, 1280, 800);
		ctx.fillStyle = '#131511';
		ctx.fillRect(0, 0, 1280, 52);
		ctx.fillStyle = '#8fbf9a';
		ctx.beginPath();
		ctx.arc(28, 26, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#c5c0b4';
		ctx.beginPath();
		ctx.arc(52, 26, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#5c6358';
		ctx.beginPath();
		ctx.arc(76, 26, 7, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#e6eadf';
		ctx.globalAlpha = 0.55;
		ctx.fillRect(120, 20, 180, 12);

		ctx.globalAlpha = 1;
		ctx.fillStyle = '#1f241f';
		ctx.fillRect(0, 52, 220, 748);

		const files = [88, 132, 176, 220, 264];
		files.forEach((y, i) => {
			ctx.fillStyle = i === 1 ? '#2c332c' : '#1f241f';
			ctx.fillRect(12, y - 14, 196, 36);
			ctx.fillStyle = i === 1 ? '#8fbf9a' : '#9aa392';
			ctx.fillRect(28, y, i === 1 ? 120 : 88 + i * 12, 8);
		});

		const body = [
			{ x: 268, y: 108, w: 210, color: '#8fbf9a' },
			{ x: 268, y: 168, w: 640, color: '#e6eadf' },
			{ x: 268, y: 200, w: 520, color: '#e6eadf' },
			{ x: 268, y: 248, w: 160, color: '#9aa392' },
			{ x: 268, y: 292, w: 90, color: '#8fbf9a' },
			{ x: 370, y: 292, w: 280, color: '#e6eadf' },
			{ x: 268, y: 324, w: 420, color: '#c5c0b4' },
			{ x: 268, y: 356, w: 360, color: '#e6eadf' },
			{ x: 268, y: 404, w: 70, color: '#8fbf9a' },
			{ x: 350, y: 404, w: 240, color: '#e6eadf' },
			{ x: 268, y: 452, w: 580, color: '#e6eadf' },
			{ x: 268, y: 484, w: 440, color: '#9aa392' },
			{ x: 268, y: 548, w: 130, color: '#8fbf9a' },
			{ x: 268, y: 596, w: 390, color: '#e6eadf' },
			{ x: 268, y: 628, w: 310, color: '#e6eadf' },
		];

		for (const line of body) {
			ctx.fillStyle = line.color;
			ctx.fillRect(line.x, line.y, line.w, 11);
		}

		ctx.fillStyle = '#8fbf9a';
		ctx.fillRect(268, 108, 4, 14);
	});
}

function scribble(ctx: CanvasRenderingContext2D, points: number[][], width = 3): void {
	if (points.length < 2) {
		return;
	}

	ctx.lineWidth = width;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);

	for (let i = 1; i < points.length; i += 1) {
		const prev = points[i - 1];
		const curr = points[i];
		const mx = (prev[0] + curr[0]) / 2;
		const my = (prev[1] + curr[1]) / 2;
		ctx.quadraticCurveTo(prev[0], prev[1], mx, my);
	}

	ctx.stroke();
}

function paperTexture(): THREE.CanvasTexture {
	return canvasTexture(1024, 1280, (ctx) => {
		ctx.fillStyle = '#efece3';
		ctx.fillRect(0, 0, 1024, 1280);
		ctx.strokeStyle = '#c9c2b4';
		ctx.lineWidth = 3;

		for (let y = 80; y < 1240; y += 48) {
			ctx.beginPath();
			ctx.moveTo(64, y);
			ctx.lineTo(960, y);
			ctx.stroke();
		}

		ctx.strokeStyle = '#1e231c';
		ctx.globalAlpha = 0.9;
		scribble(ctx, [
			[90, 130],
			[210, 118],
			[340, 142],
			[490, 128],
			[640, 150],
		], 6);
		scribble(ctx, [
			[90, 178],
			[250, 168],
			[400, 190],
			[520, 176],
		], 5);
		scribble(ctx, [
			[90, 226],
			[180, 240],
			[260, 214],
			[330, 232],
		], 5);

		ctx.strokeStyle = '#3d6b4f';
		ctx.globalAlpha = 0.92;
		ctx.lineWidth = 5;
		ctx.strokeRect(92, 320, 150, 110);
		ctx.strokeRect(330, 340, 150, 96);
		ctx.strokeRect(568, 318, 140, 118);
		ctx.beginPath();
		ctx.moveTo(242, 375);
		ctx.lineTo(330, 388);
		ctx.moveTo(480, 388);
		ctx.lineTo(568, 376);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(318, 388);
		ctx.lineTo(330, 388);
		ctx.lineTo(322, 378);
		ctx.moveTo(556, 376);
		ctx.lineTo(568, 376);
		ctx.lineTo(560, 366);
		ctx.stroke();

		ctx.strokeStyle = '#1e231c';
		ctx.globalAlpha = 0.84;
		ctx.beginPath();
		ctx.ellipse(210, 620, 88, 64, -0.2, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.ellipse(430, 650, 70, 52, 0.15, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(290, 630);
		ctx.lineTo(368, 648);
		ctx.stroke();

		scribble(ctx, [
			[560, 560],
			[620, 620],
			[700, 590],
			[780, 680],
			[860, 640],
		], 4);
		scribble(ctx, [
			[80, 820],
			[200, 800],
			[310, 840],
			[470, 810],
			[620, 850],
		], 5);
		scribble(ctx, [
			[100, 880],
			[90, 960],
			[180, 990],
			[260, 940],
			[300, 1010],
		], 4);

		ctx.globalAlpha = 0.78;
		ctx.beginPath();
		ctx.moveTo(140, 200);
		ctx.lineTo(420, 248);
		ctx.stroke();

		ctx.strokeStyle = '#3d6b4f';
		ctx.globalAlpha = 0.88;
		ctx.lineWidth = 5;
		ctx.strokeRect(620, 860, 220, 160);
		ctx.beginPath();
		ctx.moveTo(620, 940);
		ctx.lineTo(840, 940);
		ctx.moveTo(730, 860);
		ctx.lineTo(730, 1020);
		ctx.stroke();
		scribble(ctx, [
			[650, 900],
			[700, 980],
			[780, 890],
			[820, 1000],
		], 3);
	});
}

function hash2(x: number, y: number): number {
	const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return s - Math.floor(s);
}

function mixColor(a: number[], b: number[], t: number): number[] {
	return [
		a[0] + (b[0] - a[0]) * t,
		a[1] + (b[1] - a[1]) * t,
		a[2] + (b[2] - a[2]) * t,
	];
}

function woodMaps(
	width: number,
	height: number,
	kind: 'boards' | 'edge' | 'end' = 'boards',
): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
	const color = document.createElement('canvas');
	const bump = document.createElement('canvas');
	color.width = bump.width = width;
	color.height = bump.height = height;
	const colorCtx = color.getContext('2d');
	const bumpCtx = bump.getContext('2d');

	if (!colorCtx || !bumpCtx) {
		return { map: new THREE.CanvasTexture(color), bumpMap: new THREE.CanvasTexture(bump) };
	}

	const colorData = colorCtx.createImageData(width, height);
	const bumpData = bumpCtx.createImageData(width, height);
	const light = [214, 178, 132];
	const mid = [176, 134, 88];
	const dark = [122, 86, 52];
	const plankCount = kind === 'edge' ? 1 : 6;

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			const nx = x / width;
			const ny = y / height;
			const plank = Math.min(plankCount - 1, Math.floor(ny * plankCount));
			const plankY = (ny * plankCount) % 1;
			const seed = hash2(plank + 1, 3.7);
			const wave = Math.sin((nx + seed) * (7 + seed * 4) + Math.sin(ny * 14) * 0.35) * 10;
			let grain: number;
			let ring = 0;

			if (kind === 'end') {
				const cx = ((plank + 0.5) / plankCount - ny) * 2.4;
				const cy = (nx - 0.5) * 2;
				ring = Math.sqrt(cx * cx + cy * cy) * 18 + Math.sin(nx * 20 + seed) * 0.6;
				grain = 0.5 + 0.5 * Math.sin(ring);
			} else {
				const along = x + wave + seed * 40 + Math.sin((y + seed * 80) * 0.045) * 6;
				grain = 0.5 + 0.5 * Math.sin(along * 0.085);
				grain = grain * 0.82 + (0.5 + 0.5 * Math.sin(along * 0.31 + seed * 6)) * 0.18;
			}

			const noise = hash2(x * 0.37, y * 0.19) * 0.12;
			const seam = kind === 'boards' ? Math.pow(Math.abs(plankY - 0.5) * 2, 8) * 0.08 + (plankY < 0.02 || plankY > 0.98 ? 0.22 : 0) : 0;
			const tint = seed * 0.16 - 0.08;
			let t = Math.min(1, Math.max(0, grain + noise + tint - seam));
			const rgb = t < 0.5 ? mixColor(dark, mid, t * 2) : mixColor(mid, light, (t - 0.5) * 2);
			const i = (y * width + x) * 4;
			colorData.data[i] = rgb[0];
			colorData.data[i + 1] = rgb[1];
			colorData.data[i + 2] = rgb[2];
			colorData.data[i + 3] = 255;
			const bumpV = Math.min(255, Math.max(0, 118 + grain * 90 - seam * 70 + noise * 40));
			bumpData.data[i] = bumpData.data[i + 1] = bumpData.data[i + 2] = bumpV;
			bumpData.data[i + 3] = 255;
		}
	}

	colorCtx.putImageData(colorData, 0, 0);
	bumpCtx.putImageData(bumpData, 0, 0);

	const map = new THREE.CanvasTexture(color);
	const bumpMap = new THREE.CanvasTexture(bump);
	map.colorSpace = THREE.SRGBColorSpace;
	map.anisotropy = 8;
	bumpMap.anisotropy = 8;
	return { map, bumpMap };
}

function woodMaterial(
	maps: { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture },
	extras: THREE.MeshStandardMaterialParameters = {},
): THREE.MeshStandardMaterial {
	const material = new THREE.MeshStandardMaterial({
		map: maps.map,
		bumpMap: maps.bumpMap,
		bumpScale: 0.028,
		roughness: 0.62,
		metalness: 0,
		envMapIntensity: 0.2,
		...extras,
	});
	material.userData.baseColor = material.color.getHex();
	return material;
}

function hexGeometry(radius: number, length: number): THREE.ExtrudeGeometry {
	const shape = new THREE.Shape();

	for (let i = 0; i < 6; i += 1) {
		const angle = Math.PI / 6 + (i * Math.PI) / 3;
		const x = Math.cos(angle) * radius;
		const y = Math.sin(angle) * radius;

		if (i === 0) {
			shape.moveTo(x, y);
		} else {
			shape.lineTo(x, y);
		}
	}

	shape.closePath();
	const geometry = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false, steps: 1 });
	geometry.rotateX(Math.PI / 2);
	geometry.translate(0, length / 2, 0);
	return geometry;
}

function pearBodyShape(): THREE.Shape {
	const shape = new THREE.Shape();
	shape.moveTo(0, 0.46);
	shape.bezierCurveTo(0.05, 0.46, 0.11, 0.41, 0.12, 0.31);
	shape.bezierCurveTo(0.09, 0.27, 0.07, 0.18, 0.13, 0.12);
	shape.bezierCurveTo(0.22, 0.05, 0.24, -0.04, 0.17, -0.1);
	shape.bezierCurveTo(0.34, -0.18, 0.46, -0.34, 0.4, -0.52);
	shape.bezierCurveTo(0.34, -0.68, 0.16, -0.76, 0, -0.76);
	shape.bezierCurveTo(-0.16, -0.76, -0.34, -0.68, -0.4, -0.52);
	shape.bezierCurveTo(-0.46, -0.34, -0.34, -0.18, -0.17, -0.1);
	shape.bezierCurveTo(-0.15, 0.02, -0.15, 0.16, -0.12, 0.31);
	shape.bezierCurveTo(-0.11, 0.41, -0.05, 0.46, 0, 0.46);
	return shape;
}

function pearLeafShape(): THREE.Shape {
	const shape = new THREE.Shape();
	shape.moveTo(0.02, 0.5);
	shape.bezierCurveTo(0.12, 0.66, 0.3, 0.7, 0.36, 0.56);
	shape.bezierCurveTo(0.34, 0.4, 0.14, 0.42, 0.02, 0.5);
	return shape;
}

function pearStemShape(): THREE.Shape {
	const shape = new THREE.Shape();
	shape.moveTo(-0.02, 0.46);
	shape.bezierCurveTo(-0.04, 0.6, 0, 0.72, 0.035, 0.76);
	shape.bezierCurveTo(0.04, 0.62, 0.02, 0.52, 0.016, 0.46);
	shape.closePath();
	return shape;
}

function makeFruitLogo(scale = 0.58): THREE.Group {
	const logo = new THREE.Group();
	const settings: THREE.ExtrudeGeometryOptions = {
		depth: 0.03,
		bevelEnabled: true,
		bevelThickness: 0.008,
		bevelSize: 0.006,
		bevelSegments: 2,
	};
	const material = mat(LOGO, { roughness: 0.32, metalness: 0.45, envMapIntensity: 0.35 });
	const mesh = (shape: THREE.Shape) => {
		const part = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, settings), material);
		part.castShadow = true;
		part.userData.part = 'logo';
		logo.add(part);
	};

	mesh(pearBodyShape());
	const leaf = new THREE.Mesh(
		new THREE.ExtrudeGeometry(pearLeafShape(), settings),
		mat(ACCENT, { roughness: 0.42, metalness: 0.12 }),
	);
	leaf.castShadow = true;
	logo.add(leaf);
	mesh(pearStemShape());
	logo.scale.setScalar(scale);
	return logo;
}

function makeLaptop(): THREE.Group {
	const width = 3.26;
	const depth = 2.24;
	const baseH = 0.11;
	const lidH = 0.05;
	const laptop = new THREE.Group();
	const shell = mat(SHELL, { roughness: 0.56, metalness: 0.16, envMapIntensity: 0.22 });

	const base = new THREE.Mesh(new RoundedBoxGeometry(width, baseH, depth, 3, 0.04), shell);
	base.position.y = baseH / 2;
	base.castShadow = true;
	base.userData.part = 'shell';
	laptop.add(base);

	const deck = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.9, depth * 0.38), new THREE.MeshStandardMaterial({
		map: keyboardTexture(),
		roughness: 0.62,
		metalness: 0.18,
		envMapIntensity: 0.28,
	}));
	deck.rotation.x = -Math.PI / 2;
	deck.position.set(0, baseH + 0.001, -0.38);
	laptop.add(deck);

	const pad = new THREE.Mesh(
		new RoundedBoxGeometry(width * 0.43, 0.012, depth * 0.4, 2, 0.035),
		mat(0x5a5b5f, { roughness: 0.22, metalness: 0.2, envMapIntensity: 0.3 }),
	);
	pad.position.set(0, baseH + 0.008, 0.58);
	laptop.add(pad);

	const lid = new THREE.Group();
	lid.position.set(0, baseH, -depth / 2);
	lid.rotation.x = -1.78;

	const panel = new THREE.Mesh(new RoundedBoxGeometry(width, lidH, depth, 3, 0.04), shell);
	panel.position.set(0, lidH / 2, depth / 2);
	panel.receiveShadow = true;
	panel.userData.part = 'shell';
	lid.add(panel);

	const bezel = new THREE.Mesh(
		new THREE.PlaneGeometry(width - 0.08, depth - 0.08),
		mat(0x0a0a0b, { roughness: 0.55, metalness: 0.08 }),
	);
	bezel.rotation.x = Math.PI / 2;
	bezel.position.set(0, 0.002, depth / 2);
	lid.add(bezel);

	const screenMap = screenTexture();
	const screen = new THREE.Mesh(
		new THREE.PlaneGeometry(width - 0.22, depth - 0.22),
		new THREE.MeshStandardMaterial({
			map: screenMap,
			roughness: 0.22,
			metalness: 0.05,
			emissive: new THREE.Color(PAPER),
			emissiveMap: screenMap,
			emissiveIntensity: 0.5,
			side: THREE.FrontSide,
		}),
	);
	screen.rotation.x = Math.PI / 2;
	screen.position.set(0, -0.002, depth / 2);
	lid.add(screen);

	const logo = makeFruitLogo(0.62);
	logo.rotation.set(-Math.PI / 2, 0, Math.PI);
	logo.position.set(0, lidH + 0.02, depth / 2);
	logo.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.castShadow = false;
		}
	});
	lid.add(logo);

	const chin = makeFruitLogo(0.13);
	chin.rotation.set(Math.PI / 2, 0, Math.PI);
	chin.position.set(0, -0.008, 0.2);
	chin.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.castShadow = false;
		}
	});
	lid.add(chin);
	laptop.add(lid);

	return laptop;
}

function makePen(): THREE.Group {
	const pen = new THREE.Group();
	const s = 1.55;
	const hexR = 0.07 * s;
	const capR = 0.078 * s;
	const blue = mat(BIC_BLUE, { roughness: 0.38, metalness: 0.04, envMapIntensity: 0.25 });
	const ink = mat(BIC_INK, { roughness: 0.48, metalness: 0.02, envMapIntensity: 0.15 });
	const plug = mat(0xece6d8, { roughness: 0.62, metalness: 0, envMapIntensity: 0.15 });
	const barrel = new THREE.MeshStandardMaterial({
		color: 0x7aa7c2,
		roughness: 0.16,
		metalness: 0.04,
		transparent: true,
		opacity: 0.42,
		envMapIntensity: 0.28,
	});

	function part(mesh: THREE.Mesh, y: number, x = 0): void {
		mesh.position.set(x, y, 0);
		mesh.castShadow = true;
		pen.add(mesh);
	}

	part(new THREE.Mesh(new THREE.CylinderGeometry(capR * 0.98, capR, 0.5 * s, 24), blue), -0.52 * s);
	part(new THREE.Mesh(new THREE.SphereGeometry(capR * 0.98, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), blue), -0.77 * s);
	part(new THREE.Mesh(new RoundedBoxGeometry(0.02 * s, 0.32 * s, 0.045 * s, 2, 0.004 * s), blue), -0.5 * s, capR + 0.01 * s);
	part(new THREE.Mesh(hexGeometry(hexR, 0.78 * s), barrel), 0.14 * s);
	part(new THREE.Mesh(new THREE.CylinderGeometry(0.038 * s, 0.038 * s, 0.7 * s, 14), ink), 0.1 * s);
	part(new THREE.Mesh(new THREE.CylinderGeometry(hexR * 0.9, hexR * 0.9, 0.08 * s, 16), plug), 0.57 * s);

	pen.rotation.set(0, 0.55, Math.PI / 2.08);
	return pen;
}

function makeCup(): THREE.Group {
	const cup = new THREE.Group();
	cup.scale.setScalar(1.18);
	const ceramic = mat(0xb7ad9a, { roughness: 0.5, metalness: 0.02, envMapIntensity: 0.22 });
	const profile = [
		new THREE.Vector2(0.02, 0.0),
		new THREE.Vector2(0.28, 0.0),
		new THREE.Vector2(0.3, 0.045),
		new THREE.Vector2(0.29, 0.1),
		new THREE.Vector2(0.36, 0.38),
		new THREE.Vector2(0.4, 0.62),
		new THREE.Vector2(0.42, 0.7),
		new THREE.Vector2(0.4, 0.74),
		new THREE.Vector2(0.34, 0.74),
		new THREE.Vector2(0.325, 0.7),
		new THREE.Vector2(0.3, 0.14),
		new THREE.Vector2(0.05, 0.1),
		new THREE.Vector2(0.001, 0.1),
	];
	const body = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), ceramic);
	body.castShadow = true;
	cup.add(body);

	const coffee = new THREE.Mesh(
		new THREE.CylinderGeometry(0.32, 0.3, 0.06, 32),
		mat(0x120c08, { roughness: 0.28, metalness: 0.04, envMapIntensity: 0.2 }),
	);
	coffee.position.y = 0.6;
	const meniscus = new THREE.Mesh(
		new THREE.CircleGeometry(0.318, 32),
		mat(0x0a0705, { roughness: 0.1, metalness: 0.12, envMapIntensity: 0.35 }),
	);
	meniscus.rotation.x = -Math.PI / 2;
	meniscus.position.y = 0.632;
	cup.add(coffee, meniscus);

	const handleCurve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0.4, 0.26, 0),
		new THREE.Vector3(0.62, 0.3, 0),
		new THREE.Vector3(0.68, 0.46, 0),
		new THREE.Vector3(0.58, 0.64, 0),
		new THREE.Vector3(0.4, 0.66, 0),
	]);
	const handle = new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 28, 0.038, 12, false), ceramic);
	handle.castShadow = true;
	cup.add(handle);
	return cup;
}

function makePaper(): THREE.Mesh {
	const paper = new THREE.Mesh(
		new THREE.BoxGeometry(1.55, 0.014, 2.05),
		new THREE.MeshStandardMaterial({
			map: paperTexture(),
			roughness: 0.92,
			metalness: 0,
		}),
	);
	paper.receiveShadow = true;
	paper.castShadow = true;
	return paper;
}

function makeLeaf(width: number, height: number, color: number): THREE.Mesh {
	const shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.bezierCurveTo(width * 0.62, height * 0.1, width * 0.7, height * 0.42, width * 0.18, height * 0.88);
	shape.quadraticCurveTo(0, height * 1.04, -width * 0.18, height * 0.88);
	shape.bezierCurveTo(-width * 0.7, height * 0.42, -width * 0.62, height * 0.1, 0, 0);
	const geometry = new THREE.ExtrudeGeometry(shape, {
		depth: 0.018,
		bevelEnabled: true,
		bevelThickness: 0.006,
		bevelSize: 0.005,
		bevelSegments: 1,
	});
	geometry.center();
	const leaf = new THREE.Mesh(geometry, mat(color, {
		roughness: 0.58,
		metalness: 0.03,
		envMapIntensity: 0.22,
	}));
	leaf.castShadow = true;
	return leaf;
}

function makePlant(): THREE.Group {
	const plant = new THREE.Group();
	const clay = mat(0x8d735c, { roughness: 0.68, metalness: 0.03, envMapIntensity: 0.18 });
	const profile = [
		new THREE.Vector2(0.18, 0.0),
		new THREE.Vector2(0.28, 0.0),
		new THREE.Vector2(0.3, 0.05),
		new THREE.Vector2(0.34, 0.42),
		new THREE.Vector2(0.4, 0.58),
		new THREE.Vector2(0.36, 0.62),
		new THREE.Vector2(0.24, 0.62),
	];
	const pot = new THREE.Mesh(new THREE.LatheGeometry(profile, 36), clay);
	pot.castShadow = true;
	pot.receiveShadow = true;
	plant.add(pot);

	const soil = new THREE.Mesh(
		new THREE.CylinderGeometry(0.32, 0.32, 0.05, 24),
		mat(0x3a3228, { roughness: 0.92, metalness: 0, envMapIntensity: 0.1 }),
	);
	soil.position.y = 0.6;
	plant.add(soil);

	const stem = mat(0x4a5c42, { roughness: 0.72, metalness: 0.02, envMapIntensity: 0.12 });
	const leaves = [
		{ color: 0x3d6b4f, w: 0.48, h: 0.82, pos: [0.12, 1.55, 0.04], rot: [-0.35, 0.35, 0.28], stemH: 0.95 },
		{ color: 0x2c513b, w: 0.42, h: 0.72, pos: [-0.22, 1.42, 0.16], rot: [-0.45, -0.65, -0.22], stemH: 0.82 },
		{ color: 0x4f7d58, w: 0.52, h: 0.9, pos: [0.04, 2.05, -0.18], rot: [0.2, 0.12, -0.12], stemH: 1.4 },
		{ color: 0x3d6b4f, w: 0.38, h: 0.66, pos: [0.28, 1.32, -0.1], rot: [-0.18, 1.05, 0.4], stemH: 0.7 },
		{ color: 0x5a8a64, w: 0.4, h: 0.7, pos: [-0.26, 1.62, -0.14], rot: [0.12, -0.85, -0.35], stemH: 1.0 },
		{ color: 0x2c513b, w: 0.34, h: 0.58, pos: [0.2, 1.18, 0.22], rot: [-0.62, 0.5, 0.18], stemH: 0.55 },
		{ color: 0x4f7d58, w: 0.36, h: 0.62, pos: [-0.08, 1.22, 0.26], rot: [-0.75, -0.18, 0.08], stemH: 0.58 },
		{ color: 0x3d6b4f, w: 0.32, h: 0.54, pos: [0.24, 1.68, 0.14], rot: [0.28, 0.75, 0.16], stemH: 1.05 },
		{ color: 0x2c513b, w: 0.3, h: 0.5, pos: [-0.3, 1.2, 0.02], rot: [-0.3, -1.2, -0.2], stemH: 0.58 },
	] as const;

	for (const spec of leaves) {
		const shoot = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, spec.stemH, 8), stem);
		shoot.position.set(spec.pos[0] * 0.28, 0.62 + spec.stemH / 2, spec.pos[2] * 0.28);
		shoot.castShadow = true;
		plant.add(shoot);

		const leaf = makeLeaf(spec.w, spec.h, spec.color);
		leaf.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
		leaf.rotation.set(spec.rot[0], spec.rot[1], spec.rot[2]);
		plant.add(leaf);
	}

	return plant;
}

function makeTable(width: number, depth: number): THREE.Group {
	const table = new THREE.Group();
	const thickness = 0.16;
	const legH = 0.62;
	const topMaps = woodMaps(1024, 512, 'boards');
	const edgeMaps = woodMaps(1024, 128, 'edge');
	const endMaps = woodMaps(512, 256, 'end');
	const topMat = woodMaterial(topMaps, { roughness: 0.52, envMapIntensity: 0.26, bumpScale: 0.032 });
	const edgeMat = woodMaterial(edgeMaps, { roughness: 0.64, bumpScale: 0.02 });
	const endMat = woodMaterial(endMaps, { roughness: 0.7, bumpScale: 0.018 });
	const bottomMat = woodMaterial(edgeMaps, { roughness: 0.86, bumpScale: 0.01, envMapIntensity: 0.08 });
	const top = new THREE.Mesh(new THREE.BoxGeometry(width, thickness, depth), [
		endMat,
		endMat,
		topMat,
		bottomMat,
		edgeMat,
		edgeMat,
	]);
	top.position.y = -thickness / 2;
	top.castShadow = true;
	top.receiveShadow = true;
	top.userData.part = 'wood';
	table.add(top);

	const apronH = 0.11;
	const apronT = 0.07;
	const apronY = -thickness - apronH / 2;
	const apronMat = woodMaterial(edgeMaps, { roughness: 0.7, bumpScale: 0.016, color: 0xe8d3b0 });
	const front = new THREE.Mesh(new THREE.BoxGeometry(width - 0.18, apronH, apronT), apronMat);
	front.position.set(0, apronY, depth / 2 - apronT / 2 - 0.02);
	const back = front.clone();
	back.position.z = -front.position.z;
	const sideGeo = new THREE.BoxGeometry(apronT, apronH, depth - 0.18);
	const left = new THREE.Mesh(sideGeo, apronMat);
	left.position.set(-width / 2 + apronT / 2 + 0.02, apronY, 0);
	const right = left.clone();
	right.position.x = -left.position.x;

	for (const apron of [front, back, left, right]) {
		apron.castShadow = true;
		apron.receiveShadow = true;
		apron.userData.part = 'wood';
		table.add(apron);
	}

	const legW = 0.15;
	const inset = 0.2;
	const legMaps = woodMaps(256, 512, 'edge');
	const legMat = woodMaterial(legMaps, { roughness: 0.72, bumpScale: 0.02, color: 0xe4cc9f });
	const corners = [
		[width / 2 - inset, depth / 2 - inset],
		[-width / 2 + inset, depth / 2 - inset],
		[width / 2 - inset, -depth / 2 + inset],
		[-width / 2 + inset, -depth / 2 + inset],
	] as const;

	for (const [x, z] of corners) {
		const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), legMat);
		leg.position.set(x, -thickness - apronH * 0.15 - legH / 2, z);
		leg.castShadow = true;
		leg.receiveShadow = true;
		leg.userData.part = 'wood';
		table.add(leg);
	}

	return table;
}

function buildStillLife(): THREE.Group {
	const still = new THREE.Group();
	const props = new THREE.Group();
	const laptop = makeLaptop();
	laptop.position.set(0, 0, 0);
	laptop.rotation.y = 0.08;

	const paper = makePaper();
	paper.position.set(2.38, 0.01, 0.14);
	paper.rotation.y = -0.16;

	const pen = makePen();
	pen.position.set(2.32, 0.09, 0.08);

	const cup = makeCup();
	cup.position.set(-2.18, 0, 0.4);
	cup.rotation.y = 0.5;

	const plant = makePlant();
	plant.position.set(-3.05, 0, -0.78);
	plant.rotation.y = 0.3;
	plant.scale.setScalar(1.28);

	props.add(laptop, paper, pen, cup, plant);

	const bounds = new THREE.Box3().setFromObject(props);
	const size = bounds.getSize(new THREE.Vector3());
	const center = bounds.getCenter(new THREE.Vector3());
	const table = makeTable(size.x + 1.85, size.z + 1.7);
	table.position.set(center.x, bounds.min.y, center.z + 0.18);
	props.position.y = 0.008;

	still.add(table, props);
	const full = new THREE.Box3().setFromObject(still);
	const fullCenter = full.getCenter(new THREE.Vector3());
	still.position.set(-fullCenter.x, -full.min.y, -fullCenter.z);
	return still;
}

function isDarkTheme(): boolean {
	return document.documentElement.dataset.theme === 'dark';
}

export function mountDeskStill(canvas: HTMLCanvasElement): () => void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let renderer: THREE.WebGLRenderer;

	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'low-power',
		});
	} catch {
		return () => undefined;
	}

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(0x000000, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.88;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
	camera.position.set(0.12, 3.35, 8.2);

	const pmrem = new THREE.PMREMGenerator(renderer);
	scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.08).texture;
	scene.environmentIntensity = 0.42;

	const hemi = new THREE.HemisphereLight(PAPER, MUTED, 0.9);
	scene.add(hemi);

	const key = new THREE.DirectionalLight(0xfff6ea, 1.05);
	key.position.set(1.1, 10.8, 3.6);
	key.castShadow = true;
	key.shadow.mapSize.set(2048, 2048);
	key.shadow.bias = -0.00012;
	key.shadow.normalBias = 0.05;
	key.shadow.radius = 3;
	key.shadow.camera.near = 2;
	key.shadow.camera.far = 28;
	key.shadow.camera.left = -7;
	key.shadow.camera.right = 7;
	key.shadow.camera.top = 7;
	key.shadow.camera.bottom = -7;
	key.shadow.camera.updateProjectionMatrix();
	scene.add(key);

	const fill = new THREE.DirectionalLight(ACCENT, 0.22);
	fill.position.set(-3.4, 2.2, 1.6);
	scene.add(fill);

	const rim = new THREE.DirectionalLight(0xe8efe4, 0.55);
	rim.position.set(-1.4, 4.2, -5.8);
	scene.add(rim);

	const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.ShadowMaterial({ opacity: 0.16 }));
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	const still = buildStillLife();
	scene.add(still);
	key.target = still;

	const controls = new OrbitControls(camera, canvas);
	controls.enablePan = false;
	controls.enableZoom = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.autoRotate = !reducedMotion;
	controls.autoRotateSpeed = 0.55;
	controls.minPolarAngle = 0.92;
	controls.maxPolarAngle = 1.32;
	controls.target.set(0, 1.42, 0.08);
	controls.update();

	function syncLights(): void {
		const dark = isDarkTheme();
		hemi.intensity = dark ? 0.78 : 0.86;
		key.intensity = dark ? 1.02 : 0.96;
		fill.intensity = dark ? 0.42 : 0.22;
		rim.intensity = dark ? 0.55 : 0.38;
		floor.material.opacity = dark ? 0.36 : 0.16;
		scene.environmentIntensity = dark ? 0.38 : 0.48;
		still.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) {
				return;
			}

			const materials = Array.isArray(child.material) ? child.material : [child.material];

			for (const material of materials) {
				if (!(material instanceof THREE.MeshStandardMaterial)) {
					continue;
				}

				if (child.userData.part === 'shell') {
					material.color.set(dark ? SHELL_DARK : SHELL);
				}

				if (child.userData.part === 'logo') {
					material.color.set(dark ? LOGO_DARK : LOGO);
				}

				if (child.userData.part === 'wood') {
					const base = material.userData.baseColor ?? 0xffffff;
					material.color.setHex(base);

					if (dark) {
						material.color.multiplyScalar(0.58);
					}
				}
			}
		});
	}

	syncLights();
	const themeObserver = new MutationObserver(syncLights);
	themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	let width = 0;
	let height = 0;
	let frame = 0;
	let visible = true;

	function resize(): void {
		const nextWidth = Math.max(1, canvas.clientWidth);
		const nextHeight = Math.max(1, canvas.clientHeight);

		if (nextWidth === width && nextHeight === height) {
			return;
		}

		width = nextWidth;
		height = nextHeight;
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		const distance = camera.aspect < 1.45 ? 9.4 : 8.2;
		const offset = camera.position.clone().sub(controls.target).normalize().multiplyScalar(distance);
		camera.position.copy(controls.target).add(offset);
		camera.updateProjectionMatrix();
	}

	function render(): void {
		frame = requestAnimationFrame(render);

		if (!visible) {
			return;
		}

		resize();
		controls.update();
		renderer.render(scene, camera);
	}

	function onPointerDown(): void {
		controls.autoRotate = false;
		canvas.style.cursor = 'grabbing';
	}

	function onPointerUp(): void {
		canvas.style.cursor = 'grab';
	}

	function onKeyDown(event: KeyboardEvent): void {
		const step = 0.1;

		if (event.key === 'ArrowLeft') {
			controls.autoRotate = false;
			still.rotation.y += step;
			event.preventDefault();
		}

		if (event.key === 'ArrowRight') {
			controls.autoRotate = false;
			still.rotation.y -= step;
			event.preventDefault();
		}
	}

	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointerup', onPointerUp);
	canvas.addEventListener('keydown', onKeyDown);

	const visibility = new IntersectionObserver((entries) => {
		visible = entries.some((entry) => entry.isIntersecting);
	}, { threshold: 0.05 });
	visibility.observe(canvas);

	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	render();

	return () => {
		cancelAnimationFrame(frame);
		visibility.disconnect();
		resizeObserver.disconnect();
		themeObserver.disconnect();
		controls.dispose();
		pmrem.dispose();
		renderer.dispose();
		canvas.removeEventListener('pointerdown', onPointerDown);
		canvas.removeEventListener('pointerup', onPointerUp);
		canvas.removeEventListener('keydown', onKeyDown);
	};
}
