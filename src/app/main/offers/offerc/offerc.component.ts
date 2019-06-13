import { Router } from '@angular/router';
import { ServicesService } from 'app/main/services/services.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FirebaseService } from 'app/services/firebase.service';
import { ToastrService } from './../../../services/toastr.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { ServicesSharedComponent } from 'app/shared/services-mod/services-shared.component';
import * as moment from 'moment';

@Component({
  selector: 'app-offerc',
  templateUrl: './offerc.component.html',
  styleUrls: ['./offerc.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OffercComponent implements OnInit, OnDestroy {
  // form: FormGroup;
  // formErrors: any;

  contactname: string;
  // Vertical Stepper
  verticalStepperStep1: FormGroup;
  verticalStepperStep2: FormGroup;
  verticalStepperStep3: FormGroup;
  verticalStepperStep1Errors: any;
  verticalStepperStep2Errors: any;
  verticalStepperStep3Errors: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  offerStatuses: any[];


  contacts: any;

  startAt = new Subject();
  endAt = new Subject();

  startObs = this.startAt.asObservable();
  endObs = this.endAt.asObservable();

  companies: any;

  CompstartAt = new Subject();
  CompendAt = new Subject();

  CompstartObs = this.startAt.asObservable();
  CompendObs = this.endAt.asObservable();

  public dialogRef: MatDialogRef<any>;


  selected_services: any[];


  offfpa: number;
  offdiscount: number;
  offsubtotal: number;
  offsubttotalfpa: number;
  offtotal: number;

  discountstored: number;

  today: any;

  tempcompany: string;
  constructor(private _formBuilder: FormBuilder, private toast: ToastrService, private fireServ: FirebaseService,
    private dialog: MatDialog, private serviceServ: ServicesService, private route: Router) {
    this.offerStatuses = ['Pending', 'Accepted', 'Not Accepted', 'Canceled', 'Postponed', 'Other', 'No Status'];

    this.contactname = 'Test';
    this.offfpa = 24;
    this.offdiscount = 0;
    this.offsubtotal = 0;
    this.offsubttotalfpa = 0;
    this.offtotal = 0;

    this.discountstored = 0;

    this.selected_services = [];

    this.today = new Date();
    console.log(moment(this.today).format('MM DD YYYY'));

    // this.formErrors = {
    //   offtitle: {},
    //   offid: {},
    //   offdatefirst: {},
    //   offstatus: {},
    //   offnotes: {}
    // };

    // Vertical Stepper form error
    this.verticalStepperStep1Errors = {
      offtitle: {},
      offid: {},
      companyid: {}
    };

    this.verticalStepperStep2Errors = {
      offdatefirst: {},
      offstatus: {}
    };

    this.verticalStepperStep3Errors = {
      contid: {},
      offnotes: {}
    };

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  firequeryContacts(start, end): void {
    // console.log(this.verticalStepperStep1.value);
    if (!this.verticalStepperStep1.value.companyid.companyname) {
      this.tempcompany = '';
    } else {
      this.tempcompany = this.verticalStepperStep1.value.companyid.companyname;
    }
    this.contacts = this.fireServ.getContactsByCompany(start, end, this.tempcompany);
  }

  firequeryCompanies(start, end): void {

    this.companies = this.fireServ.getCompanies(start, end);
  }

  ngOnInit(): void {

    const combinedContactLetters = combineLatest(this.startObs, this.endObs).subscribe((value) => {
      this.firequeryContacts(value[0], value[1]);
    });

    const combinedCompanyLetters = combineLatest(this.CompstartObs, this.CompendObs).subscribe((value) => {
      this.firequeryCompanies(value[0], value[1]);
    });



    // Reactive Form
    // this.form = this._formBuilder.group({

    //   offtitle: ['', Validators.required],
    //   offid: ['', Validators.required],
    //   offdatefirst: ['', Validators.required],
    //   offstatus: ['', Validators.required],
    //   offnotes: ['', Validators.required]
    // });

    // this.form.valueChanges
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(() => {
    //     this.onFormValuesChanged();
    //   });


    // Vertical Stepper form stepper
    this.verticalStepperStep1 = this._formBuilder.group({
      offtitle: ['', Validators.required],
      offid: ['', Validators.required],
      companyid: ['', Validators.required]
    });

    this.verticalStepperStep2 = this._formBuilder.group({
      offdatefirst: [this.today, Validators.required],
      offstatus: ['Pending', Validators.required]
    });

    this.verticalStepperStep3 = this._formBuilder.group({
      contid: ['', Validators.required],
      offnotes: ['']
    });

    this.verticalStepperStep1.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.onFormValuesChanged1();
      });

    this.verticalStepperStep2.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.onFormValuesChanged2();
      });

    this.verticalStepperStep3.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.onFormValuesChanged3();
      });
  }
  // ngonit

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * On form values changed
   */
  onFormValuesChanged1(): void {
    for (const field in this.verticalStepperStep1Errors) {
      if (!this.verticalStepperStep1Errors.hasOwnProperty(field)) {
        continue;
      }

      this.verticalStepperStep1Errors[field] = {};

      const control = this.verticalStepperStep1.get(field);

      if (control && control.dirty && !control.valid) {
        this.verticalStepperStep1Errors[field] = control.errors;
      }
    }
  }
  // / onFormValuesChanged

  onFormValuesChanged2(): void {
    for (const field in this.verticalStepperStep2Errors) {
      if (!this.verticalStepperStep2Errors.hasOwnProperty(field)) {
        continue;
      }

      this.verticalStepperStep2Errors[field] = {};

      const control = this.verticalStepperStep2.get(field);

      if (control && control.dirty && !control.valid) {
        this.verticalStepperStep2Errors[field] = control.errors;
      }
    }
  }
  // / onFormValuesChanged

  onFormValuesChanged3(): void {
    for (const field in this.verticalStepperStep3Errors) {
      if (!this.verticalStepperStep3Errors.hasOwnProperty(field)) {
        continue;
      }

      this.verticalStepperStep3Errors[field] = {};

      const control = this.verticalStepperStep3.get(field);

      if (control && control.dirty && !control.valid) {
        this.verticalStepperStep3Errors[field] = control.errors;
      }
    }
  }
  // / onFormValuesChanged

  /**
 * Finish the vertical stepper
 */
  finishVerticalStepper(): void {
    this.toast.SnackSuccess('You have finished the form!');
    // console.log(this.form.value);

  }
  // / finishVerticalStepper

  searchFirebContacts($event): void {
    const q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');

  }
  searchFirebCompanies($event): void {
    const q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');

  }

  displayFnComp(company): string | undefined {
    return company.companyname;
  }

  displayFnCont(contact): string | undefined {
    return contact.contsurname;
  }

  showItem(item): void {
    console.log(item);
  }

  pickServices(): void {
    console.log('pick');
    const dialogRef = this.dialog.open(ServicesSharedComponent, {
      width: '80%',
      height: '60%',
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.serviceServ.deselectservices();
      console.log(result);

      if (this.selected_services.length > 0) {
        if (result) {
          for (let index = 0; index < result.length; index++) {
            result[index].months = 1;
            if (result[index].serviceonce !== 'once') {
              result[index].servicecost = result[index].servicemonthcost;
            } else {
              if (result[index].servicepercentage === true) {
                const percentage = result[index].servicepercent / 100;
                result[index].servicecost = result[index].servicebudget * percentage;
              }
            }
            this.offsubtotal += result[index].servicecost;
            console.log(this.offsubtotal);

          }
          this.calcTotal(this.offsubtotal);
          this.calcSubTotalwithFpa(this.offsubtotal);

          const temparray = this.selected_services;
          this.selected_services.push.apply(temparray, result);
        }
      }

      if (this.selected_services.length === 0) {
        this.selected_services = result;
        console.log(result);
        if (result) {
          for (let index = 0; index < this.selected_services.length; index++) {
            this.selected_services[index].months = 1;
            if (this.selected_services[index].serviceonce !== 'once') {
              this.selected_services[index].servicecost = this.selected_services[index].servicemonthcost;
            } else {
              if (this.selected_services[index].servicepercentage === true) {
                const percentage = this.selected_services[index].servicepercent / 100;

                this.selected_services[index].servicecost = this.selected_services[index].servicebudget * percentage;
              }
              // / if
            }
            // / else

            this.offsubtotal += this.selected_services[index].servicecost;
            console.log(this.offsubtotal);

          }
          // /for
          this.calcTotal(this.offsubtotal);
          this.calcSubTotalwithFpa(this.offsubtotal);

        }
        // / if



      }
      // / if


    });
    // / end of afterclosed

  }
  // / pickServices

  addMonth(i): void {
    if (this.selected_services[i].months < 48) {
      this.selected_services[i].months++;
      const oldcost = this.selected_services[i].servicecost;
      this.addToCost(oldcost);
    }
  }

  minusMonth(i): void {
    if (this.selected_services[i].months > 1) {
      this.selected_services[i].months--;
      const oldcost = this.selected_services[i].servicecost;
      this.removeFromCost(oldcost);
    }
  }

  deleteService(i, servicecost): void {
    this.selected_services.splice(i, 1);
    this.removeFromCost(servicecost);
  }


  addNote(i): void {
    const dialogRef = this.dialog.open(NoteAlertComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.selected_services[i].note = result;
    });


  }



  editCost(i): void {
    const dialogRef = this.dialog.open(EditCostAlertComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        const oldcost = this.selected_services[i].servicecost;
        this.selected_services[i].servicecost = result;

        const absolute = Math.abs(result - oldcost);

        if (result > oldcost) {
          this.addToCost(absolute);

        } else {
          this.removeFromCost(absolute);
        }

      }
    });


  }
  // / editCost 

  removeFromCost(value): void {
    this.offsubtotal -= value;
    this.calcTotal(this.offsubtotal);
    this.calcSubTotalwithFpa(this.offsubtotal);

  }

  addToCost(value): void {
    this.offsubtotal += value;
    this.calcTotal(this.offsubtotal);
    this.calcSubTotalwithFpa(this.offsubtotal);

  }

  calcTotal(value): void {
    this.offtotal = value * (this.offfpa + 100) / 100;
  }

  calcSubTotalwithFpa(value): void {
    this.offsubttotalfpa = value * (this.offfpa) / 100;

  }

  discount(disc): void {
    const newdisc = disc;
    console.log('new ' + newdisc);

    // const olddisc = this.discountstored;
    // console.log('old ' + olddisc);

    const absolute = Math.abs(newdisc - this.discountstored);
    console.log('abs ' + absolute);


    if (newdisc > this.discountstored) {
      console.log('new ' + newdisc + ' old ' + this.discountstored);

      this.offsubtotal -= absolute;
      console.log('remove');

    }
    if (this.discountstored >= newdisc) {
      console.log('new ' + newdisc + ' old ' + this.discountstored);

      this.offsubtotal += absolute;
      console.log('add');

    }

    this.discountstored = newdisc;
  }
  // / discount



  editBudgetPercentage(i): void {
    const dialogRef = this.dialog.open(EditBudgetPercentageComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result) {
        const oldcost = this.selected_services[i].servicecost;

        this.selected_services[i].servicecost = result.budget * result.percent / 100;
        const newcost = this.selected_services[i].servicecost;

        const absolute = Math.abs(newcost - oldcost);
        if (newcost > oldcost) {
          this.addToCost(absolute);

        } else {
          this.removeFromCost(absolute);
        }

        this.selected_services[i].servicebudget = result.budget;
        this.selected_services[i].servicepercent = result.percent;


      }
    });


  }
  // / editBudgetPercentage






  showMore(item): void {
    if (item.note) {
      this.toast.SnackSuccess(item.note);

    } else {
      this.toast.SnackSuccess('No Note inside');

    }
  }


  saveOffer(): void {
    // console.log(this.verticalStepperStep1.value);
    // console.log(this.verticalStepperStep2.value);
    // console.log(this.verticalStepperStep3.value);

    const date = moment(this.verticalStepperStep2.value.offdatefirst).format('MM/DD/YYYY');

    const serviceItem = {
      offtitle: this.verticalStepperStep1.value.offtitle,
      offid: this.verticalStepperStep1.value.offid,
      offdatefirst: date,
      offdateupdated: date,
      offstatus: this.verticalStepperStep2.value.offstatus,
      offnotes: this.verticalStepperStep3.value.offnotes,
      contactid: this.verticalStepperStep3.value.contid.contid,
      contname: this.verticalStepperStep3.value.contid.contsurname,
      companyid: this.verticalStepperStep1.value.companyid.compcode,
      companyname: this.verticalStepperStep1.value.companyid.companyname,
      offservices: [],
      offfpa: this.offfpa,
      offdiscount: this.offdiscount,
      offsubtotal: this.offsubtotal,
      offsubttotalfpa: this.offsubttotalfpa,
      offtotal: this.offtotal
    };
    const tempservices = [];
    console.log(serviceItem);

    for (let index = 0; index < this.selected_services.length; index++) {
      const element = this.selected_services[index];
      tempservices.push(element);
    }
    serviceItem.offservices = tempservices;

    console.log(serviceItem);
    this.fireServ.addOffer(serviceItem);
    this.route.navigate(['/offers']);
  }

}
// / Class


