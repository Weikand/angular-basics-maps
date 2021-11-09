import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
    .map-container {
      height: 100%;
      width: 100%;
    }

    .row {
      background-color: white;
      border-radius: 5px;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      width: 400px;
      z-index: 999;
    }

  `]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') mapDiv!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [1.252173972505411, 41.137908910273076];

  constructor() {
  }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.map.on('zoom', () => {
      this.zoomLevel = this.map.getZoom();
    })

    this.map.on('zoomend', () => {
      if (this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    })

    this.map.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();

      this.center = [lng,lat];

    })

  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomChanged(value: string) {
    this.map.zoomTo(Number(value));
  }

}
