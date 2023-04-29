 import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter } from 'rxjs';
import { AppRoles } from './model/app-constants';
import { AuthenticationService } from './service/authentication.service';
import { SharedService } from './service/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver,
    private router: Router,
    public _authService: AuthenticationService,
    private _sharedService: SharedService,
    public sharedService: SharedService) { }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
    this.closeSideNav();
  }

  get bgimg() {
    if (this.isLogin || this.isSignUp)
      return "bgimg";
    if(this.isDefault)
      return "bgimgdefault";
    if (this._sharedService.isCustomer())
      return "bgimg-customer";
    return "bgimg-dietitian";
  };

  get isLogin() {
    if (this.router.url.endsWith("login")) {
      this.closeSideNav();
      return true;
    }
    return false;
  }

  get isDefault() {
    if (this.router.url.endsWith("/")) {
      this.closeSideNav();
      return true;
    }
    return false;
  }

  get isSignUp() {
    if (this.router.url.endsWith("signup")) {
      this.closeSideNav();
      return true;
    }
    return false;
  }

  get isAuthenticated() {
    if (localStorage.getItem("token"))
      return true;
    return false;
  }

  get profileImage() {
    if (localStorage.getItem("userProfileImage"))
      return localStorage.getItem("userProfileImage");
    return null;
  }

  public logout(): void {
    this._authService.logout();
    this.closeSideNav();
  }

  closeSideNav() {
    if (this.sidenav && this.sidenav.opened) {
      this.sidenav.close();
    }
  }

  get nameOfUser() {
    return localStorage.getItem('nameOfUser');
  }

  get userrole() {
    let role = localStorage.getItem('role');
    if (role == AppRoles.CUSTOMER_ROLE)
      return 'Customer';
    if (role == AppRoles.DIETITIAN_ROLE)
      return 'Dietitian';
    return 'Restaurant';
  }
}
