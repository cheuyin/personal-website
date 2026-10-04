import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// One scene unit is 10 cm. Keeping the objects on the same scale matters more
// than adding arbitrary detail: a Jotter should never be the size of a marker.
export const TABLE_HEIGHT = 0.84;

export function noise(x: number, y: number): number {
	const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
	return n - Math.floor(n);
}

export function texture(
	width: number,
	height: number,
	draw: (ctx: CanvasRenderingContext2D) => void,
	color = true,
): THREE.CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not create the workspace textures.');
	draw(ctx);
	const map = new THREE.CanvasTexture(canvas);
	map.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
	map.anisotropy = 4;
	return map;
}

function material(color: number, options: THREE.MeshStandardMaterialParameters = {}) {
	return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0, ...options });
}

function mesh(
	parent: THREE.Object3D,
	geometry: THREE.BufferGeometry,
	mat: THREE.Material | THREE.Material[],
	position: [number, number, number] = [0, 0, 0],
) {
	const part = new THREE.Mesh(geometry, mat);
	part.position.set(...position);
	part.castShadow = true;
	part.receiveShadow = true;
	parent.add(part);
	return part;
}

function box(width: number, height: number, depth: number, radius = 0.02) {
	return new RoundedBoxGeometry(width, height, depth, 3, radius);
}

function flatMap(parent: THREE.Object3D, map: THREE.Texture, w: number, d: number, x: number, y: number, z: number) {
	const decal = mesh(parent, new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({
		map, transparent: true, depthWrite: false, toneMapped: false,
	}), [x, y, z]);
	decal.rotation.x = -Math.PI / 2;
	decal.castShadow = decal.receiveShadow = false;
	return decal;
}

function grainMap(size: number, base: [number, number, number], brushed = false) {
	return texture(size, size, (ctx) => {
		const image = ctx.createImageData(size, size);
		for (let y = 0; y < size; y++) {
			for (let x = 0; x < size; x++) {
				const variation = (noise(brushed ? 0 : x, y) - 0.5) * (brushed ? 14 : 9);
				const i = (y * size + x) * 4;
				for (let c = 0; c < 3; c++) image.data[i + c] = base[c] + variation;
				image.data[i + 3] = 255;
			}
		}
		ctx.putImageData(image, 0, 0);
	}, false);
}

type Key = { label: string; units: number };
const key = (label: string, units = 1): Key => ({ label, units });

