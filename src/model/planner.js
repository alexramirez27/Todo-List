// Planner.js
import Page from "./page.js";

class Planner {
    #currPageNum = 0;
    #pages = [];
    #projTitlesAndPageNums = new Map();

    constructor() {
        for (let i = 0; i < 365; i++) {
            const newPage = new Page(i);
            this.#pages.push(newPage);
        }
    }

    get currPageNum() {
        return this.#currPageNum;
    }

    set currPageNum(pageNum) {
        this.#currPageNum = pageNum;
    }

    get pages() {
        return [...this.#pages];
    }

    get projTitlesAndPageNums() {
        return this.#projTitlesAndPageNums;
    }

    printMap() {
        console.log("projTitlesAndPageNums:", Object.fromEntries(this.#projTitlesAndPageNums));
    }

    incrementPageNum() {
        this.#currPageNum++;
    }

    decrementPageNum() {
        this.#currPageNum--;
    }

    printPageDates() {
        this.#pages.forEach(page => {
            console.log(`pageDate: ${page.pageDate}`);
        })
    }

    addProjectTitleAndPageNum(title, pageNum) {
        this.#projTitlesAndPageNums.set(title, pageNum);
    }

    titleTaken(title) {
        return this.#projTitlesAndPageNums.has(title);
    }

    toJSON() {
        return {
            currPageNum: this.#currPageNum,
            pages: this.#pages.map(page => page.toJSON()),
            projTitlesAndPageNums: Array.from(this.#projTitlesAndPageNums)
        };
    }

    static fromJSON(data) {
        const planner = new Planner();

        planner.#currPageNum = data.currPageNum;
        planner.#pages = data.pages.map(pageData => Page.fromJSON(pageData));
        planner.#projTitlesAndPageNums = new Map(data.projTitlesAndPageNums);

        return planner;
    }
}

export default Planner;