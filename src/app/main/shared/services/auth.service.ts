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

  /**
   * request for logging user by credentials - for browser
   * @param credentials user pass and username
   */
  login(credentials: AccountCredentials): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(`${this.constants.API_ENDPOINT}/${this.controller}/login`,
    credentials)
    .pipe(shareReplay());
  }
  /**
   * request for logging user by credentials - for watch
   * @param credentials user pass and username
   */
  watchLogin(credentials: AccountCredentials): Observable<JwtToken> {
    return this.httpClient.post<JwtToken>(`${this.constants.API_ENDPOINT}/${this.controller}/login/watch`,
    credentials)
    .pipe(shareReplay());
  }
  /**
   * request for registerring user
   * @param user user register information
   */
  register(user: Account): Observable<Account> {
    return this.httpClient.post<Account>(`${this.constants.API_ENDPOINT}/${this.controller}/register`, user).pipe(shareReplay());
  }
  /**
   * is user logged in - is token valid
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    return false;
  }
  /**
   * redirects user to dropbox auth site
   */
  dropboxAuthCode(): void {
    window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=${this.constants.dropboxKey}&redirect_uri=${this.constants.dropboxRedirectURL}&response_type=code`;
  }
  /**
   * get dropbox token by dropbox code
   * @param code string for dropbox indentification
   */
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
  /**
   * request for saving token to database
   * @param dbxJson json containing dbx token
   */
  saveDropboxJwt(dbxJson: DbxJson): Observable<any> {
    return this.httpClient.post<any>(`${this.constants.API_ENDPOINT}/${this.controller}/registerDropbox`, dbxJson);
  }
 }
