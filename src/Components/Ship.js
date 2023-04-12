import * as THREE from '../lib/three.module.js'
import Engine from '../Engine/Engine.js';

const shipGeo = new THREE.ConeGeometry(3, 6);
const shipMaterial = new THREE.MeshNormalMaterial();

export default class Ship extends THREE.Group {
    constructor() {
        super();

        this.geometry = shipGeo;
        this.material = shipMaterial;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(Math.PI / 2);
        this.add(this.mesh);
        this.direction = new THREE.Vector3(0, 0, 1);
        this.speed = 0;
        Engine.machine.addCallback(this.update.bind(this));
    }

    update(delta_t) {
        this.position.add(new THREE.Vector3().copy(this.direction).multiplyScalar(this.speed * delta_t));
    }
}