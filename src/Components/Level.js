import * as THREE from '../lib/three.module.js'
import Asteroid from './Asteroid.js';
import Portal from './Portal.js';
import Ship from './Ship.js';

export default class Level extends THREE.Group {
    constructor() {
        super();
    }

    load(scene) {
        let ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshBasicMaterial({color: 0xeebbee})
        );
        ground.rotateX(- Math.PI / 2);
        scene.add(ground);

        let asteroid1 = new Asteroid();
        asteroid1.position.set(-10, 5, -10);
        scene.add(asteroid1);

        let portal = new Portal();
        portal.position.set(-20, 10, 15);
        scene.add(portal);

        let ship1 = new Ship();
        ship1.position.set(-5, 10, 15);
        ship1.lookAt(portal.position);
        scene.add(ship1);

        let ship2 = new Ship();
        ship2.position.set(15, 15, 15);
        ship2.lookAt(asteroid1.position);
        scene.add(ship2);

        let ship3 = new Ship();
        ship3.position.set(0, 5, -20);
        ship3.lookAt(ship2.position);
        scene.add(ship3);

        return this;
    }
}