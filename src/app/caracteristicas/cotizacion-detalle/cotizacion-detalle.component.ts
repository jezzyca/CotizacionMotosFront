import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CotizacionService } from '../../core/services/cotizacion.service';
import { CotizacionResponse } from '../../core/models/cotizacion.model';

@Component({
  selector: 'app-cotizacion-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cotizacion-detalle.component.html',
  styleUrl: './cotizacion-detalle.component.css'
})
export class CotizacionDetalleComponent implements OnInit {
  cotizacion: CotizacionResponse | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    console.log('ID recibido:', id);
    this.cargarCotizacion(id);
  }

  cargarCotizacion(id: number): void {
    console.log('Llamando al servicio con ID:', id);
    
    this.cotizacionService.obtenerCotizacion(id).subscribe({
      next: (cotizacion) => {
        console.log('COTIZACIÓN COMPLETA RECIBIDA:', cotizacion);
        console.log('COSTOS:', cotizacion.costos);
        console.log('OPCIONES FINANCIAMIENTO:', cotizacion.opcionesFinanciamiento);
        
        // Verificar campos específicos
        if (!cotizacion.costos) {
          console.error('NO HAY COSTOS');
        }
        if (!cotizacion.opcionesFinanciamiento || cotizacion.opcionesFinanciamiento.length === 0) {
          console.error('NO HAY OPCIONES DE FINANCIAMIENTO');
        }
        
        this.cotizacion = cotizacion;
        this.loading = false;
      },
      error: (error) => {
        console.error('ERROR AL CARGAR:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        this.loading = false;
        this.errorMessage = 'No se pudo cargar la cotización';
      }
    });
  }

  imprimirCotizacion(): void {
    window.print();
  }

  nuevaCotizacion(): void {
    this.router.navigate(['/']);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}