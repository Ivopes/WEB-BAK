import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserCredentials } from '../shared/models/userCredentials.model';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  }

  onSubmit(): void {
    this.load = true;
  }

  login(credentials: UserCredentials): void {
    this.auth.login(credentials).subscribe(res => {
      console.log(res);
      const token = res.token;
      localStorage.setItem('jwt', token);
      this.router.navigate(['/test']);
    },
    err => {
      this.load = false;
    });
  }

  changeForms(): void {
    this.showLoginForm = !this.showLoginForm;
  }
}
