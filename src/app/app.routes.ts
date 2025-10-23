import { Routes } from '@angular/router';
import { CotizacionFormComponent } from './caracteristicas/cotizacion-form/cotizacion-form.component';
import { CotizacionDetalleComponent } from './caracteristicas/cotizacion-detalle/cotizacion-detalle.component';

export const routes: Routes = [
    { path: '', component: CotizacionFormComponent},
    { path: 'cotizacion/:id', component: CotizacionDetalleComponent},
    { path: '**', redirectTo: ''}
];
