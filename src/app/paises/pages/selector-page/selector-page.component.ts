import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators'
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: []
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  regiones: string[] = []
  paises: PaisSmall[] = []
  fronteras: PaisSmall[] = []
  cargando: boolean = false

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('')
          this.cargando = true
          this.miFormulario.get('frontera')?.disable()
        }),
        switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        this.paises = paises
        this.cargando = false
      })

    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true
        }),
        switchMap(codigo => this.paisesServices.getPaisPorID(codigo)),
        switchMap(pais => this.paisesServices.getPaisporCodigos(pais?.borders!))
      )
      .subscribe(paises => {
        this.fronteras = paises
        console.log(this.fronteras)
        this.cargando = false
      })
  }
  guardar(){

  }

}
