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

// Prog Languages
const logosName = [
	"cpp.jpg", "python.png", "java.jpg", "js.png", "c.png", "html.webp",
	"caml.jpg", "php.png"
];
const xLogos = -330;
const yLogos = [
	30, 6, -18, -43, -66, -90, -114, -138
]; // 40
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
let logos = [];
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


init();

// Util
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
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("Compétences", {
				font: font,
				size: 20,
				depth: 2,
				height: 0,
				curveSegments: 8
			});
			textGeo.center();
			
			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({ color: lightPink});
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
	const buttonGeometry = new THREE.CircleGeometry(30, 32);
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
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("LANGAGES INFORMATIQUES", {
				font: font,
				size: 8,
				depth: 1,
				height: 0,
				curveSegments: 8
			});
			textGeo.center();
			
			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({ color: lightPink});
			textMesh = new THREE.Mesh(textGeo, textMat);
			textMesh.position.set(-250, 50, 10);

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
		logos.push(logoMesh);
	}

	// Stars
	for(let i=0; i<22; i++)
	{
		createStar(starsPos[i]);
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

function animate() {
    requestAnimationFrame(animate);
  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );