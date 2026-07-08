// index.js
import "./view/styles.css";
import View from "./view/view.js";
import Controller from "./controller/controller.js";
import Planner from "./model/planner.js";

function main() {
    const controller = new Controller();
    controller.controllerInit();
}

main();