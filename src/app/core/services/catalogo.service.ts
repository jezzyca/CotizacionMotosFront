import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ModeloMoto,
  VersionMoto,
  Accesorio,
  ApiResponse
} from '../models/cotizacion.model';
import { environment } from '../../../environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = `${environment.apiUrl}/catalogos`;

  constructor(private http: HttpClient) {}

  obtenerModelos(): Observable<ModeloMoto[]> {
    return this.http.get<ApiResponse<ModeloMoto[]>>(`${this.apiUrl}/modelos`)
     .pipe(map(response => response.data));
  }

  obtenerVersiones(): Observable<VersionMoto[]> {
    return this.http.get<ApiResponse<VersionMoto[]>>(`${this.apiUrl}/versiones`)
     .pipe(map(response => response.data));
  }

  obtenerVersionesPorModelo(idModelo: number): Observable<VersionMoto[]> {
    return this.http.get<ApiResponse<VersionMoto[]>>(`${this.apiUrl}/versiones/modelo/${idModelo}`)
     .pipe(map(response => response.data));
  }

  obtenerVersion(id: number): Observable<VersionMoto> {
    return this.http.get<ApiResponse<VersionMoto>>(`${this.apiUrl}/versiones/${id}`)
     .pipe(map(response => response.data));
  }

  obtenerAccesorios(): Observable<Accesorio[]> {
    return this.http.get<ApiResponse<Accesorio[]>>(`${this.apiUrl}/accesorios`)
     .pipe(map(response => response.data));
  }
}
