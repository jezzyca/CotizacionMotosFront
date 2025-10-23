import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CotizacionRequest,
  CotizacionResponse,
  ApiResponse
} from '../models/cotizacion.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private apiUrl = `${environment.apiUrl}/cotizaciones`;

  constructor(private http: HttpClient) {}
    crearCotizacion(request: CotizacionRequest): Observable<CotizacionResponse>{
    return this.http.post<ApiResponse<CotizacionResponse>>(this.apiUrl, request)
      .pipe(map(response => response.data))
   }

   obtenerCotizacion(id: number): Observable<CotizacionResponse>{
    return this.http.get<ApiResponse<CotizacionResponse>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
   }

   obtenerCotizacionesPorCliente(idCliente: number): Observable<CotizacionResponse[]>{
    return this.http.get<ApiResponse<CotizacionResponse[]>>(`${this.apiUrl}/cliente/${idCliente}`)
     .pipe(map(response => response.data));
   }

}
