import { Subscription } from 'rxjs';
import { NoteAlertComponent, EditCostAlertComponent, EditBudgetPercentageComponent } from './../offerc/offerc.component';
import { ServicesSharedComponent } from './../../../shared/services-mod/services-shared.component';
import { Offer } from './../offer.model';
import { FirebaseService } from 'app/services/firebase.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ServicesService } from 'app/main/services/services.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-offeredit',
  templateUrl: './offeredit.component.html',
  styleUrls: ['./offeredit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OffereditComponent implements OnInit, OnDestroy {
  offerItem: any;
  offer: Offer;
  key: string;

  selected_services: any[];

  discountstored: number;

  offerSub: Subscription;
  constructor(private fireServ: FirebaseService, private route: ActivatedRoute, 
    private dialog: MatDialog, private serviceServ: ServicesService) {

    this.selected_services = [];

    this.offer = {
      contactid: '',
      companyid:  '' ,
      companyname:  '',
      contname:  '',
      id:  '',
      offid:  '' ,
      offtitle:  '',
      offdatefirst:  '',
      offdateupdated:  '',
  
      offstatus:  '',
  
      offnotes:  '',
  
      offservices: [],
      offfpa: 0,
      offdiscount: 0,
      offsubtotal: 0,
      offsubttotalfpa: 0,
      offtotal: 0
    };

    this.discountstored = 0;

   }

  ngOnInit(): void {
    this.key = this.route.snapshot.paramMap.get('key');

    console.log(this.key);

    this.offerItem = this.fireServ.getOffer(this.key);
    console.log(this.offerItem);
   this.offerSub = this.offerItem.subscribe(x => {
      this.offer = x;
      console.log(this.offer);
      this.selected_services = this.offer.offservices;
    });
  }
  // /OnInit

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();
    this.offerSub.unsubscribe();
  }


  // SERVICES 
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
            this.offer.offsubtotal += result[index].servicecost;
            console.log(this.offer.offsubtotal);

          }
          this.calcTotal(this.offer.offsubtotal);
          this.calcSubTotalwithFpa(this.offer.offsubtotal);

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

            this.offer.offsubtotal += this.selected_services[index].servicecost;
            console.log(this.offer.offsubtotal);

          }
          // /for
          this.calcTotal(this.offer.offsubtotal);
          this.calcSubTotalwithFpa(this.offer.offsubtotal);

        }
        // / if



      }
      // / if


    });
    // / end of afterclosed

  }
  // / pickServices

  calcTotal(value): void {
    this.offer.offtotal = value * (this.offer.offfpa + 100) / 100;
  }

  calcSubTotalwithFpa(value): void {
    this.offer.offsubttotalfpa = value * (this.offer.offfpa) / 100;

  }

  removeFromCost(value): void {
    this.offer.offsubtotal -= value;
    this.calcTotal(this.offer.offsubtotal);
    this.calcSubTotalwithFpa(this.offer.offsubtotal);

  }

  addToCost(value): void {
    this.offer.offsubtotal += value;
    this.calcTotal(this.offer.offsubtotal);
    this.calcSubTotalwithFpa(this.offer.offsubtotal);

  }

  
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


  
  discount(disc): void {
    const newdisc = disc;
    console.log('new ' + newdisc);

    // const olddisc = this.discountstored;
    // console.log('old ' + olddisc);

    const absolute = Math.abs(newdisc - this.discountstored);
    console.log('abs ' + absolute);


    if (newdisc > this.discountstored) {
      console.log('new ' + newdisc + ' old ' + this.discountstored);

      this.offer.offsubtotal -= absolute;
      console.log('remove');

    }
    if (this.discountstored >= newdisc) {
      console.log('new ' + newdisc + ' old ' + this.discountstored);

      this.offer.offsubtotal += absolute;
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

  // / SERVICES

  saveOffer(){}
}
