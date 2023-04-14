import * as THREE from '../lib/three.module.js'

const portalGeo = new THREE.TorusGeometry(4, 1);
const portalMesh = new THREE.MeshNormalMaterial();

export default class Portal extends THREE.Group {
    constructor(model) {
        super();

        this.geometry = portalGeo;
        this.material = portalMesh;
        this.mesh = model.scene;
        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.mesh.rotation.set(0, Math.PI / 2, 0);
        this.add(this.mesh);
        this.name = "portal";
    }
}
