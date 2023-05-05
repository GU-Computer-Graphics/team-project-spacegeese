import * as THREE from "../lib/three.module.js";
import Engine from "../Engine/Engine.js";

export default class Portal extends THREE.Group {
    constructor(model) {
        super();
        console.log(model)
        this.mesh = model.scene;
        this.mesh.scale.set(0.1, 0.1, 0.1);
        this.mesh.rotateY(Math.PI / 2);
        this.add(this.mesh);

        this.mixer = new THREE.AnimationMixer( this.mesh );
        const animation = model.animations[0];
        const action = this.mixer.clipAction( animation );
        action.play();

        this.name = "portal";

        this.update = this.update.bind(this);
        Engine.machine.addCallback(this.update);
    }

    update(delta_t) {
        this.mixer.update(delta_t);
    }    
}
