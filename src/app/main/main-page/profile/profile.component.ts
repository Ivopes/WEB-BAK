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
import { Song } from '../../shared/models/song.model';
import { SongService } from '../../shared/services/song.service';
import { LoginComponent } from '../../main-login/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { RenamePlDialogComponent } from '../playlists/playlist-detail/rename-pl-dialog/rename-pl-dialog.component';
import { filter, switchMap } from 'rxjs/operators';
import { Playlist } from '../../shared/models/playlist.model';
import { ChangePasswdDialogComponent } from './change-passwd-dialog/change-passwd-dialog.component';
import { PlaylistService } from '../../shared/services/playlist.service';

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
    private loadingService: LoadingService,
    private songService: SongService,
    private matDialog: MatDialog,
    private playlistService: PlaylistService
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

  toAuthStorage(storageName: string): void {
    switch (storageName) {
      case 'Dropbox': {
        this.authService.toDropboxConfirm();
        break;
      }
      case 'Google Drive': {
        this.loadingService.addStartLoading();

        this.authService.getGoogleDriveAuth().subscribe(data => {
          window.location.replace(data);
        },
        err => {
          this.snackBarService.showSnackBar('Could not receive account information', 'Close', 5000);
          this.loadingService.addStopLoading();
        });
        break;
      }
      default: {

        break;
      }
    }
  }
  getAccountInfo(): void {
    this.loadingService.addStartLoading();

    this.accountService.getById().subscribe(data => {
      this.account = data;
      this.profileForm = this.createForm();
      this.dataSource = new MatTableDataSource(data.storage);
      if (this.stopLoading === true) {
        this.loadingService.addStopLoading();
      }
      this.stopLoading = true;
    },
      err => {
        this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
        this.loadingService.addStopLoading();
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
        this.loadingService.addStopLoading();
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
  signOutStorage(storageName: string): void {
    this.loadingService.addStartLoading();

    switch (storageName) {
      case 'Dropbox': {
        this.authService.signOutDbx().subscribe(() => {
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('Dropbox data deleted', 'Close', 2000);
          this.account.storage.splice(this.account.storage.findIndex(s => s.name === 'Dropbox'), 1);
          this.songService.clearData();
          this.playlistService.clearData();
        },
        err => {
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
        });
        break;
      }
      case 'Google Drive': {
        this.authService.signOutGoogleDrive().subscribe(() => {
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('Google Drive data deleted', 'Close', 2000);
          this.account.storage.splice(this.account.storage.findIndex(s => s.name === 'Google Drive'), 1);
          this.songService.clearData();
          this.playlistService.clearData();
        },
        err => {
          this.loadingService.addStopLoading();
          this.snackBarService.showSnackBar('Oops! Something went wrong, please try again later', 'Close', 3000);
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  changePasswd(): void {
    this.matDialog.open(ChangePasswdDialogComponent);
  }
}
