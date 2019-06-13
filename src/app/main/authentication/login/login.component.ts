import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { AuthService } from "./../../../services/auth.service";
import { AngularFirePerformance } from "@angular/fire/performance";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    // screenTrace: any;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private afp: AngularFirePerformance,
        private authService: AuthService,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.afp.trace("loginScreen");

        this.loginForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required]
        });
    }
    // end of ngOnInit

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        // this.screenTrace.stop();
    }
    // end of ngOnDestroy

    onSubmit(): void {
        console.log(this.loginForm.value);
        this.authService.registerUser({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        });
    }
    // end of onSubmit

    loginGoogle(): void {
        this.authService.loginGoogleAuth();
    }
    // end of loginGoogle
}
// end of class
