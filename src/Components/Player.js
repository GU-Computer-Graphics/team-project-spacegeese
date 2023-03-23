import * as THREE from 'three'
import Engine from '../Engine/Engine';

export default class Player extends THREE.Object3D {
    constructor(maxWidth, maxLength) {
        super();
        /**@type {THREE.PerspectiveCamera} */
        this.camera = undefined;
        this.turnSpeed = 2;
        this.moveSpeed = 20;
        Engine.machine.addCallback(this.update.bind(this));
        this.levelBoundary = new THREE.Vector3(maxWidth, 0, maxLength);
    }

    update(delta_t) {
        this.movementController(delta_t);
    }

    /**
     * Basic WASD/ArrowKey controls
     * @param {number} delta_t Time in ms since last frame
     */
    movementController(delta_t) {
        let frameSpeed = this.moveSpeed * delta_t;
        let frameTurnSpeed = this.turnSpeed * delta_t;
        let lookDown = Engine.inputListener.isPressed('ArrowUp') || Engine.inputListener.isPressed('KeyI');
        let lookUp = Engine.inputListener.isPressed('ArrowDown') || Engine.inputListener.isPressed('KeyK');
        let turnLeft = Engine.inputListener.isPressed('ArrowLeft') || Engine.inputListener.isPressed('KeyJ');
        let turnRight = Engine.inputListener.isPressed('ArrowRight') || Engine.inputListener.isPressed('KeyL');
        let forward = Engine.inputListener.isPressed("KeyW");
        let backward = Engine.inputListener.isPressed('KeyS');
        let left = Engine.inputListener.isPressed("KeyA");
        let right = Engine.inputListener.isPressed("KeyD");
        let newPos = new THREE.Vector3(0, 0, 0);
        if (lookDown) { this.camera.rotateX(frameTurnSpeed); }
        if (lookUp) { this.camera.rotateX(-1 * frameTurnSpeed); }
        if (turnLeft) { this.rotateY(frameTurnSpeed); }
        if (turnRight) { this.rotateY(-1 * frameTurnSpeed); }
        if (forward) { newPos.z += -1 * frameSpeed; }
        if (backward) { newPos.z += frameSpeed; }
        if (right) { newPos.x += frameSpeed; }
        if (left) { newPos.x += -1 * frameSpeed; }
        newPos.applyQuaternion(this.quaternion);
        this.position.add(this.checkBoundary(newPos));
    }

    /**
     * @param {THREE.Vector3} newPos 
     */
    checkBoundary(newPos) {
        if (this.position.x + newPos.x > this.levelBoundary.x - 1) {
            newPos.x = this.levelBoundary.x - this.position.x - 1;
        }
        if (this.position.x + newPos.x < -1 * this.levelBoundary.x + 1) {
            newPos.x = -1 * this.levelBoundary.x - this.position.x + 1;
        }
        if (this.position.z + newPos.z > this.levelBoundary.z - 1) {
            newPos.z = this.levelBoundary.z - this.position.z - 1;
        }
        if (this.position.z + newPos.z < -1 * this.levelBoundary.z + 1) {
            newPos.z = -1 * this.levelBoundary.z - this.position.z + 1;
        }
        return newPos;
    }

    addCamera(camera) {
        this.camera = camera;
        this.add(camera);
        this.camera.position.set(0, 0, 0);
    }
} 