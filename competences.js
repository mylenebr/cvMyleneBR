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
	addQualities();
	addLanguages();
	addProgLang();
});
let optimerRegularFont = null;
loader.load('fonts/optimer_regular.typeface.json', (font) => {
	optimerRegularFont = font;
	addQualities();
	addLanguages();
});

// Init variables
let camera, scene, renderer, controls, raycaster, mouse;

// Colors
let lightPink = 0xFFE3F0;
let darkPink = 0x5C1F36;
let black = 0x000000;
let backgroundPink = 0x614850; //0xC7B1BD;

// Header
let textMesh, buttonMesh, frameMesh;

// Prog Languages
const logosName = [
	"cpp.jpg", "python.png", "java.jpg", "js.png", "c.png", "html.webp",
	"caml.jpg", "php.png"
];
const xLogos = -325;
const yLogos = [
	30, 6, -18, -43, -66, -90, -114, -138
];
const logosPos = [
	new THREE.Vector3(xLogos, yLogos[0], 10), 
	new THREE.Vector3(xLogos, yLogos[1], 10), 
	new THREE.Vector3(xLogos, yLogos[2], 10),
	new THREE.Vector3(xLogos, yLogos[3], 10),
	new THREE.Vector3(xLogos, yLogos[4], 10), 
	new THREE.Vector3(xLogos, yLogos[5], 10), 
	new THREE.Vector3(xLogos, yLogos[6], 10), 
	new THREE.Vector3(xLogos, yLogos[7], 10), 
];
let logoMesh;

// Prog Stars
const xStars = [
	-290, -265, -240, -215,-190
];
const starsPos = [
	new THREE.Vector3(xStars[0], yLogos[0], 10), new THREE.Vector3(xStars[1], yLogos[0], 10), new THREE.Vector3(xStars[2], yLogos[0], 10), new THREE.Vector3(xStars[3], yLogos[0], 10), new THREE.Vector3(xStars[4], yLogos[0], 10),// cpp
	new THREE.Vector3(xStars[0], yLogos[1], 10), new THREE.Vector3(xStars[1], yLogos[1], 10), new THREE.Vector3(xStars[2], yLogos[1], 10), new THREE.Vector3(xStars[3], yLogos[1], 10), // python
	new THREE.Vector3(xStars[0], yLogos[2], 10), new THREE.Vector3(xStars[1], yLogos[2], 10), new THREE.Vector3(xStars[2], yLogos[2], 10),// java
	new THREE.Vector3(xStars[0], yLogos[3], 10), new THREE.Vector3(xStars[1], yLogos[3], 10), new THREE.Vector3(xStars[2], yLogos[3], 10),// js
	new THREE.Vector3(xStars[0], yLogos[4], 10), new THREE.Vector3(xStars[1], yLogos[4], 10),// c
	new THREE.Vector3(xStars[0], yLogos[5], 10), new THREE.Vector3(xStars[1], yLogos[5], 10),// html
	new THREE.Vector3(xStars[0], yLogos[6], 10), new THREE.Vector3(xStars[1], yLogos[6], 10),// caml
	new THREE.Vector3(xStars[0], yLogos[7], 10),// php
];

// Flags
const flagsName = [
	"fr.jpg", "gb.png", "it.jpg"
];
const xFlags = 175;
const yFlags = [
	10, -50, -110
];
const flagsPos = [
	new THREE.Vector3(xFlags, yFlags[0], 10), 
	new THREE.Vector3(xFlags, yFlags[1], 10), 
	new THREE.Vector3(xFlags, yFlags[2], 10),
];
let flagMesh;
let flags = [];
let flagsFrames = [];

// Thread poses
let sparks = [];
const threadPos = [
	new THREE.Vector3(-160, -20, 10), 
	new THREE.Vector3(0, -50, 10), 
	new THREE.Vector3(120, 50, 10), 
	// Start star
	/*new THREE.Vector3(200, 130, 10), 
	new THREE.Vector3(270, 132, 10), 
	new THREE.Vector3(200, 82, 10), 
	new THREE.Vector3(230, 180, 10), 
	new THREE.Vector3(260, 82, 10), 
	new THREE.Vector3(180, 115, 10), 
	new THREE.Vector3(170, 50, 10), */
	// End star
	new THREE.Vector3(150, 50, 10), 
	new THREE.Vector3(180, 20, 10),
	new THREE.Vector3(150, -20, 10),
	new THREE.Vector3(180, -60, 10),
	new THREE.Vector3(190, -80, 10),
	new THREE.Vector3(180, -100, 10)
];
const curve = new THREE.CatmullRomCurve3(threadPos);
const frames = curve.computeFrenetFrames(100, true);

init();

// Utils
function createRoundedRectShape(width, height, radius) {
    const x = -width / 2;
    const y = -height / 2;

    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);

    return shape;
}

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


