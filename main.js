

import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let camera, scene, renderer, controls, raycaster, mouse, parameters;
let stars = [];
let sparks = [];
const materials = []; //SF

// Zoom/click on stars
let targetStar = null; // the star we clicked
let zooming = false;
let zoomStart = 0;
let zoomDuration = 1000; // ms (1s)
let zoomStartPos = null;

// Colors
let lightPink = 0xFFC2DE;
let darkPink = 0x5C1F36;
let backgroundPink = 0x614850; //0xC7B1BD;

// Star poses
const starPoses = [
    new THREE.Vector3(-250, 50, 10),
    new THREE.Vector3(-150, -100, 10),
    new THREE.Vector3(-50, 30, 10),
    new THREE.Vector3(30, -120, 10),
    new THREE.Vector3(200, 20, 10),
];
const curve = new THREE.CatmullRomCurve3(starPoses);
const frames = curve.computeFrenetFrames(100, true); // precompute 100 segments


init();

function header()
{

	// Name Title
	const loaderHeader = new FontLoader();
	loaderHeader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry("Mylène Bénier-Rollet", {
			font: font,
			size: 20,
			depth: 5,
			height: 0,
			curveSegments: 8
			});

			// Center text above the star
			textGeo.computeBoundingBox();
			const w = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
			const d = 1;
			//textGeo.translate(-w / 2, 1.5, d); // X center, Y above sphere, Z same

			//const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			const textMat = new THREE.MeshPhongMaterial({ color: lightPink, metalness: 0.5, roughness: 0.5 });
			const textMesh = new THREE.Mesh(textGeo, textMat);
			textMesh.position.set(-150, 100, 10);

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

function createSparkleSprites(mesh, count = 200, radius = 50) {
  	const sparks = [];

	const spriteMat = new THREE.SpriteMaterial({
		map: new THREE.TextureLoader().load('textures/sprites/sparkle.png'),
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	});

	for (let i = 0; i < count; i++) {
		const sprite = new THREE.Sprite(spriteMat);
		sprite.scale.set(5, 5, 1);

		// store original position & motion speed
		sprite.userData = {
		basePos: new THREE.Vector3(
			(Math.random() - 0.5) * radius,
			(Math.random() - 0.5) * radius,
			(Math.random() - 0.5) * radius
		),
		speed: Math.random() * 1.5 + 0.5,
		phase: Math.random() * Math.PI * 2
		};

		sprite.position.copy(sprite.userData.basePos);
		mesh.add(sprite);
		sparks.push(sprite);
	}
  	mesh.userData.sparks = sparks;
}

function createStar(pos, starName, starPage)
{
	const pts = [], numPts = 5;
	for ( let i = 0; i < numPts * 2; i ++ ) {
		const l = i % 2 == 1 ? 10 : 20;
		const a = i / numPts * Math.PI;
		pts.push( new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
	}
	const starShape = new THREE.Shape(pts);
	const materialExt = new THREE.MeshLambertMaterial( { color: darkPink, wireframe: false } );
	const materialInt = new THREE.MeshLambertMaterial( { color: lightPink, wireframe: false } );
	const materials = [ materialInt, materialExt ];

	const starDepth = 20;
	const extrudeSettings = {
		depth: starDepth,
		steps: 1,
		bevelEnabled: true,
		bevelThickness: 2,
		bevelSize: 4,
		bevelSegments: 1
	};
	const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
	const star = new THREE.Mesh(starGeo, materials);
	star.position.set(pos.x, pos.y, pos.z);
	star.userData.isHovered = false;
	star.name = starName;

	// add text to star
	// Load font and attach text to THIS star
	const loader = new FontLoader();
	loader.load(
		'fonts/optimer_bold.typeface.json',
		function (font) {
			const textGeo = new TextGeometry(starPage, {
			font: font,
			size: 10,
			depth: 5,
			height: 0,
			curveSegments: 8
			});

			// Center text above the star
			textGeo.computeBoundingBox();
			const w = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
			const d = starDepth + 1;
			textGeo.translate(-w / 2, 1.5, d); // X center, Y above sphere, Z same

			const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
			//const textMat = new THREE.MeshPhongMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.5 });
			const textMesh = new THREE.Mesh(textGeo, textMat);

			star.add(textMesh);
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
	//end add text

	// add sparkles
	//createSparkleSprites(star);

	return star;
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

function snowParticles(){
	scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
	const geometry = new THREE.BufferGeometry();
	const vertices = [];
	const textureLoader = new THREE.TextureLoader();
	const assignSRGB = ( texture ) => {
		texture.colorSpace = THREE.SRGBColorSpace;
	};
	const sprite1 = textureLoader.load('textures/sprites/snowflake2.png', assignSRGB);
	sprite1.colorSpace = THREE.SRGBColorSpace;
	const sprite2 = textureLoader.load('textures/sprites/snowflake4.png', assignSRGB);
	sprite2.colorSpace = THREE.SRGBColorSpace;
	const sprite3 = textureLoader.load('textures/sprites/snowflake5.png', assignSRGB);
	sprite3.colorSpace = THREE.SRGBColorSpace;
	for ( let i = 0; i < 5000; i ++ ) {
		const x = Math.random() * 2000 - 1000;
		const y = Math.random() * 2000 - 1000;
		const z = Math.random() * 2000 - 1000;
		vertices.push( x, y, z );
	}
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
	parameters = [
		[[ 0.92, 0.31, 0.54  ], sprite1, 20 ],
		[[ 1, 1, 1 ], sprite2, 11 ],
		[[ 0.92, 0.31, 0.54 ], sprite3, 6 ]
	];
	for (let i = 0; i < parameters.length; i ++) {
		const color = parameters[i][0];
		const sprite = parameters[i][1];
		const size = parameters[i][2];
		materials[i] = new THREE.PointsMaterial({ size: size, 
			map: sprite, 
			blending: THREE.AdditiveBlending, 
			depthTest: false, 
    		depthWrite: false,
			transparent: true });
		materials[i].color.setHSL(color[0], color[1], color[2]);
		const particles = new THREE.Points(geometry, materials[i]);
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add(particles);
	}
}

function startZoom(star) {
    targetStar = star;
    zoomStart = performance.now();
    zooming = true;
    zoomStartPos = camera.position.clone(); // 🔑 store starting position
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
	header();

	// Snow Particles
	snowParticles();

	// Stars
	const star1 = createStar(starPoses[0], "star1", "Experience");
	scene.add(star1); 
	const star2 = createStar(starPoses[1], "star2", "Compétences");
	scene.add(star2); 
	const star3 = createStar(starPoses[2], "star3", "Présentation");
	scene.add(star3); 
	const star4 = createStar(starPoses[3], "star4", "Intérets");
	scene.add(star4); 
	const star5 = createStar(starPoses[4], "star5", "Cursus");
	scene.add(star5); 

	stars.push(star1); stars.push(star2); stars.push(star3); stars.push(star4); stars.push(star5);

	// Thread between stars
	sparklethread();


	// Raycaster setup
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('click', onClick);
	window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(stars);

  // If hovering, start spin if not already spinning
  intersects.forEach(intersect => {
    const star = intersect.object;
    if (!star.userData.spinning) {
      star.userData.spinning = true;
      star.userData.startRotation = star.rotation.y;
      star.userData.targetRotation = star.rotation.y + Math.PI * 2; // 1 full spin
    }
  });
}

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(stars);

  if (intersects.length > 0) {
	startZoom(intersects[0].object); // store start position
  }
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let last = performance.now();
function animate() {
    requestAnimationFrame(animate); //pour tubes
	controls.update();

	const now = performance.now();

	// Animate thread sparkles
	const time = now * 0.0005;
	sparks.forEach(s => {
		const t = (time * 0.05 + s.offset) % 1; // move forward

		// Base position on curve
		const pos = curve.getPointAt(t);

		// Find local frame
		const l = Math.floor(t * frames.tangents.length); 
		const normal = frames.normals[l];
		const binormal = frames.binormals[l];

		// Add a small circular offset
		const angle = time * 2 + s.offset * Math.PI * 2; // spin around
		const radius = 10; // how far they float away
		const offset = normal.clone().multiplyScalar(Math.cos(angle) * radius)
					.add(binormal.clone().multiplyScalar(Math.sin(angle) * radius));

		s.sprite.position.copy(pos.clone().add(offset));
		s.sprite.position.add(new THREE.Vector3(
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2,
			(Math.random() - 0.5) * 2
		));
	});


	// Spin hovered star
	stars.forEach(star => {
		if (star.userData.spinning) { 
			// Spin slowly around Y axis
			star.rotation.y += 0.005;

			(Math.cos(star.rotation.y)>0) ? star.position.y += 0.005 : star.position.y -= 0.005;

			// Stop when target reached
			if (star.rotation.y >= star.userData.targetRotation) {
				star.rotation.y = star.userData.targetRotation;
				star.userData.spinning = false;
			}
		}

		//star.material.opacity = Math.random();
		if (star.userData.sparks) {
  			const time = performance.now() * 0.001;
			star.userData.sparks.forEach((sprite) => {
			const { basePos, speed, phase } = sprite.userData;

			// make them gently bob around their base position
			sprite.position.set(
				basePos.x + Math.sin(time * speed + phase) * 0.5,
				basePos.y + Math.cos(time * speed + phase) * 0.5,
				basePos.z + Math.sin(time * speed * 0.8 + phase) * 0.5
			);

			// flicker opacity
			sprite.material.opacity = 0.6 + Math.sin(time * speed * 3 + phase) * 0.4;
			});
		}
	});

	// Click star 
	if (zooming && targetStar) {
		const tLinear = Math.min((now - zoomStart) / zoomDuration, 1);
		const t = easeInOutCubic(tLinear); // apply easing

		const targetPos = targetStar.position.clone().add(new THREE.Vector3(0, 0, -10));
		camera.position.lerpVectors(zoomStartPos, targetPos, t);
		camera.lookAt(targetStar.position);

		if (tLinear >= 1) {
			zooming = false;
			setTimeout(() => {
				window.location.href = `./${targetStar.name}.html`;
			}, 300);
		}
	}
	render();
}

const clock = new THREE.Clock();
function render() {
	const delta = clock.getDelta()*0.5; // seconds since last frame
	
	for (let i = 0; i < scene.children.length; i ++) {
		const object = scene.children[i];
		if (object instanceof THREE.Points) {
            const speed = (i < 2 ? i + 1 : -(i + 1)) * 0.1;
            object.rotation.y += speed * delta;
		}
	}
	renderer.render(scene, camera);
}
