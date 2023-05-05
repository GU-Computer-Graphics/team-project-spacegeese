import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";

const chunkGeometry = new THREE.SphereGeometry(0.5, 3, 2);
const chunkMaterial = new THREE.MeshBasicMaterial({ color: 0x1fff0f });

export default class Explosion extends THREE.Group {
  /**
  //  * @param {THREE.Vector3} velocity in World Coordinates
   */
  // constructor(velocity) {
  constructor() {
    super();

    for (let i = 0; i < THREE.MathUtils.randFloat(1, 4); i++) {
      console.log("Explosion number ", i);
      this.mesh = new THREE.Mesh(chunkGeometry, chunkMaterial);
      this.add(this.mesh);

      // this.name = "chunk";

      /**@type {THREE.Vector3} */
      // this.velocity = velocity;
      this.speed = 4;

      this.direction = new THREE.Vector3(
        THREE.MathUtils.randFloat(0, 1),
        THREE.MathUtils.randFloat(0, 1),
        THREE.MathUtils.randFloat(0, 1)
      ).normalize();

      console.log(this.direction);

      this.lastPos = new THREE.Vector3().copy(this.position);
      this.update = this.update.bind(this);
      Engine.app.getScene().add(this.mesh);
    }
    Engine.machine.addCallback(this.update);
  }

  update(delta_t) {
    if (this.inScene()) {
      this.lastPos.copy(this.position);
      this.position.add(
        new THREE.Vector3()
          .copy(this.direction)
          .multiplyScalar(this.speed * delta_t)
      );
      this.checkForCollision(delta_t);
    } else {
      this.destroy();
    }
  }

  checkForCollision(delta_t) {
    let rc = new THREE.Raycaster(
      this.lastPos,
      new THREE.Vector3().copy(this.direction).normalize(),
      0,
      new THREE.Vector3().subVectors(this.lastPos, this.position).length()
    );
    const intersects = rc.intersectObjects(
      Engine.app.getScene().children,
      true
    );
    if (intersects.length > 0) {
      if (
        intersects[0].object.parent.name === "asteroid" ||
        intersects[0].object.parent.name === "ship"
      ) {
        this.destroy();
      }
      Engine.eventHandler.dispatch("chunkCollision", intersects[0]);
    }
  }

  inScene() {
    return (
      Math.abs(this.position.x) < Engine.app.level.maxX &&
      Math.abs(this.position.y) < Engine.app.level.maxY &&
      Math.abs(this.position.z) < Engine.app.level.maxZ
    );
  }

  destroy() {
    Engine.machine.removeCallback(this.update);
    this.removeFromParent();
  }
}