function makeKeyboard(parent: THREE.Group) {
	const rows: Key[][] = [
		['esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', ''].map((label) => key(label)),
		['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((label) => key(label)).concat(key('delete', 1.5)),
		[key('tab', 1.5), ...'QWERTYUIOP'.split('').map((label) => key(label)), key('['), key(']'), key('\\')],
		[key('caps', 1.8), ...'ASDFGHJKL'.split('').map((label) => key(label)), key(';'), key("'"), key('return', 1.7)],
		[key('shift', 2.3), ...'ZXCVBNM'.split('').map((label) => key(label)), key(','), key('.'), key('/'), key('shift', 2.2)],
		[key('fn'), key('control'), key('option'), key('⌘', 1.3), key('', 5.4), key('⌘', 1.3), key('option'), key('◀'), key('▲\n▼'), key('▶')],
	];
	const width = 2.43;
	const depth = 1.02;
	const centerZ = -0.36;
	mesh(parent, box(width + 0.08, 0.008, depth + 0.055, 0.035), material(0x151719), [0, 0.127, centerZ]);
	const count = rows.reduce((sum, row) => sum + row.length, 0) + 1;
	const keys = new THREE.InstancedMesh(box(1, 0.08, 1, 0.07), material(0x131619, { roughness: 0.58, envMapIntensity: 0.15 }), count);
	keys.castShadow = keys.receiveShadow = true;
	const transform = new THREE.Object3D();
	const legends: { x: number; z: number; width: number; label: string }[] = [];
	let index = 0;
	for (const [r, row] of rows.entries()) {
		const gap = 0.021;
		const unit = (width - gap * (row.length - 1)) / row.reduce((sum, k) => sum + k.units, 0);
		let x = -width / 2;
		for (const k of row) {
			const w = unit * k.units;
			const z = centerZ - depth / 2 + (r + 0.5) * depth / rows.length;
			const keyDepth = depth / rows.length - 0.022;
			const arrow = r === 5 && ['◀', '▲\n▼', '▶'].includes(k.label);
			const parts = k.label === '▲\n▼' ? ['▲', '▼'] : [k.label];
			for (const legend of parts) {
				const keyZ = z + (arrow ? (legend === '▲' ? -1 : 1) * keyDepth / 4 : 0);
				transform.position.set(x + w / 2, 0.137, keyZ);
				transform.scale.set(w, 0.12, arrow ? keyDepth / 2 - 0.006 : keyDepth);
				transform.updateMatrix();
				keys.setMatrixAt(index++, transform.matrix);
				legends.push({ x: x + w / 2, z: keyZ, width: w, label: legend });
			}
			x += w + gap;
		}
	}
	parent.add(keys);
	const labels = texture(1536, 640, (ctx) => {
		ctx.fillStyle = '#b8bdc3';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		for (const k of legends) {
			ctx.font = `${k.label.length > 2 ? 15 : 21}px ui-monospace, monospace`;
			const x = (k.x / width + 0.5) * 1536;
			const y = ((k.z - centerZ) / depth + 0.5) * 640;
			ctx.fillText(k.label, x, y);
		}
	});
	flatMap(parent, labels, width, depth, 0, 0.1425, centerZ);
	const touchId = mesh(parent, new THREE.CircleGeometry(0.045, 24), material(0x101214), [legends[13].x, 0.143, legends[13].z]);
	touchId.rotation.x = -Math.PI / 2;
	touchId.castShadow = false;
}

function screenTexture() {
	return texture(1512, 982, (ctx) => {
		ctx.fillStyle = '#171e22';
		ctx.fillRect(0, 0, 1512, 982);
		ctx.fillStyle = '#10171b';
		ctx.fillRect(0, 0, 1512, 38);
		ctx.fillStyle = '#b9c9c9';
		ctx.font = '17px sans-serif';
		ctx.fillText('Code     File     Edit     View     Terminal', 40, 25);
		ctx.fillText('Mon  9:41', 1362, 25);
		ctx.fillStyle = '#1e272c';
		ctx.fillRect(0, 38, 255, 910);
		ctx.fillStyle = '#8aa3a5';
		ctx.font = '17px ui-monospace, monospace';
		ctx.fillText('EXPLORER', 30, 104);
		ctx.fillStyle = '#d2d9d5';
		ctx.fillText('⌄ workspace', 29, 153);
		['src', '  home.astro', '  desk-scene.ts', '  notes.md', 'package.json'].forEach((file, i) => {
			if (i === 3) {
				ctx.fillStyle = '#2d3a3e';
				ctx.fillRect(0, 287, 255, 43);
			}
			ctx.fillStyle = i === 3 ? '#dce5d6' : '#92a5a7';
			ctx.fillText(file, 44, 211 + i * 34);
		});
		ctx.fillStyle = '#263238';
		ctx.fillRect(255, 38, 1257, 58);
		ctx.fillStyle = '#171e22';
		ctx.fillRect(255, 38, 222, 58);
		ctx.fillStyle = '#d0dad0';
		ctx.fillText('notes.md   ×', 287, 75);
		ctx.font = '21px ui-monospace, monospace';
		const lines = [
			[{ text: '# A little workspace', color: '#a8c5a4' }],
			[],
			[{ text: 'A few familiar things, and room to think.', color: '#c5d0ca' }],
			[],
			[{ text: 'const ', color: '#b6a8d2' }, { text: 'desk ', color: '#c5d0ca' }, { text: '= {', color: '#9bb8c0' }],
			[{ text: '  notebook: ', color: '#c5d0ca' }, { text: '"LEUCHTTURM1917",', color: '#a8c5a4' }],
			[{ text: '  pen: ', color: '#c5d0ca' }, { text: '"Parker Jotter",', color: '#a8c5a4' }],
			[{ text: '  coffee: ', color: '#c5d0ca' }, { text: '"still warm",', color: '#a8c5a4' }],
			[{ text: '};', color: '#9bb8c0' }],
			[],
			[{ text: '// Make something. Take a break. Repeat.', color: '#6c8b87' }],
		];
		lines.forEach((segments, i) => {
			ctx.fillStyle = '#50666c';
			ctx.textAlign = 'right';
			ctx.fillText(String(i + 1), 313, 164 + i * 44);
			ctx.textAlign = 'left';
			let x = 347;
			for (const segment of segments) {
				ctx.fillStyle = segment.color;
				ctx.fillText(segment.text, x, 164 + i * 44);
				x += ctx.measureText(segment.text).width;
			}
		});
		ctx.fillStyle = '#10181c';
		ctx.fillRect(255, 733, 1257, 215);
		ctx.fillStyle = '#799496';
		ctx.font = '16px ui-monospace, monospace';
		ctx.fillText('TERMINAL', 291, 770);
		ctx.fillStyle = '#a8c5a4';
		ctx.fillText('➜  workspace  npm run dev', 291, 815);
		ctx.fillStyle = '#9aaeb0';
		ctx.fillText('astro  ready in 248 ms', 291, 856);
		ctx.fillText('Local  http://localhost:4321/', 291, 885);
		ctx.fillStyle = '#324744';
		ctx.fillRect(0, 948, 1512, 34);
		ctx.fillStyle = '#c1d2c8';
		ctx.font = '14px ui-monospace, monospace';
		ctx.fillText('⑂ main     ✓ 0 problems', 25, 970);
		ctx.fillText('Markdown    UTF-8', 1290, 970);
	});
}

function appleLogo() {
	const shape = new THREE.Shape();
	shape.moveTo(0, 0.33);
	shape.bezierCurveTo(0.17, 0.43, 0.43, 0.36, 0.54, 0.08);
	shape.bezierCurveTo(0.3, -0.04, 0.32, -0.27, 0.52, -0.34);
	shape.bezierCurveTo(0.36, -0.72, 0.16, -0.67, 0, -0.58);
	shape.bezierCurveTo(-0.19, -0.69, -0.5, -0.69, -0.55, -0.18);
	shape.bezierCurveTo(-0.63, 0.3, -0.26, 0.45, 0, 0.33);
	const leaf = new THREE.Shape();
	leaf.moveTo(0.04, 0.4);
	leaf.bezierCurveTo(0.07, 0.57, 0.2, 0.68, 0.36, 0.7);
	leaf.bezierCurveTo(0.32, 0.5, 0.18, 0.39, 0.04, 0.4);
	return new THREE.ShapeGeometry([shape, leaf], 20);
}

export function makeMacBook(): THREE.Group {
	const laptop = new THREE.Group();
	laptop.name = 'macbook';
	laptop.userData.label = '14″ MacBook Pro · M1 Pro';
	const aluminum = material(0xc3c8ce, { metalness: 0.86, roughness: 0.32, envMapIntensity: 0.85 });
	const edge = material(0x9ca3aa, { metalness: 0.9, roughness: 0.24 });
	const black = material(0x101317, { roughness: 0.65, envMapIntensity: 0.1 });
	const width = 3.126;
	const depth = 2.212;
	mesh(laptop, box(width, 0.115, depth, 0.058), aluminum, [0, 0.064, 0]);
	mesh(laptop, box(width - 0.028, 0.013, depth - 0.025, 0.055), edge, [0, 0.008, 0]);
	makeKeyboard(laptop);
	const pad = mesh(laptop, box(1.27, 0.005, 0.74, 0.038), edge, [0, 0.125, 0.641]);
	pad.castShadow = false;
	mesh(laptop, box(1.253, 0.004, 0.722, 0.036), aluminum, [0, 0.128, 0.641]).castShadow = false;
	const grilleMap = texture(128, 640, (ctx) => {
		ctx.fillStyle = '#bac0c7';
		ctx.fillRect(0, 0, 128, 640);
		ctx.fillStyle = '#454d56';
		for (let y = 8; y < 635; y += 9) for (let x = 8; x < 125; x += 10) {
			ctx.beginPath(); ctx.arc(x + (y % 18 ? 0 : 3), y, 1.5, 0, Math.PI * 2); ctx.fill();
		}
	});
	for (const x of [-1.355, 1.355]) {
		const speaker = mesh(laptop, new THREE.PlaneGeometry(0.135, 0.97), material(0xffffff, { map: grilleMap, metalness: 0.55 }), [x, 0.123, -0.345]);
		speaker.rotation.x = -Math.PI / 2;
		speaker.castShadow = false;
	}
	mesh(laptop, box(0.37, 0.018, 0.018, 0.007), edge, [0, 0.108, depth / 2 + 0.002]);
	const hinge = mesh(laptop, new THREE.CylinderGeometry(0.041, 0.041, 2.56, 24), black, [0, 0.123, -1.026]);
	hinge.rotation.z = Math.PI / 2;
	// MagSafe, two USB-C ports and headphone jack on the left; HDMI, USB-C
	// and SDXC on the right. These are recessed dark inserts, not painted dots.
	for (const [side, z, length, height] of [
		[-1, -0.8, 0.19, 0.032], [-1, -0.5, 0.12, 0.035], [-1, -0.27, 0.12, 0.035], [-1, 0.07, 0.04, 0.04],
		[1, -0.76, 0.17, 0.04], [1, -0.45, 0.12, 0.035], [1, -0.07, 0.29, 0.018],
	]) mesh(laptop, box(0.006, height, length, 0.005), black, [side * (width / 2 + 0.001), 0.06, z]);
	const feet = material(0x292a2c, { roughness: 0.9 });
	for (const x of [-1.22, 1.22]) for (const z of [-0.84, 0.84]) {
		mesh(laptop, new THREE.CylinderGeometry(0.079, 0.07, 0.012, 20), feet, [x, -0.003, z]);
	}
	const lid = new THREE.Group();
	lid.name = 'display';
	lid.position.set(0, 0.123, -1.026);
	lid.rotation.x = -0.24;
	mesh(lid, box(width, 2.066, 0.045, 0.055), aluminum, [0, 1.033, 0]);
	mesh(lid, box(width - 0.047, 2.025, 0.011, 0.043), black, [0, 1.042, 0.027]);
	const screen = mesh(lid, new THREE.PlaneGeometry(3.01, 1.955), new THREE.MeshBasicMaterial({ map: screenTexture(), toneMapped: false }), [0, 1.044, 0.035]);
	screen.castShadow = screen.receiveShadow = false;
	mesh(lid, box(0.25, 0.066, 0.008, 0.012), new THREE.MeshBasicMaterial({ color: 0x0b1014 }), [0, 1.993, 0.04]).castShadow = false;
	const lens = mesh(lid, new THREE.CircleGeometry(0.012, 16), material(0x263744, { metalness: 0.6, roughness: 0.1 }), [0, 1.998, 0.045]);
	lens.castShadow = false;
	const logo = mesh(lid, appleLogo(), material(0x24282b, { metalness: 0.65, roughness: 0.2 }), [0, 1.125, -0.0235]);
	logo.rotation.y = Math.PI;
	logo.scale.setScalar(0.25);
	logo.castShadow = false;
	laptop.add(lid);
	return laptop;
}

export function makeNotebook(): THREE.Group {
	const book = new THREE.Group();
	book.name = 'notebook';
	book.userData.label = 'LEUCHTTURM1917 · Forest Green';
	const leather = material(0x143924, { roughness: 0.72, envMapIntensity: 0.18, bumpMap: grainMap(256, [128, 128, 128]), bumpScale: 0.0014 });
	const elastic = material(0x193b2a, { roughness: 0.98 });
	const paper = material(0xeee9d9, { roughness: 0.93 });
	mesh(book, box(1.45, 0.027, 2.10, 0.055), leather, [0, 0.019, 0]);
	mesh(book, box(1.386, 0.155, 2.017, 0.035), paper, [0.009, 0.108, 0]);
	mesh(book, box(1.45, 0.027, 2.10, 0.055), leather, [0, 0.198, 0]);
	mesh(book, box(0.075, 0.195, 2.027, 0.025), leather, [-0.69, 0.11, 0]);
	const pageEdges = texture(512, 128, (ctx) => {
		ctx.fillStyle = '#ebe5d5'; ctx.fillRect(0, 0, 512, 128);
		for (let y = 1; y < 128; y += 3) {
			ctx.strokeStyle = `rgba(124,112,84,${0.12 + noise(y, 4) * 0.14})`;
			ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y + noise(y, 9) * 0.6); ctx.stroke();
		}
	});
	const edgeMat = material(0xffffff, { map: pageEdges, roughness: 1 });
	mesh(book, new THREE.PlaneGeometry(1.32, 0.146), edgeMat, [0.02, 0.108, 1.009]).castShadow = false;
	const foreEdge = mesh(book, new THREE.PlaneGeometry(1.95, 0.146), edgeMat, [0.702, 0.108, 0]);
	foreEdge.rotation.y = Math.PI / 2;
	foreEdge.castShadow = false;
	mesh(book, box(0.045, 0.008, 2.075, 0.003), elastic, [0.542, 0.216, 0]);
	for (const z of [-1.041, 1.041]) mesh(book, box(0.045, 0.2, 0.012, 0.005), elastic, [0.542, 0.113, z]);
	const imprint = texture(1024, 160, (ctx) => {
		ctx.fillStyle = '#102f21'; ctx.textAlign = 'center'; ctx.font = '500 56px sans-serif';
		ctx.fillText('LEUCHTTURM1917', 512, 82);
		ctx.fillStyle = 'rgba(145,180,136,0.16)'; ctx.fillText('LEUCHTTURM1917', 512, 81);
	});
	flatMap(book, imprint, 0.75, 0.118, -0.06, 0.212, 0.77);
	for (const [x, color, bend] of [[-0.37, 0x799270, -0.06], [-0.28, 0x254c35, 0.07]]) {
		const ribbon = mesh(book, new THREE.PlaneGeometry(0.026, 0.31, 1, 10), material(color, { side: THREE.DoubleSide, roughness: 0.95 }), [x, 0.033, 1.13]);
		ribbon.rotation.x = -Math.PI / 2;
		const positions = ribbon.geometry.attributes.position;
		for (let i = 0; i < positions.count; i++) {
			const t = (positions.getY(i) + 0.155) / 0.31;
			positions.setX(i, positions.getX(i) + Math.sin(t * Math.PI) * bend);
			positions.setZ(i, Math.sin(t * Math.PI) * 0.011);
		}
		ribbon.geometry.computeVertexNormals();
	}
	return book;
}

