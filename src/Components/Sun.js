import * as THREE from "../lib/three.module.js";

const sunGeo = new THREE.SphereGeometry(10);
let loader = new THREE.TextureLoader();
let texture = loader.load("./src/images/sunSurfaceMaterial.jpg", () => {
  true;
});
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  specular: 0xffa000,
  shininess: 36,
  transparency: true,
  opacity: 0.2,
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
