// Project.js
import Todo from "./todo.js";

class Project {
    #projectId = crypto.randomUUID();
    #projectTitle;
    #pageNum;
    #todos = [];
    #todoTitleSet = new Set();

    constructor(day) {
        this.#pageNum = day;
    }

    get projectId() {
        return this.#projectId;
    }

    get projectTitle() {
        return this.#projectTitle;
    }

    set projectTitle(name) {
        this.#projectTitle = name;
    }

    get todos() {
        return [...this.#todos];
    }

    get pageNum() {
        return this.#pageNum;
    }
    
    addTodo(todo) {
        this.#todos.push(todo);
        this.#todoTitleSet.add(todo.title);
    }

    deleteTodo(idOfTodo) {
        const todo = this.#todos.find(todo => todo.todoId === idOfTodo);
        this.#todoTitleSet.delete(todo.title);
        this.#todos = this.#todos.filter(todo => todo.todoId !== idOfTodo);
    }

    printTitleSet() {
        console.log("Todo titles:")
        this.#todoTitleSet.forEach(title => {
            console.log(title);
        });
    }

    titleInSet(title) {
        return this.#todoTitleSet.has(title);
    }

    toJSON() {
        return {
            projectId: this.#projectId,
            projectTitle: this.#projectTitle,
            pageNum: this.#pageNum,
            todos: this.#todos.map(todo => todo.toJSON()),
            todoTitleSet: Array.from(this.#todoTitleSet)
        };
    }

    static fromJSON(data) {
        const project = new Project(data.pageNum);

        project.#projectId = data.projectId;
        project.#projectTitle = data.projectTitle;
        project.#todos = data.todos.map(todoData => Todo.fromJSON(todoData));
        project.#todoTitleSet = new Set(project.#todos.map(todo => todo.title));

        return project;
    }
}

export default Project;