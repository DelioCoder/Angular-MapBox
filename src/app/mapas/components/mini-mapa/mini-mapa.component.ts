import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
  `
    div {
      width: 100%;
      height: 150px;
      margin: 0px;
    }
  `
  ]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lnLat: [ number, number ] = [ 0, 0 ];
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    var map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lnLat,
      zoom: 15,
      interactive: false
    });

    new mapboxgl.Marker()
      .setLngLat( this.lnLat )
      .addTo( map );
  }

}
