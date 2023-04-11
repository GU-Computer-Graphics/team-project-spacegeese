import * as THREE from '../lib/three.module.js'
import { OrbitControls } from '../lib/OrbitControls.js';

export default class Camera extends THREE.PerspectiveCamera {
    constructor(cp) {
        super(
            cp.fov,
            cp.aspectRatio,
            cp.near,
            cp.far
        );
        this.params = cp;
        this.position.set(cp.eyeX, cp.eyeY, cp.eyeZ);
        this.up.set(cp.upX, cp.upY, cp.upZ);
    }

    setupCameraControls(canvas, render) {
        this.cameraControls = new OrbitControls(this, canvas);
        this.cameraControls.addEventListener("change", render);
        this.cameraControls.target = new THREE.Vector3(
            this.params.atX,
            this.params.atY,
            this.params.atZ    
        );
        this.cameraControls.update();
    }
}
