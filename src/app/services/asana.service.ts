import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse,
    HttpResponse,
    HttpParams
} from "@angular/common/http";
import * as moment from "moment";

@Injectable({
    providedIn: "root"
})
export class AsanaService {
    body: any;
    constructor(private http: HttpClient) {}
    // /constructor

    getRemoteData() {
        return this.http.get("https://jsonplaceholder.typicode.com/posts");
    }

    getAsanaTeams() {
        const apiUrl =
            "https://app.asana.com/api/1.0/organizations/8909158657352/teams";
        // gets tasks from specific project with id 672636393973257

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            })
        };
        return this.http.get(apiUrl, ParseHeaders);
    }

    getAsanaProjects() {
        const apiUrl =
            "https://app.asana.com/api/1.0/workspaces/8909158657352/projects/";
        // gets tasks from specific project with id 672636393973257

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            })
        };
        return this.http.get(apiUrl, ParseHeaders);
    }

    createAsanaProject() {
        const apiUrl =
            "https://app.asana.com/api/1.0/workspaces/8909158657352/projects/";
        // gets tasks from specific project with id 672636393973257

        this.body = new HttpParams()
            .set("name", "newProjectSpyros")
            .set("notes", "testNotes")
            .set("team", "686523727557815");

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: environment.asanaToken
            })
        };
        return this.http.post(apiUrl, this.body.toString(), ParseHeaders);
    }

    getAsanaTasks(projectId) {
        const apiUrl =
            "https://app.asana.com/api/1.0/projects/" + projectId + "/tasks/";
        // gets tasks from specific project with id 672636393973257

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            })
        };
        return this.http.get(apiUrl, ParseHeaders);
    }

    getAsanaUser() {
        const apiUrl = "https://app.asana.com/api/1.0/users/me";

        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            })
        };

        return this.http.get(apiUrl, ParseHeaders);
    }

    getMyAsanaTasks(userId) {
        const apiUrl =
            "https://app.asana.com/api/1.0/workspaces/8909158657352/tasks/search";
        // gets tasks from specific project with id 672636393973257
        const now = moment(new Date()).format("Y-MM-DD");
        console.log(now);

        const params = new HttpParams()
            .set("completed", "false")
            .set("assignee.any", userId)
            .set("due_on.before", now)
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
        return this.http.get(apiUrl, options);
    }

    getAsanaTask(id) {
        const apiUrl = "https://app.asana.com/api/1.0/tasks/" + id;
        const ParseHeaders = {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                Authorization: environment.asanaToken
            })
        };
        return this.http.get(apiUrl, ParseHeaders);
    }
}
// /class
