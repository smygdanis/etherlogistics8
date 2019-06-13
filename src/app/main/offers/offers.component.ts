import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { OffersService } from 'app/main/offers/offers.service';
import { OffersFormDialogComponent } from 'app/main/offers/offer-form/offer-form.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as greek } from './i18n/el';

import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
    selector     : 'offers',
    templateUrl  : './offers.component.html',
    styleUrls    : ['./offers.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class OffersComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedoffers: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OffersService} _OffersService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(

        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _OffersService: OffersService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private route: Router
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, greek);

        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

     
    ngOnInit(): void
    {
        this._OffersService.onSelectedoffersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedoffers => {
                this.hasSelectedoffers = selectedoffers.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._OffersService.onSearchTextChanged.next(searchText);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

        /**
     * New Offer
     */

    newOffer(): void {
        console.log('new offer');
        this.route.navigate(['/app-offerc']);
    }


    /**
     * New contact
     */

    newContact(): void
    {
        this.dialogRef = this._matDialog.open(OffersFormDialogComponent, {
            panelClass: 'offer-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                console.log(response);
                
                if ( !response )
                {
                    return;
                }

                const formattedDate = moment(response.value.offdateupdated).format();
                response.value.offdateupdated = formattedDate;
                console.log(response);

                this._OffersService.addContact(response);
            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