export function makeJotter(): THREE.Group {
	const pen = new THREE.Group();
	pen.name = 'pen';
	pen.userData.label = 'Parker Jotter · Stainless steel';
	const steel = material(0xc2c8cc, { metalness: 1, roughness: 0.3, bumpMap: grainMap(128, [128, 128, 128], true), bumpScale: 0.0004, envMapIntensity: 1.1 });
	const chrome = material(0xd4dade, { metalness: 1, roughness: 0.14, envMapIntensity: 1.3 });
	const seam = material(0x545b60, { metalness: 0.85, roughness: 0.4 });
	const profile = [
		[0.009, -0.641], [0.014, -0.594], [0.023, -0.55], [0.027, -0.44],
		[0.034, -0.08], [0.037, 0.04], [0.039, 0.09], [0.039, 0.52], [0.034, 0.559],
	].map(([r, y]) => new THREE.Vector2(r, y));
	mesh(pen, new THREE.LatheGeometry(profile, 32), steel);
	mesh(pen, new THREE.CylinderGeometry(0.0396, 0.0396, 0.018, 32), chrome, [0, 0.083, 0]);
	mesh(pen, new THREE.CylinderGeometry(0.0385, 0.0385, 0.004, 32), seam, [0, 0.065, 0]);
	mesh(pen, new THREE.CylinderGeometry(0.025, 0.025, 0.064, 28), chrome, [0, 0.586, 0]);
	mesh(pen, new THREE.SphereGeometry(0.025, 24, 12), chrome, [0, 0.619, 0]).scale.y = 0.24;
	mesh(pen, new THREE.CylinderGeometry(0.0105, 0.004, 0.045, 20), chrome, [0, -0.65, 0]);
	mesh(pen, new THREE.SphereGeometry(0.004, 12, 8), material(0x4b4b43, { metalness: 0.8 }), [0, -0.675, 0]);
	const arrow = new THREE.Shape();
	arrow.moveTo(-0.01, 0.542); arrow.lineTo(0.011, 0.542);
	arrow.lineTo(0.012, 0.225); arrow.lineTo(0.024, 0.244);
	arrow.lineTo(0, 0.168); arrow.lineTo(-0.024, 0.244);
	arrow.lineTo(-0.011, 0.225); arrow.closePath();
	mesh(pen, new THREE.ExtrudeGeometry(arrow, { depth: 0.005, bevelEnabled: true, bevelSize: 0.001, bevelThickness: 0.001, bevelSegments: 2 }), chrome, [0, 0, 0.045]);
	mesh(pen, box(0.021, 0.037, 0.016, 0.005), chrome, [0, 0.526, 0.037]);
	const engraving = texture(512, 96, (ctx) => {
		ctx.fillStyle = 'rgba(47,56,61,0.65)'; ctx.font = '36px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PARKER', 256, 62);
	});
	const mark = mesh(pen, new THREE.PlaneGeometry(0.18, 0.034), new THREE.MeshBasicMaterial({ map: engraving, transparent: true, depthWrite: false }), [0, 0.12, 0.04]);
	mark.castShadow = false;
	pen.rotation.x = -Math.PI / 2;
	return pen;
}

