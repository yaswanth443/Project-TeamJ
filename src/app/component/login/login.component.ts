import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserLoginDetail } from '../../model/user-detail';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginValid = true;
  public username = '';
  public password = '';
  public userType!: string;
  public userDetail!: UserLoginDetail;
  error!: string;

  constructor(
    private _router: Router,
    private _authService: AuthenticationService
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
    this.loginValid = true;
    this.userDetail = {
      userName: this.username,
      password: this.password,
      userType: this.userType
    };

    this._authService.login(this.userDetail).pipe(
      take(1)
    ).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('nameOfUser', res.nameOfUser);
        localStorage.setItem('userProfileActivated', res.userProfileActivated);
        this.loginValid = true;
        localStorage.setItem('userProfileImage', res.userProfileImage);
        this._router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.error = err.error.message;
        this.loginValid = false
      }
    });
  }

}
