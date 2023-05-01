import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AppConstants } from '../model/app-constants';
import { UserDetail, UserLoginDetail } from '../model/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  saveUserDetails(userDetail: UserDetail): Observable<any> {
    return this.http.post(AppConstants.CREATE_USER, userDetail);
  }

  post(userDetail: UserDetail, url: string): Observable<any> {
    return this.http.post(url, userDetail);
  }

  postJson(userDetail: any, url: string): Observable<any> {
    return this.http.post(url, userDetail);
  }

  login(userDetail: UserLoginDetail): Observable<any> {
    return this.http.post(AppConstants.SIGN_IN_USER, userDetail);
  }

  getLoggedUserDetails(): Observable<any> {
    return this.http.get(AppConstants.GET_LOGGED_USER);
  }

  logout() {
    // Remove the token from the localStorage.  
    this.http.post(AppConstants.SIGN_OUT_USER, {});
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nameOfUser');
    localStorage.removeItem('userProfileActivated');
    this.router.navigate(['/']);
  }

  /* 
  * Check whether User is loggedIn or not. 
  */

  isLoggedIn() {

    // create an instance of JwtHelper class.  
    let jwtHelper = new JwtHelperService();

    // get the token from the localStorage as we have to work on this token.  
    let token = localStorage.getItem('token');

    // check whether if token have something or it is null.  
    if (!token) {
      return false;
    }

    // get the Expiration date of the token by calling getTokenExpirationDate(String) method of JwtHelper class.
    //This method accepts a string value which is nothing but a token.  

    else {
      let expirationDate = jwtHelper.getTokenExpirationDate(token);

      // check whether the token is expired or not by calling isTokenExpired() method of JwtHelper class.  

      let isExpired = jwtHelper.isTokenExpired(token);

      return !isExpired;
    }
  }

  isUserProfileActivated() {
    if (localStorage.getItem('userProfileActivated') === 'Y')
      return true;
    return false;
  }
}
