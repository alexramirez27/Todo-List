// Page.js
import Project from "./project.js";
import Todo from "./todo.js";
import { addDays, format } from 'date-fns';

class Page {
    #pageDate;
    #pageNum; 
    #currentProject = null;
    #currentTodo = null;
    #numLinesUsed = 0;
    #projects = [];

    constructor(days) {
        this.#pageNum = days;
        const janFirst = new Date(2026, 0, 1);
        const calculatedDate = addDays(janFirst, days);
        this.#pageDate = format(calculatedDate, "MMMM d, yyyy");
    }

    get pageDate() {
        return this.#pageDate;
    }

    get projects() {
        return [...this.#projects];
    }

    get pageNum() {
        return this.#pageNum;
    }

    get numLinesUsed() {
        return this.#numLinesUsed;
    }

    get currentProject() {
        return this.#currentProject;
    }

    set currentProject(project) {
        this.#currentProject = project;
    }

    updateNumLinesProjectAdded() {
        this.#numLinesUsed += 2;
    }

    addProject(project) {
        if (this.#numLinesUsed >= 22) {
            alert("Cannot add project. Page content is full!");
            return;
        }
        this.#projects.push(project);
        this.#numLinesUsed += 2;
        this.#currentProject = project;
    }

    deleteProject(idOfProject) {
        const project = this.#projects.find(project => project.projectId === idOfProject);
        this.#numLinesUsed -= 2 * project.todos.length + 2;

        this.#projects = this.#projects.filter(project => project.projectId !== idOfProject);
    }

    printProjects() {
        const projectTitles = [];
        this.#projects.forEach(project => {
            projectTitles.push(project.projectTitle);
        });

        console.log(`Page's Projects: ${JSON.stringify(projectTitles)}`);
    }

    toJSON() {
        return {
            pageNum: this.#pageNum,
            numLinesUsed: this.#numLinesUsed,
            projects: this.#projects.map(project => project.toJSON())
        };
    }

    static fromJSON(data) {
        const page = new Page(data.pageNum);

        page.#numLinesUsed = data.numLinesUsed;
        page.#projects = data.projects.map(projectData => Project.fromJSON(projectData));

        return page;
    }
}

export default Page;