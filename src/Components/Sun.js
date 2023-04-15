import * as THREE from "../lib/three.module.js";

const sunGeo = new THREE.SphereGeometry(3);
const sunMaterial = new THREE.MeshPhongMaterial({
  color: 0xffa500,
  specular: 0xfffd00,
  shininess: 36,
});

export default class Sun extends THREE.Group {
  constructor() {
    super();

    this.geometry = sunGeo;
    this.material = sunMaterial;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.add(this.mesh);
  }
}
