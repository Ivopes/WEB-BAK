import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountCredentials } from '../models/accountCredentials.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { shareReplay } from 'rxjs/operators';
import { Account } from '../models/account.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DbxOAuth } from '../models/dbxOAuth.model';
import { DbxJson } from '../models/dbxJson.model';
import { JwtToken } from '../models/jwtToken.model';

@Injectable({providedIn: 'root'})

export class AuthService {

private readonly controller: string = 'auth';

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    private jwtHelper: JwtHelperService,
    ) { }

  login(credentials: AccountCredentials): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(`${this.constants.API_ENDPOINT}/${this.controller}/login`,
    credentials)
    .pipe(shareReplay());
  }
  watchLogin(credentials: AccountCredentials): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(`${this.constants.API_ENDPOINT}/${this.controller}/login/watch`,
    credentials)
    .pipe(shareReplay());
  }

  register(user: Account): Observable<Account> {
    return this.httpClient.post<Account>(`${this.constants.API_ENDPOINT}/${this.controller}/register`, user).pipe(shareReplay());
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    return false;
  }
  dropboxAuthCode(): void {
    window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=${this.constants.dropboxKey}&redirect_uri=${this.constants.dropboxRedirectURL}&response_type=code`;
  }
  dropboxOAuth(code: string): Observable<DbxOAuth> {
    const formData: FormData = new FormData();
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', `${this.constants.dropboxRedirectURL}`);

    let myHeaders: HttpHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('Authorization', 'Basic ' + window.btoa(`${this.constants.dropboxKey}:${this.constants.dropboxSecret}`));

    return this.httpClient.post<DbxOAuth>('https://api.dropbox.com/1/oauth2/token',
    formData, {
      headers: myHeaders
    });
  }
  saveDropboxJwt(dbxJson: DbxJson): Observable<any> {
    return this.httpClient.post<any>(`${this.constants.API_ENDPOINT}/${this.controller}/registerDropbox`, dbxJson);
  }
 }
