import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl: string = 'https://restcountries.com/v3.1'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']

  get regiones(){
    return [...this._regiones]
  }

  constructor(private http: HttpClient) { }

  getPaisesPorRegion(region: string): Observable<PaisSmall[]>{
    const url: string= `${this._baseUrl}/region/${region}?fields=name&fields=cca3`
    return this.http.get<PaisSmall[]>(url)
  }

  getPaisPorID(codigo:string):Observable<Pais | null>{
    if(!codigo){
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url)
  }

  getPaisPorIDSmall(codigo:string):Observable<PaisSmall>{
    const url = `${this._baseUrl}/alpha/${codigo}?fields=name&fields=cca3`;
    return this.http.get<PaisSmall>(url)
  }

  getPaisporCodigos(borders: string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of ([])
    }
    const peticiones: Observable<PaisSmall>[] = []

    borders.forEach(codigo => {
      const peticion = this.getPaisPorIDSmall(codigo)
      peticiones.push(peticion)
    });
    return combineLatest(peticiones)
  }
}
