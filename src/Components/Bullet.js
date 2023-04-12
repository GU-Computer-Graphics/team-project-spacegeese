import * as THREE from '../lib/three.module.js'
import Engine from '../Engine/Engine.js';

const bulletGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2);
const bulletMaterial = new THREE.MeshBasicMaterial({color: 0x1FFF0F})

export default class Bullet extends THREE.Group {
    /**
     * @param {THREE.Vector3} velocity in World Coordinates
     */
    constructor(velocity) {
        super();
        this.mesh = new THREE.Mesh(
            bulletGeometry,
            bulletMaterial
        );
        this.add(this.mesh);

        this.name = "bullet";

        /**@type {THREE.Vector3} */
        this.velocity = velocity;
        this.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().copy(velocity).normalize());

        this.lastPos = new THREE.Vector3().copy(this.position);

        this.update = this.update.bind(this)
        Engine.machine.addCallback(this.update);
    }

    update(delta_t) {
        if (this.inScene()) {
            this.lastPos.copy(this.position);
            this.position.add(new THREE.Vector3().copy(this.velocity).multiplyScalar(delta_t));
            this.checkForCollision(delta_t);
        } else {            
            this.destroy();
        }
    }

    checkForCollision(delta_t) {
        let rc = new THREE.Raycaster(this.lastPos, new THREE.Vector3().copy(this.velocity).normalize(), 0, new THREE.Vector3().subVectors(this.lastPos, this.position).length());
        const intersects = rc.intersectObjects(Engine.app.getScene().children, true);
        if (intersects.length > 0) {
            if (intersects[0].object.parent.name === "asteroid" || intersects[0].object.parent.name === "ship") {
                this.destroy();
            }
            Engine.eventHandler.dispatch("bulletCollision", intersects[0])
        }
    }

    inScene() {
        return (
            Math.abs(this.position.x) < Engine.app.level.maxX &&
            Math.abs(this.position.y) < Engine.app.level.maxY &&
            Math.abs(this.position.z) < Engine.app.level.maxZ
        )
    }

    destroy() {
        Engine.machine.removeCallback(this.update);
        this.removeFromParent();
    }
} 