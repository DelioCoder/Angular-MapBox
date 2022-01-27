import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor {
  color : string;
  marker?: mapboxgl.Marker;
  centro?: [ number, number ]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }
  
      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        position: fixed;
        z-index: 999;
        width: 400px;
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
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -77.09069341919765, -12.039257827575268 ]

  // Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    
    this.leerLocalStorate();

    // const marker = new mapboxgl.Marker()
    //   .setLngLat( this.center )
    //   .addTo( this.map );

  }

  agregarMarcador() {

    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo( this.map );

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    //console.log(this.marcadores);
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }

  irMarcador( marcador: MarcadorColor ) {
    this.map.flyTo({
      center: marcador.marker!.getLngLat()
    });
  }

  guardarMarcadoresLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach( m => {
      const color   = m.color;
      const { lng, lat }  = m.marker!.getLngLat();
    
      lngLatArr.push({
        color,
        centro: [ lng, lat ]
      });

    });

    localStorage.setItem( 'marcadores', JSON.stringify( lngLatArr ) );

  }

  leerLocalStorate() {

    if ( !localStorage.getItem('marcadores') ) {
      return;
    }

    const ngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')! );

    //console.log( ngLatArr );

    ngLatArr.forEach( m => {
      
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      }).setLngLat( m.centro! )
      .addTo( this.map );

      this.marcadores.push({
        marker: newMarker,
        color: m.color  
      });

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });

    });

  }

  borrarMarcador( i: number ) {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice( i, 1 );
    this.guardarMarcadoresLocalStorage();
  }

}
