import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Offer } from 'app/main/offers/offer.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class OffersService implements Resolve<any>
{
    onoffersChanged: BehaviorSubject<any>;
    onSelectedoffersChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    offers: Offer[];
    user: any;
    selectedoffers: string[] = [];

    searchText: string;
    filterBy: string;


    private contactDoc: AngularFirestoreDocument<Offer>;
    private offersCollection: AngularFirestoreCollection<Offer>;


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
        this.onoffersChanged = new BehaviorSubject([]);
        this.onSelectedoffersChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

        this.offersCollection = this.afs.collection<Offer>('offers');

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
                this.getoffers(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getoffers();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getoffers();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get offers
     *
     * @returns {Promise<any>}
     */

    getEpafes(): Observable<any> {
        return this.afs.collection('offers').valueChanges();
    }

    getoffers(): Promise<any> {
        return new Promise((resolve, reject) => {
                // this.afs.collection('offers').valueChanges()
             const offersCollection =   this.afs.collection('offers');
                const shirts = offersCollection.snapshotChanges().pipe(
                    map(actions => actions.map(a => {
                      const data = a.payload.doc.data() as Offer;
                      const id = a.payload.doc.id;
                      return { id, ...data };
                    }))
                  );
                  shirts.subscribe((response: any) => {
                    console.log(response);
                        this.offers = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.offers = this.offers.filter(_contact => {
                                return this.user.starred.includes(_contact.offid);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.offers = this.offers.filter(_contact => {
                                return this.user.frequentoffers.includes(_contact.offid);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        // {
                        //     this.offers = FuseUtils.filterArrayByString(this.offers, this.searchText);
                        // }
                        {
                            console.log('edw');
                            // this.companies = FuseUtils.filterArrayByString(this.companies, this.searchText);
                            const val = this.searchText;

                            if (val && val.trim() !== '') {
                              this.offers = this.offers.filter((item) => {
                        
                                return (item.offtitle.toLowerCase().indexOf(val.toLowerCase()) > -1);
                              });
                            }
                        }

                        // this.offers = this.offers.map(contact => {
                        //     return new Offer(contact);
                        // });

                        this.onoffersChanged.next(this.offers);
                        resolve(this.offers);
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
        //         this._httpClient.get('api/offers-user/5725a6802d10e277a0f35724')
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
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        if (this.selectedoffers.length > 0) {
            const index = this.selectedoffers.indexOf(id);

            if (index !== -1) {
                this.selectedoffers.splice(index, 1);

                // Trigger the next event
                this.onSelectedoffersChanged.next(this.selectedoffers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedoffers.push(id);

        // Trigger the next event
        this.onSelectedoffersChanged.next(this.selectedoffers);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void {
        if (this.selectedoffers.length > 0) {
            this.deselectoffers();
        }
        else {
            this.selectoffers();
        }
    }

    /**
     * Select offers
     *
     * @param filterParameter
     * @param filterValue
     */
    selectoffers(filterParameter?, filterValue?): void {
        this.selectedoffers = [];

        // If there is no filter, select all offers
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedoffers = [];
            this.offers.map(contact => {
                this.selectedoffers.push(contact.offid);
            });
        }

        // Trigger the next event
        this.onSelectedoffersChanged.next(this.selectedoffers);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    updateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {

            console.log('update contact Spyros');
            console.log(contact);
            this.contactDoc = this.afs.doc<Offer>('offers/' + contact.offid);
            this.contactDoc.update(contact);
            // this._httpClient.post('api/offers-offers/' + contact.offid, {...contact})
            //     .subscribe(response => {
            //         this.getoffers();
            //         resolve(response);
            //     });
        });
    }

    addContact(data): Promise<any> {
        return new Promise((resolve, reject) => {
           const contact = data.value;
            console.log('add contact Spyros');
            const id = this.afs.createId();
            contact.offid = id;
            console.log(contact);
            this.offersCollection.doc(id).set(contact);


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

            // this._httpClient.post('api/offers-user/' + this.user.offid, { ...userData })
            //     .subscribe(response => {
            //         this.getUserData();
            //         this.getoffers();
            //         resolve(response);
            //     });
        });
    }

    /**
     * Deselect offers
     */
    deselectoffers(): void {
        this.selectedoffers = [];

        // Trigger the next event
        this.onSelectedoffersChanged.next(this.selectedoffers);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contact): void {
        console.log('delete contact');


            console.log(contact);
            this.contactDoc = this.afs.doc<Offer>('offers/' + contact.offid);
            this.contactDoc.delete();

        
        // const contactIndex = this.offers.indexOf(contact);
        // this.offers.splice(contactIndex, 1);
        // this.onoffersChanged.next(this.offers);
    }

    /**
     * Delete selected offers
     */
    deleteSelectedoffers(): void {
        for (const contactId of this.selectedoffers) {
            const contact = this.offers.find(_contact => {
                return _contact.offid === contactId;
            });
            const contactIndex = this.offers.indexOf(contact);
            this.offers.splice(contactIndex, 1);
        }
        this.onoffersChanged.next(this.offers);
        this.deselectoffers();
    }

}
