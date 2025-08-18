import * as THREE from 'three';

// Colors
let lightPink = 0xFFC2DE;
let darkPink = 0x5C1F36;
let backgroundPink = 0x614850; //0xC7B1BD;

const scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundPink);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


camera.position.z = 5;

function animate() {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );