import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Offer } from 'app/main/offers/offer.model';

@Component({
    selector     : 'offers-form-dialog',
    templateUrl  : './offer-form.component.html',
    styleUrls    : ['./offer-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class OffersFormDialogComponent
{
    action: string;
    contact: Offer;
    offerForm: FormGroup;
    dialogTitle: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<OffersFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<OffersFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Offer';
            this.contact = _data.contact;
        }
        else
        {
            this.dialogTitle = 'New Offer';
            this.contact = new Offer({});
        }

        // this.offerForm = this.createContactForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    // createContactForm(): FormGroup
    // {
    //     return this._formBuilder.group({
    //         offid      : [this.contact.offid],
    //         contactid    : [this.contact.contactid],
    //         offtitle: [this.contact.offtitle],
    //         offdatefirst  : [this.contact.offdatefirst],
    //         offdateupdated: [this.contact.offdateupdated],
    //         offnotes : [this.contact.offnotes],
    //         companyid: [this.contact.companyid],
    //         offservices   : [this.contact.offservices],
    //         offfpa   : [this.contact.offfpa],
    //         offdiscount : [this.contact.offdiscount],
    //         offsubtotal: [this.contact.offsubtotal],
    //         offsubttotalfpa   : [this.contact.offsubttotalfpa],
    //         offtotal   : [this.contact.offtotal]
    //     });
    // }
}
