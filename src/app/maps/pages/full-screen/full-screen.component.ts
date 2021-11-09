import {Component, OnInit} from '@angular/core';
import * as mapboxgl from 'mapbox-gl'


@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [`
      #map {
        height: 100%;
        width: 100%;
      }
    `]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ 1.252173972505411, 41.137908910273076 ],
      zoom: 18
    });
  }

}
