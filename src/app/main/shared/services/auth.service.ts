import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserCredentials } from '../models/userCredentials.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { shareReplay } from 'rxjs/operators';
import { User } from '../models/user.model';


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private constants: Constants
    ) { }

  login(credentials: UserCredentials): Observable<any> {
    return this.httpClient.post<UserCredentials>(this.constants.API_ENDPOINT + '/auth', credentials).pipe(shareReplay());
  }

  register(user: User): Observable<any> {
    return this.httpClient.post<User>(this.constants.API_ENDPOINT + '/auth', user).pipe(shareReplay());
  }
}
