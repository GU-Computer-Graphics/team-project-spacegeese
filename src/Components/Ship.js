import * as THREE from '../lib/three.module.js'
import Engine from '../Engine/Engine.js';
import Bullet from './Bullet.js';

export default class Ship extends THREE.Group {
    constructor(model) {
        super();
        this.mesh = model.scene
        this.add(model.scene)
        this.mesh.rotation.set(0, -Math.PI / 2, 0)
        this.mesh.position.set(-1, 0, 0)
        this.add(this.mesh);
        this.direction = new THREE.Vector3(0, 0, 1);
        this.speed = 0;
        this.name = "ship";
        this.bulletSpeed = 50;
        this.update = this.update.bind(this);

        Engine.machine.addCallback(this.update);
        Engine.eventHandler.subscribe('bulletCollision', (payload) => {
            if (payload.object.parent === this) {
                console.log("Hit ship at", this.position);
                this.explode();
            }
        });
    }

    update(delta_t) {
        this.updateMatrixWorld();
        this.mesh.updateMatrixWorld();
        const currDir = new THREE.Vector3().copy(this.direction).applyQuaternion(this.quaternion).normalize();
        this.position.add(currDir.multiplyScalar(this.speed * delta_t));
    }

    fire() {
        this.mesh.updateMatrixWorld();
        const currDir = new THREE.Vector3().copy(this.direction).applyQuaternion(this.quaternion).normalize();
        let bullet = new Bullet(currDir.multiplyScalar(this.bulletSpeed));
        bullet.position.copy(this.position);
        Engine.app.getScene().add(bullet);
    }

    explode() {
        console.log("Explode Ship!");
    }
}
