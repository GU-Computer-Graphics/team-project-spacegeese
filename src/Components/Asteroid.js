import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";
import Explosion from "./Explosion.js";

const asteroidGeo = new THREE.SphereGeometry(2);
const asteroidMaterial = new THREE.MeshNormalMaterial();

export default class Asteroid extends THREE.Group {
  constructor(model) {
    super();

    this.geometry = asteroidGeo;
    this.material = asteroidMaterial;
    this.mesh = model.scene;
    // console.log(this.mesh);
    this.mesh.rotation.set(0, Math.PI / 2, 0);
    this.mesh.scale.set(0.05, 0.05, 0.05);
    this.add(this.mesh);
    this.direction = new THREE.Vector3(0, 0, 1);
    this.speed = 0;
    this.update = this.update.bind(this);
    this.explosionSpeed = 50;
    Engine.machine.addCallback(this.update);
    Engine.eventHandler.subscribe("bulletCollision", (payload) => {
      // this.explode();
      // console.log(payload.object);
      if (payload.object.name === "Daphne_LP_1_0") {
        console.log("Hit asteroid at", this.position);
        this.explode();
      }
    });
  }

  update(delta_t) {
    this.position.add(
      new THREE.Vector3()
        .copy(this.direction)
        .multiplyScalar(this.speed * delta_t)
    );
  }

  explode() {
    console.log("Explode Asteroid!");
    this.mesh.updateMatrixWorld();

    const currDir = new THREE.Vector3()
      .copy(this.direction)
      .applyQuaternion(this.quaternion)
      .normalize();
    let explosion = new Explosion();

    // let explosion = new Explosion();
    explosion.position.copy(this.position);
    Engine.app.getScene().add(explosion);
    // Engine.app.getScene().remove(this);
  }
}
