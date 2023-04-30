import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoles } from '../model/app-constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  get(url: any): Observable<any> {
    return this.http.get(url);
  }

  getWithParams(url: any, params: HttpParams): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get(url, { headers, responseType: 'text', 'params': params });
  }

  post(url: string, data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(url, data, { headers, responseType: 'text' });
  }

  postForResetPwd(url: string, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'skip': "true",
      'Authorization': `Bearer ${token}`
    });
    let options = {headers: headers};
    return this.http.post(url, data, options);
  }

  postWithParams(url: string, data: any, params: HttpParams): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(url, data, { headers, responseType: 'text', 'params': params });
  }

  put(url: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(url, { headers, responseType: 'text' });
  }

  isCustomer() {
    let role = localStorage.getItem('role');
    if (role == AppRoles.CUSTOMER_ROLE)
      return true;
    return false;
  }

  isDietitian() {
    let role = localStorage.getItem('role');
    if (role == AppRoles.DIETITIAN_ROLE)
      return true;
    return false;
  }

  isRestaurent() {
    let role = localStorage.getItem('role');
    if (role == AppRoles.RESTAURENT_ROLE)
      return true;
    return false;
  }

  isAdmin() {
    let role = localStorage.getItem('role');
    if (role == AppRoles.ADMIN_ROLE)
      return true;
    return false;
  }

  displayMessage(err: string, classname: string) {
    if (err === 'Unknown Error') {
      err = 'Error connecting to the services, kindly contact the administrator';
    }
    else if (err === 'OK') {
      err = 'Error submitting value, kindly contact the administrator';
    }
    this._snackBar.open(err, '', {
      duration: 2000,
      panelClass: [classname],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
