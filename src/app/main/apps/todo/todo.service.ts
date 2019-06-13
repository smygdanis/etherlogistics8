import { AsanaService } from "app/services/asana.service";
import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";

import { FuseUtils } from "@fuse/utils";

import { Todo } from "app/main/apps/todo/todo.model";
import { environment } from "./../../../../environments/environment";

@Injectable()
export class TodoService implements Resolve<any> {
    todos: Todo[];
    selectedTodos: Todo[];
    currentTodo: Todo;
    searchText: string;
    filters: any[];
    tags: any[];
    routeParams: any;

    todo_data: any;
    todos_data: any;
    tags_data: any;

    onTodosChanged: BehaviorSubject<any>;
    onSelectedTodosChanged: BehaviorSubject<any>;
    onCurrentTodoChanged: BehaviorSubject<any>;
    onFiltersChanged: BehaviorSubject<any>;
    onTagsChanged: BehaviorSubject<any>;
    onSearchTextChanged: BehaviorSubject<any>;
    onNewTodoClicked: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {Location} _location
     */
    constructor(
        private asanaService: AsanaService,
        private _httpClient: HttpClient,
        private _location: Location
    ) {
        // Set the defaults
        this.selectedTodos = [];
        this.searchText = "";
        this.onTodosChanged = new BehaviorSubject([]);
        this.onSelectedTodosChanged = new BehaviorSubject([]);
        this.onCurrentTodoChanged = new BehaviorSubject([]);
        this.onFiltersChanged = new BehaviorSubject([]);
        this.onTagsChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new BehaviorSubject("");
        this.onNewTodoClicked = new Subject();
    }

    // todos template:
    // {
    //     'id'       : '561551bd7fe2ff461101c192',
    //     'name'    : 'Proident tempor est nulla irure ad est',
    //     'notes'    : 'Id nulla nulla proident deserunt deserunt proident in quis. Cillum reprehenderit labore id anim laborum.',
    //     'startDate': 'Wednesday, January 29, 2017 3:17 PM',
    //     'dueDate'  : null,
    //     'completed': false,
    //     'starred'  : false,
    //     'important': false,
    //     'deleted'  : false,
    //     'tags'     : [1]
    // },
    // {
    //     'id'       : '561551bd4ac1e7eb77a3a750',
    //     'name'    : 'Magna quis irure quis ea pariatur laborum',
    //     'notes'    : '',
    //     'startDate': 'Sunday, February 1, 2018 1:30 PM',
    //     'dueDate'  : 'Friday, December 30, 2019 10:07 AM',
    //     'completed': false,
    //     'starred'  : false,
    //     'important': true,
    //     'deleted'  : false,
    //     'tags'     : [1, 4]
    // },

