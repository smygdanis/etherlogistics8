import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components';
import { CompanyComponent } from './company.component';
import { FuseHighlightModule } from '@fuse/components';
import { FuseSidebarModule } from '@fuse/components';
import { MatIconModule, MatDividerModule, MatListModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatStepperModule, MatTabsModule } from '@angular/material';


const routes = [
    {
        path     : 'company',
        component: CompanyComponent
    }
];

@NgModule({
    declarations: [
        CompanyComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule,

        FuseHighlightModule,
        FuseSidebarModule,
        MatIconModule, MatDividerModule, MatListModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatStepperModule,
        MatTabsModule,

        FuseWidgetModule
    ],
    exports     : [
        CompanyComponent
    ]
})

export class CompanyModule
{
}
