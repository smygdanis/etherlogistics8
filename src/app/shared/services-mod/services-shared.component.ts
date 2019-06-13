import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from 'app/services/dialog.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServicesService } from 'app/main/services/services.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { DataSource } from '@angular/cdk/collections';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-services-shared',
    templateUrl: './services-shared.component.html',
    styleUrls: ['./services-shared.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ServicesSharedComponent implements OnInit {
    displayedColumns = ['checkbox', 'name', 'type', 'cost'];
    dataSource: any;
    services: any;

    selectedservices: any[];
    passSelectedServices: any[];
    checkboxes: {};
    private _unsubscribeAll: Subject<any>;


    user: any;
    searchInput: FormControl;

    constructor(private dialogService: DialogService, private _ServicesService: ServicesService, public dialogRef: MatDialogRef<ServicesSharedComponent>
    ) {
          // Set the defaults
          this.searchInput = new FormControl('');

          // Set the private defaults
          this._unsubscribeAll = new Subject();

    }



    close(): void {
        console.log('test');
        this.passSelectedServices = [];
        this.passSelectedServices = this._ServicesService.selectedItems;
        
        
        this.dialogRef.close(this.passSelectedServices);
        // this._ServicesService.deselectservices();
    }

    ngOnInit(): void {
        this._ServicesService.resolveForShared();

        // setTimeout(() => {
        //     this.dialogService.openSpinner();
        //   });

        // const testservices = this._ServicesService.getservices();

        // this.testSubscription = testservices.subscribe(x => {

        //     console.log(x);
        //     this.dataSource = x;
        //     this.dialogService.closeAll();

        // });

        // this.dataSource = this._ServicesService.getEpafes();
        this.dataSource = new FilesDataSource(this._ServicesService);
        // this.dialogService.closeAll();

        this.searchInput.valueChanges
        .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            distinctUntilChanged()
        )
        .subscribe(searchText => {
            this._ServicesService.onSearchTextChanged.next(searchText);
        });

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



    onSelectedChange(serviceId, service): void {
        this._ServicesService.toggleSelectedservice(serviceId, service);
    }


}
// / class



export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ServicesService} _ServicesService
     */
    constructor(
        private _ServicesService: ServicesService
    ) {
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
    disconnect(): void {
    }
}
// / FilesDataSource
