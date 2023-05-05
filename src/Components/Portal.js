import * as THREE from "../lib/three.module.js";

const portalGeo = new THREE.TorusGeometry(4, 1);
const portalMesh = new THREE.MeshNormalMaterial();

export default class Portal extends THREE.Group {
    constructor(model) {
        super();

        this.outerGeometry = portalGeo;
        this.outerMaterial = portalMesh;
        // this.mesh = model.scene;
        // this.mesh.scale.set(0.1, 0.1, 0.1);
        this.mesh = new THREE.Mesh(this.outerGeometry, this.outerMaterial);
        this.mesh.rotateY(Math.PI / 2);
        this.add(this.mesh);

        this.portalImageGeometry = new THREE.CircleGeometry(5);
        this.portalImageMaterial = new THREE.MeshBasicMaterial({
            color: "green",
            side: THREE.DoubleSide
        });
        this.portalImageMesh = new THREE.Mesh(
            this.portalImageGeometry,
            this.portalImageMaterial
        );
        this.portalImageMesh.rotateY(Math.PI / 2);
        this.add(this.portalImageMesh);

        this.name = "portal";
    }
}
