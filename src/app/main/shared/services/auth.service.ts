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
  toDropboxConfirm(): void {
    window.location.href = `https://www.dropbox.com/oauth2/authorize?client_id=${this.constants.dropboxKey}&redirect_uri=${this.constants.dropboxRedirectURL}&response_type=code`;
  }
  getGoogleDriveAuth(): Observable<any> {
    return this.httpClient.get(`${this.constants.API_ENDPOINT}/${this.controller}/gd/url`, {responseType: 'text'});
  }
  /**
   * send dropbox code to backend
   * @param code string for dropbox indentification
   */
  dropboxOAuth(code: string): Observable<any> {
    return this.httpClient.get(`${this.constants.API_ENDPOINT}/${this.controller}/dbx/${code}`);
  }
  /**
   * send gd code to backend
   * @param code string for gd indentification
   */
  GoogleDriveAuth(code: string): Observable<any> {
    // Azure decodes url anyway so no need for encoding
    console.log(`${this.constants.API_ENDPOINT}/${this.controller}/gd/code/${code}`);

    return this.httpClient.get(`${this.constants.API_ENDPOINT}/${this.controller}/gd/code/${code}`, { responseType: 'text' });
  }
  /**
   * request for saving token to database
   * @param dbxJson json containing dbx token
   */
  saveDropboxJwt(dbxJson: DbxJson): Observable<any> {
    return this.httpClient.post<any>(`${this.constants.API_ENDPOINT}/${this.controller}/registerDropbox`, dbxJson);
  }
  signOutDbx(): Observable<any> {
    return this.httpClient.delete(`${this.constants.API_ENDPOINT}/${this.controller}/dbx`);
  }
  signOutGoogleDrive(): Observable<any> {
    return this.httpClient.delete(`${this.constants.API_ENDPOINT}/${this.controller}/gd`);
  }
  public changePasswd(oldPasswd: string, newPasswd: string): Observable<Account> {
    const formData = new FormData();

    formData.append('oldPass', oldPasswd);
    formData.append('newPass', newPasswd);

    return this.httpClient.post<Account>(`${this.constants.API_ENDPOINT}/${this.controller}/password`, formData);
  }
 }