function steamMap() {
	return texture(96, 256, (ctx) => {
		ctx.filter = 'blur(5px)';
		for (let y = 8; y < 250; y += 4) {
			const t = y / 256;
			const x = 48 + Math.sin(t * 8) * 14 + Math.sin(t * 17) * 5;
			const radius = 2 + t * 9;
			const gradient = ctx.createRadialGradient(x, 256 - y, 0, x, 256 - y, radius);
			gradient.addColorStop(0, `rgba(237,241,236,${Math.sin(t * Math.PI) * 0.6})`);
			gradient.addColorStop(1, 'rgba(237,241,236,0)');
			ctx.fillStyle = gradient;
			ctx.fillRect(x - radius, 256 - y - radius, radius * 2, radius * 2);
		}
	});
}

export function makeMug(): THREE.Group {
	const mug = new THREE.Group();
	mug.name = 'mug';
	mug.userData.label = 'Coffee mug';
	mug.userData.easterEgg = '/grounds';
	const glazeMap = texture(512, 256, (ctx) => {
		ctx.fillStyle = '#d8cebb'; ctx.fillRect(0, 0, 512, 256);
		for (let i = 0; i < 1600; i++) {
			ctx.fillStyle = `rgba(99,77,53,${0.035 + noise(i, 4) * 0.09})`;
			ctx.beginPath(); ctx.arc(noise(i, 1) * 512, noise(i, 2) * 256, 0.3 + noise(i, 3) * 0.7, 0, Math.PI * 2); ctx.fill();
		}
	});
	const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: glazeMap, roughness: 0.27, clearcoat: 0.55, clearcoatRoughness: 0.24, metalness: 0 });
	const profile = [
		[0.001, 0.034], [0.25, 0.034], [0.282, 0.04], [0.307, 0.073], [0.314, 0.13],
		[0.35, 0.33], [0.386, 0.65], [0.399, 0.842], [0.398, 0.881],
		[0.389, 0.897], [0.368, 0.9], [0.35, 0.886], [0.345, 0.856],
		[0.334, 0.65], [0.298, 0.23], [0.275, 0.139], [0.001, 0.137],
	].map(([r, y]) => new THREE.Vector2(r, y));
	mesh(mug, new THREE.LatheGeometry(profile, 64), ceramic);
	mesh(mug, new THREE.TorusGeometry(0.272, 0.018, 12, 48), material(0xa7977c, { roughness: 0.98 }), [0, 0.035, 0]).rotation.x = Math.PI / 2;
	const curve = new THREE.CatmullRomCurve3([
		new THREE.Vector3(0.374, 0.745, 0), new THREE.Vector3(0.577, 0.748, 0),
		new THREE.Vector3(0.682, 0.617, 0), new THREE.Vector3(0.671, 0.39, 0),
		new THREE.Vector3(0.559, 0.257, 0), new THREE.Vector3(0.332, 0.258, 0),
	]);
	mesh(mug, new THREE.TubeGeometry(curve, 40, 0.052, 12, false), ceramic);
	for (const [x, y] of [[0.36, 0.735], [0.332, 0.26]]) {
		mesh(mug, new THREE.SphereGeometry(0.064, 20, 12), ceramic, [x, y, 0]).scale.set(0.8, 1.08, 1);
	}
	const coffeeMap = texture(512, 512, (ctx) => {
		const gradient = ctx.createRadialGradient(205, 170, 15, 256, 256, 256);
		gradient.addColorStop(0, '#38271b'); gradient.addColorStop(0.7, '#20150d'); gradient.addColorStop(1, '#573823');
		ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 512);
		for (let i = 0; i < 65; i++) {
			const a = noise(i, 4) * Math.PI * 2;
			const r = 215 + noise(i, 2) * 23;
			ctx.strokeStyle = `rgba(196,153,94,${0.12 + noise(i, 5) * 0.2})`;
			ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(256 + Math.cos(a) * r, 256 + Math.sin(a) * r, 1 + noise(i, 6) * 3, 0, Math.PI * 2); ctx.stroke();
		}
	});
	const coffee = mesh(mug, new THREE.CircleGeometry(0.341, 64), new THREE.MeshPhysicalMaterial({ map: coffeeMap, roughness: 0.16, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12 }), [0, 0.787, 0]);
	coffee.rotation.x = -Math.PI / 2;
	coffee.castShadow = false;
	const meniscus = mesh(mug, new THREE.TorusGeometry(0.338, 0.005, 8, 64), material(0x664229, { roughness: 0.23 }), [0, 0.789, 0]);
	meniscus.rotation.x = Math.PI / 2;
	meniscus.castShadow = false;
	const map = steamMap();
	for (let i = 0; i < 4; i++) {
		const steam = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
		steam.center.set(0.5, 0);
		steam.scale.set(0.27, 0.85, 1);
		steam.position.set((i - 1.5) * 0.065, 0.82, 0);
		steam.userData.part = 'steam';
		steam.userData.phase = i / 4;
		steam.raycast = () => {};
		mug.add(steam);
	}
	const hit = mesh(mug, new THREE.CylinderGeometry(0.49, 0.44, 0.93, 16), new THREE.MeshBasicMaterial({ visible: false }), [0.08, 0.48, 0]);
	hit.castShadow = hit.receiveShadow = false;
	return mug;
}

