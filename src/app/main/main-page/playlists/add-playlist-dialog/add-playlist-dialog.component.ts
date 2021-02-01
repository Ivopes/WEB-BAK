import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Playlist } from 'src/app/main/shared/models/playlist.model';

@Component({
  selector: 'app-add-playlist-dialog',
  templateUrl: './add-playlist-dialog.component.html',
  styleUrls: ['./add-playlist-dialog.component.scss']
})
export class AddPlaylistDialogComponent implements OnInit {

  playlistForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddPlaylistDialogComponent>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.playlistForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.playlistForm.invalid) {
      return;
    }
    this.dialogRef.close(this.playlistForm.value);
  }
}
