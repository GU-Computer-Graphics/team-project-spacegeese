import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";
import Asteroid from "./Asteroid.js";
import Portal from "./Portal.js";
import Ship from "./Ship.js";
import { GLTFLoader } from "../lib/gltfLoader.js";
import Sun from "./Sun.js";

export default class Level extends THREE.Group {
    constructor() {
        super();
        this.maxX = 200;
        this.maxY = 200;
        this.maxZ = 200;
    }

    load(scene) {
        const loader = new GLTFLoader();
        Promise.all([
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/spaceballs_rv.glb"),
            loader.loadAsync("./src/assets/stargate.glb"),
            loader.loadAsync("./src/assets/daphne_planetoid.glb"),
        ]).then((models) => {
            this.setup(scene, models);
        });
    }

    setup(scene, models) {
        // let ground = new THREE.Mesh(
        //     new THREE.PlaneGeometry(500, 500),
        //     new THREE.MeshBasicMaterial({ color: 0xeebbee })
        // );
        // ground.rotateX(-Math.PI / 2);
        // ground.position.set(0, -10, 0);
        // scene.add(ground);

        let asteroid1 = new Asteroid(models[4]);
        asteroid1.position.set(-10, 5, -10);
        scene.add(asteroid1);

        let portal = new Portal(models[3]);
        portal.position.set(-20, 10, 15);
        scene.add(portal);

        let ship1 = new Ship(models[0]);
        ship1.position.set(-5, 10, 15);
        ship1.lookAt(portal.position);
        scene.add(ship1);
        Engine.eventHandler.subscribe("inputListener", (payload) => {
            if (payload.code === "Digit1" && payload.pressed) {
                ship1.fire();
                console.log("fire ship1");
            }
            if (payload.code === "KeyQ" && payload.pressed) {
                ship1.moveTo(
                    portal.position.clone().add(new THREE.Vector3(-4, 0, 0))
                );
                console.log("move ship1");
            }
        });

        let ship2 = new Ship(models[1]);
        ship2.position.set(15, 15, 15);
        ship2.lookAt(asteroid1.position);
        scene.add(ship2);
        Engine.eventHandler.subscribe("inputListener", (payload) => {
            if (payload.code === "Digit2" && payload.pressed) {
                ship2.fire();
                console.log("fire ship2");
            }
        });

        let ship3 = new Ship(models[2]);
        ship3.position.set(0, 5, -20);
        ship3.lookAt(ship2.position);
        scene.add(ship3);
        Engine.eventHandler.subscribe("inputListener", (payload) => {
            if (payload.code === "Digit3" && payload.pressed) {
                ship3.fire();
                console.log("fire ship3");
            }
        });

        let light = new THREE.AmbientLight();
        scene.add(light);

        let sun = new Sun();
        sun.position.set(0, 0, 0);
        scene.add(sun);

        const pointlight = new THREE.PointLight(0xfffd00, 7, 100);
        pointlight.position.set(0, 0, 0);
        scene.add(pointlight);

        return this;
    }
}
