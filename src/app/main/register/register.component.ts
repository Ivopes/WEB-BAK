import { trigger, transition, animate, style } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.load = true;
    //this.login(this.loginForm.value);
  }

  register(): void {

  }

  showLogin(): void {
    this.showLoginEvent.emit();
  }
}
