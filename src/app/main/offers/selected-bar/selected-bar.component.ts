import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { OffersService } from 'app/main/offers/offers.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class OffersSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedoffers: boolean;
    isIndeterminate: boolean;
    selectedoffers: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OffersService} _OffersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _OffersService: OffersService,
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
        this._OffersService.onSelectedoffersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedoffers => {
                this.selectedoffers = selectedoffers;
                setTimeout(() => {
                    this.hasSelectedoffers = selectedoffers.length > 0;
                    this.isIndeterminate = (selectedoffers.length !== this._OffersService.offers.length && selectedoffers.length > 0);
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
        this._OffersService.selectoffers();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._OffersService.deselectoffers();
    }

    /**
     * Delete selected offers
     */
    deleteSelectedoffers(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected offers?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._OffersService.deleteSelectedoffers();
                }
                this.confirmDialogRef = null;
            });
    }
}
