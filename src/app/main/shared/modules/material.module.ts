import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  imports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule,
   MatProgressSpinnerModule,
   MatSnackBarModule
  ],
  exports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule,
   MatProgressSpinnerModule,
   MatSnackBarModule
  ],
})
export class MaterialModule { }
