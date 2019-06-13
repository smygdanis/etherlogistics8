import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { ServicesService } from 'app/main/services/services.service';
import { ServicesServiceFormDialogComponent } from 'app/main/services/service-form/service-form.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from './i18n/en';
import { locale as greek } from './i18n/el';

import * as moment from 'moment';


@Component({
    selector     : 'services',
    templateUrl  : './services.component.html',
    styleUrls    : ['./services.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ServicesComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedservices: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ServicesService} _ServicesService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(

        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _ServicesService: ServicesService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
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
        this._ServicesService.onSelectedservicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedservices => {
                this.hasSelectedservices = selectedservices.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._ServicesService.onSearchTextChanged.next(searchText);
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
     * New service
     */
    newservice(): void
    {
        this.dialogRef = this._matDialog.open(ServicesServiceFormDialogComponent, {
            panelClass: 'service-form-dialog',
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

                const formattedDate = moment(response.value.dateupdated).format();
                response.value.dateupdated = formattedDate;
                console.log(response);

                this._ServicesService.addservice(response);
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