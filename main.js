

import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let camera, scene, renderer, controls;

init();

function drawLines()
{
	const linesCount = 5;            // nombre de lignes
    const length = 12;              // longueur de chaque ligne (axe X)
    const spacing = 0.7;            // espace vertical entre les lignes
    const tubeRadius = 0.06;        // rayon du "tube" (épaisseur)
    const radialSegments = 16;      // qualité du tube

    const material = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.1, roughness: 0.7 });

    for(let i=0;i<linesCount;i++){
      // CylinderGeometry: (radiusTop, radiusBottom, height, radialSegments)
      const geom = new THREE.CylinderGeometry(tubeRadius, tubeRadius, length, radialSegments);
      const mesh = new THREE.Mesh(geom, material);

      // par défaut l'axe principal du cylindre est Y — on le met le long de X
      mesh.rotation.z = Math.PI / 2;

      // positionner la ligne au bon Y
      const y = (i - (linesCount-1)/2) * spacing; // centre vertical
      mesh.position.set(0, y, 0);

      scene.add(mesh);
    }

    // un petit plan pour repère (optionnel)
    const grid = new THREE.GridHelper(30, 30, 0xcccccc, 0xeeeeee);
    grid.rotation.x = Math.PI/2; // plat
    grid.position.y = -3;
    grid.visible = false; // cacher par défaut
    scene.add(grid);

    // responsive
    window.addEventListener('resize', onResize);
    function onResize(){
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function drawStar(px, py, pz)
{
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
	mesh3.position.set( px, py, pz );
	scene.add( mesh3 ); 
}

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

	// Draw 5 black lines (partition)
	// drawLines();

///////////////
	//
	drawStar(50, 100, 50);
	drawStar(50, 50, 50);

	//
	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame(animate); //pour tubes
	controls.update();
	renderer.render( scene, camera );
}
