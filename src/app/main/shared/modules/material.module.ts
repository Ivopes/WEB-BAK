import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  imports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule
  ],
  exports: [
   MatSliderModule,
   MatButtonModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatSlideToggleModule
  ],
})
export class MaterialModule { }
