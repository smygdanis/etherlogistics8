import { AngularFireAuth } from "@angular/fire/auth";
import { AsanaService } from "./../../../services/asana.service";
import { Component, ViewEncapsulation } from "@angular/core";
import { UserPreferencesService } from "app/services/user-preferences.service";
@Component({
    selector: "quick-panel",
    templateUrl: "./quick-panel.component.html",
    styleUrls: ["./quick-panel.component.scss"],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent {
    date: Date;
    events: any[];
    projects: any[];
    notes: any[];
    settings: any;
    gid: any;
    projects_data: any;
    /**
     * Constructor
     */
    constructor(
        public afAuth: AngularFireAuth,
        public preferencesService: UserPreferencesService,
        private asana: AsanaService
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = this.preferencesService.preferences;

        this.notes = [
            //     { title: "Note 1", detail: "details of Note 1" },
            //     { title: "Note 2", detail: "details of Note 2" }
            //
        ];

        this.projects = [
            { name: "Project 1", detail: "details of Project 1" },
            { name: "Project 2", detail: "details of Project 2" }
        ];

        this.events = [
            //     { title: "Event 1", detail: "details of Event 1" },
            //     { title: "Event 2", detail: "details of Event 2" }
            //
        ];

        this.afAuth.authState.subscribe(user => {
            console.log(user.email);
            if (user.email === "m.spyros@gmail.com") {
                this.gid = "479232384171";
                console.log("Spyros tasks");
            } else {
                this.gid = "4735618534978";
                console.log("George tasks");
            }

            //george 4735618534978
            //spyros 479232384171
            this.asana.getMyAsanaTasks(this.gid).subscribe(x => {
                this.projects_data = x;
                this.projects = this.projects_data.data;
                console.log(this.projects);
            });
        });
    }
}
