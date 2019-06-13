import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Service } from 'app/main/services/service.model';

@Component({
    selector     : 'services-service-form-dialog',
    templateUrl  : './service-form.component.html',
    styleUrls    : ['./service-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ServicesServiceFormDialogComponent
{
    action: string;
    service: Service;
    serviceForm: FormGroup;
    dialogTitle: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<ServicesServiceFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ServicesServiceFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit service';
            this.service = _data.service;
        }
        else
        {
            this.dialogTitle = 'New service';
            this.service = new Service({});
        }

        this.serviceForm = this.createserviceForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create service form
     *
     * @returns {FormGroup}
     */
    createserviceForm(): FormGroup
    {
        return this._formBuilder.group({
            serviceid      : [this.service.serviceid],
            servicename    : [this.service.servicename],
            servicebudget: [this.service.servicebudget],
            servicephoto  : [this.service.servicephoto],
            servicecost: [this.service.servicecost],
            servicemonthcost : [this.service.servicemonthcost],
            servicepercentage: [this.service.servicepercentage],
            servicepercent   : [this.service.servicepercent],
            servicetype   : [this.service.servicetype],
            servicedesc : [this.service.servicedesc],
            serviceonce: [this.service.serviceonce]
        });
    }
}
