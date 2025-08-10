

import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let camera, scene, renderer, controls;

init();

function init() {

	const info = document.createElement( 'div' );
	info.style.position = 'absolute';
	info.style.top = '10px';
	info.style.width = '100%';
	info.style.textAlign = 'center';
	info.style.color = '#fff';
	//info.innerHTML = '<a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - geometry extrude shapes';
	document.body.appendChild( info );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setAnimationLoop( animate );
	document.body.appendChild( renderer.domElement );

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xFFF0F6 );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 0, 500 );

	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 200;
	controls.maxDistance = 500;

	scene.add( new THREE.AmbientLight( 0x666666 ) );

	const light = new THREE.PointLight( 0xffffff, 3, 0, 0 );
	light.position.copy( camera.position );
	scene.add( light );

	//
	const pts2 = [], numPts = 5;
	for ( let i = 0; i < numPts * 2; i ++ ) {

		const l = i % 2 == 1 ? 10 : 20;

		const a = i / numPts * Math.PI;

		pts2.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );

	}
	const shape2 = new THREE.Shape( pts2 );
	const material2 = new THREE.MeshLambertMaterial( { color: 0xff8000, wireframe: false } );
	
	//
	const material1 = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
	const materials = [ material1, material2 ];
	const extrudeSettings3 = {
		depth: 20,
		steps: 1,
		bevelEnabled: true,
		bevelThickness: 2,
		bevelSize: 4,
		bevelSegments: 1
	};
	const geometry3 = new THREE.ExtrudeGeometry( shape2, extrudeSettings3 );
	const mesh3 = new THREE.Mesh( geometry3, materials );
	mesh3.position.set( 50, 100, 50 );
	scene.add( mesh3 ); 

	//
	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	controls.update();
	renderer.render( scene, camera );

}
