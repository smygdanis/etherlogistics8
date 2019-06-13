import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OffersService } from 'app/main/offers/offers.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as english } from '../../i18n/en';
import { locale as greek } from '../../i18n/el';
@Component({
    selector   : 'offers-main-sidebar',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class OffersMainSidebarComponent implements OnInit, OnDestroy
{
    user: any;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {OffersService} _OffersService
     */
    constructor( public afAuth: AngularFireAuth, 
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,

        private _OffersService: OffersService
    )
    {
        this.user = {
            'name': 'User Name',
            'avatar': './../../../../../assets/images/avatars/profile.jpg',
        };
        this._fuseTranslationLoaderService.loadTranslations(english, greek);

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

        this.afAuth.authState.subscribe(x => {
            this.user = 
            {
                'id'              : '5725a6802d10e277a0f35724',
                'name': x.displayName,
                'avatar': x.photoURL,
                'starred'         : [
                    'CON1',
                    'CON2',
                    'CON5',
                    'CON7',
                    'CON8'
                ],
                'frequentoffers': [
                    'CON1',
                    'CON2',
                    'CON7',
                    'CON8',
                    'CON5',
                    'CON6'
                ],
                'groups'          : [
                    {
                        'id'        : '5725a6802d10e277a0f35739',
                        'name'      : 'Friends',
                        'contactIds': [
                            'CON2',
                            'CON5',
                            'CON6'
                        ]
                    },
                    {
                        'id'        : '5725a6802d10e277a0f35749',
                        'name'      : 'Clients',
                        'contactIds': [
                            'CON2',
                            'CON5',
                            'CON9',
                            'CON6'
                        ]
                    },
                    {
                        'id'        : '5725a6802d10e277a0f35329',
                        'name'      : 'Recent Workers',
                        'contactIds': [
                            'CON2',
                            'CON1',
                            'CON4',
                            'CON5'
                        ]
                    }
                ]
            };

            
          });


        this.filterBy = this._OffersService.filterBy || 'all';


        

        // this._OffersService.onUserDataChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(user => {
        //         this.user = user;
        //     });
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
     * Change the filter
     *
     * @param filter
     */
    changeFilter(filter): void
    {
        this.filterBy = filter;
        this._OffersService.onFilterChanged.next(this.filterBy);
    }
}
