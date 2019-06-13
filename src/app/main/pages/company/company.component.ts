import { FirebaseService } from "app/services/firebase.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject, Subscription } from "rxjs";

import { MyCompany } from "app/models/mycompany.model";
@Component({
    selector: "app-company",
    templateUrl: "./company.component.html",
    styleUrls: ["./company.component.scss"]
})
export class CompanyComponent implements OnInit, OnDestroy {
    form: FormGroup;
    contactDetailsform: FormGroup;

    formErrors: any;

    companySubscription: Subscription;

    company: MyCompany;
    banks: any;
    constructor(
        private _formBuilder: FormBuilder,
        private fireServ: FirebaseService
    ) {
        // Reactive form errors
        this.formErrors = {
            company: {},
            compname: {},
            compeponymia: {},
            compaddress: {},
            compdrastiriotita: {},
            comppoli: {},
            state: {},
            compafm: {},
            comptk: {},
            compemail: {},
            compfax: {},
            compweb: {},
            compphone: {},
            compxora: {}
        };
    }

    async getMyCompany(): Promise<void> {
        this.companySubscription = new Subscription();
        const tempcompany = await this.fireServ.getCompany();
        this.companySubscription = tempcompany.subscribe(x => {
            this.company = x[1];
            console.log(this.company);
            // Reactive Form
            this.form = this._formBuilder.group({
                company: [
                    {
                        value: this.company.compname_eng,
                        disabled: true
                    },
                    Validators.required
                ],
                compname: [this.company.compname, Validators.required],
                compeponymia: [this.company.compeponymia, Validators.required],
                compaddress: [this.company.compaddress, Validators.required],
                compdrastiriotita: [
                    this.company.compdrastiriotita,
                    Validators.required
                ],
                comppoli: [this.company.comppoli, Validators.required],
                state: [this.company.compstate, Validators.required],
                compafm: [
                    this.company.compafm,
                    [Validators.required, Validators.maxLength(9)]
                ],
                comptk: [
                    this.company.comptk,
                    [Validators.required, Validators.maxLength(5)]
                ],
                compxora: [this.company.compxora, Validators.required],
                compemail: [this.company.compemail, Validators.required],
                compfax: [this.company.compfax],
                compphone: [this.company.compphone, Validators.required],
                compweb: [this.company.compweb, Validators.required]
            });

            // this.contactDetailsform = this._formBuilder.group({

            // });

            // end of forms
        });

        this.banks = await this.fireServ.getBanks();
    }

    ngOnInit(): void {
        // Reactive Form
        this.form = this._formBuilder.group({
            company: [
                {
                    value: "",
                    disabled: true
                },
                Validators.required
            ],
            compname: ["", Validators.required],
            compeponymia: ["", Validators.required],
            compaddress: ["", Validators.required],
            compdrastiriotita: ["", Validators.required],
            comppoli: ["", Validators.required],
            state: ["", Validators.required],
            compafm: ["", [Validators.required, Validators.maxLength(9)]],
            comptk: ["", [Validators.required, Validators.maxLength(5)]],
            compxora: ["", Validators.required],
            compemail: ["", Validators.required],
            compfax: ["", Validators.required],
            compphone: ["", Validators.required],
            compweb: ["", Validators.required]
        });

        this.getMyCompany();
    }
    // / OnInit

    ngOnDestroy(): void {
        if (this.companySubscription) {
            this.companySubscription.unsubscribe();
        }
    }
}
