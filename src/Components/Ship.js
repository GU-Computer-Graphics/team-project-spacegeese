import * as THREE from '../lib/three.module.js'

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
    }
}