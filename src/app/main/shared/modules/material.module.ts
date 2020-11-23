import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  imports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule,
   MatProgressSpinnerModule,
   MatSnackBarModule,
   MatToolbarModule,
   MatIconModule,
   MatSidenavModule,
   MatMenuModule,
   MatListModule,
   MatDialogModule,
  ],
  exports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule,
   MatProgressSpinnerModule,
   MatSnackBarModule,
   MatToolbarModule,
   MatIconModule,
   MatSidenavModule,
   MatMenuModule,
   MatListModule,
   MatDialogModule,
  ],
})
export class MaterialModule { }
