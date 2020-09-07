import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';
import { shareReplay } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private constants: Constants
    ) { }

  login(user: User): Observable<any>{
    return this.httpClient.post<User>(this.constants.API_ENDPOINT + '/auth', user).pipe(shareReplay());
  }
}
