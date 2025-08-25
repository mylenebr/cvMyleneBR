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
const leftX = -265;
const smallRange = 10;
const upY = 70;
const longRange = 30;
const downY = -170; //170?
const rightX = 265;
const threadPos = [
	new THREE.Vector3(leftX, upY, 10), // Left
	new THREE.Vector3(leftX-smallRange, upY-longRange, 10), 
	new THREE.Vector3(leftX, upY-longRange*2, 10), 
	new THREE.Vector3(leftX-smallRange, upY-longRange*3, 10), 
	new THREE.Vector3(leftX, upY-longRange*4, 10),
	new THREE.Vector3(leftX-smallRange, upY-longRange*5, 10), 
	new THREE.Vector3(leftX, upY-longRange*6, 10), 
	new THREE.Vector3(leftX-smallRange, upY-longRange*7, 10), 
	new THREE.Vector3(leftX, upY-longRange*8-5, 10),
	new THREE.Vector3(leftX+longRange, downY, 10), // Down
	new THREE.Vector3(leftX+longRange*2, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*3, downY, 10),
	new THREE.Vector3(leftX+longRange*4, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*5, downY, 10),
	new THREE.Vector3(leftX+longRange*6, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*7, downY, 10),
	new THREE.Vector3(leftX+longRange*8, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*9, downY, 10),
	new THREE.Vector3(leftX+longRange*10, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*11, downY, 10),
	new THREE.Vector3(leftX+longRange*12, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*13, downY, 10),
	new THREE.Vector3(leftX+longRange*14, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*15, downY, 10),
	new THREE.Vector3(leftX+longRange*16, downY-smallRange, 10),
	new THREE.Vector3(leftX+longRange*17, downY, 10),
	new THREE.Vector3(leftX+longRange*18-10, downY-smallRange, 10),
	new THREE.Vector3(rightX+smallRange, downY+longRange, 10),// Right
	new THREE.Vector3(rightX, downY+longRange*2, 10),
	new THREE.Vector3(rightX+smallRange, downY+longRange*3, 10),
	new THREE.Vector3(rightX, downY+longRange*4, 10),
	new THREE.Vector3(rightX+smallRange, downY+longRange*5, 10),
	new THREE.Vector3(rightX, downY+longRange*6, 10),
	new THREE.Vector3(rightX+smallRange, downY+longRange*7, 10),
	new THREE.Vector3(rightX, downY+longRange*8, 10),
	new THREE.Vector3(rightX-longRange, upY, 10), // Up
	new THREE.Vector3(rightX-longRange*2, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*3, upY, 10),
	new THREE.Vector3(rightX-longRange*4, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*5, upY, 10),
	new THREE.Vector3(rightX-longRange*6, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*7, upY, 10),
	new THREE.Vector3(rightX-longRange*8, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*9, upY, 10),
	new THREE.Vector3(rightX-longRange*10, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*11, upY, 10),
	new THREE.Vector3(rightX-longRange*12, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*13, upY, 10),
	new THREE.Vector3(rightX-longRange*14, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*15, upY, 10),
	new THREE.Vector3(rightX-longRange*16, upY+smallRange, 10),
	new THREE.Vector3(rightX-longRange*17, upY, 10),
	new THREE.Vector3(leftX, upY, 10)
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

function title()
{

	// Name Title
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("Présentation", {
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
	const texture = new THREE.TextureLoader().load("textures/pictures/cv_picture_house.jpg");
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

function addIntro()
{
	// Frame
	const shape = createRoundedRectShape(500, 230, 10);
	const geometry = new THREE.ShapeGeometry(shape);
	const material = new THREE.MeshStandardMaterial({ color: darkPink, side: THREE.DoubleSide });
	const roundedPlaneMesh = new THREE.Mesh(geometry, material);
	roundedPlaneMesh.position.set(0, -50, 9.9);
	scene.add(roundedPlaneMesh);

	// Text
	const text = "1 mois apres mon arrivée au Canada dans le cadre d'un echange avec mon \n" 
				+ "ecole d'ingenieur en informatique, j'ai trouve un travail au sein du pipeline \n"
				+ "de Pitch Black (Folks VFX a l'epoque) a temps partiel, a cote de mes etudes que\n"
				+ "je pursuivait a l'Universite du quebec a chicoutimi.\n"
				+ "Je ne connaissait rien au monde des effetx visuels et de l'animation hormis \n"
				+ "que j'aimais les regarder. Et bien que pendant ces 10 mois au sein du pipeline\n"
				+ "je n'y touchais pas directement, j'appreciais enormement ce domaine et souhaitais\n"
				+ "l'approfondir.\n"
				+ "J'ai donc demande a mon superviseur si je pouvais effectuer mon stage de fin\n"
				+ "d'etudes a leur cote mais dans l'equipe de Recherche et Developpement afin de\n"
				+ "pouvoir approfondir mes connaissances en 3D et de mettre a profit\n"
				+ "ma formation en mathematiques et physique. \n"
				+ "A la fin de mon stage j'ai obtenu mes deux diplomes : Ingenieur en informatique\n"
				+ "et reseaux (ENSISA, France), et Maitrise en informatique (UQAC, Canada), mais \n"
				+ "je ressentais que mon aventure au Quebec n'etais pas terminee, je suis donc reste\n"
				+ "1 an et demi de plus, toujours dans l'equipe de R&D de Pitch Black.\n"
				+ "J'ai recemment decide de rentrer en France, et je suis actuellement a la\n"
				+ "recherche d'un emploi dans le meme domaine pour continuer d'y apprendre et evoluer\n"
				+ "Je vous invite a explorer mon web CV pour en apprendre plus sur moi, \n"
				+ "mes competences, mon experiences, mes passions, etc.\n"
				+ "Et je repondrais a vos questions avec plaisir donc n'hesitez pas a me contacter ! :)\n"
				+ "\n Mylene" ;

	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_regular.typeface.json',
		function (font) {
			const textGeo = new TextGeometry(text, {
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
			textMesh.position.set(0, 50, 10);

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

function addPictures()
{
	// UQAC
	const textureUQAC = new THREE.TextureLoader().load(`textures/pictures/intro/uqac.JPG`);
	const uqacGeometry = new THREE.CircleGeometry(25, 32);
	const uqacMaterial = new THREE.MeshBasicMaterial({map: textureUQAC, transparent: false });
	const uqacMesh = new THREE.Mesh(uqacGeometry, uqacMaterial);
	uqacMesh.position.set(-260, 40, 10); // put it in front of camera
	scene.add(uqacMesh); 

	// Ensisa
	const textureEnsisa = new THREE.TextureLoader().load(`textures/pictures/intro/ensisa.jpeg`);
	const ensisaGeometry = new THREE.CircleGeometry(25, 32);
	const ensisaMaterial = new THREE.MeshBasicMaterial({map: textureEnsisa, transparent: false });
	const ensisaMesh = new THREE.Mesh(ensisaGeometry, ensisaMaterial);
	ensisaMesh.position.set(260, -20, 10); // put it in front of camera
	scene.add(ensisaMesh); 

	// Canada
	const textureCanada = new THREE.TextureLoader().load(`textures/pictures/intro/canada.jpeg`);
	const canadaGeometry = new THREE.CircleGeometry(25, 32);
	const canadaMaterial = new THREE.MeshBasicMaterial({map: textureCanada, transparent: false });
	const canadaMesh = new THREE.Mesh(canadaGeometry, canadaMaterial);
	canadaMesh.position.set(-250, -140, 10); // put it in front of camera
	scene.add(canadaMesh); 
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

	// Introduction
	addIntro();

	// Pictures
	addPictures();

	// Thread (wave around the rect)
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