function createStar(pos)
{
	const pts = [], numPts = 5;
	for ( let i = 0; i < numPts * 2; i ++ ) {
		const l = i % 2 == 1 ? 4 : 8;
		const a = i / numPts * Math.PI;
		pts.push( new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
	}
	const starShape = new THREE.Shape(pts);
	const material = new THREE.MeshLambertMaterial({ color: lightPink, wireframe: false });

	const starDepth = 2;
	const extrudeSettings = {
		depth: starDepth,
		steps: 1
	};
	const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
	const star = new THREE.Mesh(starGeo, material);
	star.position.set(pos.x, pos.y, pos.z);
	star.userData.isHovered = false;

	scene.add(star);
}

// Note : generaliser la fonction de texte car je reutilise le meme code
// dans 'addProgLang'
function title()
{
	// Name Title
	text(optimerBoldFont, "Compétences", 20, 2, 8, lightPink,
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

function addProgLang()
{
	// Frame
	const shape = createRoundedRectShape(200, 230, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(-250, -40, 9.9);
	scene.add(roundedPlaneMesh);

	// Title
	text(optimerBoldFont, "LANGAGES INFORMATIQUES", 8, 1, 8, lightPink,
		new THREE.Vector3(-250, 55, 10)
	);

	// Logos
	for(let i=0; i<8; i++)
	{
		// Picture Logo
		const texture = new THREE.TextureLoader().load(`textures/pictures/prog_languages/${logosName[i]}`);
		const logoGeometry = new THREE.CircleGeometry(10, 32);
		const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
		logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
		logoMesh.position.set(logosPos[i].x, logosPos[i].y, logosPos[i].z); // put it in front of camera
		scene.add(logoMesh); 
	}

	// Stars
	for(let i=0; i<22; i++)
	{
		createStar(starsPos[i]);
	}
}

function addQualities()
{
	// Frame
	const shape = createRoundedRectShape(200, 230, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(0, -40, 9.9);
	scene.add(roundedPlaneMesh);

	// Title
	text(optimerBoldFont, "QUALITÉS", 8, 1, 8, lightPink,
		new THREE.Vector3(0, 55, 10)
	);

	// Text
	const qualityPres = "Je suis une personne \n"
					+ "travailleuse, appliquée \n"
					+ "et organisée. \n \n"
					+ "J'ai également un fort \n"
					+ "sens de l'analyse et \n" 
					+ "un goût prononcé pour \n"
					+ "les travaux en équipes.";
	text(optimerRegularFont, qualityPres, 10, 1, 8, lightPink,
		new THREE.Vector3(0, -50, 10)
	);
}

function addLanguages()
{
	// Frames
	for(let i=0; i<3; i++){
		const shape = createRoundedRectShape(170, 30, 10);
		const geometry = new THREE.ShapeGeometry(shape);
		const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
		const roundedPlaneMesh = new THREE.Mesh(geometry, material);
		roundedPlaneMesh.position.set(250, yFlags[i], 9.9);
		scene.add(roundedPlaneMesh);
	}

	// Title
	text(optimerBoldFont, "LANGUES", 8, 1, 8, lightPink,
		new THREE.Vector3(250, 55, 10)
	);

	// Flags
	for(let i=0; i<3; i++)
	{
		// Picture Flags
		const texture = new THREE.TextureLoader().load(`textures/pictures/flags/${flagsName[i]}`);
		const flagGeometry = new THREE.CircleGeometry(20, 32);
		const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
		flagMesh = new THREE.Mesh(flagGeometry, buttonMaterial);
		flagMesh.position.set(flagsPos[i].x, flagsPos[i].y, flagsPos[i].z); // put it in front of camera
		scene.add(flagMesh); 
		flags.push(flagMesh);

		// Frame
		const frameGeometry = new THREE.CircleGeometry(22, 32);
		const frameMaterial = new THREE.MeshPhongMaterial({color: darkPink});
		frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
		frameMesh.position.set(flagsPos[i].x, flagsPos[i].y, flagsPos[i].z-0.1); // put it in front of camera
		scene.add(frameMesh);
		flagsFrames.push(frameMesh);
	}

	// Text
	const spokenLang = ["Natif", "Avancé (C1: 960 points au TOEIC)", "Débutant (A2)"];
	const xLang = [250, 260, 250];
	for(let i=0; i<3; i++)
	{
		text(optimerRegularFont, spokenLang[i], 6, 1, 8, lightPink,
			new THREE.Vector3(xLang[i], yFlags[i], 10)
		);
	}
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

	// Prog Lang
	addProgLang();

	// Qualities
	addQualities();

	// Spoken Languages
	addLanguages();

	// Thread
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

function animLogos(now){
	flags.forEach(flag => {
		const seconds = Math.floor(now / 1000);
		const y = (seconds % 2) ? 0.001 : -0.001;

		flag.position.add(new THREE.Vector3(
			0,
			y,
			0
		));
	});

	flagsFrames.forEach(flagFrame => {
		const seconds = Math.floor(now / 1000);
		const y = (seconds % 2) ? 0.001 : -0.001;

		flagFrame.position.add(new THREE.Vector3(
			0,
			y,
			0
		));
	});
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
	controls.update();

	const now = performance.now();

	//animLogos(now);

	animThreadSparkles(now*0.0005);
  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );