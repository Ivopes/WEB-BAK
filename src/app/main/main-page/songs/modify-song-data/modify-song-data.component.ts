import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from 'src/app/main/shared/models/song.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-modify-song-data',
  templateUrl: './modify-song-data.component.html',
  styleUrls: ['./modify-song-data.component.scss']
})
export class ModifySongDataComponent implements OnInit {

  formGroup: FormGroup = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModifySongDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      song: Song
    }) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: [this.data.song.name, Validators.required],
      author: [this.data.song.author]
    });
  }

  onSubmit(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const song: Song = {
      author: this.formGroup.controls['author'].value,
      id: this.data.song.id,
      storageID: this.data.song.storageID,
      fileName: this.data.song.fileName,
      playlists: null,
      name: this.formGroup.controls['name'].value,
      lengthSec: this.data.song.lengthSec
    };

    this.dialogRef.close(song);
  }
}
