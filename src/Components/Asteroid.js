import * as THREE from '../lib/three.module.js'

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
    }
}