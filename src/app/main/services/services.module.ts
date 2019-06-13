import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule,
     MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ServicesComponent } from 'app/main/services/services.component';
import { ServicesService } from 'app/main/services/services.service';
import { ServicesServiceListComponent } from 'app/main/services/service-list/service-list.component';
import { ServicesSelectedBarComponent } from 'app/main/services/selected-bar/selected-bar.component';
import { ServicesMainSidebarComponent } from 'app/main/services/sidebars/main/main.component';
import { ServicesServiceFormDialogComponent } from 'app/main/services/service-form/service-form.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    {
        path     : 'services',
        component: ServicesComponent,
        resolve  : {
            services: ServicesService
        }
    }
];

@NgModule({
    declarations   : [
        ServicesComponent,
        ServicesServiceListComponent,
        ServicesSelectedBarComponent,
        ServicesMainSidebarComponent,
        ServicesServiceFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatFormFieldModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        TranslateModule
    ],
    providers      : [
        ServicesService
    ],
    entryComponents: [
        ServicesServiceFormDialogComponent
    ]
})
export class ServicesModule
{
}
