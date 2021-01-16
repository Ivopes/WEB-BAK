import { Component, OnInit } from '@angular/core';
import { PrototypeDataService } from '../shared/services/prototype-data.service';
import { WeatherForecast } from '../../main/shared/models/weather-forecast.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-main-prototype',
  templateUrl: './main-prototype.component.html',
  styleUrls: ['./main-prototype.component.scss']
})
export class MainPrototypeComponent implements OnInit {

  weatherForecast: WeatherForecast[] = [];
  singleForecast: WeatherForecast = null;
  mp3File: any = null;

  fileToUpload: File = null;

  code: string;

  constructor(
    private proData: PrototypeDataService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    /*this.proData.getData().subscribe(data => {
      this.weatherForecast = data;
    },
    err => console.error(err)
    );
    this.proData.getSingle().subscribe(data => {
      this.singleForecast = data;
    },
    err => console.error(err)
    );
    this.getMp3();
    this.getMp3Info();*/

    this.readJwtCode();
  }

  private readJwtCode(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.proData.oauth(this.code).subscribe(data => {
        localStorage.setItem('jwt-dropbox', data.access_token);
      });
    });
  }

  getMp3(): void {
    this.proData.getMp3().subscribe(data => {
      return data;
      this.mp3File = data;
    },
    err => console.error(err)
    );
  }
  getMp3Info(): void {
    this.proData.getMp3Info().subscribe(data => {
    },
      err => console.error(err)
    );
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
  }

  uploadFile(): void {
    this.proData.postMp3(this.fileToUpload).subscribe(data => {
      });
  }
  dropboxRequest(): void {
    this.proData.getDropbox().subscribe(data => {
      console.log(data);
    });
  }
}
