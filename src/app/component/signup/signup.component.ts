import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserDetail } from '../../model/user-detail';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signUpValid = true;
  public username = '';
  public firstName = '';
  public lastName = '';
  public phoneNumber = '';
  public password = '';
  public userType!: string;
  public restaurantName!: string;
  public userDetail!: UserDetail;
  errorMessage: string = 'An error occurred while registering the user. Kindly try again';

  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) {
  }

  public ngOnInit(): void {
    if ((this._authService.isLoggedIn())) {
      this._router.navigateByUrl('/dashboard');
    }
  }

  public onSubmit(): void {
    this.signUpValid = true;
    this.userDetail = {
      firstName: this.firstName,
      lastName: this.lastName,
      userName: this.username,
      phoneNumber: this.phoneNumber,
      password: this.password,
      userType: this.userType,
      price: '100',
      restaurantName: this.restaurantName
    };
    
    this._authService.saveUserDetails(this.userDetail).pipe(
      take(1)
    ).subscribe({
      next: _ => {
        this.signUpValid = true;
        this._router.navigateByUrl('/login');
      },
      error: (err) => {
        this.signUpValid = false;
        if (err.error && err.error.message)
          this.errorMessage = err.error.message;
      }
    });
  }

}
