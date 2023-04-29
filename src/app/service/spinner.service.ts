import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { SpinnerComponent } from '../component/shared/spinner/spinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  loadingSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showSpin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Contains in-progress loading requests
   */
  loadingMap: Map<string, boolean> = new Map<string, boolean>();

  dialogRef!: MatDialogRef<SpinnerComponent>;

  constructor(private dialog: MatDialog) { }

  setSpinner(loading: boolean, url: string) {
    if (!url) {
      throw new Error('The request URL must be provided to the LoadingService.setLoading function');
    }
    if (loading === true) {
      this.loadingMap.set(url, loading);
      this.loadingSub.next(true);
    } else if (loading === false && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub.next(false);
    }
    this.showSpinner();
    this.hideSpinner();
  }

  showSpinner() {
    if (this.loadingSub.getValue() && !this.showSpin.getValue()) {
      this.dialogRef = this.dialog.open(SpinnerComponent, {
        panelClass: 'transparent',
        disableClose: true
      });
      this.showSpin.next(true);
    }
  }

  hideSpinner() {
    if (!this.loadingSub.getValue()) {
      if (this.dialogRef) {
        this.dialogRef.close();
        this.showSpin.next(false);
      }
    }
  }
}
