import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherForecast } from '../models/weather-forecast.model';
import { Observable } from 'rxjs';
import { Constants } from '../../../config/constants';

@Injectable({providedIn: 'root'})
export class PrototypeDataService {
  constructor(
    private httpClient: HttpClient,
    private constants: Constants
    ) { }

  getData(): Observable<WeatherForecast[]> {
    return this.httpClient.get<WeatherForecast[]>(this.constants.API_ENDPOINT + '/weatherforecast');
  }
  getSingle(): Observable<WeatherForecast> {
    return this.httpClient.get<WeatherForecast>(this.constants.API_ENDPOINT + '/weatherforecast/single');
  }
}
