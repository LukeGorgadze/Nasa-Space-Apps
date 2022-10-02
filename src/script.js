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
import { quakeInfo } from "./bigQuakeDataWithTime.js";

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
controls.dampingFactor = 0.25;
controls.enableDamping = true;

renderer.setSize(window.innerWidth / 1 / 1, window.innerHeight);
document.body.appendChild(renderer.domElement);

var moon = new THREE.SphereGeometry(2, 100, 100);

var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(textureURL);
var displacementMap = textureLoader.load(displacementURL);

var MoonMaterial = new MeshPhysicalMaterial({
  map: texture,
  displacementMap: displacementMap,
  displacementScale: 0.05,
  bumpMap: displacementMap,
  roughness: 1,
  bumpScale: 0.05,
  reflectivity: 0.5,
  sheen: 0.1,
  sheenRoughness: 0.85,
  sheenColor: new Color("#0000FF").convertSRGBToLinear(),
  clearcoat: 0.3,
  clearcoatRoughness: .5,

})

var moon = new THREE.Mesh(moon, MoonMaterial);

const sunLight = new DirectionalLight(
  new Color("#FFFFFF").convertSRGBToLinear(),
  1.1,
);
sunLight.position.set(-100, 10, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.bottom = -10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.right = 10;
scene.add(sunLight);


let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);

const tor = new THREE.TorusGeometry(.5, .01, 16, 100);

const torMat = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  emissive: 0xffff00
})
const torus = new THREE.Mesh(tor, torMat);
torus.name = "Torus"

var Pin = new THREE.Group()
var angle = 0;

//R,Theta,Phi
var Spherical = (theta, phi) => {
  return new THREE.Spherical(1., theta, phi)
}

var pointMesh = new THREE.SphereGeometry(.01, 20, 20)
var pointNorthMesh = new THREE.SphereGeometry(.2, 20, 20)
var pointSouthMesh = new THREE.SphereGeometry(.2, 20, 20)
var spherical = new THREE.Spherical(1., Math.PI * 50 / 180, 10)
var sphericalNorth = new THREE.Spherical(2.1, 0, 0)
var sphericalSouth = new THREE.Spherical(2.1, Math.PI * 180 / 180, 0)

var pointMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xe74c3c,
    shininess: .5
  }

);
var point = new THREE.Mesh(pointMesh, pointMaterial)
point.scale.set(1, 1, .2)

let Arr = []
let MoonGroup = new THREE.Group()


Arr = []
let index = 0;
let getPinn = (index) => {
  // Arr = []
  let info = quakeInfo[index]
  index = (index + 1) % quakeInfo.length;
  let r = Math.random() * 255;
  let g = Math.random() * 255;
  let b = Math.random() * 255;
  // let colorr = new THREE.Color(`rgb(255,255,255)`);
  let colorr = new THREE.Color("rgb(" + parseInt(r) + "," + parseInt(g) + "," + parseInt(b) + ")");
  const torMatt = new THREE.MeshPhongMaterial({
    color: colorr,
    emissive: colorr
  })
  var Pinn = new THREE.Group()

  var phi = (90 - info.latitude) * (Math.PI / 180);
  var theta = (info.longitude + 180) * (Math.PI / 180);

  var sp = Spherical(theta, phi);
  var p = new THREE.Mesh(pointMesh, pointMaterial);
  var toruss = new THREE.Mesh(tor, torMatt);
  p.position.setFromSpherical(sp)
  toruss.position.setFromSpherical(sp)


  Pinn.lookAt(0, 0, 0)
  Pinn.position.setFromSpherical(sp)
  toruss.lookAt(0, 0, 0)
  p.lookAt(0, 0, 0)

  Pinn.add(p, toruss)
  MoonGroup.add(Pinn)
  return Pinn
}

//////////////////////////////////////////
var pointSouth = new THREE.Mesh(pointNorthMesh, pointMaterial)
var pointNorth = new THREE.Mesh(pointSouthMesh, pointMaterial)
point.position.setFromSpherical(spherical)
torus.position.setFromSpherical(spherical)
Pin.lookAt(0, 0, 0)
Pin.position.setFromSpherical(spherical)

torus.lookAt(0, 0, 0)
point.lookAt(0, 0, 0)

pointNorth.position.setFromSpherical(sphericalNorth)
pointSouth.position.setFromSpherical(sphericalSouth)
//////////////////////////////////

scene.add(moon);

Pin.add(point, torus)
MoonGroup.add(moon)


scene.add(MoonGroup)

Arr.forEach(Pin => {
  MoonGroup.add(Pin)
})

camera.position.z = 35;

moon.rotation.x = 3.1415 * 0.02;
moon.rotation.y = 3.1415 * 1.54;

var ts = new THREE.Vector3(0, 0, 1)
var radScale = 0
let speed = 0.0001
let freqSlider = .01;
let sizeSlider = - 0.;
let timer = 0;
let indexx = 0;
let CurrentPin = getPinn(indexx)
let lastUpdate = Date.now()
function animate() {
  requestAnimationFrame(animate);
  CurrentPin.children[1].scale.set(radScale, radScale, 3);
  var now = Date.now();
  var dt = now - lastUpdate;
  lastUpdate = now;
  timer += 0.01 * dt
  MoonGroup.rotation.y += 0.005;
  MoonGroup.rotation.x += 0.0002;
  if (CurrentPin != null) {
    let dist = Math.sqrt(Math.pow(CurrentPin.children[1].position.x, 2) + Math.pow(CurrentPin.children[1].position.y, 2) + Math.pow(CurrentPin.children[1].position.z, 2))

    CurrentPin.children[1].translateZ(speed)

    var direction = Pin.position.normalize()

    if (dist < 0.92 + sizeSlider) {
      CurrentPin.children[1].position.set(
        CurrentPin.children[0].position.x,
        CurrentPin.children[0].position.y,
        CurrentPin.children[0].position
          .z);
      speed = 0.00001
    }

    speed += dist > 0.95 + sizeSlider ? 0.000001 * freqSlider : 0.000006 * freqSlider

    radScale = (Math.sqrt(1 - dist * dist)) / 0.29
    // CurrentPin.children[1].scale.set(radScale, radScale, 3);
  }

  if (timer >= 20) {
    radScale = 1
    MoonGroup.remove(CurrentPin)
    indexx += 1
    CurrentPin = getPinn(indexx)
    timer = 0
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