    // tags template:
    //ΣΤΟ HANDLE ΒΆΛΕ ΤΟ ID
    // static tags = [
    //     {
    //         'id'    : 1,
    //         'handle': 'frontend',
    //         'title' : 'Frontend',
    //         'color' : '#388E3C'
    //     },
    //     {
    //         'id'    : 2,
    //         'handle': 'backend',
    //         'title' : 'Backend',
    //         'color' : '#F44336'
    //     },

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {
            Promise.all([
                this.getFilters(),
                this.getTags(),
                this.getTodos()
            ]).then(() => {
                if (this.routeParams.todoId) {
                    this.setCurrentTodo(this.routeParams.todoId);
                } else {
                    this.setCurrentTodo(null);
                }

                this.onSearchTextChanged.subscribe(searchText => {
                    if (searchText !== "") {
                        this.searchText = searchText;
                        this.getTodos();
                    } else {
                        this.searchText = searchText;
                        this.getTodos();
                    }
                });
                resolve();
            }, reject);
        });
    }

    /**
     * Get all filters
     *
     * @returns {Promise<any>}
     */
    getFilters(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.filters = [
                // {
                //     id: 0,
                //     handle: "starred",
                //     title: "Starred",
                //     icon: "star"
                // },
                // {
                //     id: 1,
                //     handle: "important",
                //     title: "Priority",
                //     icon: "error"
                // },
                // {
                //     id: 2,
                //     handle: "dueDate",
                //     title: "Sheduled",
                //     icon: "schedule"
                // },
                {
                    id: 0,
                    handle: "today",
                    title: "Today",
                    icon: "today"
                }
                // {
                //     id: 4,
                //     handle: "completed",
                //     title: "Done",
                //     icon: "check"
                // },
                // {
                //     id: 5,
                //     handle: "deleted",
                //     title: "Deleted",
                //     icon: "delete"
                // }
            ];
            this.onFiltersChanged.next(this.filters);
            resolve(this.filters);

            // this._httpClient
            //     .get("api/todo-filters")
            //     .subscribe((response: any) => {
            //         this.filters = response;
            //         this.onFiltersChanged.next(this.filters);
            //         resolve(this.filters);
        });
    }

    /**
     * Get all tags
     *
     * @returns {Promise<any>}
     */
    getTags(): Promise<any> {
        return new Promise((resolve, reject) => {
            const apiUrl = "https://app.asana.com/api/1.0/projects";

            const params = new HttpParams()
                .set("workspace", "8909158657352")
                .set("archived", "false")
                .set("assignee.any", "me")
                // .set("due_on.before", now)
                // .set("limit", 3)
                .set("sort_by", "due_date");

            const ParseHeaders = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: environment.asanaToken
                }),
                params: params
            };

            const options = { headers: ParseHeaders.headers, params: params };

            this._httpClient.get(apiUrl, options).subscribe((response: any) => {
                this.tags_data = response;
                this.tags = this.tags_data.data;
                console.log(this.tags);

                this.onTagsChanged.next(this.tags);
                resolve(this.tags);
            }, reject);
        });
    }

    /**
     * Get todos
     *
     * @returns {Promise<Todo[]>}
     */
    getTodos(): Promise<Todo[]> {
        if (this.routeParams.tagHandle) {
            return this.getTodosByTag(this.routeParams.tagHandle);
        }

        if (this.routeParams.filterHandle) {
            return this.getTodosByFilter(this.routeParams.filterHandle);
        }

        return this.getTodosByParams(this.routeParams);
    }

    /**
     * Get todos by params
     *
     * @param handle
     * @returns {Promise<Todo[]>}
     */
    getTodosByParams(handle): Promise<Todo[]> {
        const apiUrl =
            "https://app.asana.com/api/1.0/workspaces/8909158657352/tasks/search";
        // gets tasks from specific project with id 672636393973257

        const params = new HttpParams()
            .set("completed", "false")
            .set("assignee.any", "me")
            .set("opt_fields", "due_on,due_at,name,notes,completed,projects")
            .set("due_on.before", "2019-05-03")
            // .set("limit", 20)
            .set("sort_by", "due_date");

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            }),
            params: params
        };
        const options = { headers: ParseHeaders.headers, params: params };

        return new Promise((resolve, reject) => {
            this._httpClient.get(apiUrl, options).subscribe((todos: any) => {
                this.todos_data = todos;
                // const temptodos = this.todos_data.data;
                this.todos = this.todos_data.data;
                console.log(this.todos);
                // for (let index = 0; index < temptodos.length; index++) {
                //     const id = temptodos[index].id;
                //     this.asanaService.getAsanaTask(id).subscribe(x => {
                //         console.log(x);
                //         this.todo_data = x;
                //         const todo = this.todo_data.data;
                //         this.todos.push(todo);
                //         console.log(this.todos);
                //     });
                // }

                //commented the below and replaced it with the above
                // this.todos = todos.map(todo => {
                //     return new Todo(todo);
                // });

                this.todos = FuseUtils.filterArrayByString(
                    this.todos,
                    this.searchText
                );

                this.onTodosChanged.next(this.todos);

                resolve(this.todos);
            });
        });
    }

    /**
     * Get todos by filter
     *
     * @param handle
     * @returns {Promise<Todo[]>}
     */
    getTodosByFilter(handle): Promise<Todo[]> {
        console.log("go filters");
        let param = handle + "=true";

        if (handle === "dueDate") {
            param = handle + "=^$|\\s+";
        }

        const apiUrl =
            "https://app.asana.com/api/1.0/workspaces/8909158657352/tasks/search";
        // gets tasks from specific project with id 672636393973257

        const params = new HttpParams()
            .set("completed", "false")
            .set("assignee.any", "me")
            .set("opt_fields", "due_on,due_at,name,notes,completed,projects")
            .set("due_on", "2019-05-03")
            // .set("limit", 20)
            .set("sort_by", "due_date");

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            }),
            params: params
        };
        const options = { headers: ParseHeaders.headers, params: params };

        return new Promise((resolve, reject) => {
            this._httpClient.get(apiUrl, options).subscribe((todos: any) => {
                this.todos_data = todos;
                // const temptodos = this.todos_data.data;
                this.todos = this.todos_data.data;
                console.log(this.todos);
                // this.todos = todos.map(todo => {
                //     return new Todo(todo);
                // });

                this.todos = FuseUtils.filterArrayByString(
                    this.todos,
                    this.searchText
                );

                this.onTodosChanged.next(this.todos);

                resolve(this.todos);
            }, reject);
        });
    }

    /**
     * Get todos by tag
     *
     * @param handle
     * @returns {Promise<Todo[]>}
     */
    getTodosByTag(projectId): Promise<Todo[]> {
        console.log(projectId);

        return new Promise((resolve, reject) => {
            const apiUrl =
                "https://app.asana.com/api/1.0/projects/" +
                projectId +
                "/tasks";
            // gets tasks from specific project with id 672636393973257

            const params = new HttpParams()
                .set("completed", "false")
                .set("assignee.any", "me")
                .set(
                    "opt_fields",
                    "due_on,due_at,name,notes,completed,projects"
                )
                .set("due_on", "2019-05-03")
                // .set("limit", 20)
                .set("sort_by", "due_date");

            const ParseHeaders = {
                headers: new HttpHeaders({
                    "Content-Type": "application/json",
                    Authorization: environment.asanaToken
                }),
                params: params
            };
            const options = { headers: ParseHeaders.headers, params: params };

            return new Promise((resolve, reject) => {
                this._httpClient
                    .get(apiUrl, options)
                    .subscribe((todos: any) => {
                        this.todos_data = todos;
                        // const temptodos = this.todos_data.data;
                        this.todos = this.todos_data.data;
                        console.log(this.todos);
                        // this.todos = todos.map(todo => {
                        //     return new Todo(todo);
                        // });

                        this.todos = FuseUtils.filterArrayByString(
                            this.todos,
                            this.searchText
                        );

                        this.onTodosChanged.next(this.todos);

                        resolve(this.todos);
                    }, reject);
            });
        });
    }

    /**
     * Toggle selected todo by id
     *
     * @param id
     */
    toggleSelectedTodo(id): void {
        // First, check if we already have that todo as selected...
        if (this.selectedTodos.length > 0) {
            for (const todo of this.selectedTodos) {
                // ...delete the selected todo
                if (todo.id === id) {
                    const index = this.selectedTodos.indexOf(todo);

                    if (index !== -1) {
                        this.selectedTodos.splice(index, 1);

                        // Trigger the next event
                        this.onSelectedTodosChanged.next(this.selectedTodos);

                        // Return
                        return;
                    }
                }
            }
        }

        // If we don't have it, push as selected
        this.selectedTodos.push(
            this.todos.find(todo => {
                return todo.id === id;
            })
        );

        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedTodos.length > 0) {
            this.deselectTodos();
        } else {
            this.selectTodos();
        }
    }

    /**
     * Select todos
     *
     * @param filterParameter
     * @param filterValue
     */
    selectTodos(filterParameter?, filterValue?): void {
        this.selectedTodos = [];

        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedTodos = this.todos;
        } else {
            this.selectedTodos.push(
                ...this.todos.filter(todo => {
                    return todo[filterParameter] === filterValue;
                })
            );
        }

        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
    }

    /**
     * Deselect todos
     */
    deselectTodos(): void {
        this.selectedTodos = [];

        // Trigger the next event
        this.onSelectedTodosChanged.next(this.selectedTodos);
    }

    /**
     * Set current todo by id
     *
     * @param id
     */
    setCurrentTodo(id): void {
        this.currentTodo = this.todos.find(todo => {
            return todo.id === id;
        });

        this.onCurrentTodoChanged.next([this.currentTodo, "edit"]);

        const tagHandle = this.routeParams.tagHandle,
            filterHandle = this.routeParams.filterHandle;

        if (tagHandle) {
            this._location.go("apps/todo/tag/" + tagHandle + "/" + id);
        } else if (filterHandle) {
            this._location.go("apps/todo/filter/" + filterHandle + "/" + id);
        } else {
            this._location.go("apps/todo/all/" + id);
        }
    }

    /**
     * Toggle tag on selected todos
     *
     * @param tagId
     */
    toggleTagOnSelectedTodos(tagId): void {
        this.selectedTodos.map(todo => {
            this.toggleTagOnTodo(tagId, todo);
        });
    }

    /**
     * Toggle tag on todo
     *
     * @param tagId
     * @param todo
     */
    toggleTagOnTodo(tagId, todo): void {
        const index = todo.tags.indexOf(tagId);

        if (index !== -1) {
            todo.tags.splice(index, 1);
        } else {
            todo.tags.push(tagId);
        }

        this.updateTodo(todo);
    }

    /**
     * Has tag?
     *
     * @param tagId
     * @param todo
     * @returns {boolean}
     */
    hasTag(tagId, todo): any {
        if (!todo.tags) {
            return false;
        }

        return todo.tags.indexOf(tagId) !== -1;
    }

    /**
     * Update the todo
     *
     * @param todo
     * @returns {Promise<any>}
     */
    updateTodo(todo): any {
        return new Promise((resolve, reject) => {
            console.log(todo);
            this._httpClient
                .post("api/todo-todos/" + todo.id, { ...todo })
                .subscribe(response => {
                    this.getTodos().then(todos => {
                        resolve(todos);
                    }, reject);
                });
        });
    }
}