function leafGeometry(width: number, height: number) {
	const geometry = new THREE.PlaneGeometry(width, height, 8, 14);
	const positions = geometry.attributes.position;
	for (let i = 0; i < positions.count; i++) {
		const v = (positions.getY(i) + height / 2) / height;
		const u = positions.getX(i) / (width / 2);
		positions.setX(i, positions.getX(i) * Math.pow(Math.max(0.015, Math.sin(v * Math.PI)), 0.7));
		positions.setZ(i, Math.sin(v * Math.PI) * 0.055 - u * u * 0.055 + v * v * 0.045);
	}
	geometry.computeVertexNormals();
	return geometry;
}

export function makePlant(): THREE.Group {
	const plant = new THREE.Group();
	plant.name = 'plant';
	plant.userData.label = 'A little rubber plant';
	const clay = new THREE.MeshPhysicalMaterial({ color: 0xb59678, roughness: 0.76, bumpMap: grainMap(128, [128, 128, 128]), bumpScale: 0.002 });
	const pot = [[0.001, 0.02], [0.24, 0.02], [0.27, 0.045], [0.31, 0.48], [0.329, 0.507], [0.325, 0.55], [0.291, 0.55], [0.282, 0.49], [0.235, 0.1], [0.001, 0.1]].map(([r, y]) => new THREE.Vector2(r, y));
	mesh(plant, new THREE.LatheGeometry(pot, 40), clay);
	mesh(plant, new THREE.CylinderGeometry(0.285, 0.27, 0.018, 32), material(0x342c20, { roughness: 1, bumpMap: grainMap(128, [100, 100, 100]), bumpScale: 0.012 }), [0, 0.491, 0]);
	const stem = material(0x5b6640, { roughness: 0.9 });
	const shades = [0x375d40, 0x264932, 0x547747, 0x3f6546];
	const leafMap = texture(128, 256, (ctx) => {
		const gradient = ctx.createLinearGradient(0, 0, 128, 0);
		gradient.addColorStop(0, '#bac5a4'); gradient.addColorStop(0.48, '#f4f1cc'); gradient.addColorStop(1, '#879b76');
		ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 256);
		ctx.strokeStyle = 'rgba(70,91,51,0.16)'; ctx.lineWidth = 1;
		for (let y = 28; y < 245; y += 23) { ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(4, y - 30); ctx.moveTo(64, y); ctx.lineTo(124, y - 30); ctx.stroke(); }
	});
	const specs = [
		[-0.27, 1.06, 0.08, 0.38, 0.53, -0.5, -0.8, -0.52],
		[0.25, 1.12, 0.12, 0.39, 0.57, -0.45, 0.45, 0.53],
		[-0.15, 1.4, -0.12, 0.37, 0.61, 0.1, -0.5, -0.26],
		[0.17, 1.58, -0.1, 0.35, 0.62, 0.12, 0.6, 0.3],
		[0.01, 1.91, 0, 0.32, 0.56, -0.1, 0.1, 0.03],
		[0.09, 0.86, 0.24, 0.3, 0.46, -0.8, 0.2, 0.24],
		[-0.2, 1.28, 0.23, 0.34, 0.55, -0.5, -0.4, -0.37],
	];
	for (const [i, [x, y, z, w, h, rx, ry, rz]] of specs.entries()) {
		const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.49, 0), new THREE.Vector3(x * 0.2, y * 0.66, z * 0.4), new THREE.Vector3(x, y - h * 0.39, z)]);
		mesh(plant, new THREE.TubeGeometry(curve, 12, 0.011, 6, false), stem);
		const leaf = mesh(plant, leafGeometry(w, h), material(shades[i % shades.length], { map: leafMap, roughness: 0.4, side: THREE.DoubleSide }), [x, y, z]);
		leaf.rotation.set(rx, ry, rz);
		leaf.userData.part = 'leaf';
		leaf.userData.baseRotation = leaf.rotation.clone();
		leaf.userData.phase = i * 1.7;
		const vein = new THREE.CatmullRomCurve3([new THREE.Vector3(0, -h * 0.48, 0.006), new THREE.Vector3(0, 0, 0.06), new THREE.Vector3(0, h * 0.46, 0.047)]);
		mesh(leaf, new THREE.TubeGeometry(vein, 12, 0.003, 4, false), material(0x82905b, { roughness: 0.6 })).castShadow = false;
	}
	return plant;
}

