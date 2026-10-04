import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildWorkspace, noise, texture } from './desk-objects';

const HOME_YAW = 0.10;
const HOME_POLAR = 1.33;
const TARGET = new THREE.Vector3(0, 1.55, 0.05);
const CLICK_DISTANCE = 8;

const skyVertex = `
	varying vec3 vDirection;
	void main() {
		vDirection = position;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

function makeCoast(lowPower: boolean) {
	const coast = new THREE.Group();
	const sky = new THREE.ShaderMaterial({
		side: THREE.BackSide,
		depthWrite: false,
		uniforms: {
			top: { value: new THREE.Color() }, horizon: { value: new THREE.Color() },
			sunColor: { value: new THREE.Color() }, sunDirection: { value: new THREE.Vector3() },
		},
		vertexShader: skyVertex,
		fragmentShader: `
			varying vec3 vDirection;
			uniform vec3 top, horizon, sunColor, sunDirection;
			float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
			float noise(vec2 p) {
				vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
				return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
			}
			void main() {
				vec3 d = normalize(vDirection);
				vec3 color = mix(horizon, top, smoothstep(-0.015, 0.10, d.y));
				float cloud = noise(d.xz * 10.0 + vec2(d.y*24.0, 4.0));
				cloud = smoothstep(0.60,0.82,cloud) * smoothstep(0.08,0.28,d.y) * (1.0-smoothstep(0.35,0.7,d.y));
				color = mix(color, horizon, cloud * 0.26);
				float sun = max(0.0, dot(d, normalize(sunDirection)));
				color += sunColor * pow(sun, 180.0) * 0.12;
				color = mix(color, sunColor, smoothstep(0.9993,0.99965,sun));
				gl_FragColor = vec4(color, 1.0);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	});
	coast.add(new THREE.Mesh(new THREE.SphereGeometry(85, 24, 16), sky));
	const sandMap = texture(lowPower ? 128 : 256, lowPower ? 128 : 256, (ctx) => {
		const size = ctx.canvas.width;
		const image = ctx.createImageData(size, size);
		for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
			const variation = (noise(x, y) - 0.5) * 14 + Math.sin(y * 0.19 + x * 0.01) * 2;
			const i = (y * size + x) * 4;
			image.data[i] = 207 + variation; image.data[i + 1] = 188 + variation; image.data[i + 2] = 154 + variation; image.data[i + 3] = 255;
		}
		ctx.putImageData(image, 0, 0);
	});
	sandMap.wrapS = sandMap.wrapT = THREE.RepeatWrapping;
	sandMap.repeat.set(20, 12);
	const sand = new THREE.MeshStandardMaterial({ map: sandMap, roughness: 0.97, envMapIntensity: 0.12 });
	const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 36), sand);
	ground.rotation.x = -Math.PI / 2;
	ground.position.set(0, -0.018, 8.4);
	ground.receiveShadow = true;
	coast.add(ground);
	const water = new THREE.ShaderMaterial({
		fog: true,
		uniforms: {
			...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
			time: { value: 0 }, deep: { value: new THREE.Color() }, shallow: { value: new THREE.Color() },
			glint: { value: new THREE.Color() }, lightDirection: { value: new THREE.Vector3(0.4, 0.65, -0.65).normalize() },
		},
		vertexShader: `
			uniform float time;
			varying vec3 vWorld;
			#include <fog_pars_vertex>
			void main() {
				vec3 p = position;
				p.z += sin(p.x*0.48+time*0.36)*0.016 + sin(p.y*0.36-time*0.28)*0.012;
				vWorld = (modelMatrix * vec4(p,1.0)).xyz;
				vec4 mvPosition = modelViewMatrix * vec4(p,1.0);
				gl_Position = projectionMatrix * mvPosition;
				#include <fog_vertex>
			}
		`,
		fragmentShader: `
			uniform float time;
			uniform vec3 deep, shallow, glint, lightDirection;
			varying vec3 vWorld;
			#include <fog_pars_fragment>
			void main() {
				vec2 p = vWorld.xz;
				float a = sin(p.x*2.7+p.y*1.8+time*0.5);
				float b = sin(p.x*1.5-p.y*3.9-time*0.42);
				float c = sin(p.x*5.7+p.y*0.9+time*0.31);
				vec3 normal = normalize(vec3((a+c)*0.024,1.0,b*0.04));
				vec3 view = normalize(cameraPosition-vWorld);
				float reflection = pow(max(0.0,dot(reflect(-lightDirection,normal),view)),70.0);
				float depth = 1.0-smoothstep(-38.0,-10.0,p.y);
				vec3 color = mix(shallow,deep,depth);
				color += (a*b)*0.012;
				color += glint * reflection * (0.1 + smoothstep(0.4,0.95,a*b)*0.4);
				gl_FragColor = vec4(color,1.0);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
				#include <fog_fragment>
			}
		`,
	});
	const ocean = new THREE.Mesh(new THREE.PlaneGeometry(160, 100, lowPower ? 24 : 48, 24), water);
	ocean.rotation.x = -Math.PI / 2;
	ocean.position.set(0, -0.045, -59.5);
	coast.add(ocean);
	const foam = new THREE.ShaderMaterial({
		transparent: true, depthWrite: false,
		uniforms: { time: { value: 0 }, tint: { value: new THREE.Color() } },
		vertexShader: `varying vec2 vUv; void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
		fragmentShader: `
			varying vec2 vUv; uniform float time; uniform vec3 tint;
			void main() {
				float line = 0.5 + sin(vUv.x*65.0+time*0.2)*0.07 + sin(vUv.x*29.0)*0.08;
				float alpha = exp(-pow((vUv.y-line)*14.0,2.0))*0.25;
				alpha *= 0.65 + sin(vUv.x*450.0+time*0.3)*0.2;
				gl_FragColor=vec4(tint,alpha);
				#include <tonemapping_fragment>
				#include <colorspace_fragment>
			}
		`,
	});
	const shoreline = new THREE.Mesh(new THREE.PlaneGeometry(100, 0.8), foam);
	shoreline.rotation.x = -Math.PI / 2;
	shoreline.position.set(0, -0.006, -9.3);
	coast.add(shoreline);
	return { group: coast, sky, sand, water, foam };
}

function labeledRoot(object: THREE.Object3D): THREE.Object3D | undefined {
	let current: THREE.Object3D | null = object;
	while (current) {
		if (typeof current.userData.label === 'string') return current;
		current = current.parent;
	}
}

function disposeResources(scene: THREE.Scene) {
	const geometries = new Set<THREE.BufferGeometry>();
	const materials = new Set<THREE.Material>();
	const textures = new Set<THREE.Texture>();
	scene.traverse((object) => {
		if (object instanceof THREE.Mesh) {
			geometries.add(object.geometry);
			for (const mat of Array.isArray(object.material) ? object.material : [object.material]) materials.add(mat);
			if (object instanceof THREE.InstancedMesh) object.dispose();
		} else if (object instanceof THREE.Sprite) materials.add(object.material);
	});
	for (const mat of materials) for (const value of Object.values(mat)) if (value instanceof THREE.Texture) textures.add(value);
	textures.forEach((map) => map.dispose());
	materials.forEach((mat) => mat.dispose());
	geometries.forEach((geometry) => geometry.dispose());
}

export function mountDeskStill(canvas: HTMLCanvasElement, onReady?: () => void): () => void {
	const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	const device = navigator as Navigator & { deviceMemory?: number };
	const lowPower = canvas.clientWidth < 520 || (device.deviceMemory ?? 8) <= 4 || navigator.hardwareConcurrency <= 4;
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.35 : 2));
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.shadowMap.autoUpdate = false;
	renderer.shadowMap.needsUpdate = true;
	const scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xe5e9df, 26, 78);
	const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 120);
	const pmrem = new THREE.PMREMGenerator(renderer);
	const room = new RoomEnvironment();
	const environment = pmrem.fromScene(room, 0.04);
	room.dispose();
	pmrem.dispose();
	scene.environment = environment.texture;
	const hemisphere = new THREE.HemisphereLight(0xe7edf2, 0xbc9670, 1.1);
	const sunlight = new THREE.DirectionalLight(0xffebcf, 2.4);
	sunlight.position.set(-3.8, 8.5, 4.0);
	sunlight.target.position.set(0, 0.8, 0);
	sunlight.castShadow = true;
	sunlight.shadow.mapSize.setScalar(lowPower ? 1024 : 2048);
	sunlight.shadow.camera.left = -5; sunlight.shadow.camera.right = 5;
	sunlight.shadow.camera.top = 4; sunlight.shadow.camera.bottom = -4;
	sunlight.shadow.camera.near = 0.5; sunlight.shadow.camera.far = 20;
	sunlight.shadow.bias = -0.00015;
	sunlight.shadow.normalBias = 0.012;
	sunlight.shadow.radius = 3;
	const fill = new THREE.DirectionalLight(0xc5dbe4, 0.5);
	fill.position.set(4, 3.5, 0);
	const rim = new THREE.DirectionalLight(0xffdfad, 1.0);
	rim.position.set(1, 5, -5);
	scene.add(hemisphere, sunlight, sunlight.target, fill, rim);
	const coast = makeCoast(lowPower);
	const workspace = buildWorkspace(lowPower);
	scene.add(coast.group, workspace);
	const leaves: THREE.Mesh[] = [];
	const steam: THREE.Sprite[] = [];
	workspace.traverse((object) => {
		if (object instanceof THREE.Mesh && object.userData.part === 'leaf') leaves.push(object);
		if (object instanceof THREE.Sprite && object.userData.part === 'steam') steam.push(object);
	});
	const root = canvas.closest<HTMLElement>('[data-desk-still]');
	const pauseButton = root?.querySelector<HTMLButtonElement>('[data-desk-pause]');
	const resetButton = root?.querySelector<HTMLButtonElement>('[data-desk-reset]');
	const label = root?.querySelector<HTMLElement>('[data-desk-label]');
	const raycaster = new THREE.Raycaster();
	const ndc = new THREE.Vector2();
	let hovered: THREE.Object3D | undefined;
	let pointer: { id: number; x: number; y: number; lastX: number; lastY: number; moved: boolean; touch: boolean } | undefined;
	let yaw = HOME_YAW, desiredYaw = HOME_YAW;
	let polar = HOME_POLAR, desiredPolar = HOME_POLAR;
	let distance = 10;
	let cameraDrift = 0;
	let paused = motionQuery.matches;
	let visible = true;
	let disposed = false;
	let ready = false;
	let frame = 0;
	let width = 0, height = 0;
	let elapsed = 0, lastTime = 0;
	let dark = false;

	function requestRender() {
		if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(render);
	}

	function syncTheme() {
		dark = document.documentElement.dataset.theme === 'dark';
		scene.environmentIntensity = dark ? 0.5 : 0.75;
		hemisphere.color.setHex(dark ? 0xc2d0e8 : 0xe7edf2);
		hemisphere.groundColor.setHex(dark ? 0x785640 : 0xbc9670);
		hemisphere.intensity = dark ? 0.75 : 1.1;
		sunlight.color.setHex(dark ? 0xffb67c : 0xffebcf);
		sunlight.intensity = dark ? 1.45 : 2.4;
		fill.color.setHex(dark ? 0x9bb7e1 : 0xc5dbe4);
		fill.intensity = dark ? 0.65 : 0.5;
		rim.color.setHex(dark ? 0xffae72 : 0xffdfad);
		rim.intensity = dark ? 1.5 : 1;
		coast.sky.uniforms.top.value.setHex(dark ? 0x273b58 : 0x9fc9dd);
		coast.sky.uniforms.horizon.value.setHex(dark ? 0xc69882 : 0xe5e9df);
		coast.sky.uniforms.sunColor.value.setHex(dark ? 0xffc58c : 0xfff0d0);
		coast.sky.uniforms.sunDirection.value.set(0.36, dark ? 0.13 : 0.32, -1).normalize();
		coast.water.uniforms.deep.value.setHex(dark ? 0x3a586b : 0x608f9e);
		coast.water.uniforms.shallow.value.setHex(dark ? 0x69868e : 0x9bbab6);
		coast.water.uniforms.glint.value.setHex(dark ? 0xd8a383 : 0xe6e4c6);
		coast.foam.uniforms.tint.value.setHex(dark ? 0xb8b7a7 : 0xefeee2);
		// Lower the sand's daylight albedo so the broad ground plane stays soft.
		coast.sand.color.setHex(dark ? 0xb9a49a : 0xc2bbb0);
		scene.fog!.color.setHex(dark ? 0xc69882 : 0xe5e9df);
		requestRender();
	}

	function syncPause() {
		canvas.dataset.motion = paused ? 'paused' : 'playing';
		if (pauseButton) {
			pauseButton.disabled = false;
			pauseButton.setAttribute('aria-pressed', String(paused));
			pauseButton.setAttribute('aria-label', paused ? 'Play scene animation' : 'Pause scene animation');
			pauseButton.title = paused ? 'Play animation' : 'Pause animation';
		}
		lastTime = 0;
		requestRender();
	}

	function togglePause() { paused = !paused; syncPause(); }
	function onMotionPreference() { paused = motionQuery.matches; syncPause(); }
	function resetView() {
		desiredYaw = HOME_YAW; desiredPolar = HOME_POLAR;
		cameraDrift = 0;
		setHovered(undefined);
		requestRender();
	}

	function resize() {
		const w = Math.max(1, canvas.clientWidth), h = Math.max(1, canvas.clientHeight);
		if (w === width && h === height) return;
		width = w; height = h;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		// Fit the entire desk horizontally on phones; keep a closer crop on
		// desktop. A fixed camera distance used to clip the plant on narrow screens.
		const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
		distance = Math.max(9.1, 4.2 / (Math.tan(halfFov) * camera.aspect));
		camera.updateProjectionMatrix();
	}

	function updateCamera() {
		if (!paused && !pointer) cameraDrift = Math.sin(elapsed * 0.16) * 0.028;
		const angle = yaw + cameraDrift;
		camera.position.set(
			TARGET.x + Math.sin(angle) * Math.sin(polar) * distance,
			TARGET.y + Math.cos(polar) * distance,
			TARGET.z + Math.cos(angle) * Math.sin(polar) * distance,
		);
		camera.lookAt(TARGET);
	}

	function animate() {
		coast.water.uniforms.time.value = elapsed;
		coast.foam.uniforms.time.value = elapsed;
		for (const leaf of leaves) {
			const base = leaf.userData.baseRotation as THREE.Euler;
			const phase = leaf.userData.phase as number;
			leaf.rotation.x = base.x + Math.sin(elapsed * 0.6 + phase) * 0.009;
			leaf.rotation.z = base.z + Math.sin(elapsed * 0.48 + phase) * 0.014;
		}
		for (const strand of steam) {
			const phase = strand.userData.phase as number;
			const cycle = (elapsed * 0.13 + phase) % 1;
			strand.position.set((phase - 0.375) * 0.2 + Math.sin(cycle * 7 + phase * 9) * 0.035, 0.82 + cycle * 0.36, 0);
			strand.scale.set(0.2 + cycle * 0.17, 0.6 + cycle * 0.55, 1);
			strand.material.opacity = Math.sin(cycle * Math.PI) * (dark ? 0.24 : 0.20);
		}
	}

	function render(time: number) {
		frame = 0;
		if (disposed || !visible || document.hidden) return;
		const interval = 1000 / (lowPower ? 30 : 45);
		if (lastTime && time - lastTime < interval) { requestRender(); return; }
		const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.08) : 1 / 45;
		lastTime = time;
		if (!paused) elapsed += dt;
		const smoothing = 1 - Math.exp(-dt * 12);
		yaw = THREE.MathUtils.lerp(yaw, desiredYaw, smoothing);
		polar = THREE.MathUtils.lerp(polar, desiredPolar, smoothing);
		resize();
		updateCamera();
		animate();
		renderer.render(scene, camera);
		if (!ready) {
			ready = true;
			canvas.dataset.sceneReady = 'true';
			if (resetButton) resetButton.disabled = false;
			onReady?.();
		}
		if (!paused || Math.abs(yaw - desiredYaw) + Math.abs(polar - desiredPolar) > 0.0001) requestRender();
	}

	function objectAt(event: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		if (!rect.width || !rect.height) return;
		ndc.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
		raycaster.setFromCamera(ndc, camera);
		const intersection = raycaster.intersectObject(workspace, true)[0];
		return intersection ? labeledRoot(intersection.object) : undefined;
	}

	function setHovered(next: THREE.Object3D | undefined) {
		if (hovered === next) return;
		hovered = next;
		if (label) label.textContent = next?.userData.label ?? 'Drag to look around';
		canvas.style.cursor = next?.userData.easterEgg ? 'pointer' : 'grab';
	}

	function onPointerDown(event: PointerEvent) {
		if (!event.isPrimary || event.button !== 0) return;
		pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false, touch: event.pointerType === 'touch' };
		canvas.setPointerCapture(event.pointerId);
		canvas.style.cursor = 'grabbing';
	}

	function onPointerMove(event: PointerEvent) {
		if (!pointer) { setHovered(objectAt(event)); return; }
		if (pointer.id !== event.pointerId) return;
		const dx = event.clientX - pointer.lastX, dy = event.clientY - pointer.lastY;
		pointer.moved ||= Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > CLICK_DISTANCE;
		if (pointer.moved) {
			desiredYaw = THREE.MathUtils.clamp(desiredYaw - dx * 0.0045, -0.58, 0.58);
			if (!pointer.touch) desiredPolar = THREE.MathUtils.clamp(desiredPolar - dy * 0.003, 0.98, 1.38);
		}
		pointer.lastX = event.clientX; pointer.lastY = event.clientY;
		requestRender();
	}

	function onPointerUp(event: PointerEvent) {
		if (!pointer || event.pointerId !== pointer.id) return;
		const wasClick = !pointer.moved && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= CLICK_DISTANCE;
		pointer = undefined;
		if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
		const object = objectAt(event);
		setHovered(undefined); setHovered(object);
		if (wasClick && typeof object?.userData.easterEgg === 'string') window.location.assign(object.userData.easterEgg);
		requestRender();
	}

	function cancelPointer() { pointer = undefined; setHovered(undefined); canvas.style.cursor = 'grab'; }
	function onPointerLeave() { if (!pointer) setHovered(undefined); }
	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') desiredYaw = Math.max(-0.58, desiredYaw - 0.12);
		else if (event.key === 'ArrowRight') desiredYaw = Math.min(0.58, desiredYaw + 0.12);
		else if (event.key === 'ArrowUp') desiredPolar = Math.max(0.98, desiredPolar - 0.07);
		else if (event.key === 'ArrowDown') desiredPolar = Math.min(1.38, desiredPolar + 0.07);
		else if (event.key === 'Home') resetView();
		else if (event.key === ' ') togglePause();
		else if (event.key === 'Enter') window.location.assign('/grounds');
		else return;
		event.preventDefault(); requestRender();
	}

	function onVisibility() {
		lastTime = 0;
		if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
		else requestRender();
	}
	const visibility = new IntersectionObserver((entries) => {
		visible = entries.some((entry) => entry.isIntersecting);
		lastTime = 0;
		if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
		else requestRender();
	}, { threshold: 0.01 });
	const resizeObserver = new ResizeObserver(() => { resize(); requestRender(); });
	const themeObserver = new MutationObserver(syncTheme);
	visibility.observe(canvas);
	resizeObserver.observe(canvas);
	themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerup', onPointerUp);
	canvas.addEventListener('pointercancel', cancelPointer);
	canvas.addEventListener('lostpointercapture', cancelPointer);
	canvas.addEventListener('pointerleave', onPointerLeave);
	canvas.addEventListener('keydown', onKeyDown);
	document.addEventListener('visibilitychange', onVisibility);
	motionQuery.addEventListener('change', onMotionPreference);
	pauseButton?.addEventListener('click', togglePause);
	resetButton?.addEventListener('click', resetView);
	syncTheme();
	syncPause();
	resize();
	updateCamera();
	requestRender();

	return () => {
		disposed = true;
		if (frame) cancelAnimationFrame(frame);
		visibility.disconnect(); resizeObserver.disconnect(); themeObserver.disconnect();
		canvas.removeEventListener('pointerdown', onPointerDown);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerup', onPointerUp);
		canvas.removeEventListener('pointercancel', cancelPointer);
		canvas.removeEventListener('lostpointercapture', cancelPointer);
		canvas.removeEventListener('pointerleave', onPointerLeave);
		canvas.removeEventListener('keydown', onKeyDown);
		document.removeEventListener('visibilitychange', onVisibility);
		motionQuery.removeEventListener('change', onMotionPreference);
		pauseButton?.removeEventListener('click', togglePause);
		resetButton?.removeEventListener('click', resetView);
		if (pauseButton) pauseButton.disabled = true;
		if (resetButton) resetButton.disabled = true;
		delete canvas.dataset.sceneReady;
		delete canvas.dataset.motion;
		sunlight.shadow.map?.dispose();
		disposeResources(scene);
		environment.dispose();
		renderer.dispose();
	};
}
