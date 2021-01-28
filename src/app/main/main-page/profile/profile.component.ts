import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account } from '../../shared/models/account.model';
import { AccountService } from '../../shared/services/account.service';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { SongService } from '../../shared/services/song.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;

  account: Account;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['']
    });

    this.getAccountInfo();

  }

  auth(): void {
    this.authService.dropboxAuthCode();
  }
  getAccountInfo(): void {
    this.accountService.getById().subscribe(data => {
      this.account = data;
      this.profileForm = this.createForm();
    },
      err => this.snackBarService.showSnackBar('Could not receive account information', 'Close', 5000)
    );
  }
  createForm(): FormGroup {
    return this.fb.group({
      firstName: [this.account.firstName],
      lastName: [this.account.lastName],
      email: [this.account.email],
      username: [this.account.username]
    });
  }
}