function woodMap(lowPower: boolean) {
	const w = lowPower ? 512 : 1024;
	const h = w / 2;
	return texture(w, h, (ctx) => {
		const image = ctx.createImageData(w, h);
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
			const plank = Math.floor(y / h * 5);
			const ny = y / h;
			const bend = Math.sin(x / w * 7 + plank) * 3 + Math.sin(x / w * 22) * 0.7;
			const grain = Math.sin(y * 0.71 + bend) * 3.8 + Math.sin(y * 2.1 + bend * 2) * 1.6;
			const pore = Math.pow(noise(x * 0.6, y), 14) * 10;
			const seam = (ny * 5) % 1 < 0.005 ? 12 : 0;
			const shade = grain - pore - seam + (noise(plank, 3) - 0.5) * 11;
			const i = (y * w + x) * 4;
			image.data[i] = 169 + shade; image.data[i + 1] = 136 + shade; image.data[i + 2] = 97 + shade; image.data[i + 3] = 255;
		}
		ctx.putImageData(image, 0, 0);
	});
}

export function makeTable(lowPower: boolean): THREE.Group {
	const table = new THREE.Group();
	table.name = 'table';
	const wood = material(0xffffff, { map: woodMap(lowPower), roughness: 0.54, envMapIntensity: 0.35 });
	const side = wood.clone();
	side.color.setHex(0xd4bd98);
	mesh(table, box(7.1, 0.16, 3.75, 0.045), [side, side, wood, side, side, side], [0, TABLE_HEIGHT - 0.08, 0.06]);
	for (const z of [-1.66, 1.78]) mesh(table, box(6.76, 0.15, 0.065, 0.01), side, [0, TABLE_HEIGHT - 0.23, z]);
	for (const x of [-3.28, 3.28]) {
		mesh(table, box(0.065, 0.15, 3.4, 0.01), side, [x, TABLE_HEIGHT - 0.23, 0.06]);
		for (const z of [-1.51, 1.63]) mesh(table, box(0.145, 0.69, 0.145, 0.012), side, [x, 0.346, z]);
	}
	return table;
}

