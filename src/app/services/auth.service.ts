import { Injectable } from "@angular/core";

import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { FuseUser } from "./../models/user.model";
import { AuthData } from "./../models/auth-data-model";

import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private isAuthenticated = false;
    authChange = new Subject<boolean>();

    constructor(public afAuth: AngularFireAuth, private router: Router) {}
    // end of consructor

    initAuthListener(): void {
        console.log("check if user is authenticated");

        this.afAuth.authState.subscribe(user => {
            console.log(user);

            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                // leei oti to authchange pairnei timi true otan kapoios kanei register. Ara otan kapoios zitaei to authChange enw exei ginei register tha pairnei true
                this.router.navigate([""]);
            } else {
                this.authChange.next(false);
                this.router.navigate(["/login"]);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData): void {
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
    // end of registerUser()

    loginUser(authData: AuthData): void {
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
    // end of loginUser

    loginGoogleAuth(): void {
        this.afAuth.auth
            .signInWithPopup(new auth.GoogleAuthProvider())
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }
    // end of loginGoogleAuth

    logout(): void {
        this.afAuth.auth.signOut();
    }
    // end of logout

    getUser(): void {
        this.afAuth.authState.subscribe(x => {
            console.log(x);
        });
    }
    // end of getUser

    //  get currentUserName(): any {
    //   return this.afAuth;
    // }

    isAuth(): boolean {
        if (this.isAuthenticated) {
            console.log("user logged in");
        } else {
            console.log("user logged out");
        }
        return this.isAuthenticated;
        // if this.user is not equal to null (has data then it gives true), if it is null it gives false
    }
    // end of isAuth

    changeisAuth(): void {
        this.authChange.next(true);
    }
    // end of changeisAuth()
}
// end of class
