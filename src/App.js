import * as THREE from './lib/three.module.js'
import Engine from './Engine/Engine.js';
import Level from './Components/Level.js';
import Camera from './Components/Camera.js';

class App {
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        // Zach: uncomment for shadows
        // this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.canvas = this.renderer.domElement;
        let c = document.getElementById("c");
        c.appendChild(this.canvas);
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.renderer.setClearColor("grey", 1);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    main() {
        this.setup();
        Engine.inputListener.start();
        this.render();
        this.start();
    }

    setup() {
        Engine.app = this;
        this.scene = new THREE.Scene();

        const cameraParams = {
            near: 1,
            far: 1000,
            fov: 75, // degrees
            aspectRatio: this.canvas.offsetWidth / this.canvas.offsetHeight,
            atX: 0,
            atY: 0,
            atZ: 0,
            eyeX: 0,
            eyeY: 30,
            eyeZ: 40,
            upX: 0,
            upY: 1,
            upZ: 0,
        };

        this.camera = new Camera(cameraParams);
        this.camera.setupCameraControls(this.canvas, () => this.render);

        // Load initial level
        this.level = new Level()
        this.level.load(this.scene);

        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera);
        });

        Engine.inputListener.setCaster((payload) => {
            Engine.eventHandler.dispatch('inputListener', payload);
            console.log(payload);
        });
    }

    start() {
        // Start/Stop controls
        Engine.eventHandler.subscribe('inputListener', (payload) => {
            if (payload.code === "Escape" && payload.pressed) {
                Engine.machine.stop();
                console.log("stop");
            }
            if (payload.code === "KeyR" && payload.pressed) {
                this.reset();
                console.log("reset");
            }
        });
        Engine.machine.start();
        console.log(Engine);
    }

    getScene() {
        return this.scene;
    }

    reset() {
        Engine.clear();
        while(this.scene.children.length > 0){
            if (this.scene.children[0].hasOwnProperty('dispose')) {
                this.scene.children[0].dispose();
            }
            this.scene.remove(this.scene.children[0]);
        }
        this.main();
    }
}

export default App;
