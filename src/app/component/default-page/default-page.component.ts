import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})
export class DefaultPageComponent implements OnInit {

  constructor(
    private _router: Router,
    private _authService: AuthenticationService) { }

  ngOnInit(): void {
    if ((this._authService.isLoggedIn())) {
      this._router.navigateByUrl('/dashboard');
    }
  }

}
