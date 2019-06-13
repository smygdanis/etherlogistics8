import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";
import "hammerjs";

import { FuseModule } from "@fuse/fuse.module";
import { FuseSharedModule } from "@fuse/shared.module";
import {
    FuseProgressBarModule,
    FuseSidebarModule,
    FuseThemeOptionsModule
} from "@fuse/components";

import { fuseConfig } from "app/fuse-config";

// this wasn't in etherlogistics 5
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app/main/authentication/auth.guard";
const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "sample-dashboard",
        pathMatch: "full",
        canActivate: [AuthGuard]
    },
    {
        path: "**",
        redirectTo: "sample"
    },
    {
        path: "company",
        loadChildren: "app/main/pages/company/company.module#CompanyModule",
        canActivate: [AuthGuard]
    },
    {
        path: "todos",
        loadChildren: "app/main/apps/todo/todo.module#TodoModule",
        canActivate: [AuthGuard]
    },
    {
        path: "login",
        loadChildren: "app/main/authentication/login/login.module#LoginModule"
    }
];

//COMPONENTS
import { AppComponent } from "app/app.component";
import { LayoutModule } from "app/layout/layout.module";

//PAGES
import { SampleModule } from "app/main/sample/sample.module";
import { LoginModule } from "app/main/authentication/login/login.module";
import { CompanyModule } from "app/main/pages/company/company.module";
import { TodoModule } from "app/main/apps/todo/todo.module";

//FIREBASE
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";

// SERVICES
import { AsanaService } from "app/services/asana.service";
import { ToastrService } from "app/services/toastr.service";
import { FirebaseService } from "app/services/firebase.service";
import { DialogService } from "app/services/dialog.service";
import { AuthService } from "app/services/auth.service";
import { FleepService } from "app/services/fleep.service";
import { UserPreferencesService } from "app/services/user-preferences.service";

//TODO: AUTH SERVICE
//TODO: DIALOG MODAL SERVICE
//TODO: ROUTING MODULE

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase, "EtherLogistics"), // imports firebase/app needed for everything
        AngularFirestoreModule, // imports firebase/firestore, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        AngularFireStorageModule, // imports firebase/storage only needed for storage features
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        //APPS
        TodoModule,

        // App modules
        LayoutModule,
        //PAGES
        SampleModule,
        LoginModule,
        CompanyModule
    ],
    providers: [
        AsanaService,
        ToastrService,
        FirebaseService,
        DialogService,
        AuthService,
        FleepService,
        UserPreferencesService,

        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
