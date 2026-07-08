// index.js
import "./view/styles.css";
import View from "./view/view.js";
import Controller from "./controller/controller.js";
import Planner from "./model/planner.js";

function main() {
    // const view = new View();
    // view.viewInit();

    const controller = new Controller();
    controller.controllerInit();

    // const planner = new Planner();



    // planner.allPages.forEach(page => {
    //     console.log(`pageNum: ${page.pageNum}`);
    //     page.enableEventListeners();
    // })

    // planner.getPage(0).enableEventListeners();

    // console.log(`curr page: ${planner.currPage}`);

    // planner.enablePrevAndNextListeners();
}

main();