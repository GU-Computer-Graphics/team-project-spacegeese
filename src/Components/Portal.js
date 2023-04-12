import * as THREE from '../lib/three.module.js'

const portalGeo = new THREE.TorusGeometry(4, 1);
const portalMesh = new THREE.MeshNormalMaterial();

export default class Portal extends THREE.Group {
    constructor() {
        super();

        this.geometry = portalGeo;
        this.material = portalMesh;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateY(Math.PI / 2);
        this.add(this.mesh);

        this.name = "asteroid";
    }
}