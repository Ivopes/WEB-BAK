import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passMatchValidator } from 'src/app/main/shared/Validators/password-re-type';
import { AuthService } from 'src/app/main/shared/services/auth.service';
import { LoadingService } from 'src/app/main/shared/services/loading.service';
import { SnackBarService } from 'src/app/main/shared/services/snackBar.service';

@Component({
  selector: 'app-change-passwd-dialog',
  templateUrl: './change-passwd-dialog.component.html',
  styleUrls: ['./change-passwd-dialog.component.scss']
})
export class ChangePasswdDialogComponent implements OnInit {

  passwdForm: FormGroup = null;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswdDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingService: LoadingService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this.passwdForm = this.fb.group({
      currentPsswd: ['', Validators.required],
      newPsswd: ['', Validators.required],
      reNewPsswd: ['', Validators.required],
      },
      {validators: passMatchValidator('newPsswd', 'reNewPsswd')}
    );
  }

  onSubmit(): void {
    if (this.passwdForm.invalid) {
      return;
    }
    const oldP = this.passwdForm.controls['currentPsswd'].value;
    const newP = this.passwdForm.controls['reNewPsswd'].value;

    this.loadingService.startLoading();

    this.authService.changePasswd(oldP, newP).subscribe(() => {
      this.snackBarService.showSnackBar('Password was changed', 'Close', 3000);
      this.loadingService.stopLoading();
      this.dialogRef.close();
    },
    err => {
      this.snackBarService.showSnackBar(err.error, 'Close', 3000);
      this.loadingService.stopLoading();
    });

  }

}
