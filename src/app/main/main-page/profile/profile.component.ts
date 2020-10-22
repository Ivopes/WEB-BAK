import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  auth(): void {
    window.location.href = 'https://www.dropbox.com/oauth2/authorize?client_id=34niuwlpk3k4gki&redirect_uri=https://localhost:44303/test&response_type=code';
    //this.authService.dropboxAuth();
  }
}
