import * as THREE from "./three.module.js";
import Room from "./Room.js";
import { OrbitControls } from "./OrbitControls.js";
import dat from "./dat.gui.module.js";

const cameraParams = {
    near: 1,
    far: 1000,
    fov: 75, // degrees
    aspectRatio: 800 / 500, // from dimensions of the canvas, see CSS
    atX: 0,
    atY: 0,
    atZ: 0,
    eyeX: 0,
    eyeY: 0,
    eyeZ: 75,
    upX: 0,
    upY: 1,
    upZ: 0,
};

function setupCamera(cameraParameters) {
    // set up an abbreviation
    let cp = cameraParameters;
    // create an initial camera with the desired shape
    let camera = new THREE.PerspectiveCamera(
        cp.fov,
        cp.aspectRatio,
        cp.near,
        cp.far
    );
    // set the camera location and orientation
    camera.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
    camera.up.set(cp.upX, cp.upY, cp.upZ);
    camera.lookAt(new THREE.Vector3(cp.atX, cp.atY, cp.atZ));
    return camera;
}

function setupCameraControls(camera, canvas, render) {
    let cameraControls = new OrbitControls(camera, canvas);
    cameraControls.addEventListener("change", render);
    cameraControls.update();
}

function main() {
    //Create a renderer to render the scene
    const renderer = new THREE.WebGLRenderer();

    // Adds the canvas to the document,
    // Enables display of 3D coordinate axes, sets up camera controls
    const canvas = renderer.domElement;
    const parent = document.body;
    parent.appendChild(canvas);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(new THREE.Color(0xcccccc), 1);

    const scene = new THREE.Scene();

    // Set up a camera for the scene
    const camera = setupCamera(cameraParams);
    setupCameraControls(camera, canvas, () => {
        renderer.render(scene, camera);
    });
    scene.add(camera);

    let room = new Room(50);
    scene.add(room);

    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.target = room.ball;
    scene.add(directionalLight);

    // Testing spotlight
    // const light = new THREE.SpotLight(0xffffff, 1, 5, Math.PI / 7, 0, 0);
    // light.position.set(0, 0, 0);
    // light.target = new THREE.Object3D();
    // light.target.position.set(0, -20, 0);
    // scene.add(light);
    // scene.add(light.target);
    // const spotLightHelper = new THREE.SpotLightHelper(light);
    // scene.add(spotLightHelper);
    let spotlight1 = new THREE.SpotLight(0xffffff, 1, 200, Math.PI / 8, 0, 0);
    spotlight1.position.set(21, 0, 0);
    //   spotlight1.target = new THREE.Object3D();
    //   scene.add(spotlight1.target);
    //   spotlight1.target.position.set(0, -1, -0);
    scene.add(spotlight1);
    //   spotlight2.position.set(-35, 4, -40);
    //   spotlight2.target  = new THREE.Object3D();
    //   spotlight2.target.position.set(-35, 40, -40);

    //   scene.add(spotlight2);
    //   scene.add(spotlight2.target);

    const spotLightHelper = new THREE.SpotLightHelper(spotlight1);
    scene.add(spotLightHelper);

    const gui = new dat.GUI();
    const guiParams = {
        ambientIntensity: ambient.intensity,
        ambient: ambient.visible,
        directionalIntensity: directionalLight.intensity,
        directional: directionalLight.visible,
        sconceIntensity: room.upLight.intensity,
        sconce: room.upLight.visible,
    };
    gui.add(guiParams, "ambient").onChange(() => {
        ambient.visible = guiParams.ambient;
        renderer.render(scene, camera);
    });
    gui.add(guiParams, "ambientIntensity", 0.1, 1).onChange(() => {
        ambient.intensity = guiParams.ambientIntensity;
        renderer.render(scene, camera);
    });
    gui.add(guiParams, "directional").onChange(() => {
        directionalLight.visible = guiParams.directional;
        renderer.render(scene, camera);
    });
    gui.add(guiParams, "directionalIntensity", 0.1, 1).onChange(() => {
        directionalLight.intensity = guiParams.directionalIntensity;
        renderer.render(scene, camera);
    });
    gui.add(guiParams, "sconce").onChange(() => {
        room.upLight.visible = guiParams.sconce;
        room.downLight.visible = guiParams.sconce;
        renderer.render(scene, camera);
    });
    gui.add(guiParams, "sconceIntensity", 0.1, 1).onChange(() => {
        room.upLight.intensity = guiParams.sconceIntensity;
        room.downLight.intensity = guiParams.sconceIntensity;
        renderer.render(scene, camera);
    });

    renderer.render(scene, camera);
}

main();
