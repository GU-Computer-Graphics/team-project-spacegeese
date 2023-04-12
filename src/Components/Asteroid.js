import * as THREE from '../lib/three.module.js'
import Engine from '../Engine/Engine.js';

const asteroidGeo = new THREE.SphereGeometry(2);
const asteroidMaterial = new THREE.MeshNormalMaterial();

export default class Asteroid extends THREE.Group {
    constructor() {
        super();

        this.geometry = asteroidGeo;
        this.material = asteroidMaterial;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(Math.PI / 2);
        this.add(this.mesh);
        this.direction = new THREE.Vector3(0, 0, 1);
        this.speed = 0;
        this.name = "asteroid";
        this.update = this.update.bind(this);
        Engine.machine.addCallback(this.update);
        Engine.eventHandler.subscribe('bulletCollision', (payload) => {
            if (payload.object.parent === this) {
                console.log("Hit asteroid at", this.position);
                this.explode();
            }
        });
    }

    update(delta_t) {
        this.position.add(new THREE.Vector3().copy(this.direction).multiplyScalar(this.speed * delta_t));
    }

    explode() {
        console.log("Explode Asteroid!");
    }
}