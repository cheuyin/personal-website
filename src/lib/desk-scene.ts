import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const PAPER = 0xf1f0e8;
const MUTED = 0x5c6358;
const ACCENT = 0x3d6b4f;
const SHELL = 0xb9bec5;
const SHELL_DARK = 0xa8adb5;
const LOGO = 0x8f949b;
const LOGO_DARK = 0x6f747b;
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
	const light = [216, 182, 140];
	const mid = [184, 146, 106];
	const dark = [138, 102, 70];
	const plankCount = kind === 'edge' ? 1 : 5;
	const plankDetails = Array.from({ length: plankCount }, (_, plank) => {
		const seed = hash2(plank + 1, 3.7);
		return {
			seed,
			knotX: 0.22 + seed * 0.58,
			knotY: 0.22 + hash2(plank + 4, 8.1) * 0.56,
		};
	});

	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			const nx = x / width;
			const ny = y / height;
			const plank = Math.min(plankCount - 1, Math.floor(ny * plankCount));
			const plankY = (ny * plankCount) % 1;
			const { seed, knotX, knotY } = plankDetails[plank];
			const warp = Math.sin(ny * 8 + seed * 5) * 6.2 + Math.sin(ny * 23 + seed * 2) * 1.6;
			let grain: number;

			if (kind === 'end') {
				const cx = ((plank + 0.5) / plankCount - ny) * 2.2;
				const cy = (nx - 0.5) * 1.8;
				const ring = Math.sqrt(cx * cx + cy * cy) * 14 + Math.sin(nx * 16 + seed) * 0.4;
				grain = Math.sin(ring) * 0.12;
			} else {
				const along = x + warp + seed * 28;
				grain =
					Math.sin(along * 0.055) * 0.07 +
					Math.sin(along * 0.19 + seed * 4) * 0.032 +
					Math.sin(along * 0.58 + seed * 7) * 0.012;
			}

			const knotDx = (nx - knotX) * 4.2;
			const knotDy = (plankY - knotY) * 9;
			const knotDistanceSquared = knotDx * knotDx + knotDy * knotDy;
			let knot = 0;

			if (kind === 'boards' && knotDistanceSquared < 0.64) {
				const knotDistance = Math.sqrt(knotDistanceSquared);
				knot = (1 - knotDistance / 0.8) * Math.sin(knotDistance * 13) * 0.065;
			}

			grain += knot;
			const noise = (hash2(x * 0.51, y * 0.47) - 0.5) * 0.03;
			const seamDist = Math.min(plankY, 1 - plankY);
			const seam = kind === 'boards' ? Math.max(0, 0.034 - seamDist) * 3.6 : 0;
			const streak = Math.pow(Math.max(0, Math.sin(ny * 18 + seed * 8) * Math.sin(nx * 2.4 + seed * 3)), 12) * 0.1;
			const boardShift = (seed - 0.5) * 0.08;
			const t = Math.min(1, Math.max(0, 0.56 + grain + boardShift + noise - seam - streak));
			const rgb = t < 0.5 ? mixColor(dark, mid, t * 2) : mixColor(mid, light, (t - 0.5) * 2);
			const i = (y * width + x) * 4;
			colorData.data[i] = rgb[0];
			colorData.data[i + 1] = rgb[1];
			colorData.data[i + 2] = rgb[2];
			colorData.data[i + 3] = 255;
			const bumpV = Math.min(255, Math.max(0, 128 + grain * 130 - seam * 70 - streak * 80 + noise * 50));
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
		bumpScale: 0.014,
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

