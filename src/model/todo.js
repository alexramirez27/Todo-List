// Todo.js

class Todo {
    #todoId = crypto.randomUUID();
    #title;
    #description;
    #dueDate;
    #priority;
    #complete;
    
    constructor(title, description, dueDate, priority, complete = false) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#complete = complete;
    }

    get todoId() {
        return this.#todoId;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        this.#title = value;
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }

    get dueDate() {
        return this.#dueDate;
    }

    set dueDate(value) {
        this.#dueDate = value;
    }

    get priority() {
        return this.#priority;
    }

    set priority(value) {
        this.#priority = value;
    }

    get complete() {
        return this.#complete;
    }

    toggleComplete() {
        this.#complete = !this.#complete;
    }

    printTodo() {
        console.log(
            `Todo = 
            { 
                title: ${this.#title}, 
                description: ${this.#description}, 
                dueDate: ${this.#dueDate}, 
                priority: ${this.#priority},
                complete: ${this.#complete}
            }`
        );
    }

    toJSON() {
        return {
            todoId: this.#todoId,
            title: this.#title,
            description: this.#description,
            dueDate: this.#dueDate,
            priority: this.#priority,
            complete: this.#complete
        };
    }

    static fromJSON(data) {
        const todo = new Todo(
            data.title,
            data.description,
            data.dueDate,
            data.priority,
            data.complete
        );

        todo.#todoId = data.todoId;
        return todo;
    }
}

export default Todo;