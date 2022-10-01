import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Group, Spherical } from 'three';

// var textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
// var displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
// var worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"

var textureURL = "textures/Moon/Moon-Color.jpg"
var displacementURL = "textures/Moon/Moon-Disp.jpg";
var worldURL = "textures/Moon/Stars.jpg"

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 2000);

var renderer = new THREE.WebGLRenderer({ antialias: true });

var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var moon = new THREE.SphereGeometry(2, 60, 60);

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(textureURL);
var displacementMap = textureLoader.load(displacementURL);
var worldTexture = textureLoader.load(worldURL);

var material = new THREE.MeshPhongMaterial(
    {
        color: 0xffffff,
        map: texture,
        displacementMap: displacementMap,
        displacementScale: 0.02,
        bumpMap: displacementMap,
        bumpScale: 0.05,
        reflectivity: .1,
        shininess: .5
    }

);

// material

var moon = new THREE.Mesh(moon, material);


const light = new THREE.DirectionalLight(0xFFFFFF, 1.1);
light.position.set(-100, 10, 50);
scene.add(light);


let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);


var worldGeometry = new THREE.SphereGeometry(1000, 60, 60);
var worldMaterial = new THREE.MeshBasicMaterial(
    {
        color: 0xffffff,
        map: worldTexture,
        side: THREE.BackSide
    }
);

const tor = new THREE.TorusGeometry(10, 1, 16, 100);
const torMat = new THREE.MeshPhongMaterial({ color: 0xffff00 })
const torus = new THREE.Mesh(tor, torMat);
torus.name = "Torus"
scene.add( torus );

var Pin = new THREE.Group()


var world = new THREE.Mesh(worldGeometry, worldMaterial);
var pointMesh = new THREE.SphereGeometry(.2, 20, 20)
var pointNorthMesh = new THREE.SphereGeometry(.2, 20, 20)
var pointSouthMesh = new THREE.SphereGeometry(.2, 20, 20)
var spherical = new THREE.Spherical(2.1, Math.PI * 90 / 180, 0)
var sphericalNorth = new THREE.Spherical(2.1, 0, 0)
var sphericalSouth = new THREE.Spherical(2.1, Math.PI * 180 / 180, 0)
// var theta = Math.atan()
// spherical.setFromCartesianCoords(geometry.position)
var pointMaterial = new THREE.MeshPhongMaterial(
    {
        color: 0xe74c3c,
        shininess: .5
    }

);
var point = new THREE.Mesh(pointMesh, pointMaterial)
//////////////////////////////////////////


var pointSouth = new THREE.Mesh(pointNorthMesh, pointMaterial)
var pointNorth = new THREE.Mesh(pointSouthMesh, pointMaterial)
point.position.setFromSpherical(spherical)
// point.name = "PIN"
pointNorth.position.setFromSpherical(sphericalNorth)
pointSouth.position.setFromSpherical(sphericalSouth)
// scene.add(point);

// THREE.Spherical(2,0,0)


let MoonGroup = new THREE.Group()
MoonGroup.add(pointNorth)
MoonGroup.add(pointSouth)

//////////////////////////////////

//Add to scene
scene.add(world);
scene.add(moon);

//Add to Groups
Pin.add(point,torus)
MoonGroup.add(point)
MoonGroup.add(moon)

//Add Groups to scene
scene.add(Pin)
scene.add(MoonGroup)

camera.position.z = 5;

moon.rotation.x = 3.1415 * 0.02;
moon.rotation.y = 3.1415 * 1.54;


function animate() {
    requestAnimationFrame(animate);
    MoonGroup.rotation.y += 0.005;
    MoonGroup.rotation.x += 0.0002;
    world.rotation.y += 0.0001
    world.rotation.x += 0.0005

    // Pin.children[1].scale.x += 0.00001;
    // Pin.children[1].scale.y += 0.00001;
    // Pin.children[1].scale.z += 0.00001;









    

    console.log(Pin?.children)

    renderer.render(scene, camera);
}
animate();


function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth , window.innerHeight);
}

window.addEventListener('resize', onResize, false);
