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
import { MatDialog, MatDialogRef, MatTableDataSource } from "@angular/material";
import { DataSource } from "@angular/cdk/collections";
import { Observable, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

import { ServicesService } from "app/main/services/services.service";
import { ServicesServiceFormDialogComponent } from "app/main/services/service-form/service-form.component";

import * as moment from "moment";

@Component({
    selector: "services-service-list",
    templateUrl: "./service-list.component.html",
    styleUrls: ["./service-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ServicesServiceListComponent implements OnInit, OnDestroy {
    @ViewChild("dialogContent", { static: false })
    dialogContent: TemplateRef<any>;

    services: any;
    user: any;
    dataSource: any;
    displayedColumns = ["checkbox", "name", "type", "cost"];
    selectedservices: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    testSubscription = new Subscription();
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ServicesService} _ServicesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private dialogService: DialogService,
        private _ServicesService: ServicesService,
        public _matDialog: MatDialog
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

        // const testservices = this._ServicesService.getservices();

        // this.testSubscription = testservices.subscribe(x => {

        //     console.log(x);
        //     this.dataSource = x;
        //     this.dialogService.closeAll();

        // });

        this.dataSource = new FilesDataSource(this._ServicesService);
        // console.log(this._ServicesService);
        // this.dataSource = new MatTableDataSource(this._ServicesService.services);

        this.dialogService.closeAll();

        this._ServicesService.onservicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(services => {
                this.services = services;

                this.checkboxes = {};
                services.map(service => {
                    this.checkboxes[service.id] = false;
                });
            });

        this._ServicesService.onSelectedservicesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedservices => {
                for (const id in this.checkboxes) {
                    if (!this.checkboxes.hasOwnProperty(id)) {
                        continue;
                    }

                    this.checkboxes[id] = selectedservices.includes(id);
                }
                this.selectedservices = selectedservices;
            });

        this._ServicesService.onUserDataChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(user => {
                this.user = user;
            });

        this._ServicesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._ServicesService.deselectservices();
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
     * Edit service
     *
     * @param service
     */
    editservice(service): void {
        this.dialogRef = this._matDialog.open(
            ServicesServiceFormDialogComponent,
            {
                panelClass: "service-form-dialog",
                data: {
                    service: service,
                    action: "edit"
                }
            }
        );

        this.dialogRef.afterClosed().subscribe(response => {
            console.log(response);

            if (!response) {
                return;
            }
            const actionType: string = response[0];
            const formData: FormGroup = response[1];
            switch (actionType) {
                /**
                 * Save
                 */
                case "save":
                    console.log("case save");

                    const formattedDate = moment(
                        formData.value.dateupdated
                    ).format();

                    formData.value.dateupdated = formattedDate;
                    console.log(formData);

                    this._ServicesService.updateservice(formData.value);

                    break;
                /**
                 * Delete
                 */
                case "delete":
                    this.deleteservice(service);

                    break;
            }
        });
    }

    /**
     * Delete service
     */
    deleteservice(service): void {
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
                this._ServicesService.deleteservice(service);
            }
            this.confirmDialogRef = null;
        });
    }

    /**
     * On selected change
     *
     * @param serviceId
     */
    onSelectedChange(serviceId, service): void {
        console.log(service);
        this._ServicesService.toggleSelectedservice(serviceId, service);
    }

    /**
     * Toggle star
     *
     * @param serviceId
     */
    toggleStar(serviceId): void {
        if (this.user.starred.includes(serviceId)) {
            this.user.starred.splice(this.user.starred.indexOf(serviceId), 1);
        } else {
            this.user.starred.push(serviceId);
        }

        this._ServicesService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any> {
    /**
     * Constructor
     *
     * @param {ServicesService} _ServicesService
     */
    constructor(private _ServicesService: ServicesService) {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._ServicesService.onservicesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void {}
}
