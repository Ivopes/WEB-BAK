import { Component, OnInit } from '@angular/core';
import { PrototypeDataService } from '../shared/services/prototype-data.service';
import { WeatherForecast } from '../shared/models/weather-forecast.model';


@Component({
  selector: 'app-main-prototype',
  templateUrl: './main-prototype.component.html',
  styleUrls: ['./main-prototype.component.scss']
})
export class MainPrototypeComponent implements OnInit {

  weatherForecast: WeatherForecast[] = [];
  singleForecast: WeatherForecast = null;
  mp3File: any = null;

  constructor(
    private proData: PrototypeDataService
  ) { }

  ngOnInit(): void {
    this.proData.getData().subscribe(data => {
      this.weatherForecast = data;
    },
    err => console.error(err)
    );
    this.proData.getSingle().subscribe(data => {
      this.singleForecast = data;
    },
    err => console.error(err)
    );
    //this.getMp3();
  }

  getMp3(): void {
    this.proData.getMp3ById('5').subscribe(data => {
      this.mp3File = data;
      //new File(data, 'vytvorene.mp3');
    },
    err => console.error(err)
    );
  }
}
