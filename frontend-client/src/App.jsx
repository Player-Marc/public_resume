import { BrowserRouter } from "react-router-dom";

import { Experience, Hero, Navbar, UpgradesBar, ContestBar, Tech, AnalogStick, Dialogues } from "./components";

import React from "react";

import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { Water } from 'three/examples/jsm/objects/Water.js';
// import { Sky } from 'three/examples/jsm/objects/Sky.js';

import waterTexture from './assets/waternormals.jpg'

import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// import { LuminosityShader } from 'three/addons/shaders/LuminosityShader.js';
// import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader.js';


let water, sun;

let myPlayer;

import "reflect-metadata"

import Ship from "./Ship.jsx"
import InputListener from "./InputListener";
import Map from "./Map"
import Snowball from "./Snowball";
import Enemy from "./Enemy";

import SocketReceiver from "./SocketReceiver"
import { HemisphereLight } from "three";



const canvasEl = document.getElementById("clickArea");
canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;


//// trying out adding canvas elements for HUD,
//// but can't show elements alongside WEBGL (or whatever causes the issue, not sure)
// const canvasEl = document.getElementById("canvasTEST");
// const ctx = canvasEl.getContext("2d");
// document.body.prepend(canvasEl);


///////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// camera.position.set(0, 1, 0);

camera.position.y = 90





const renderClickArea = new THREE.WebGLRenderer({
  canvas: clickArea,
  antialias: true,
})
renderClickArea.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderClickArea.domElement)

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.shadowMap.enabled = true;
document.body.prepend(renderer.domElement)








sun = new THREE.Vector3();

const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = false;


// random normal default box ground

// const groundGeometry = new THREE.BoxGeometry(50, 0.5, 50)
// const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xe1c0a8 })
// const ground = new THREE.Mesh(groundGeometry, groundMaterial)
// ground.receiveShadow = true;
// ground.position.x = 0
// ground.position.y = -6

// scene.add(ground)


//// Lighting

const light = new THREE.DirectionalLight(0x00a4ff, 0.03)
light.position.y = 4
light.position.z = 1
light.castShadow = true
// scene.add(light)

scene.add(new THREE.AmbientLight(0xB1FFE1, 0.4))
// 63FFB6
// 00a4ff

// // hemisphere light
// const upColor = 0xB1FFE1;
// const downColor = 0xFF0000;
// const lightHS = new THREE.HemisphereLight(upColor, downColor, 0.5);
// scene.add(lightHS);

// point light
const lightP = new THREE.PointLight(0x0C00FF, 8, 60);
scene.add(lightP);

// spot light
const distance = 225.0;
const angle = Math.PI / 11;
const penumbra = 0.2;
const decay = 1;
const lightS = new THREE.SpotLight(0x1700FF, 1, distance, angle, penumbra, decay);
lightS.target.position.set(-1, 0, 0);
scene.add(lightS);
scene.add(lightS.target);


//// Water

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

