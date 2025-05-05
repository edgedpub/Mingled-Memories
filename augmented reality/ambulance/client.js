import * as THREE from "https://cdn.skypack.dev/three@0.132.2/build/three.module.js";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
window.onload = ()=>{

const canvas = document.getElementById("canvas");
let screenDimensions = {
    width: canvas.width,
    height: canvas.height
};
let video = document.getElementById( 'video' );

const texture = new THREE.VideoTexture( video );
console.log(navigator.mediaDevices);
if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {

    const constraints = { video: { width: 1280, height: 720, facingMode: 'environment' } };

    navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {

        // apply the stream to the video element used in the texture

        video.srcObject = stream;
        video.play();

    } ).catch( function ( error ) {

        console.error( 'Unable to access the camera/webcam.', error );

    } );

} else {

    console.error( 'MediaDevices interface not available.' );

}
const scene = new THREE.Scene();
scene.background = texture;


const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(screenDimensions.width, screenDimensions.height);
renderer.gammaOutput = true;

const aspectRation = screenDimensions.width/screenDimensions.height;
const fieldOfView = 75;
const nearPlane = 0.1;
const farPlane = 100;
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRation, nearPlane, farPlane);
camera.position.z = -10;
camera.position.y = 2;

const controls = new OrbitControls(camera, document.body);
//const sceneManager = new SceneManager(canvas);

bindEventListeners();
render();

function bindEventListeners(){
    window.onresize = resizeCanvas;
	resizeCanvas();	
}
/* JS code -------------------------------------------------------------- */
const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white ambientLight
scene.add( ambientLight );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
let dirLightPos = new THREE.Vector3(0,5,15);
directionalLight.position.set(dirLightPos.x, dirLightPos.y, dirLightPos.z);
scene.add( directionalLight );

let ambulance;
const loader = new GLTFLoader();
loader.load('./ASSETS/OBJ/scene.glb', (model)=>{
    ambulance = model.scene;
    ambulance.scale.set(0.009, 0.009,0.009);
    ambulance.traverse(node => {
        if (node.isMesh && node.name !== "Ambulance_Glass_0") {
            node.frustumCulled = false;
        }
        if(node.name == "Ambulance_Interior_0"){
            node.material.color = new THREE.Color(0x000000);
        }
    });
    scene.add(ambulance);
    console.log(ambulance)
})

/* /JS code -------------------------------------------------------------- */

function update(){
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize(){
    const {width, height} = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.render(scene, camera);
}


function resizeCanvas(){
    canvas.style.width = '100%';
	canvas.style.height= '100%';
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    onWindowResize();
}

function render(){
    update();
    requestAnimationFrame(render);
}
};
