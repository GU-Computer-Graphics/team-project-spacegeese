import * as THREE from 'three'
import Engine from './Engine/Engine';
import OpenLevel from './Components/Level';

class Game { 
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

    main() {
        this.setup();
        Engine.inputListener.start();
        this.renderer.render(this.scene, this.camera);
        this.start();
    }

    getScene() {
        return this.scene;
    }

    setup() {
        Engine.game = this;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.5, 1000);

        // Load initial level
        this.level = new OpenLevel().load(this.scene, this.camera);

        Engine.machine.addCallback(() => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    start() {
        // Start/Stop controls
        Engine.eventHandler.subscribe('inputListener', (payload) => {
            if (payload.code === "Escape" && payload.isPressed) {
                Engine.machine.stop();
            }
            if (payload.code === "KeyR" && payload.isPressed) {
                this.reset();
            }
        });
        Engine.machine.start();
    }

    reset() {
        Engine.clear();
        // TODO: Dispose of all materials and geometries
        while(this.scene.children.length > 0){
            if (this.scene.children[0].hasOwnProperty('dispose')) {
                this.scene.children[0].dispose();
            }
            this.scene.remove(this.scene.children[0]);
        }
        this.main();
    }
}

export default Game;