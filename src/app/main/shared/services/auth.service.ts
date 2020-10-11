import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from '../models/userCredentials.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})

export class AuthService {

private readonly controller: string = '/auth';

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    private jwtHelper: JwtHelperService,
    ) { }

  login(credentials: UserCredentials): Observable<any> {
    return this.httpClient.post<UserCredentials>(this.constants.API_ENDPOINT + this.controller + '/login',
    credentials)
    .pipe(shareReplay());
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(this.constants.API_ENDPOINT + this.controller + '/register', user).pipe(shareReplay());
  }
  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    return false;
  }
 }
