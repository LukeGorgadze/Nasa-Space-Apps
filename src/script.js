// import './style.css'
import * as THREE from "../node_modules/three/build/three.module.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { 
    DoubleSide,
  PCFSoftShadowMap,
  MeshPhysicalMaterial,
  TextureLoader,
  FloatType,
  PMREMGenerator,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Vector2,
  DirectionalLight,
  Clock,
  RingGeometry,
  Vector3,
  PlaneGeometry,
  CameraHelper,
  Group
} from 'three';
import dist from 'webpack-merge';

// var textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg"; 
// var displacementURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg"; 
// var worldURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/hipp8_s.jpg"

var textureURL = "textures/Moon/Moon-Color.jpg"
var displacementURL = "textures/Moon/Moon-Disp.jpg";
var worldURL = "textures/Moon/Stars.jpg"

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 2000);

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
controls.dampingFactor = 0.25;
controls.enableDamping = true;

renderer.setSize(window.innerWidth/1 / 1, window.innerHeight);
document.body.appendChild(renderer.domElement);

var moon = new THREE.SphereGeometry(2, 100, 100);

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(textureURL);
var displacementMap = textureLoader.load(displacementURL);
var worldTexture = textureLoader.load(worldURL);

var MoonMaterial = new MeshPhysicalMaterial({
    map: texture,
    displacementMap: displacementMap,
    displacementScale: 0.05,
    bumpMap: displacementMap,
    roughness:1,
    bumpScale: 0.05,
    // envMap,
    // envMapIntensity: 0.4,
    reflectivity: 0.5,
    sheen: 0.1,
    sheenRoughness: 0.85,
    sheenColor: new Color("#0000FF").convertSRGBToLinear(),
    clearcoat: 0.3,
    // clearcoatNormalScale:(.1,.1)
    clearcoatRoughness:.5,
    // wireframe:true
    
  })

var moon = new THREE.Mesh(moon, MoonMaterial);

const sunLight = new DirectionalLight(
  new Color("#FFFFFF").convertSRGBToLinear(),
  1.1,
);
sunLight.position.set(-100, 10, 50);
sunLight.castShadow =  true;
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.bottom = -10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.right = 10;
scene.add(sunLight);
// const light = new THREE.DirectionalLight(0xFFFFFF, 1.1);
// light.position.set(-100, 10, 50);
// scene.add(light);


let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);


var worldGeometry = new THREE.SphereGeometry(1000, 60, 60);
var worldMaterial = new THREE.MeshBasicMaterial(
    {
        // color: 0x303952,
        // map: worldTexture,
        side: THREE.BackSide
    }
);

const tor = new THREE.TorusGeometry(.5, .01, 16, 100);
const torMat = new THREE.MeshPhongMaterial({ 
    color: 0xffff00 ,
    emissive: 0xffff00})
const torus = new THREE.Mesh(tor, torMat);
// torus.scale.set(.5,.5,.5);

torus.name = "Torus"
// scene.add( torus );

var Pin = new THREE.Group()


var world = new THREE.Mesh(worldGeometry, worldMaterial);
var pointMesh = new THREE.SphereGeometry(.1, 20, 20)

var pointNorthMesh = new THREE.SphereGeometry(.2, 20, 20)
var pointSouthMesh = new THREE.SphereGeometry(.2, 20, 20)
var spherical = new THREE.Spherical(1., Math.PI * 120 / 180, 0)
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
point.scale.set(1, 1, .2)
//////////////////////////////////////////


var pointSouth = new THREE.Mesh(pointNorthMesh, pointMaterial)
var pointNorth = new THREE.Mesh(pointSouthMesh, pointMaterial)
point.position.setFromSpherical(spherical)
torus.position.setFromSpherical(spherical)
// torus.rotation.setFromSpherical(spherical)

// Pin.position.setFromSpherical(spherical)
Pin.lookAt(0, 0, 0)
Pin.position.setFromSpherical(spherical)
// Pin.position.setFromSpherical(spherical)
torus.lookAt(0, 0, 0)
point.lookAt(0, 0, 0)
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
// scene.add(world);
scene.add(moon);

//Add to Groups
Pin.add(point, torus)
MoonGroup.add(Pin)
MoonGroup.add(moon)

//Add Groups to scene
scene.add(MoonGroup)

camera.position.z = 35;

moon.rotation.x = 3.1415 * 0.02;
moon.rotation.y = 3.1415 * 1.54;

var ts = new THREE.Vector3(0, 0, 1)
var radius = 2.1
// var sphericalTor = 
var depth = 2;

function animate() {
    requestAnimationFrame(animate);
    // MoonGroup.rotation.y += 0.005;
    // MoonGroup.rotation.x += 0.0002;
    world.rotation.y += 0.0001
    world.rotation.x += 0.0005

    var direction = Pin.position.normalize()

    depth -= .01
    Pin.translateOnAxis(direction, depth)
    if (depth <= -1) {
        depth = -1
    }

    // Pin.children[1].scale.x += 0.00001;
    // Pin.children[1].scale.y += 0.00001;
    // Pin.children[1].scale.z += 0.00001;
    // console.log(Pin.children)


    ts.x += 0.02;
    ts.y += 0.02;
    // ts.z += 0.2;
    // Pin.scale.set(ts.x, ts.y, ts.z)

    // console.log(Pin?.children)


    if (ts.x > 2) {
        ts.x = 0.1;
        ts.y = 0.1;
    }

    renderer.render(scene, camera);
}
animate();


function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onResize, false);
