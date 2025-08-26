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
const clock = new THREE.Clock();

// Colors
let lightPink = 0xFFE3F0;
let darkPink = 0x5C1F36; // rgb = 92, 31, 54 
let backgroundPink = 0x614850; //0xC7B1BD;
let black = 0x000000;

// Header 
let textMesh, buttonMesh, frameMesh;

// XP poses
let sparks = [];
const yArrow = -30;
const xpPoses = [
	new THREE.Vector3(-350, -30+yArrow, 10), // Maths 2018
	new THREE.Vector3(-330, -30+yArrow, 10), // Maths 2021
	new THREE.Vector3(-260, 0+yArrow, 10), // Stage rectorat 2021
	new THREE.Vector3(-170, -30+yArrow, 10), //  McDo 2022
	new THREE.Vector3(-70, 0+yArrow, 10), // FOLKS Pipeline 2022-2023
	new THREE.Vector3(50, -30+yArrow, 10), // FOLKS interniship 2023-2024
	new THREE.Vector3(170, 0+yArrow, 10), // FOLKS R&D 2024-2025
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

// Dates
const years = [
	"2018", "2021", "2022", "2023", "2024", "2025"
];

const yYears = -110+yArrow;
const yearsPos = [
	new THREE.Vector3(-350, yYears, 10),
	new THREE.Vector3(-300, yYears, 10),
	new THREE.Vector3(-130, yYears, 10),
	new THREE.Vector3(0, yYears, 10),
	new THREE.Vector3(100, yYears, 10),
	new THREE.Vector3(200, yYears, 10),
];

// Logos
const logosName = [
	"maths.jpg", "reseaux.jpg", "mcdo.jpg", "pb.jpeg", "pb.jpeg", "pb.jpeg"
];
const logosPos = [
	new THREE.Vector3(-350, -60+yArrow, 10), // Maths 2018
	new THREE.Vector3(-260, 30+yArrow, 10), // Stage rectorat 2021
	new THREE.Vector3(-170, -60+yArrow, 10), //  McDo 2022
	new THREE.Vector3(-70, 30+yArrow, 10), // FOLKS Pipeline 2022-2023
	new THREE.Vector3(50, -60+yArrow, 10), // FOLKS interniship 2023-2024
	new THREE.Vector3(170, 30+yArrow, 10), // FOLKS R&D 2024-2025
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
	text(optimerBoldFont, "Expérience", 20, 2, 8, lightPink,
		new THREE.Vector3(0, 100, 10)
	);
}

function homePageButton()
{
	// Picture Button
	const texture = new THREE.TextureLoader().load("textures/pictures/cv_picture_house.jpg");
	const buttonGeometry = new THREE.CircleGeometry(30, 30);
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
	for(let i = 0; i < 6; i++) {
		text(optimerBoldFont, years[i], 10, 1, 8, lightPink, yearsPos[i]);
	}
}

function addLogos(){

	for(let i=0; i<6; i++)
	{
		// Picture Logo
		const texture = new THREE.TextureLoader().load(`textures/pictures/companies/${logosName[i]}`);
		const logoGeometry = new THREE.CircleGeometry(20, 20);
		const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
		logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
		logoMesh.position.set(logosPos[i].x, logosPos[i].y, logosPos[i].z); // put it in front of camera
		scene.add(logoMesh); 
		logos.push(logoMesh);

		// Frame
		const frameGeometry = new THREE.CircleGeometry(22, 22);
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

  	const intersectLogoMath = raycaster.intersectObjects([logos[0]]);
	const popupMath = document.getElementById("popupMath");
	if (intersectLogoMath.length > 0) {
		popupMath.style.display = "block"; 
	}else {
		popupMath.style.display = "none";
  	}

  	const intersectLogoNetwork = raycaster.intersectObjects([logos[1]]);
	const popupNetwork = document.getElementById("popupNetwork");
	if (intersectLogoNetwork.length > 0) {
		popupNetwork.style.display = "block"; 
	}else {
		popupNetwork.style.display = "none";
  	}

  	const intersectLogoMcdo = raycaster.intersectObjects([logos[2]]);
	const popupMcdo = document.getElementById("popupMcdo");
	if (intersectLogoMcdo.length > 0) {
		popupMcdo.style.display = "block"; 
	}else {
		popupMcdo.style.display = "none";
  	}

  	const intersectLogoPipe = raycaster.intersectObjects([logos[3]]);
	const popupPipe = document.getElementById("popupPipe");
	if (intersectLogoPipe.length > 0) {
		popupPipe.style.display = "block"; 
	}else {
		popupPipe.style.display = "none";
  	}

  	const intersectLogoInternPB = raycaster.intersectObjects([logos[4]]);
	const popupInternPB = document.getElementById("popupInternPB");
	if (intersectLogoInternPB.length > 0) {
		popupInternPB.style.display = "block"; 
	}else {
		popupInternPB.style.display = "none";
  	}

  	const intersectLogoPB = raycaster.intersectObjects([logos[5]]);
	const popupPB = document.getElementById("popupPB");
	if (intersectLogoPB.length > 0) {
		popupPB.style.display = "block"; 
	}else {
		popupPB.style.display = "none";
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

	const now = clock.getDelta();

	// Animate thread sparkles
	animThreadSparkles(now * 0.0005);

	// Animate logos
	animLogos(now);

  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );