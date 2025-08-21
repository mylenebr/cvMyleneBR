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


// Thread poses
let sparks = [];
const threadPos = [
	new THREE.Vector3(-160, -90, 10), 
	new THREE.Vector3(-40, 20, 10), 
	new THREE.Vector3(-30, -100, 10), 
	new THREE.Vector3(120, -170, 10), 
	new THREE.Vector3(150, 60, 10),
	new THREE.Vector3(250, -20, 10)
];
const curve = new THREE.CatmullRomCurve3(threadPos);
const frames = curve.computeFrenetFrames(100, true);

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

function addText(text, size, depth, height, curveSegments,
	color, pos)
{
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry(text, {
				font: font,
				size: size,
				depth: depth,
				height: height,
				curveSegments: curveSegments
			});
			textGeo.center();
			
			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({color: color});
			textMesh = new THREE.Mesh(textGeo, textMat);
			textMesh.position.set(pos.x, pos.y, pos.z);

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

function title()
{

	// Name Title
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("Intérêts", {
				font: font,
				size: 20,
				depth: 2,
				height: 0,
				curveSegments: 8
			});
			textGeo.center();
			
			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({ color: lightPink });
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

function addMusic()
{
	// Frame
	const shape = createRoundedRectShape(200, 180, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(-250, -60, 9.9);
	scene.add(roundedPlaneMesh);

	// Picture
	const texture = new THREE.TextureLoader().load(`textures/pictures/hobbies/music.JPG`);
	const logoGeometry = new THREE.CircleGeometry(30, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	const logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
	logoMesh.position.set(-300, 40, 10); // put it in front of camera
	scene.add(logoMesh); 

	// Text
	const musicText = "La majorité de mon temps libre \nest consacrée à la musique : \nchant, guitare, piano, \ncomposition, production, etc. \nJouer avec des amis ou seule, \nsur scène ou dans ma chambre, \ntout ce qui y est attrait \nme fais vibrer.";
	addText(musicText, 8, 1, 0, 8, lightPink, new THREE.Vector3(-250, -60, 10));
}

function addBooks()
{
	// Frame
	const shape = createRoundedRectShape(200, 80, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(0, -12, 9.9);
	scene.add(roundedPlaneMesh);

	// Picture
	const texture = new THREE.TextureLoader().load(`textures/pictures/hobbies/books.jpg`);
	const logoGeometry = new THREE.CircleGeometry(15, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	const logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
	logoMesh.position.set(70, -30, 10); // put it in front of camera
	scene.add(logoMesh); 

	// Text
	const musicText = "Un autres de mes passe temps \nfavoris est la lecture, un temps \nd'attente ? J'ai toujours un \nlivre dans mon sac a sortir \npour le remplir !";
	addText(musicText, 7, 1, 0, 8, lightPink, new THREE.Vector3(-10, -12, 10));
}

function addAsso()
{
	// Frame
	const shape = createRoundedRectShape(200, 85, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(0, -112, 9.9);
	scene.add(roundedPlaneMesh);

	// Picture
	const texture = new THREE.TextureLoader().load(`textures/pictures/hobbies/asso.jpg`);
	const logoGeometry = new THREE.CircleGeometry(15, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	const logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
	logoMesh.position.set(70, -130, 10); // put it in front of camera
	scene.add(logoMesh); 

	// Text
	const musicText = "J'aime egalement m'impliquer dans la vie \nassociative. En ecole d'ingenieur j'etais \npresidente de plusieurs assos/club. \nEt tout au long de mes etudes j'ai \nparticipe dans plusieurs clubs \nsportifs et de musique.";
	addText(musicText, 6, 1, 0, 8, lightPink, new THREE.Vector3(-10, -112, 10));
}

function addSpanish()
{
	// Frame
	const shape = createRoundedRectShape(200, 180, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(250, -60, 9.9);
	scene.add(roundedPlaneMesh);

	// Picture
	const texture = new THREE.TextureLoader().load(`textures/pictures/hobbies/spain.png`);
	const logoGeometry = new THREE.CircleGeometry(30, 32);
	const buttonMaterial = new THREE.MeshBasicMaterial({map: texture, transparent: false });
	const logoMesh = new THREE.Mesh(logoGeometry, buttonMaterial);
	logoMesh.position.set(300, -140, 10); // put it in front of camera
	scene.add(logoMesh); 

	// Text
	const spainText = "Puisque que j'aime toujours \napprendre, j'ai récement décidé \nd'étudier l'espagnol. J'ai choisis \ncette langue pour deux raisons \nmajeurs: c'est une langue parlée \ndans beaucoup de pays (que j'aimerais \nvisiter un jour), et la culture\nhispanique m'intéresse de plus en plus, \nen particulier (vous l'aurez peut-etre \ndevine) la musique \nhispanophone !";
	addText(spainText, 7, 1, 0, 8, lightPink, new THREE.Vector3(250, -60, 10));
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

	// Music
	addMusic();

	// Books
	addBooks();

	// Asso
	addAsso();

	// Spanish
	addSpanish();
	
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
	controls.update();

	const now = performance.now();
	animThreadSparkles(now*0.005);

  	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );