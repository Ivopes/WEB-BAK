import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-pl-dialog',
  templateUrl: './rename-pl-dialog.component.html',
  styleUrls: ['./rename-pl-dialog.component.scss']
})
export class RenamePlDialogComponent implements OnInit {

  playlistForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RenamePlDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {
      name: string
    }
  ) { }

  ngOnInit(): void {
    this.playlistForm = this.fb.group({
      name: [this.data.name, Validators.required]
    });
  }
  onSubmit(): void {
    if (this.playlistForm.invalid) {
      return;
    }
    this.dialogRef.close(this.playlistForm.value);
  }
}