water = new Water(
  waterGeometry,
  {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: new THREE.TextureLoader().load(waterTexture, function (texture) {

      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x000000,
    distortionScale: 5,
    fog: scene.fog !== undefined
  }
);

water.rotation.x = - Math.PI / 2;

////> comment this out while testing to save GPU
scene.add(water);

// // Skybox

// const sky = new Sky();
// sky.scale.setScalar(0.005);
// scene.add(sky);

// const skyUniforms = sky.material.uniforms;

// // skyUniforms['turbidity'].value = 10;
// // skyUniforms['rayleigh'].value = 2;
// // skyUniforms['mieCoefficient'].value = 0.005;
// // skyUniforms['mieDirectionalG'].value = 0.8;

// skyUniforms['turbidity'].value = 0.02;
// skyUniforms['rayleigh'].value = 0.001;
// skyUniforms['mieCoefficient'].value = 0.00001;
// skyUniforms['mieDirectionalG'].value = 0.001;

// const parameters = {
//   elevation: 0,
//   azimuth: 180
// };

// const pmremGenerator = new THREE.PMREMGenerator(renderer);

// function updateSun() {

//   const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
//   const theta = THREE.MathUtils.degToRad(parameters.azimuth);

//   sun.setFromSphericalCoords(1, phi, theta);

//   sky.material.uniforms['sunPosition'].value.copy(sun);
//   water.material.uniforms['sunDirection'].value.copy(sun).normalize();

//   scene.environment = pmremGenerator.fromScene(sky).texture;

// }

// // updateSun();


//// bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0.6; //intensity of glow
bloomPass.radius = 1.3;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

// // black and white
// const effectGrayScale = new ShaderPass(LuminosityShader);
// bloomComposer.addPass(effectGrayScale);

// // outline effect
// const effectSobel = new ShaderPass(SobelOperatorShader);
// effectSobel.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
// effectSobel.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
// bloomComposer.addPass(effectSobel);


renderer.toneMapping = THREE.CineonToneMapping;
renderer.toneMappingExposure = 0.95;

//sun object
// const color = new THREE.Color("#FDB813");
// const geometry = new THREE.IcosahedronGeometry(8, 1);
// const material = new THREE.MeshBasicMaterial({ color: color });
// const sphere = new THREE.Mesh(geometry, material);
// // sphere.layers.set(1);
// scene.add(sphere);


////////






///////////

const socketReceiver = new SocketReceiver();

const inputListener = new InputListener(canvasEl);

inputListener.movement();
inputListener.shoot(canvasEl);
inputListener.useSkill();

const ship = new Ship();
const map = new Map();
const snowball = new Snowball();
const enemy = new Enemy();



let loadedPlayers = []
let loadedSnowballs = []
let loadedEnemies = []


function onWindowResize() {

  console.log("resizing")

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderClickArea.setSize(window.innerWidth, window.innerHeight);

}



const App = () => {


  /////

  // useEffect(() => {
  //   socket.on("skillsDialogue", (data) => {
  //     setMessageList((list) => [...list, data]);
  //   });
  // }, [socket]);

  // socket.on("skillsDialogue", (data) => {
  //   // useState makes it lagger per refresh
  //   // setToggle(!toggle);

  // alternative way:
  //   console.log("d")
  //   document.getElementById("testHide").className = "hidden";
  // });

  /////

  window.removeEventListener( 'resize', onWindowResize );
  window.addEventListener( 'resize', onWindowResize );


  // draw objects and map every frame
  function loop() {

    water.material.uniforms['time'].value += 0.2 / 60.0;
    // renderer.render(scene, camera)
    bloomComposer.render();


    // clear all (clear previous frames)
    // canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // canvas2d.clearRect(0, 0, canvas.width, canvas.height);



    myPlayer = socketReceiver.myPlayer();

    // map.drawGround(socketReceiver.assignGroundMap(), myPlayer);

    // map.drawDecals(socketReceiver.assignDecalMap(), myPlayer)

    ship.draw(socketReceiver.assignPlayers(scene, loadedPlayers), myPlayer, loadedPlayers, camera, scene, lightP, lightS);

    snowball.draw(socketReceiver.assignSnowballs(scene, loadedSnowballs), myPlayer, loadedSnowballs, loadedPlayers, scene);

    enemy.draw(socketReceiver.assignEnemies(scene, loadedEnemies), myPlayer, loadedEnemies, scene);



    renderer.renderLists.dispose();

    window.requestAnimationFrame(loop);
  }

  window.requestAnimationFrame(loop);

  /////////


  return (
    <BrowserRouter>
      <div className=' relative z-0'>
        <div className="">

        </div>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          
          <Navbar />
          <AnalogStick />
          <UpgradesBar />
          <ContestBar />
          <Dialogues />
        </div>

        {/* scroll by page draft, trying to imitate crossfade website */}
        {/* notice crossfade website has an outer border of each pages then an overflow-y-scroll inside */}
        {/* maybe look into GSAP */}
        {/* <div className="h-[100%] overflow-y-scroll snap-mandatory snap-y snap-mandatory snap-y ">
          <div className="h-[100%] snap-start">
            <Hero />
          </div>
          <div className="h-[100%] snap-start">
            <Tech />
          </div>
          <div className="h-[100%] snap-start">
            <Experience />
          </div>
        </div> */}


        <Hero />
        <Tech />
        <Experience />
      </div>
    </BrowserRouter>
  )
}

export default App

export { myPlayer }


