import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Constants } from '../../../config/constants';
import { Account } from '../models/account.model';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AccountService {

  private readonly controller: string = 'account';

  private data: Account;

  constructor(
    private httpClient: HttpClient,
    private constants: Constants,
    ) { }

  public getById(): Observable<Account> {
    if (this.data) {
      return of(this.data);
    }

    return this.httpClient.get<Account>(`${this.constants.API_ENDPOINT}/${this.controller}`).pipe(
      tap(data => {
        this.data = data;
      })
    );
  }

  public clearData(): void {
    this.data = null;
  }
}
