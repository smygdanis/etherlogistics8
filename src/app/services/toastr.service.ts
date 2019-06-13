import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition, } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(public snackBar: MatSnackBar) { }
  // /constructor

  SnackSuccess(message): void {
    this.snackBar.open(message, 'Close', {
      duration: 1500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
  // /openSnackBar

}
// /class
