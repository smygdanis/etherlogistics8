import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ServicesService } from 'app/main/services/services.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class ServicesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedservices: boolean;
    isIndeterminate: boolean;
    selectedservices: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ServicesService} _ServicesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _ServicesService: ServicesService,
        public _matDialog: MatDialog
    )
    {
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
                this.selectedservices = selectedservices;
                setTimeout(() => {
                    this.hasSelectedservices = selectedservices.length > 0;
                    this.isIndeterminate = (selectedservices.length !== this._ServicesService.services.length && selectedservices.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._ServicesService.selectservices();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._ServicesService.deselectservices();
    }

    /**
     * Delete selected services
     */
    deleteSelectedservices(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected services?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._ServicesService.deleteSelectedservices();
                }
                this.confirmDialogRef = null;
            });
    }
}
