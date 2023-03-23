import * as THREE from 'three'
import Player from './Player';

export default class OpenLevel extends THREE.Group {
    constructor() {
        super();

        this.player = undefined;
    }

    load(scene, camera) {
        this.player = new Player(100, 100);
        this.player.position.set(0, 5, 0);
        this.player.addCamera(camera);
        scene.add(this.player);

        let ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({color: 0x20FF20})
        );
        ground.rotateX(- Math.PI / 2);
        scene.add(ground);

        let box = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshBasicMaterial({color: 0x0000FF})
        );
        box.position.set(0, 2, -15);
        scene.add(box);
        return this;
    }
}