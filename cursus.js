import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// Load fonts
const loader = new FontLoader();
let optimerBoldFont = null;
loader.load('fonts/optimer_bold.typeface.json', (font) => {
	optimerBoldFont = font;
	title();
	createDates();
});

// Init variables
let camera, scene, renderer, controls, raycaster, mouse;

// Colors
let lightPink = 0xFFE3F0;
let darkPink = 0x5C1F36;
let backgroundPink = 0x614850; //0xC7B1BD;

// Header
let textMesh, buttonMesh, frameMesh;

// School poses
let sparks = [];
const yArrow = -30;
const schoolPoses = [
	new THREE.Vector3(-350, 0+yArrow, 10), // Bac S 2018
	new THREE.Vector3(-330, 0+yArrow, 10), // Bac S 2018
	new THREE.Vector3(-180, -30+yArrow, 10), // Prepa Vh 2018 -> 2020
	new THREE.Vector3(0, 0+yArrow, 10), //  ENSISA 2020 -> 2023
	new THREE.Vector3(180, -30+yArrow, 10), // UQAC 2023->2024
	new THREE.Vector3(300, 0+yArrow, 10),
	// Circle
	new THREE.Vector3(308, -8+yArrow, 10),
	new THREE.Vector3(316, 0+yArrow, 10),
	new THREE.Vector3(308, 10+yArrow, 10),
	new THREE.Vector3(300, 0+yArrow, 10),
	new THREE.Vector3(308, 0+yArrow, 10),
];
const curve = new THREE.CatmullRomCurve3(schoolPoses);
const frames = curve.computeFrenetFrames(100, true);

// Dates
const years = [
	"2018", "2020", "2023", "2024"
];

const yYears = -110+yArrow;
const yearsPos = [
	new THREE.Vector3(-350, yYears, 10),
	new THREE.Vector3(-120, yYears, 10),
	new THREE.Vector3(90, yYears, 10),
	new THREE.Vector3(220, yYears, 10),
];

// Logos
const logosName = [
	"bac.jpg", "mpsi.jpg", "ensisa.png", "uqac.jpeg"
];
/*const logosPos = [
	new THREE.Vector3(-330, 0+yArrow, 10), // Bac S 2018
	new THREE.Vector3(-180, -30+yArrow, 10), // Prepa Vh 2018 -> 2020
	new THREE.Vector3(0, 0+yArrow, 10), //  ENSISA 2020 -> 2023
	new THREE.Vector3(180, -30+yArrow, 10), // UQAC 2023->2024
];*/

const logosPos = [
	new THREE.Vector3(-330, 30+yArrow, 10), // Bac S 2018
	new THREE.Vector3(-180, -60+yArrow, 10), // Prepa Vh 2018 -> 2020
	new THREE.Vector3(0, 30+yArrow, 10), //  ENSISA 2020 -> 2023
	new THREE.Vector3(180, -60+yArrow, 10), // UQAC 2023->2024
];
let logos = [];
let logoFrames = [];
let logoMesh;

// Utils
function text(font, text, size, depth, curveSegments, color, pos)
{
	if (!font) return;

	// Name Title
	const textGeo = new TextGeometry(text, { 	
		font: font, 
		size: size, 
		depth: depth, 
		curveSegments: curveSegments 
	});
	textGeo.center();
	const textMat = new THREE.MeshPhongMaterial({color: color});
	const textTitleMesh = new THREE.Mesh(textGeo, textMat);
	textTitleMesh.position.set(pos.x, pos.y, pos.z);	
	
	scene.add(textTitleMesh);
}

init();

function title()
{

	// Name Title
	text(optimerBoldFont, "Cursus", 20, 2, 8, lightPink,
		new THREE.Vector3(0, 100, 10)
	);
}

function homePageButton()
{
	// Picture Button
	const texture = new THREE.TextureLoader().load("textures/pictures/cv_picture_house.jpg");
	const buttonGeometry = new THREE.CircleGeometry(30, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
	buttonMesh.position.set(-320, 130, 10); // put it in front of camera
	scene.add(buttonMesh);

	// Pink Frame
	const frameGeometry = new THREE.CircleGeometry(32, 32);
	const frameMaterial = new THREE.MeshPhongMaterial({color: darkPink});
	frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
	frameMesh.position.set(-320, 130, 9.9); // put it in front of camera
	scene.add(frameMesh);
}

function sparklethread()
{
	const sparkTexture = new THREE.TextureLoader().load('textures/sprites/sparkle.png');
	const sparkMaterial = new THREE.SpriteMaterial({
		map: sparkTexture,
		color: 0xffffaa,
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

function createDates()
{
	for(let i = 0; i < 4; i++) {
		text(optimerBoldFont, years[i], 10, 1, 8, lightPink, yearsPos[i]);
	}
}

function addLogos(){

	for(let i=0; i<4; i++)
	{
		// Picture Logo
		const texture = new THREE.TextureLoader().load(`textures/pictures/school/${logosName[i]}`);
		const logoGeometry = new THREE.CircleGeometry(20, 32);
		const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
		logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
		logoMesh.position.set(logosPos[i].x, logosPos[i].y, logosPos[i].z); // put it in front of camera
		scene.add(logoMesh); 
		logos.push(logoMesh);

		// Frame
		const frameGeometry = new THREE.CircleGeometry(22, 32);
		const frameMaterial = new THREE.MeshPhongMaterial({color: darkPink});
		frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
		frameMesh.position.set(logosPos[i].x, logosPos[i].y, logosPos[i].z-0.1); // put it in front of camera
		scene.add(frameMesh);
		logoFrames.push(frameMesh);
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

	// Dates
	createDates();

	// Logos
	addLogos();

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

  	const intersectLogoBac = raycaster.intersectObjects([logos[0]]);
	const popupBac = document.getElementById("popupBac");
	if (intersectLogoBac.length > 0) {
		popupBac.style.display = "block"; 
	}else {
		popupBac.style.display = "none";
  	}

  	const intersectLogoMPSI = raycaster.intersectObjects([logos[1]]);
	const popupMPSI = document.getElementById("popupMPSI");
	if (intersectLogoMPSI.length > 0) {
		popupMPSI.style.display = "block"; 
	}else {
		popupMPSI.style.display = "none";
  	}

  	const intersectLogoENSISA = raycaster.intersectObjects([logos[2]]);
	const popupENSISA = document.getElementById("popupENSISA");
	if (intersectLogoENSISA.length > 0) {
		popupENSISA.style.display = "block"; 
	}else {
		popupENSISA.style.display = "none";
  	}

  	const intersectLogoUQAC = raycaster.intersectObjects([logos[3]]);
	const popupUQAC = document.getElementById("popupUQAC");
	if (intersectLogoUQAC.length > 0) {
		popupUQAC.style.display = "block"; 
	}else {
		popupUQAC.style.display = "none";
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

function animLogos(now){
	logos.forEach(logo => {
		const seconds = Math.floor(now / 1000);
		const y = (seconds % 2) ? 0.005 : -0.005;

		logo.position.add(new THREE.Vector3(
			0,
			y,
			0
		));
	});

	logoFrames.forEach(logoFrame => {
		const seconds = Math.floor(now / 1000);
		const y = (seconds % 2) ? 0.005 : -0.005;

		logoFrame.position.add(new THREE.Vector3(
			0,
			y,
			0
		));
	});
}

function animate() {
	controls.update();

	const now = performance.now();
	const time = now * 0.0005;

	// Animate thread sparkles
	animThreadSparkles(time);

	// Animate logos
	animLogos(now);

  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );