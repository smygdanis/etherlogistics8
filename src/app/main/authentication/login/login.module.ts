import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
} from "@angular/material";

import { FuseSharedModule } from "@fuse/shared.module";

import { LoginComponent } from "app/main/authentication/login/login.component";

const routes = [
    {
        path: "login",
        component: LoginComponent
    }
];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,

        FuseSharedModule
    ]
})
export class LoginModule {}
