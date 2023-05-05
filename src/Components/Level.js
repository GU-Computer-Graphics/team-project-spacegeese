import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";
import Asteroid from "./Asteroid.js";
import Portal from "./Portal.js";
import Ship from "./Ship.js";
import { GLTFLoader } from "../lib/gltfLoader.js";
import Sun from "./Sun.js";

export default class Level extends THREE.Group {
    constructor(gui) {
        super();
        this.maxX = 200;
        this.maxY = 200;
        this.maxZ = 200;
        this.gui = gui;
        this.parameters = {
            ambientBrightness: 0.7,
            sunBrightness: 1,
        }
    }

    load(scene) {
        const loader = new GLTFLoader();
        Promise.all([
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/stargate.glb"),
            loader.loadAsync("./src/assets/stargate.glb"),
            loader.loadAsync("./src/assets/daphne_planetoid.glb"),
        ]).then((models) => {
            this.setup(scene, models);
        });
    }

  setup(scene, models) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("./src/images/space.png", () => {
      true;
    });
    const boundary = new THREE.Mesh(
      new THREE.BoxGeometry(1000, 1000, 1000),
      new THREE.MeshStandardMaterial({
        color: 0xeebbee,
        side: THREE.BackSide,
        map: texture,
      })
    );
    boundary.rotateX(-Math.PI / 2);
    boundary.position.set(0, -10, 0);
    scene.add(boundary);

        const asteroid1 = new Asteroid(models[5]);
        asteroid1.position.set(-10, 5, -10);
        scene.add(asteroid1);

        const portalIn = new Portal(models[3]);
        portalIn.position.set(-30, 10, 15);
        scene.add(portalIn);

        const portalOut = new Portal(models[4]);
        portalOut.position.set(30, 10, 15);
        portalOut.rotateY(Math.PI)
        scene.add(portalOut);

        const ship1 = new Ship(models[0]);
        ship1.position.set(-5, 10, 15);
        ship1.lookAt(portalIn.position);
        scene.add(ship1);
        ship1.addFireKey("Digit1");
        Engine.eventHandler.subscribe("inputListener", (payload) => {
            if (payload.code === "KeyQ" && payload.pressed) {
                ship1.moveTo(
                    portalIn.position.clone().add(new THREE.Vector3(-4, 0, 0))
                );
                console.log("move ship1");
            }
        });
        Engine.eventHandler.subscribe("shipAtTarget", target => {
            console.log(target)
            console.log(portalIn.position);
            if (target.equals(portalIn.position.clone().add(new THREE.Vector3(-4, 0, 0)))) {
                ship1.position.copy(portalOut.position);
                ship1.moveTo(new THREE.Vector3(-5, 10, 15));
            }
        })

        const ship2 = new Ship(models[1]);
        ship2.position.set(15, 20, 15);
        ship2.lookAt(asteroid1.position);
        scene.add(ship2);
        ship2.addFireKey("Digit2");

        const ship3 = new Ship(models[2]);
        ship3.position.set(0, 5, -20);
        ship3.lookAt(ship2.position);
        scene.add(ship3);
        ship3.addFireKey("Digit3");

        this.sun = new Sun();
        this.sun.position.set(0, -30, 0);
        scene.add(this.sun);

        this.pointlight = new THREE.PointLight(0xffa000, this.parameters.sunBrightness);
        this.pointlight.position.set(0, -30, 0);
        scene.add(this.pointlight);

        this.ambientlight = new THREE.AmbientLight(0xffffff, this.parameters.ambientBrightness)
        scene.add(this.ambientlight);

        this.setupGUI();

        return this;
    }

    setupGUI() {
        if (Engine.app.isGUISetup) {return}
        Engine.app.isGUISetup = true;
        this.gui.add(this.parameters, 'sunBrightness', 0, 5).name("Sun Intensity").onChange(() => {
            console.log("changed sun brightness");
            this.pointlight.intensity = this.parameters.sunBrightness;
            this.sun.scale.set(this.parameters.sunBrightness / 2, this.parameters.sunBrightness / 2, this.parameters.sunBrightness / 2)
        })
        this.gui.add(this.parameters, 'ambientBrightness', 0, 5).name("Ambient Intensity").onChange(() => {
            console.log("changed ambient brightness");
            this.ambientlight.intensity = this.parameters.ambientBrightness;
        })
    }
}
