import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule,
    MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule,
    MatToolbarModule, MatSelectModule, MatStepperModule, MatListModule, MatDividerModule, MatDialogModule
} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { OffersComponent } from 'app/main/offers/offers.component';
import { OffersService } from 'app/main/offers/offers.service';
import { OffersListComponent } from 'app/main/offers/offer-list/offer-list.component';
import { OffersSelectedBarComponent } from 'app/main/offers/selected-bar/selected-bar.component';
import { OffersMainSidebarComponent } from 'app/main/offers/sidebars/main/main.component';
import { OffersFormDialogComponent } from 'app/main/offers/offer-form/offer-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { OffercComponent, NoteAlertComponent, EditCostAlertComponent, EditBudgetPercentageComponent } from './offerc/offerc.component';
import { OffereditComponent } from './offeredit/offeredit.component';

const routes: Routes = [
    {
        path: 'offers',
        component: OffersComponent,
        resolve: {
            offers: OffersService
        }
    },
    {
        path: 'app-offerc',
        component: OffercComponent

    },
    {
        path: 'offer-edit',
        component: OffereditComponent

    }
];

@NgModule({
    declarations: [
        OffersComponent,
        OffersListComponent,
        OffersSelectedBarComponent,
        OffersMainSidebarComponent,
        OffersFormDialogComponent,
        OffercComponent,
        NoteAlertComponent,
        EditCostAlertComponent,
        EditBudgetPercentageComponent,
        OffereditComponent
    ],
    imports: [
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
        MatSelectModule,
        MatStepperModule,
        MatListModule,
        MatDividerModule,
        MatAutocompleteModule,
        MatDialogModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        TranslateModule
    ],
    providers: [
        OffersService
    ],
    entryComponents: [
        OffersFormDialogComponent, NoteAlertComponent, EditCostAlertComponent, EditBudgetPercentageComponent
    ]
})
export class OffersModule {
}
