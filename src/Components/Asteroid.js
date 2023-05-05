import * as THREE from '../lib/three.module.js'
import Engine from '../Engine/Engine.js';
import { GLTFLoader } from "../lib/gltfLoader.js";

const asteroidGeo = new THREE.SphereGeometry(200);
const asteroidMaterial = new THREE.MeshNormalMaterial();

export default class Asteroid extends THREE.Group {
    constructor(model) {
        super();
        this.geometry = asteroidGeo;
        this.material = asteroidMaterial;
        /**@type {THREE.Mesh} */
        this.mesh = model.scene;
        this.mesh.rotation.set(0, Math.PI / 2, 0);
        this.mesh.scale.set(0.05, 0.05, 0.05);
        this.add(this.mesh);
        this.direction = new THREE.Vector3(0, 0, 1);
        this.speed = 0;
        this.name = "asteroid";
        this.mesh.traverse((child) => {
            child.name = "asteroid";
            child.userData.root = this;
        })
        this.update = this.update.bind(this);
        this.explode = this.explode.bind(this);
        this.onBulletCollision = this.onBulletCollision.bind(this)
        Engine.machine.addCallback(this.update);
        Engine.eventHandler.subscribe('bulletCollision', this.onBulletCollision);
    }
    
    onBulletCollision(payload) {
        if (payload.object.userData.root === this) {
            console.log("Hit asteroid at", this.position);
            this.explode();
        }
    }

    update(delta_t) {
        this.position.add(new THREE.Vector3().copy(this.direction).multiplyScalar(this.speed * delta_t));
        if (!this.inScene()) {
            Engine.machine.removeCallback(this.update);
            Engine.eventHandler.unsubscribe('bulletCollision', this.onBulletCollision)
            this.removeFromParent();
        }
    }

    explode() {
        console.log("Explode Asteroid!");
        for (let i = 0; i < 4; ++i) {
            this.spawnAsteroid();
        }
        Engine.app.getScene().remove(this);
    }

    async spawnAsteroid() {
        const scale = this.scale.clone().multiplyScalar(0.5);
        const a = new Asteroid(await new GLTFLoader().loadAsync("./src/assets/daphne_planetoid.glb"));
        a.direction = new THREE.Vector3().randomDirection();
        a.speed = (Math.random() + 0.25) * 25;
        a.position.copy(this.position);
        a.scale.copy(scale);
        Engine.app.getScene().add(a);
        console.log(a);
    }

    inScene() {
        return (
            Math.abs(this.position.x) < Engine.app.level.maxX &&
            Math.abs(this.position.y) < Engine.app.level.maxY &&
            Math.abs(this.position.z) < Engine.app.level.maxZ
        )
    }
}
