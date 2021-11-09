import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as mapboxgl from "mapbox-gl";

interface MarkerWithColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }

    li {
      cursor: pointer;
    }
  `]
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('map') mapDiv!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [1.252173972505411, 41.137908910273076];

  markers: MarkerWithColor[] = [];

  constructor() {
  }


  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.readMarkersFromLocalStorage();

    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hello World';

    // const marker = new mapboxgl.Marker({
    //   // element: markerHtml
    // }).setLngLat(this.center)
    //   .addTo(this.map);

  }

  addMarker() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.center)
      .addTo(this.map);

    this.markers.push({color, marker: newMarker});

    this.saveMarkersLocalStorage();

    newMarker.on('dragend', () => this.saveMarkersLocalStorage());
  }

  goToMarker(marker: MarkerWithColor) {
    this.map.flyTo({center: marker.marker?.getLngLat()});
  }

  deleteMarker(index: number) {
    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
    this.saveMarkersLocalStorage();
  }

  saveMarkersLocalStorage() {

    const lngLatArr: MarkerWithColor[] = [];

    this.markers.forEach( marker => {
      const color = marker.color;
      const {lng, lat} = marker.marker!.getLngLat();

      lngLatArr.push({
        color,
        center: [lng, lat]
      });
    })

    localStorage.setItem('markers', JSON.stringify(lngLatArr))

  }

  readMarkersFromLocalStorage() {
    if(!localStorage.getItem('markers')){
      return;
    }

    const lngLatArr: MarkerWithColor[] = JSON.parse(localStorage.getItem('markers')!);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      }).setLngLat(m.center!)
        .addTo(this.map);

      this.markers.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', () => this.saveMarkersLocalStorage());

    })



  }

}
