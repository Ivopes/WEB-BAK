import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WeatherForecast } from '../../../main/shared/models/weather-forecast.model';
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

  getMp3ById(id: string): Observable<any> {
    return this.httpClient.get(this.constants.API_ENDPOINT + '/Mp3/' + id, {
      responseType: 'text'
    });
  }
  getMp3(): Observable<any> {
    return this.httpClient.get(this.constants.API_ENDPOINT + '/Mp3', {
      responseType: 'text'
    });
  }
  getMp3Info(): Observable<any> {
    return this.httpClient.get(this.constants.API_ENDPOINT + '/Mp3/info', {
      responseType: 'text'
    });
  }
  postMp3(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    const obj = { file: file};

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });

    return this.httpClient.post(this.constants.API_ENDPOINT + '/mp3',
    formData
    );
  }
  oauth(code: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('code', code);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', 'https://localhost:44303/test');
    //formData.append('client_secret', 'dopjxzkfmz66p6r');
    //formData.append('client-id', '34niuwlpk3k4gki');

    let myHeaders: HttpHeaders = new HttpHeaders();
    myHeaders = myHeaders.append('Authorization', 'Basic ' + window.btoa('34niuwlpk3k4gki:dopjxzkfmz66p6r'));

    console.log('davam post');

    return this.httpClient.post('https://api.dropbox.com/1/oauth2/token',
    formData, {
      headers: myHeaders
    }
    );
  }
  getDropbox(): Observable<any> {

    return this.httpClient.post('https://api.dropboxapi.com/2/files/list_folder',
    {
      "path": ""
    });
  }
}