function appleBodyShape(): THREE.Shape {
	const shape = new THREE.Shape();
	// Center top cleft
	shape.moveTo(0, 0.334);
	// Top right curve over crest
	shape.bezierCurveTo(0.106, 0.405, 0.283, 0.387, 0.413, 0.29);
	// Right shoulder down to top of bite
	shape.bezierCurveTo(0.531, 0.202, 0.578, 0.079, 0.555, 0.026);
	// Inward circular bite
	shape.bezierCurveTo(0.448, -0.026, 0.342, -0.132, 0.413, -0.255);
	shape.bezierCurveTo(0.472, -0.308, 0.543, -0.326, 0.543, -0.343);
	// Right bottom lobe
	shape.bezierCurveTo(0.543, -0.475, 0.448, -0.598, 0.271, -0.634);
	// Bottom indentation
	shape.bezierCurveTo(0.142, -0.66, 0.071, -0.598, 0, -0.563);
	shape.bezierCurveTo(-0.071, -0.598, -0.142, -0.66, -0.271, -0.634);
	// Left bottom lobe and full left flank
	shape.bezierCurveTo(-0.448, -0.598, -0.566, -0.458, -0.566, -0.158);
	shape.bezierCurveTo(-0.566, 0.088, -0.519, 0.202, -0.413, 0.29);
	// Top left crest returning to center cleft
	shape.bezierCurveTo(-0.283, 0.387, -0.106, 0.405, 0, 0.334);
	return shape;
}

function appleStemShape(): THREE.Shape {
	const shape = new THREE.Shape();
	shape.moveTo(0.025, 0.38);
	shape.bezierCurveTo(0.085, 0.53, 0.24, 0.65, 0.38, 0.67);
	shape.bezierCurveTo(0.33, 0.50, 0.17, 0.40, 0.025, 0.38);
	return shape;
}

function makeAppleLogo(scale = 0.58): THREE.Group {
	const logo = new THREE.Group();
	const settings: THREE.ExtrudeGeometryOptions = {
		depth: 0.02,
		bevelEnabled: true,
		bevelThickness: 0.003,
		bevelSize: 0.002,
		bevelSegments: 3,
		curveSegments: 24,
	};
	const material = mat(LOGO, { roughness: 0.24, metalness: 0.72, envMapIntensity: 0.8 });
	const mesh = (shape: THREE.Shape) => {
		const part = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, settings), material);
		part.castShadow = true;
		part.userData.part = 'logo';
		logo.add(part);
	};

	mesh(appleBodyShape());
	mesh(appleStemShape());
	logo.scale.setScalar(scale);
	return logo;
}

function makeLaptop(): THREE.Group {
	const width = 3.26;
	const depth = 2.24;
	const baseH = 0.11;
	const lidH = 0.05;
	const laptop = new THREE.Group();
	const shell = mat(SHELL, { roughness: 0.28, metalness: 0.72, envMapIntensity: 0.52 });

	const base = new THREE.Mesh(new RoundedBoxGeometry(width, baseH, depth, 3, 0.04), shell);
	base.position.y = baseH / 2;
	base.castShadow = true;
	base.userData.part = 'shell';
	laptop.add(base);

	// Hinge clutch barrel bridging base and lid
	const hingeRadius = 0.038;
	const hingeLength = width * 0.78;
	const hinge = new THREE.Mesh(
		new THREE.CylinderGeometry(hingeRadius, hingeRadius, hingeLength, 20),
		mat(0x181a1c, { roughness: 0.55, metalness: 0.25 }),
	);
	hinge.rotation.z = Math.PI / 2;
	hinge.position.set(0, baseH * 0.88, -depth / 2 + 0.035);
	hinge.castShadow = true;
	hinge.receiveShadow = true;
	laptop.add(hinge);

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
		mat(0x7f858d, { roughness: 0.24, metalness: 0.46, envMapIntensity: 0.4 }),
	);
	pad.position.set(0, baseH + 0.008, 0.58);
	laptop.add(pad);

	const lid = new THREE.Group();
	lid.position.set(0, baseH * 0.88, -depth / 2 + 0.035);
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
	screen.userData.part = 'screen';
	lid.add(screen);

	const cursor = new THREE.Mesh(
		new THREE.PlaneGeometry(0.025, 0.11),
		new THREE.MeshBasicMaterial({
			color: 0xa7d5b0,
			transparent: true,
			opacity: 0.76,
			toneMapped: false,
		}),
	);
	cursor.rotation.x = Math.PI / 2;
	cursor.position.set(-0.83, -0.006, depth * 0.19);
	cursor.userData.part = 'screen-cursor';
	lid.add(cursor);

	const logo = makeAppleLogo(0.34);
	logo.rotation.set(-Math.PI / 2, 0, Math.PI);
	logo.position.set(0, lidH + 0.02, depth / 2);
	logo.traverse((child) => {
		if (child instanceof THREE.Mesh) {
			child.castShadow = false;
		}
	});
	lid.add(logo);

	const chin = makeAppleLogo(0.08);
	chin.rotation.set(Math.PI / 2, 0, 0);
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

