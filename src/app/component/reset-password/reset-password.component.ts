import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AppConstants } from '../../model/app-constants';
import { UserLoginDetail } from '../../model/user-detail';
import { AuthenticationService } from '../../service/authentication.service';
import { SharedService } from '../../service/shared.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetValid = true;
  username = '';
  password = '';
  confirmPassword = '';
  phoneNumber!: string;
  userType!: string;
  step = 1;
  otp!: string;
  validateToken!: string;

  errorMessage!: string;

  constructor(public dialog: MatDialog,
    private _router: Router,
    private _authService: AuthenticationService,
    private _sharedService: SharedService
  ) {
    if ((this._authService.isLoggedIn())) {
      this._router.navigateByUrl('/dashboard');
    }
  }

  public ngOnInit(): void {
    if ((this._authService.isLoggedIn())) {
      this._router.navigateByUrl('/dashboard');
    }
  }

  public onSubmit(): void {
    debugger
    if (this.step == 1) {
      this.step1Submit();
    }
    else if (this.step == 2) {
      this.step2Submit();
    }
    else if (this.step == 3) {
      this.step3Submit();
    }
  }

  private step1Submit() {
    this.resetValid = true;
    let userDetail = {
      userName: this.username,
      userType: this.userType,
      phoneNumber: this.phoneNumber
    };

    this._sharedService.post(AppConstants.RESET_USER_REQUEST, userDetail).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.resetValid = true;
        this.step = 2;
      },
      error: (err) => {
        this.errorMessage = JSON.parse(err.error).message;
        this.resetValid = false;
      }
    });
  }

  private step2Submit() {
    this.resetValid = true;
    let userDetail = {
      userName: this.username,
      otp: this.otp
    };

    this._sharedService.post(AppConstants.VALIDATE_OTP, userDetail).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.resetValid = true;
        this.step = 3;
        let response = JSON.parse(res);
        this.validateToken = response.response;
      },
      error: (err) => {
        this.errorMessage = JSON.parse(err.error).message;
        this.resetValid = false;
      }
    });
  }

  private step3Submit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Password and Confirm Password do not match";
      this.resetValid = false;
      return;
    }
    this.resetValid = true;
    let userDetail = {
      password: this.password
    };

    this._sharedService.postForResetPwd(AppConstants.RESET_USER, userDetail, this.validateToken).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        this.resetValid = true;
        this.step = 4;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "36%";
        dialogConfig.data = {
          popupTitle: 'Password had been reset successfully.',
          showCancel: false,
          actionText: 'Close'
        };
        this.dialog
          .open(ConfirmDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => {
            this._router.navigateByUrl("/login");
          })
      },
      error: (err) => {
        this.errorMessage = err.error ? JSON.parse(err.error).message : '';
        this.resetValid = false;
      }
    });
  }

}
