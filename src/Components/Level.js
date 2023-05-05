import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";
import Asteroid from "./Asteroid.js";
import Portal from "./Portal.js";
import Ship from "./Ship.js";
import { GLTFLoader } from "../lib/gltfLoader.js";
import Sun from "./Sun.js";
import Explosion from "./Explosion.js";
import * as Dat from "../lib/dat.gui.module.js"

export default class Level extends THREE.Group {
    constructor() {
        super();
        this.maxX = 200;
        this.maxY = 200;
        this.maxZ = 200;
        this.gui = new Dat.GUI();
        this.parameters = {
            ambientBrightness: 10,
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
    let loader = new THREE.TextureLoader();
    let texture = loader.load("./src/images/space.png", () => {
      true;
    });
    let ground = new THREE.Mesh(
      new THREE.BoxGeometry(500, 500, 500),
      new THREE.MeshLambertMaterial({
        color: 0xeebbee,
        side: THREE.BackSide,
        map: texture,
      })
    );
    ground.rotateX(-Math.PI / 2);
    ground.position.set(0, -10, 0);
    scene.add(ground);

        let asteroid1 = new Asteroid(models[5]);
        asteroid1.position.set(-10, 5, -10);
        scene.add(asteroid1);

        let portalIn = new Portal(models[3]);
        portalIn.position.set(-30, 10, 15);
        scene.add(portalIn);

        let portalOut = new Portal(models[4]);
        portalOut.position.set(30, 10, 15);
        portalOut.rotateY(Math.PI)
        scene.add(portalOut);

        let ship1 = new Ship(models[0]);
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

        let ship2 = new Ship(models[1]);
        ship2.position.set(15, 15, 15);
        ship2.lookAt(asteroid1.position);
        scene.add(ship2);
        ship2.addFireKey("Digit2");

        let ship3 = new Ship(models[2]);
        ship3.position.set(0, 5, -20);
        ship3.lookAt(ship2.position);
        scene.add(ship3);
        ship3.addFireKey("Digit3");

        let sun = new Sun();
        sun.position.set(0, -30, 0);
        scene.add(sun);

        let pointlight = new THREE.PointLight(0xfffd00, this.parameters.ambientBrightness, 200);
        pointlight.position.set(0, -30, 0);
        scene.add(pointlight);

        const spotlight = new THREE.SpotLight(0xffd00, 4, 100, Math.PI / 2);
        spotlight.position.set(0, 10, 0);

        this.gui.add(this.parameters, 'ambientBrightness', 0, 20).name("Lighting Intensity").onChange(() => {
            console.log("changed brightness")
            scene.remove(pointlight);
            pointlight = new THREE.AmbientLight(0xffffff, this.parameters.ambientBrightness);
            scene.add(pointlight)
        })
        return this;
    }
}
