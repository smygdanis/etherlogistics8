import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UserPreferencesService {
    public preferences: any;
    constructor() {
        this.preferences = {
            notify: true,
            cloud: false,
            retro: false
        };
    }
}
