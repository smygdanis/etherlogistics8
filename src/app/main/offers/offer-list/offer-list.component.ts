import { Router } from "@angular/router";
import { DialogService } from "app/services/dialog.service";
import {
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material";
import { DataSource } from "@angular/cdk/collections";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

import { OffersService } from "app/main/offers/offers.service";
import { OffersFormDialogComponent } from "app/main/offers/offer-form/offer-form.component";

import * as moment from "moment";

@Component({
    selector: "offers-list",
    templateUrl: "./offer-list.component.html",
    styleUrls: ["./offer-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OffersListComponent implements OnInit, OnDestroy {
    @ViewChild("dialogContent", { static: false })
    dialogContent: TemplateRef<any>;

    offers: any;
    user: any;
    dataSource: any;
    displayedColumns = [
        "checkbox",
        "offid",
        "offtitle",
        "company",
        "offdatefirst",
        "offtotal"
    ];
    selectedoffers: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    testSubscription = new Subscription();
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OffersService} _OffersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private dialogService: DialogService,
        private _OffersService: OffersService,
        public _matDialog: MatDialog,
        private route: Router
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        setTimeout(() => {
            this.dialogService.openSpinner();
        });

        // const testoffers = this._OffersService.getEpafes();

        this.dataSource = new FilesDataSource(this._OffersService);
        // this.testSubscription = this.dataSource.subscribe(x => {

        //     console.log(x);
        //     // this.dataSource = x;
        //     // this.dialogService.closeAll();

        // });
        this.dialogService.closeAll();

        this._OffersService.onoffersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(offers => {
                this.offers = offers;

                this.checkboxes = {};
                offers.map(contact => {
                    this.checkboxes[contact.id] = false;
                });
            });

        this._OffersService.onSelectedoffersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedoffers => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedoffers.includes(id);
                }
                this.selectedoffers = selectedoffers;
            });

        this._OffersService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._OffersService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._OffersService.deselectoffers();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        if (this.testSubscription) {
            this.testSubscription.unsubscribe();
        }
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void {
        console.log(contact);

        this.route.navigate(["/offer-edit", { key: contact.id }]);

        // this.dialogRef = this._matDialog.open(OffersFormDialogComponent, {
        //     panelClass: 'offer-form-dialog',
        //     data      : {
        //         contact: contact,
        //         action : 'edit'
        //     }
        // });

        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         console.log(response);

        //         if ( !response )
        //         {
        //             return;
        //         }
        //         const actionType: string = response[0];
        //         const formData: FormGroup = response[1];
        //         switch ( actionType )
        //         {
        //             /**
        //              * Save
        //              */
        //             case 'save':
        //                 console.log('case save');

        //                 const formattedDate = moment(formData.value.offdateupdated).format();

        //                 formData.value.offdateupdated = formattedDate;
        //                 console.log(formData);

        //                 this._OffersService.updateContact(formData.value);

        //                 break;
        //             /**
        //              * Delete
        //              */
        //             case 'delete':

        //                 this.deleteContact(contact);

        //                 break;
        //         }
        //     });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false
            }
        );

        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to delete?";

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._OffersService.deleteContact(contact);
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void {
        this._OffersService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void {
        if (this.user.starred.includes(contactId)) {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        } else {
            this.user.starred.push(contactId);
        }

        this._OffersService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any> {
    /**
     * Constructor
     *
     * @param {OffersService} _OffersService
     */
    constructor(private _OffersService: OffersService) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._OffersService.onoffersChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {}
}
