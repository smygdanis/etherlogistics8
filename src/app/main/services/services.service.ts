import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Service } from 'app/main/services/service.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable()
export class ServicesService implements Resolve<any>
{
    onservicesChanged: BehaviorSubject<any>;
    onSelectedservicesChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    services: Service[];
    user: any;
    selectedservices: string[] = [];
    selectedItems: any[];

    searchText: string;
    filterBy: string;


    private serviceDoc: AngularFirestoreDocument<Service>;
    private servicesCollection: AngularFirestoreCollection<Service>;


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private afs: AngularFirestore,
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onservicesChanged = new BehaviorSubject([]);
        this.onSelectedservicesChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.servicesCollection = this.afs.collection<Service>('services');
        this.selectedItems = [];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getservices(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getservices();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getservices();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    resolveForShared(): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getservices(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getservices();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getservices();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get services
     *
     * @returns {Promise<any>}
     */

    getEpafes(): Observable<any> {
        return this.afs.collection('services').valueChanges();
    }

    getservices(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection('services').valueChanges()
                .subscribe((response: any) => {

                    this.services = response;

                    if (this.filterBy === 'starred') {
                        this.services = this.services.filter(_service => {
                            return this.user.starred.includes(_service.serviceid);
                        });
                    }

                    if (this.filterBy === 'frequent') {
                        this.services = this.services.filter(_service => {
                            return this.user.frequentservices.includes(_service.serviceid);
                        });
                    }

                    if (this.searchText && this.searchText !== '')
                    // {
                    //     this.services = FuseUtils.filterArrayByString(this.services, this.searchText);
                    // }

                    {
                        console.log('edw');
                        // this.companies = FuseUtils.filterArrayByString(this.companies, this.searchText);
                        const val = this.searchText;

                        if (val && val.trim() !== '') {
                            this.services = this.services.filter((item) => {

                                return (item.servicename.toLowerCase().indexOf(val.toLowerCase()) > -1);
                            });
                        }
                    }

                    this.services = this.services.map(service => {
                        return new Service(service);
                    });

                    this.onservicesChanged.next(this.services);
                    resolve(this.services);
                }, reject);
        }
        );

    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any> {
        // return new Promise((resolve, reject) => {
        //         this._httpClient.get('api/services-user/5725a6802d10e277a0f35724')
        //             .subscribe((response: any) => {
        //                 this.user = response;
        //                 this.onUserDataChanged.next(this.user);
        //                 resolve(this.user);
        //             }, reject);
        //     }
        // );
        return;

    }

    /**
     * Toggle selected service by id
     *
     * @param id
     */
    toggleSelectedservice(id, item): void {

        // First, check if we already have that service as selected...
        if (this.selectedservices.length > 0) {
            const index = this.selectedservices.indexOf(id);

            if (index !== -1) {
                this.selectedservices.splice(index, 1);
                this.selectedItems.splice(index, 1);

                // Trigger the next event
                this.onSelectedservicesChanged.next(this.selectedservices);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedservices.push(id);
        const temp = {
            servicebudget:  item.servicebudget,
            servicecost:  item.servicecost,
            servicedesc:  item.servicedesc,
            serviceid:  item.serviceid,
            servicemonthcost:  item.servicemonthcost,
            servicename:  item.servicename,
            serviceonce:  item.serviceonce,
            servicepercent:  item.servicepercent,
            servicepercentage:  item.servicepercentage,
            servicephoto:  item.servicephoto,
            servicetype:  item.servicetype,
        
        };

        this.selectedItems.push(temp);
        // Trigger the next event
        this.onSelectedservicesChanged.next(this.selectedservices);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedservices.length > 0) {
            this.deselectservices();
        }
        else {
            this.selectservices();
        }
    }

    /**
     * Select services
     *
     * @param filterParameter
     * @param filterValue
     */
    selectservices(filterParameter?, filterValue?): void {
        this.selectedservices = [];

        // If there is no filter, select all services
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedservices = [];
            this.services.map(service => {
                this.selectedservices.push(service.serviceid);
            });
        }

        // Trigger the next event
        this.onSelectedservicesChanged.next(this.selectedservices);
    }

    /**
     * Update service
     *
     * @param service
     * @returns {Promise<any>}
     */
    updateservice(service): Promise<any> {
        return new Promise((resolve, reject) => {

            console.log('update service Spyros');
            console.log(service);
            this.serviceDoc = this.afs.doc<Service>('services/' + service.serviceid);
            this.serviceDoc.update(service);
            // this._httpClient.post('api/services-services/' + service.serviceid, {...service})
            //     .subscribe(response => {
            //         this.getservices();
            //         resolve(response);
            //     });
        });
    }

    addservice(data): Promise<any> {
        return new Promise((resolve, reject) => {
            const service = data.value;
            console.log('add service Spyros');
            const id = this.afs.createId();
            service.serviceid = id;
            console.log(service);
            this.servicesCollection.doc(id).set(service);


        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('update user data');

            // this._httpClient.post('api/services-user/' + this.user.serviceid, { ...userData })
            //     .subscribe(response => {
            //         this.getUserData();
            //         this.getservices();
            //         resolve(response);
            //     });
        });
    }

    /**
     * Deselect services
     */
    deselectservices(): void {
        this.selectedservices = [];
        this.selectedItems = [];
        // Trigger the next event
        this.onSelectedservicesChanged.next(this.selectedservices);

    }

    /**
     * Delete service
     *
     * @param service
     */
    deleteservice(service): void {
        console.log('delete service');


        console.log(service);
        this.serviceDoc = this.afs.doc<Service>('services/' + service.serviceid);
        this.serviceDoc.delete();


        // const serviceIndex = this.services.indexOf(service);
        // this.services.splice(serviceIndex, 1);
        // this.onservicesChanged.next(this.services);
    }

    /**
     * Delete selected services
     */
    deleteSelectedservices(): void {
        for (const serviceId of this.selectedservices) {
            const service = this.services.find(_service => {
                return _service.serviceid === serviceId;
            });
            const serviceIndex = this.services.indexOf(service);
            this.services.splice(serviceIndex, 1);
        }
        this.onservicesChanged.next(this.services);
        this.deselectservices();
    }

}
