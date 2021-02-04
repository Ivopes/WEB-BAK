import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account } from '../../shared/models/account.model';
import { AccountService } from '../../shared/services/account.service';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../../shared/services/snackBar.service';
import { StorageService  } from '../../shared/services/storage.service';
import { Storage } from '../../shared/models/storage.model';
import { MatTableDataSource } from '@angular/material/table';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;

  account: Account;

  storages: Storage[];

  displayedColumns = ['storage', 'add', 'remove', 'signed'];

  dataSource: MatTableDataSource<Storage>;

  stopLoading = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackBarService: SnackBarService,
    private storageService: StorageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      username: ['']
    });

    this.getAccountInfo();

    this.getStorages();

  }

  toBbxAuth(): void {
    this.authService.toDropboxConfirm();
  }
  getAccountInfo(): void {
    this.loadingService.startLoading();

    this.accountService.getById().subscribe(data => {
      this.account = data;
      this.profileForm = this.createForm();
      this.dataSource = new MatTableDataSource(data.storage);
      if (this.stopLoading === true) {
        this.loadingService.stopLoading();
      }
      this.stopLoading = true;
    },
      err => {
        this.snackBarService.showSnackBar('Could not receive account information', 'Close', 5000);
        this.loadingService.stopLoading();
      }
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
  getStorages(): void {
    this.storageService.getAll().subscribe(data => {
      this.storages = data;
      if (this.stopLoading === true) {
        this.loadingService.stopLoading();
      }
      this.stopLoading = true;
    });
  }
  /**
   * does account have this storage signed
   * @param storage storage to check if signed
   */
  isStorageSigned(storage: Storage): boolean {
    return this.account.storage.some(s => s.name === storage.name);
  }
}
