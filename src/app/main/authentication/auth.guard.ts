import { AuthService } from "./../../services/auth.service";
import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        // console.log(this.authService.isAuth());

        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(["/login"]);
            return false;
        }
    }
}
