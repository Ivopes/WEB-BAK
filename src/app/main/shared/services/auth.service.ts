import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountCredentials } from '../models/accountCredentials.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { shareReplay } from 'rxjs/operators';
import { Account } from '../models/account.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})

export class AuthService {

private readonly controller: string = '/auth';

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    private jwtHelper: JwtHelperService,
    ) { }

  login(credentials: AccountCredentials): Observable<any> {
    return this.httpClient.post<AccountCredentials>(this.constants.API_ENDPOINT + this.controller + '/login',
    credentials)
    .pipe(shareReplay());
  }

  register(user: Account): Observable<Account> {
    return this.httpClient.post<Account>(this.constants.API_ENDPOINT + this.controller + '/register', user).pipe(shareReplay());
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    return false;
  }
  dropboxAuth(): any {
    return this.httpClient.get('https://www.dropbox.com/oauth2/authorize?client_id=34niuwlpk3k4gki&redirect_uri=https://localhost:44303/test&response_type=code');
  }
 }
