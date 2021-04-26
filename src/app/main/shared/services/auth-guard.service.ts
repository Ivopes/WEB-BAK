import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SongService } from './song.service';
import { PlaylistService } from './playlist.service';
import { AccountService } from './account.service';
import { StorageService } from './storage.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private songService: SongService,
    private playlistService: PlaylistService,
    private accountService: AccountService,
    private storageService: StorageService,

    ) { }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate();
  }

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');

    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    localStorage.removeItem('jwt');
    this.songService.clearData();
    this.playlistService.clearData();
    this.accountService.clearData();
    this.storageService.clearData();
    this.router.navigate(['/login']);
    return false;
  }

}