function contactShadow(parent: THREE.Group, x: number, z: number, w: number, d: number, map: THREE.Texture) {
	const shadow = mesh(parent, new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0.18, depthWrite: false }), [x, TABLE_HEIGHT + 0.002, z]);
	shadow.rotation.x = -Math.PI / 2;
	shadow.castShadow = shadow.receiveShadow = false;
	shadow.renderOrder = 1;
}

export function buildWorkspace(lowPower: boolean): THREE.Group {
	const workspace = new THREE.Group();
	workspace.name = 'workspace';
	workspace.add(makeTable(lowPower));
	const laptop = makeMacBook();
	laptop.position.set(-0.22, TABLE_HEIGHT + 0.012, -0.14);
	laptop.rotation.y = -0.075;
	const book = makeNotebook();
	book.position.set(2.3, TABLE_HEIGHT + 0.02, 0.04);
	book.rotation.y = -0.19;
	const pen = makeJotter();
	pen.position.set(-0.13, 0.26, -0.02);
	// Rotate about the desk normal after laying the cylindrical pen down.
	const penRest = new THREE.Group();
	penRest.rotation.y = -0.48;
	penRest.add(pen);
	book.add(penRest);
	const mug = makeMug();
	mug.position.set(-2.06, TABLE_HEIGHT + 0.002, 0.05);
	mug.rotation.y = 3.55;
	const plant = makePlant();
	plant.position.set(-3.09, TABLE_HEIGHT, -0.88);
	plant.rotation.y = 0.22;
	plant.scale.setScalar(0.91);
	workspace.add(laptop, book, mug, plant);
	const shadowMap = texture(128, 128, (ctx) => {
		const gradient = ctx.createRadialGradient(64, 64, 18, 64, 64, 64);
		gradient.addColorStop(0, 'rgba(34,27,18,0.8)'); gradient.addColorStop(1, 'rgba(34,27,18,0)');
		ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
	});
	contactShadow(workspace, -0.22, -0.1, 3.7, 2.7, shadowMap);
	contactShadow(workspace, mug.position.x, mug.position.z, 1.12, 1.12, shadowMap);
	contactShadow(workspace, plant.position.x, plant.position.z, 1, 1, shadowMap);
	return workspace;
}
