import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{

  constructor(
    private _router: Router,
    private _authService: AuthenticationService,
    public _sharedService: SharedService
  ) {
  }

  ngOnInit() {
    if (!this._authService.isLoggedIn()) {
      this._authService.logout();
    }
    if ((this._sharedService.isDietitian() || this._sharedService.isRestaurent()) && !this._authService.isUserProfileActivated()) {
      this._router.navigateByUrl('/profile');
    }
  }
}
