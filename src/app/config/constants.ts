// Angular Modules
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Constants {
  private readonly baseUrl = environment.baseUrl;

  public readonly API_ENDPOINT: string = this.baseUrl + '/api';
}
