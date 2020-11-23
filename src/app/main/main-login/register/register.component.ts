import { trigger, transition, animate, style } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from '../../shared/models/account.model';
import { AuthService } from '../../shared/services/auth.service';
import { passMatchValidator } from '../../shared/Validators/password-re-type';
import { SnackBarService } from '../../shared/services/snackBar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('remove', [
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup;

  public load = false;

  @Output() showLoginEvent = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private snack: SnackBarService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      retypePassword: ['', Validators.required]
    }, {validators: passMatchValidator('password', 'retypePassword')});
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.load = true;
    this.register(this.registerForm.value);
  }

  register(user: Account): void {
    this.auth.register(user).subscribe(() => {
      this.snack.showSnackBar('Registration was succesfull', 'Close', 5000);
      this.showLogin();
    },
    (err) => {
      this.snack.showSnackBar(err.error, 'Close', 5000);
      this.load = false;
    },
    () => {
      this.load = false;
    });
  }

  showLogin(): void {
    this.showLoginEvent.emit();
  }
}
