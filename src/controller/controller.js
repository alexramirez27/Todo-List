// controller.js
// Model
import Todo from "../model/todo.js";
import Project from "../model/project.js";
import Page from "../model/page.js";
import Planner from "../model/planner.js";
// View
import View from "../view/view.js";
import { addDays, format, isBefore, isAfter, differenceInCalendarDays, parseISO } from 'date-fns';


class Controller {
    #planner;
    #view;

    constructor() {
        this.#planner = new Planner();
        this.#view = new View();
    }

    #handleDeleteProject(page, projectId, pageNum, projectTitle) {
        page.deleteProject(projectId);
        this.#planner.projTitlesAndPageNums.delete(projectTitle);

        this.saveToLocalStorage();

        this.#displayCurrentPage();

        // Update select menu options
        const selectProjects = document.querySelector("#projects");
        const currOptions = selectProjects.querySelectorAll("option");
        currOptions.forEach(optionItem => {
            selectProjects.removeChild(optionItem);
        });

        this.#planner.projTitlesAndPageNums.forEach((pageNum, title) => {
            const option = document.createElement("option");
            option.setAttribute("value", pageNum);
            option.textContent = title;
            selectProjects.appendChild(option);
        });
    }

    #createProjectFromDialog() {
        const dialog = document.querySelector(".create-project-dialog");
        const form = dialog.querySelector("form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const titleInput = document.querySelector(".create-project-dialog #title");

            if (this.#planner.titleTaken(titleInput.value)) {
                alert("Cannot create Project! Another Project with the same name has already been created!");
                return;
            }

            const project = new Project(this.#planner.currPageNum);
            project.projectTitle = titleInput.value;

            const currPage = this.#planner.pages[this.#planner.currPageNum];
            currPage.addProject(project);

            this.#planner.addProjectTitleAndPageNum(titleInput.value, this.#planner.currPageNum);

            // Save to local storage
            this.saveToLocalStorage();

            form.reset();
            dialog.close();

            // Push the project title to the select projects menu
            this.#view.addProjectToSelectMenu(project);

            this.#displayCurrentPage();
        });
    }

    #createTodoFromDialog() {
        const dialog = document.querySelector(".create-todo-dialog");
        const form = dialog.querySelector("form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const currPage = this.#planner.pages[this.#planner.currPageNum];
            if (currPage.numLinesUsed >= 24) {
                alert("Cannot add todo. Page content is full!");
                return;
            }

            const titleInput = document.querySelector(".create-todo-dialog #title");
            const descInput = document.querySelector(".create-todo-dialog #description");
            const dueDateInput = document.querySelector(".create-todo-dialog #due_date");
            const priorityInput = document.querySelector(".create-todo-dialog #priority");

            const dueDateText = format(parseISO(dueDateInput.value), "MMMM d, yyyy");

            if (currPage.currentProject.titleInSet(titleInput.value)) {
                alert("Cannot create To-Do! Another To-Do with the same name has already been created in this project!");
                return;
            }

            const todo = new Todo(titleInput.value, descInput.value, dueDateText, priorityInput.value);
            
            currPage.currentProject.addTodo(todo);
            currPage.updateNumLinesProjectAdded();

            this.saveToLocalStorage();

            form.reset();
            dialog.close();

            this.#displayCurrentPage();
        });
    }

    #modifyTodoFromDialog() {
        const dialog = document.querySelector(".modify-todo-dialog");
        const form = dialog.querySelector("form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const currPage = this.#planner.pages[this.#planner.currPageNum];

            const currTodo = currPage.currentTodo;

            const titleInput = document.querySelector(".modify-todo-dialog #title");
            const descInput = document.querySelector(".modify-todo-dialog #description");
            const dueDateInput = document.querySelector(".modify-todo-dialog #due_date");
            const priorityInput = document.querySelector(".modify-todo-dialog #priority");

            // const dueDateText = format(dueDateInput.value, "MMMM d, yyyy");
            const dueDateText = format(parseISO(dueDateInput.value), "MMMM d, yyyy");

            currTodo.title = titleInput.value;
            currTodo.description = descInput.value;
            currTodo.dueDate = dueDateText;
            currTodo.priority = priorityInput.value;

            this.saveToLocalStorage();

            form.reset();
            dialog.close();

            this.#displayCurrentPage();
        });
    } 

    #goToDateFromDialog() {
        const dialog = document.querySelector(".go-to-date-dialog");
        const form = dialog.querySelector("form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const goToDate = document.querySelector("#go_to_date").value;
            const dateSelected = parseISO(goToDate);
            const janFirst = new Date(2026, 0, 1);
            const decThirtyFirst = new Date(2026, 11, 31);

            if (isBefore(dateSelected, janFirst) || isAfter(dateSelected, decThirtyFirst)) {
                alert("Date selected must be in the year 2026!");
                return;
            }

            const dayOfYear = differenceInCalendarDays(dateSelected, janFirst);
            const selectedPage = this.#planner.pages[dayOfYear];

            this.#planner.currPageNum = dayOfYear;

            this.saveToLocalStorage();

            form.reset();
            dialog.close();

            // Slide out
            const aside = document.querySelector("aside");
            const dimOverlay = document.querySelector(".overlay");
            dimOverlay.classList.remove('active');
            aside.style.transform = "translateX(calc(-100% - 10px))";

            this.#displayCurrentPage();
        });
    }

    #goToProjectFromDialog() {
        const dialog = document.querySelector(".projects-dialog");
        const form = dialog.querySelector("form");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const selectMenu = document.querySelector("#projects");
            const selectedOption = selectMenu.options[selectMenu.selectedIndex];
            const pageNum = selectedOption.value;
            const title = selectedOption.textContent;

            this.#planner.currPageNum = Number(pageNum);
            this.saveToLocalStorage();  

            form.reset();
            dialog.close();

            // Slide out
            const aside = document.querySelector("aside");
            const dimOverlay = document.querySelector(".overlay");
            dimOverlay.classList.remove('active');
            aside.style.transform = "translateX(calc(-100% - 10px))";

            const selectedPage = this.#planner.pages[this.#planner.currPageNum];
            this.#displayCurrentPage();
        });
    }

    #enablePrevAndNextListeners() {
        // Decrement page number
        const prevBtn = document.querySelector("#prev-page");
        prevBtn.addEventListener("click", () => {
            if (this.#planner.currPageNum > 0) {
                this.#planner.decrementPageNum();
                this.saveToLocalStorage();
                // Display page content
                const currPage = this.#planner.pages[this.#planner.currPageNum];
                this.#displayCurrentPage();
            } else {
                alert("Cannot go to the previous page because this is the first day of 2026!");
            }
        });

        // Increment page number
        const nextBtn = document.querySelector("#next-page");
        nextBtn.addEventListener("click", () => {
            if (this.#planner.currPageNum < 364) {
                this.#planner.incrementPageNum();
                this.saveToLocalStorage();
                // Display page content
                const currPage = this.#planner.pages[this.#planner.currPageNum];
                this.#displayCurrentPage();
            } else {
                alert("Cannot go to the next page because this is the last day of 2026!");
            }
        });
    }

    #displayCurrentPage(pageDay = this.#planner.currPageNum) {
        this.#planner.currPageNum = pageDay;
        const currPage = this.#planner.pages[this.#planner.currPageNum];

        this.#view.displayPageContent(
            currPage,
            (p, id, num, title) => this.#handleDeleteProject(p, id, num, title),
            (project, todoId) => this.#handleDeleteTodo(project, todoId),
            (todo) => this.#handleToggleTodo(todo)
        );
    }

    #handleDeleteTodo(project, todoId) {
        project.deleteTodo(todoId);
        this.saveToLocalStorage();
        this.#displayCurrentPage();
    }

    #handleToggleTodo(todo) {
        todo.toggleComplete();
        this.saveToLocalStorage();
        this.#displayCurrentPage();
    }

    saveToLocalStorage() {
        localStorage.setItem("planner", JSON.stringify(this.#planner.toJSON()));
    }

    loadFromLocalStorage() {
        const savedPlanner = localStorage.getItem("planner");

        if (!savedPlanner) {
            return;
        }

        const parsedPlanner = JSON.parse(savedPlanner);
        this.#planner = Planner.fromJSON(parsedPlanner);
    }

    controllerInit() {
        this.loadFromLocalStorage();

        this.#createProjectFromDialog();
        this.#createTodoFromDialog();
        this.#modifyTodoFromDialog();
        this.#goToDateFromDialog();
        this.#goToProjectFromDialog();
        this.#enablePrevAndNextListeners();

        this.#view.viewInit();

        this.#planner.projTitlesAndPageNums.forEach((pageNum, title) => {
            this.#view.addProjectToSelectMenu({
                pageNum,
                projectTitle: title
            });
        });

        const today = new Date();
        const daysSinceJan1 = differenceInCalendarDays(today, new Date(2026, 0, 1));
        console.log(`daysSinceJan1 = ${daysSinceJan1}`);

        if (today.getFullYear() !== 2026) {
            this.#displayCurrentPage();
        } else {
            this.#displayCurrentPage(daysSinceJan1);
        }
    }
}

export default Controller;