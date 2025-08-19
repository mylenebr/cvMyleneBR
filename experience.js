import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let camera, scene, renderer, controls, raycaster, mouse;

// Colors
let lightPink = 0xFFE3F0;
let darkPink = 0x5C1F36;
let backgroundPink = 0x614850; //0xC7B1BD;

// Header 
let textMesh, buttonMesh, frameMesh;

// XP poses
let sparks = [];
const yArrow = -30;
const xpPoses = [
	new THREE.Vector3(-350, -30+yArrow, 10), // Maths
	new THREE.Vector3(-330, -30+yArrow, 10), // Maths
	new THREE.Vector3(-260, 0+yArrow, 10), // McDo
	new THREE.Vector3(-170, -30+yArrow, 10), // Stage rectorat
	new THREE.Vector3(-70, 0+yArrow, 10), // FOLKS Pipeline
	new THREE.Vector3(50, -30+yArrow, 10), // FOLKS interniship
	new THREE.Vector3(170, 0+yArrow, 10), // FOLKS R&D
	new THREE.Vector3(250, -30+yArrow, 10),
	new THREE.Vector3(300, 0+yArrow, 10),
	// Arrow
	new THREE.Vector3(300, -10+yArrow, 10),
	new THREE.Vector3(310, 0+yArrow, 10),
	new THREE.Vector3(300, 10+yArrow, 10),
	new THREE.Vector3(305, 0+yArrow, 10),
];
const curve = new THREE.CatmullRomCurve3(xpPoses);
const frames = curve.computeFrenetFrames(100, true);

init();

function title()
{
	// Name Title
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("Expérience", {
				font: font,
				size: 20,
				depth: 2,
				height: 0,
				curveSegments: 8
			});
			textGeo.center(); 
			
			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({color: lightPink});
			textMesh = new THREE.Mesh(textGeo, textMat);
			textMesh.position.set(0, 100, 10);

			// Attach text to star so it moves/rotates with it
			scene.add(textMesh);
		},
		// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// onError callback
		function ( err ) {
			console.log( 'An error happened' );
		}
	);
}

function homePageButton()
{
	// Picture Button
	const texture = new THREE.TextureLoader().load("textures/pictures/cv_picture.jpeg");
	const buttonGeometry = new THREE.CircleGeometry(30, 30);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
	buttonMesh.position.set(-320, 130, 10); // put it in front of camera
	scene.add(buttonMesh);

	// Pink Frame
	const frameGeometry = new THREE.CircleGeometry(32, 32);
	const frameMaterial = new THREE.MeshPhongMaterial({ color: lightPink});
	frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
	frameMesh.position.set(-320, 130, 9.9); // put it in front of camera
	scene.add(frameMesh);
}

function sparklethread()
{
	const sparkTexture = new THREE.TextureLoader().load('textures/sprites/sparkle.png');
	const sparkMaterial = new THREE.SpriteMaterial({
		map: sparkTexture,
		color: 0x8F8F8F,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false 
	});

	for (let i = 0; i < 2000; i++) {
		const sprite = new THREE.Sprite(sparkMaterial.clone());
		sprite.scale.set(1, 1, 1);
		scene.add(sprite);
		sparks.push({
			sprite,
			offset: Math.random() // random start along curve
		});
	}
}

function init() {

	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animate);
	document.body.appendChild(renderer.domElement);

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 0, 500);

	// Controls
	controls = new TrackballControls(camera, renderer.domElement);
	controls.minDistance = 200;
	controls.maxDistance = 500;

	// Scene
	scene = new THREE.Scene();
	//scene.background = new THREE.Color(0xFFDBEC);#240913
	scene.background = new THREE.Color(backgroundPink);
	scene.add(new THREE.AmbientLight(0x666666));
	const light = new THREE.PointLight(0xffffff, 3, 0, 0);
	light.position.copy(camera.position);
	scene.add(light);

	// Header
	title();
	homePageButton();

	// Arrow
	sparklethread();

	// Raycaster setup
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Events
	window.addEventListener('click', onClick);
}

function onClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	raycaster.setFromCamera(mouse, camera);

	// Home Page Button
	const interesectImg = raycaster.intersectObjects([buttonMesh]);
	if (interesectImg.length > 0) {
      window.location.href = "index.html"; 
    }
}

function animThreadSparkles(time){
	sparks.forEach(s => {
		const t = (time * 0.05 + s.offset) % 1; // move forward

		// Base position on curve
		const pos = curve.getPointAt(t);

		// Find local frame
		const l = Math.floor(t * frames.tangents.length); 
		const normal = frames.normals[l];
		const binormal = frames.binormals[l];
		
		const offset = normal.clone().add(binormal.clone());

		s.sprite.position.copy(pos.clone().add(offset));
		s.sprite.position.add(new THREE.Vector3(
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2
		));
	});
}

function animate() {
	requestAnimationFrame(animate);

	const now = performance.now();
	const time = now * 0.0005;

	// Animate thread sparkles
	animThreadSparkles(time);

  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );