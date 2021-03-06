import { trigger, transition, animate, style } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountCredentials } from '../../shared/models/accountCredentials.model';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snackBar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('remove', [
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  /**
   * show loading animation
   */
  public load = false;

  /**
   * watch or main browser
   */
  private loginType: string;

  /**
   * switch form to register
   */
  @Output() showRegisterEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: SnackBarService
  ) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.router.url.endsWith('login/watch')) {
      this.loginType = 'watch';
    } else {
      this.loginType = 'main';
    }
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.load = true;
    this.login(this.loginForm.value);

  }
  /**
   * Container for two login methods - calls proper login method by active url the user is in
   * @param credentials user pass and username
   */
  login(credentials: AccountCredentials): void {
    if (this.loginType === 'watch') {
      this.watchLogin(credentials);
    } else {
      this.mainLogin(credentials);
    }
  }
  /**
   * emits event to show register form and show this one
   */
  showRegister(): void {
    this.showRegisterEvent.emit();
  }
  /**
   * Login user - for browser use
   * @param credentials user pass and username
   */
  mainLogin(credentials: AccountCredentials): void {
    this.auth.login(credentials).subscribe(res => {
      const token = res.token;
      localStorage.setItem('jwt', token);
      this.router.navigate(['/']);
    },
    (err: HttpErrorResponse) => {
      this.load = false;
      if (err.status === 401) {
        this.snack.showSnackBar('Wrong password or username', 'Close', 5000);
      } else {
        this.snack.showSnackBar('Unknown error', 'Close', 5000);
      }
    },
    () => {
      this.load = false;
    });
  }
  /**
   * Login user - for watch use
   * @param credentials user pass and username
   */
  watchLogin(credentials: AccountCredentials): void {
    this.auth.watchLogin(credentials).subscribe(res => {
      const token = res.token;
      // this.router.navigate(['/login'], {queryParams: {token}});
      // window.location.reload();
      window.location.href = '/login?token=' + token;
    },
    (err: HttpErrorResponse) => {
      this.load = false;
      if (err.status === 401) {
        this.snack.showSnackBar('Wrong password or username', 'Close', 5000);
      } else {
        this.snack.showSnackBar('Unknown error', 'Close', 5000);
      }
    },
    () => {
      this.load = false;
    });
  }
}