function steamTexture(): THREE.CanvasTexture {
	return canvasTexture(64, 160, (ctx) => {
		const gradient = ctx.createRadialGradient(32, 78, 4, 32, 72, 38);
		gradient.addColorStop(0, 'rgba(248, 248, 244, 0.85)');
		gradient.addColorStop(0.35, 'rgba(236, 240, 232, 0.32)');
		gradient.addColorStop(1, 'rgba(236, 240, 232, 0)');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 64, 160);
	});
}

function makeCup(): THREE.Group {
	const cup = new THREE.Group();
	cup.userData.easterEgg = '/grounds';
	cup.scale.setScalar(1.18);
	const ceramic = new THREE.MeshPhysicalMaterial({
		color: 0xb7ad9a,
		roughness: 0.38,
		metalness: 0,
		clearcoat: 0.18,
		clearcoatRoughness: 0.42,
		envMapIntensity: 0.34,
	});
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

	const steamMap = steamTexture();
	const puffs = [
		{ x: -0.08, z: 0.04, phase: 0, width: 0.48, height: 0.78 },
		{ x: 0.06, z: -0.03, phase: 0.34, width: 0.56, height: 0.92 },
		{ x: 0.16, z: 0.03, phase: 0.68, width: 0.44, height: 0.7 },
	];

	for (const puff of puffs) {
		const strand = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: steamMap,
				transparent: true,
				opacity: 0,
				depthWrite: false,
				toneMapped: false,
			}),
		);
		strand.center.set(0.5, 0);
		strand.scale.set(puff.width, puff.height, 1);
		strand.position.set(puff.x, 0.74, puff.z);
		strand.userData.part = 'steam';
		strand.userData.phase = puff.phase;
		strand.userData.baseX = puff.x;
		strand.userData.baseZ = puff.z;
		strand.userData.baseWidth = puff.width;
		strand.userData.baseHeight = puff.height;
		cup.add(strand);
	}

	const hit = new THREE.Mesh(
		new THREE.CylinderGeometry(0.62, 0.55, 0.95, 16),
		new THREE.MeshBasicMaterial({ visible: false }),
	);
	hit.position.set(0.12, 0.42, 0);
	cup.add(hit);
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
		roughness: 0.48 + (color % 7) * 0.025,
		metalness: 0.03,
		envMapIntensity: 0.28,
	}));
	leaf.castShadow = true;
	leaf.userData.part = 'leaf';

	const vein = new THREE.Mesh(
		new THREE.CylinderGeometry(0.007, 0.012, height * 0.7, 5),
		mat(0x274733, { roughness: 0.72, metalness: 0, envMapIntensity: 0.08 }),
	);
	vein.position.set(0, -height * 0.04, 0.016);
	vein.castShadow = false;
	leaf.add(vein);
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
		leaf.userData.baseRotation = leaf.rotation.clone();
		leaf.userData.phase = plant.children.length * 0.71;
		plant.add(leaf);
	}

	return plant;
}

