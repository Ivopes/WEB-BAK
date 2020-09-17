import { trigger, transition, animate, style } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredentials } from '../shared/models/userCredentials.model';
import { AuthService } from '../shared/services/auth.service';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.load = true;
    //this.login(this.loginForm.value);
  }

  login(credentials: UserCredentials): void {
    this.auth.login(credentials).subscribe(res => {
      console.log(res);
      const token = res.token;
      localStorage.setItem('jwt', token);
      this.router.navigate(['/test']);
    },
    err => {
      console.log(err);
      this.load = false;
    });
  }

  showRegister(): void {
    this.showRegisterEvent.emit();
  }
}
