import { EtherspinnerComponent } from "./../../app/ui/etherspinner/etherspinner.component";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

@Injectable({
    providedIn: "root"
})
export class DialogService {
    constructor(public dialog: MatDialog) {}
    // /constructor

    openSpinner(): void {
        console.log("open dialog");

        this.dialog.open(EtherspinnerComponent, {
            width: "150px",
            height: "150px",
            hasBackdrop: true
        });
    }

    closeAll(): void {
        setTimeout(() => {
            console.log("close dialog");
            this.dialog.closeAll();
        }, 1000);
    }
}
// /class
