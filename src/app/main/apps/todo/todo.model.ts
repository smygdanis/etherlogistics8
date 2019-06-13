export class Todo {
    id: string;
    name: string;
    notes: string;
    due_at: string;
    due_on: string;
    completed: boolean;
    starred: boolean;
    important: boolean;
    deleted: boolean;
    tags: [
        {
            id: string;
            gid: string;
            label: string;
            resource_type: string;
        }
    ];

    /**
     * Constructor
     *
     * @param todo
     */
    constructor(todo) {
        {
            this.id = todo.id;
            this.name = todo.name;
            this.notes = todo.notes;
            this.due_at = todo.due_at;
            this.due_on = todo.due_on;
            this.completed = todo.completed;
            this.starred = todo.starred;
            this.important = todo.important;
            this.deleted = todo.deleted;
            this.tags = todo.projects || [];
        }
    }

    /**
     * Toggle star
     */
    toggleStar(): void {
        this.starred = !this.starred;
    }

    /**
     * Toggle important
     */
    toggleImportant(): void {
        this.important = !this.important;
    }

    /**
     * Toggle completed
     */
    toggleCompleted(): void {
        this.completed = !this.completed;
    }

    /**
     * Toggle deleted
     */
    toggleDeleted(): void {
        this.deleted = !this.deleted;
    }
}