function makeTable(width: number, depth: number, lowPower = false): THREE.Group {
	const table = new THREE.Group();
	const thickness = 0.11;
	const legH = 0.58;
	const mapScale = lowPower ? 0.5 : 1;
	const topMaps = woodMaps(512 * mapScale, 256 * mapScale, 'boards');
	const edgeMaps = woodMaps(512 * mapScale, 64 * mapScale, 'edge');
	const endMaps = woodMaps(256 * mapScale, 128 * mapScale, 'end');
	const topMat = woodMaterial(topMaps, { roughness: 0.5, envMapIntensity: 0.24, bumpScale: 0.02 });
	const edgeMat = woodMaterial(edgeMaps, { roughness: 0.64, bumpScale: 0.01 });
	const endMat = woodMaterial(endMaps, { roughness: 0.7, bumpScale: 0.01 });
	const bottomMat = woodMaterial(edgeMaps, { roughness: 0.86, bumpScale: 0.006, envMapIntensity: 0.08 });
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

	const apronH = 0.075;
	const apronT = 0.06;
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

	const legW = 0.12;
	const inset = 0.17;
	const legMat = woodMaterial(edgeMaps, { roughness: 0.72, bumpScale: 0.02, color: 0xe4cc9f });
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

function buildStillLife(lowPower = false): THREE.Group {
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
	plant.position.set(-2.86, 0, -0.62);
	plant.rotation.y = 0.3;
	plant.scale.setScalar(1.16);

	props.add(laptop, paper, pen, cup, plant);

	const bounds = new THREE.Box3().setFromObject(props);
	const size = bounds.getSize(new THREE.Vector3());
	const center = bounds.getCenter(new THREE.Vector3());
	const table = makeTable(size.x + 1.5, size.z + 1.35, lowPower);
	table.position.set(center.x, bounds.min.y, center.z + 0.18);
	props.position.y = 0.008;

	still.add(table, props);
	const full = new THREE.Box3().setFromObject(still);
	const fullCenter = full.getCenter(new THREE.Vector3());
	still.position.set(-fullCenter.x, -full.min.y, -fullCenter.z);
	return still;
}

const EASTER_EGG_CLICK_PX = 10;

function easterEggRootFrom(object: THREE.Object3D): THREE.Object3D | undefined {
	let current: THREE.Object3D | null = object;

	while (current) {
		if (typeof current.userData.easterEgg === 'string') {
			return current;
		}

		current = current.parent;
	}
}

function isDarkTheme(): boolean {
	return document.documentElement.dataset.theme === 'dark';
}

export function mountDeskStill(canvas: HTMLCanvasElement, onReady?: () => void): () => void {
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const device = navigator as Navigator & { deviceMemory?: number };
	const lowPower =
		canvas.clientWidth < 520 ||
		(typeof device.deviceMemory === 'number' && device.deviceMemory <= 4) ||
		(typeof device.hardwareConcurrency === 'number' && device.hardwareConcurrency <= 4);
	const pixelRatioCap = lowPower ? 1.25 : 1.75;
	const shadowSize = lowPower ? 1024 : 2048;
	let renderer: THREE.WebGLRenderer;

	try {
		renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'low-power',
		});
	} catch {
		throw new Error('WebGL renderer could not be created.');
	}

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
	renderer.setClearColor(0x000000, 0);
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.92;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
	camera.position.set(0.12, 3.45, 8.45);

	const pmrem = new THREE.PMREMGenerator(renderer);
	const environment = pmrem.fromScene(new RoomEnvironment(), 0.08);
	scene.environment = environment.texture;
	scene.environmentIntensity = 0.46;

	const hemi = new THREE.HemisphereLight(PAPER, MUTED, 0.7);
	scene.add(hemi);

	const key = new THREE.DirectionalLight(0xfff3df, 1.16);
	key.position.set(1.1, 10.8, 3.6);
	key.castShadow = true;
	key.shadow.mapSize.set(shadowSize, shadowSize);
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

	const fill = new THREE.DirectionalLight(ACCENT, 0.16);
	fill.position.set(-3.4, 2.2, 1.6);
	scene.add(fill);

	const rim = new THREE.DirectionalLight(0xe8efe4, 0.44);
	rim.position.set(-1.4, 4.2, -5.8);
	scene.add(rim);

	const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.ShadowMaterial({ opacity: 0.14 }));
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	const still = buildStillLife(lowPower);
	scene.add(still);
	key.target = still;

	const raycaster = new THREE.Raycaster();
	const pointerNdc = new THREE.Vector2();
	let pointerStart: { x: number; y: number } | null = null;
	let hoveredEgg: THREE.Object3D | undefined;
	let idleMotion = !reducedMotion;

	const controls = new OrbitControls(camera, canvas);
	controls.enablePan = false;
	controls.enableZoom = false;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.autoRotate = false;
	controls.minPolarAngle = 0.96;
	controls.maxPolarAngle = 1.28;
	controls.minAzimuthAngle = -0.42;
	controls.maxAzimuthAngle = 0.42;
	controls.target.set(0, 1.54, 0.08);
	controls.update();

	const leaves: THREE.Mesh[] = [];
	const steam: THREE.Sprite[] = [];
	const screenCursors: THREE.Mesh[] = [];
	still.traverse((child) => {
		if (child instanceof THREE.Sprite && child.userData.part === 'steam') {
			steam.push(child);
			return;
		}

		if (!(child instanceof THREE.Mesh)) {
			return;
		}

		if (child.userData.part === 'leaf') {
			leaves.push(child);
		}

		if (child.userData.part === 'screen-cursor') {
			screenCursors.push(child);
		}
	});

	let darkTheme = isDarkTheme();

	function syncLights(): void {
		darkTheme = isDarkTheme();
		hemi.intensity = darkTheme ? 0.62 : 0.7;
		key.intensity = darkTheme ? 1.24 : 1.16;
		fill.intensity = darkTheme ? 0.36 : 0.16;
		rim.intensity = darkTheme ? 0.72 : 0.44;
		floor.material.opacity = darkTheme ? 0.28 : 0.14;
		scene.environmentIntensity = darkTheme ? 0.48 : 0.46;
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
					material.color.set(darkTheme ? SHELL_DARK : SHELL);
				}

				if (child.userData.part === 'logo') {
					material.color.set(darkTheme ? LOGO_DARK : LOGO);
				}

				if (child.userData.part === 'screen') {
					material.color.setHex(darkTheme ? 0x777d77 : 0xffffff);
					material.roughness = darkTheme ? 0.38 : 0.22;
					material.envMapIntensity = darkTheme ? 0.08 : 0.2;
					material.emissiveIntensity = darkTheme ? 0.34 : 0.5;
				}

				if (child.userData.part === 'wood') {
					const base = material.userData.baseColor ?? 0xffffff;
					material.color.setHex(base);

					if (darkTheme) {
						material.color.multiplyScalar(0.68);
					}
				}
			}
		});

		requestRender();
	}

	let width = 0;
	let height = 0;
	let frame = 0;
	let visible = true;
	let hasRenderedFirstFrame = false;
	let lastRenderTime = 0;
	const minimumFrameInterval = lowPower ? 1000 / 30 : 0;

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
		const distance = camera.aspect < 1.45 ? 9.25 : 8.45;
		const offset = camera.position.clone().sub(controls.target).normalize().multiplyScalar(distance);
		camera.position.copy(controls.target).add(offset);
		camera.updateProjectionMatrix();
	}

	function animate(time: number): void {
		if (reducedMotion) {
			return;
		}

		const elapsed = time / 1000;

		if (idleMotion) {
			still.rotation.y = Math.sin(elapsed * 0.32) * 0.22;
		}

		for (const leaf of leaves) {
			const base = leaf.userData.baseRotation as THREE.Euler | undefined;
			const phase = Number(leaf.userData.phase ?? 0);

			if (base) {
				leaf.rotation.x = base.x + Math.sin(elapsed * 0.7 + phase) * 0.012;
				leaf.rotation.z = base.z + Math.sin(elapsed * 0.82 + phase) * 0.022;
			}
		}

		for (const strand of steam) {
			const phase = Number(strand.userData.phase ?? 0);
			const cycle = (elapsed * 0.16 + phase) % 1;
			const fade = Math.pow(Math.sin(cycle * Math.PI), 1.35);
			const width = Number(strand.userData.baseWidth ?? 0.26);
			const height = Number(strand.userData.baseHeight ?? 0.42);
			strand.position.y = 0.74 + cycle * 0.34;
			strand.position.x = Number(strand.userData.baseX ?? 0) + Math.sin(elapsed * 0.55 + phase * 8) * 0.03;
			strand.position.z = Number(strand.userData.baseZ ?? 0);
			strand.scale.set(width * (1 + cycle * 0.28), height * (1 + cycle * 0.42), 1);
			strand.material.opacity = (darkTheme ? 0.55 : 0.4) * fade;
		}

		for (const cursor of screenCursors) {
			cursor.visible = Math.floor(elapsed * 1.4) % 2 === 0;
		}
	}

	function requestRender(): void {
		if (frame === 0 && visible && !document.hidden) {
			frame = requestAnimationFrame(render);
		}
	}

	function render(time: number): void {
		frame = 0;

		if (!visible || document.hidden) {
			return;
		}

		if (minimumFrameInterval > 0 && time - lastRenderTime < minimumFrameInterval) {
			requestRender();
			return;
		}

		lastRenderTime = time;
		resize();
		animate(time);
		const controlsChanged = controls.update();
		renderer.render(scene, camera);

		if (!hasRenderedFirstFrame) {
			hasRenderedFirstFrame = true;
			if (onReady) {
				onReady();
			}
		}

		if (!reducedMotion || controlsChanged) {
			requestRender();
		}
	}

	function eggAt(event: PointerEvent): THREE.Object3D | undefined {
		const rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) {
			return;
		}

		pointerNdc.set(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			-((event.clientY - rect.top) / rect.height) * 2 + 1,
		);
		raycaster.setFromCamera(pointerNdc, camera);
		const hit = raycaster.intersectObject(still, true)[0];
		return hit ? easterEggRootFrom(hit.object) : undefined;
	}

	function setEggHovered(next: THREE.Object3D | undefined): void {
		if (hoveredEgg === next) {
			return;
		}

		for (const [root, active] of [[hoveredEgg, false], [next, true]] as const) {
			root?.traverse((child) => {
				if (!(child instanceof THREE.Mesh)) {
					return;
				}

				const materials = Array.isArray(child.material) ? child.material : [child.material];

				for (const material of materials) {
					if (!(material instanceof THREE.MeshStandardMaterial)) {
						continue;
					}

					if (material.userData.hoverEmissive === undefined) {
						material.userData.hoverEmissive = material.emissive.getHex();
						material.userData.hoverEmissiveIntensity = material.emissiveIntensity;
					}

					material.emissive.setHex(active ? ACCENT : material.userData.hoverEmissive);
					material.emissiveIntensity = active ? 0.16 : material.userData.hoverEmissiveIntensity;
				}
			});
		}

		hoveredEgg = next;
		requestRender();
	}

	function onPointerMove(event: PointerEvent): void {
		if (pointerStart) {
			return;
		}

		const egg = eggAt(event);
		setEggHovered(egg);
		canvas.style.cursor = egg ? 'pointer' : 'grab';
	}

	function onPointerDown(event: PointerEvent): void {
		idleMotion = false;
		canvas.style.cursor = 'grabbing';
		pointerStart = { x: event.clientX, y: event.clientY };
		requestRender();
	}

	function onPointerUp(event: PointerEvent): void {
		if (!pointerStart) {
			return;
		}

		const dx = event.clientX - pointerStart.x;
		const dy = event.clientY - pointerStart.y;
		pointerStart = null;

		if (dx * dx + dy * dy > EASTER_EGG_CLICK_PX * EASTER_EGG_CLICK_PX) {
			setEggHovered(eggAt(event));
			canvas.style.cursor = hoveredEgg ? 'pointer' : 'grab';
			return;
		}

		const egg = eggAt(event);
		setEggHovered(egg);
		canvas.style.cursor = egg ? 'pointer' : 'grab';
		const href = egg?.userData.easterEgg;

		if (typeof href === 'string') {
			window.location.assign(href);
		}
	}

	function onPointerCancel(): void {
		pointerStart = null;
		setEggHovered(undefined);
		canvas.style.cursor = 'grab';
	}

	function onPointerLeave(): void {
		if (!pointerStart) {
			setEggHovered(undefined);
			canvas.style.cursor = 'grab';
		}
	}

	function onKeyDown(event: KeyboardEvent): void {
		const step = 0.1;

		if (event.key === 'ArrowLeft') {
			idleMotion = false;
			still.rotation.y += step;
			event.preventDefault();
			requestRender();
		}

		if (event.key === 'ArrowRight') {
			idleMotion = false;
			still.rotation.y -= step;
			event.preventDefault();
			requestRender();
		}
	}

	syncLights();
	const themeObserver = new MutationObserver(syncLights);
	themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

	controls.addEventListener('change', requestRender);
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointerup', onPointerUp);
	canvas.addEventListener('pointercancel', onPointerCancel);
	canvas.addEventListener('pointerleave', onPointerLeave);
	canvas.addEventListener('keydown', onKeyDown);

	const visibility = new IntersectionObserver((entries) => {
		visible = entries.some((entry) => entry.isIntersecting);

		if (visible) {
			requestRender();
		} else if (frame !== 0) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}, { threshold: 0.05 });
	visibility.observe(canvas);

	const resizeObserver = new ResizeObserver(() => {
		resize();
		requestRender();
	});
	resizeObserver.observe(canvas);
	const onVisibilityChange = () => requestRender();
	document.addEventListener('visibilitychange', onVisibilityChange);
	requestRender();

	return () => {
		if (frame !== 0) {
			cancelAnimationFrame(frame);
		}

		visibility.disconnect();
		resizeObserver.disconnect();
		themeObserver.disconnect();
		document.removeEventListener('visibilitychange', onVisibilityChange);
		controls.removeEventListener('change', requestRender);
		controls.dispose();
		environment.dispose();
		pmrem.dispose();

		const geometries = new Set<THREE.BufferGeometry>();
		const materials = new Set<THREE.Material>();
		const textures = new Set<THREE.Texture>();
		scene.traverse((child) => {
			if (child instanceof THREE.Sprite) {
				materials.add(child.material);

				if (child.material.map) {
					textures.add(child.material.map);
				}

				return;
			}

			if (!(child instanceof THREE.Mesh)) {
				return;
			}

			geometries.add(child.geometry);
			const childMaterials = Array.isArray(child.material) ? child.material : [child.material];

			for (const material of childMaterials) {
				materials.add(material);

				for (const value of Object.values(material)) {
					if (value instanceof THREE.Texture) {
						textures.add(value);
					}
				}
			}
		});
		textures.forEach((texture) => texture.dispose());
		materials.forEach((material) => material.dispose());
		geometries.forEach((geometry) => geometry.dispose());
		renderer.dispose();
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerdown', onPointerDown);
		canvas.removeEventListener('pointerup', onPointerUp);
		canvas.removeEventListener('pointercancel', onPointerCancel);
		canvas.removeEventListener('pointerleave', onPointerLeave);
		canvas.removeEventListener('keydown', onKeyDown);
	};
}
