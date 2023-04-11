import EventHandler from "./EventHandler.js";
import InputListener from "./InputListener.js";
import Machine from "./Machine.js";

class GameEngine {
    constructor() {
        this.eventHandler = new EventHandler()
        this.machine = new Machine();
        this.inputListener = new InputListener();
        this.app = undefined;
    }

    clear() {
        this.eventHandler.clear();
        this.machine.clear();
        this.inputListener.clear();
    }
}

const Engine = new GameEngine();

export default Engine;