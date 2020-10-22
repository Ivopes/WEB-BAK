import { trigger, transition, animate, style } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrototypeDataService } from 'src/app/prototype/shared/services/prototype-data.service';
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

  public load = false;

  @Output() showRegisterEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: SnackBarService,
    private testS: PrototypeDataService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.load = true;
    this.login(this.loginForm.value);
  }

  login(credentials: AccountCredentials): void {
    this.auth.login(credentials).subscribe(res => {
      const token = res.token;
      localStorage.setItem('jwt', token);
      this.router.navigate(['/']);
    },
    (err: HttpErrorResponse) => {
      console.log(err);
      this.load = false;
      if (err.status === 401) {
        this.snack.showsnackBar('Wrong password or username', 'Close', 5000);
      }
      else {
        this.snack.showsnackBar('Unknown error', 'Close', 5000);
      }
    },
    () => {
      this.load = false;
    });
  }

  showRegister(): void {
    this.showRegisterEvent.emit();
  }

  testR(): void {
    this.testS.getSingle().subscribe(data => {
      console.log(data);
    },
    err => console.log(err));
  }

}
