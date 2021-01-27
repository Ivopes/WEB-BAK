import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watch-login',
  templateUrl: '../main-login.component.html',
  styleUrls: ['../main-login.component.scss']
})
export class WatchLoginComponent implements OnInit {

  showLoginForm = true;
  load = false;

  constructor() { }

  ngOnInit(): void {
    console.log('watch login');
  }
  onSubmit(): void {
    this.load = true;
  }
  changeForms(): void {
    this.showLoginForm = !this.showLoginForm;
  }
}
