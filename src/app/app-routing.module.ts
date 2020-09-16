import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLoginComponent } from './main/main-login/main-login.component';
import { MainPrototypeComponent } from './prototype/main-prototype/main-prototype.component';
import { AuthGuard } from './main/shared/services/auth-guard.service';

const routes: Routes = [
  { path: 'login', component: MainLoginComponent},
  { path: 'test', component: MainPrototypeComponent, canActivate: [AuthGuard]},
  { path: '', pathMatch: 'full', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
