import { Component, OnInit } from '@angular/core';
import { AccountCredentials } from '../shared/models/accountCredentials.model';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.component.html',
  styleUrls: ['./main-login.component.scss']
})
export class MainLoginComponent implements OnInit {

  showLoginForm = true;
  load = false;

  constructor(
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }
  /**
   * swap login and register forms
   */
  changeForms(): void {
    this.showLoginForm = !this.showLoginForm;
  }
}