@Component({
  selector: 'dialog-overview-example-dialog',
  template: `
      <div mat-dialog-content>
  <p>Insert Note</p>
  <mat-form-field>
    <input matInput [(ngModel)]="note">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button [mat-dialog-close]="note" cdkFocusInitial>Ok</button>
</div>`,
})
export class NoteAlertComponent {

  note: number;
  constructor(
    public dialogRef: MatDialogRef<NoteAlertComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'editcost-dialog',
  template: `
      <div mat-dialog-content>
  <p>Edit Cost</p>
  <mat-form-field>
    <input matInput [(ngModel)]="cost">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button [mat-dialog-close]="cost" cdkFocusInitial>Ok</button>
</div>`,
})
export class EditCostAlertComponent {

  cost: number;
  constructor(
    public dialogRef: MatDialogRef<EditCostAlertComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'editbudgetpercentage-dialog',
  template: `
      <div mat-dialog-content>
  <p>Edit Budget</p>
  <mat-form-field>
    <input matInput [(ngModel)]="budget">
  </mat-form-field>
  <p>Edit Percent</p>
  <mat-form-field>
    <input matInput [(ngModel)]="percent">
  </mat-form-field>
</div>
<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No Thanks</button>
  <button mat-button (click)="onClick()" cdkFocusInitial>Ok</button>
</div>`,
})
export class EditBudgetPercentageComponent {
  budget: number;
  percent: number;
  constructor(
    public dialogRef: MatDialogRef<EditBudgetPercentageComponent>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    const data = {
      budget: this.budget,
      percent: this.percent
    }
    this.dialogRef.close(data);
  }

}
