import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CotizacionService } from '../../core/services/cotizacion.service';
import { CatalogoService } from '../../core/services/catalogo.service';
import { Accesorio, VersionMoto, CotizacionRequest } from '../../core/models/cotizacion.model';

@Component({
  selector: 'app-cotizacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cotizacion-form.component.html',
  styleUrl: './cotizacion-form.component.css'
})
export class CotizacionFormComponent implements OnInit {
  cotizacionForm!: FormGroup;
  versiones: VersionMoto[] = [];
  accesorios: Accesorio[] = [];
  versionSeleccionada: VersionMoto | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private cotizacionService: CotizacionService,
    private catalogoService: CatalogoService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.inicializarFormulario();
      this.cargarCatalogos();
  }

  inicializarFormulario(): void {
    this.cotizacionForm = this.fb.group({
      idVersion: ['', Validators.required],
      cliente: this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(200)]],
        telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]]  // ✅ CORREGIDO
      }),
      montoEnganche: ['', [Validators.required, Validators.min(0)]],
      gastosAdministrativos: [2500, [Validators.required, Validators.min(0)]],
      costoSeguro: [5000, [Validators.required, Validators.min(0)]],
      accesoriosSeleccionados: this.fb.array([])
    });

    this.cotizacionForm.get('idVersion')?.valueChanges.subscribe(idVersion => {
      this.onVersionChange(idVersion);
    });
  }

  cargarCatalogos(): void {
    console.log('Cargando catálogos...'); // Debug
    
    this.catalogoService.obtenerVersiones().subscribe({
      next: (versiones) => {
        this.versiones = versiones;
        console.log('Versiones cargadas:', versiones); // Debug
      },
      error: (error) => {
        console.error('Error al cargar versiones:', error);
        this.errorMessage = 'No se pudieron cargar las versiones de motos';
      }
    });

    this.catalogoService.obtenerAccesorios().subscribe({
      next: (accesorios) => {
        this.accesorios = accesorios;
        console.log('Accesorios cargados:', accesorios); // Debug
      },
      error: (error) => {
        console.error('Error al cargar accesorios:', error);
      }
    });
  }

  onVersionChange(idVersion: number): void {
    if (!idVersion) return;

    console.log('Versión seleccionada ID:', idVersion); // Debug

    this.catalogoService.obtenerVersion(idVersion).subscribe({
      next: (version) => {
        this.versionSeleccionada = version;
        const engancheMinimo = version.precioBase * 0.10;
        this.cotizacionForm.get('montoEnganche')?.setValue(engancheMinimo);
        console.log('Versión cargada:', version); // Debug
      },
      error: (error) => {
        console.error('Error al obtener versión:', error);
      }
    });
  }

  get accesoriosFormArray(): FormArray {
    return this.cotizacionForm.get('accesoriosSeleccionados') as FormArray;
  }

  agregarAccesorio(accesorio: Accesorio): void {
    const accesorioGroup = this.fb.group({
      idAccesorio: [accesorio.idAccesorio],
      nombre: [accesorio.nombre],
      precio: [accesorio.precio],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.accesoriosFormArray.push(accesorioGroup);
    console.log('Accesorio agregado:', accesorio); // Debug
  }

  eliminarAccesorio(index: number): void {
    this.accesoriosFormArray.removeAt(index);
  }

  calcularTotalAccesorios(): number {
    let total = 0;
    this.accesoriosFormArray.controls.forEach(control => {
      const precio = control.get('precio')?.value || 0;
      const cantidad = control.get('cantidad')?.value || 0;
      total += precio * cantidad;
    });
    return total;
  }

  calcularCostoTotal(): number {
    if (!this.versionSeleccionada) return 0;

    const precioBase = this.versionSeleccionada.precioBase;
    const iva = precioBase * 0.16;
    const gastosAdmin = this.cotizacionForm.get('gastosAdministrativos')?.value || 0;
    const seguro = this.cotizacionForm.get('costoSeguro')?.value || 0;
    const accesorios = this.calcularTotalAccesorios();

    return precioBase + iva + gastosAdmin + seguro + accesorios;
  }

  validarEnganche(): boolean {
    if (!this.versionSeleccionada) return false;

    const enganche = this.cotizacionForm.get('montoEnganche')?.value || 0;
    const engancheMinimo = this.versionSeleccionada.precioBase * 0.10;

    return enganche >= engancheMinimo;
  }

  onSubmit(): void {
  console.log('=== SUBMIT INICIADO ===');
  
  if (this.cotizacionForm.invalid) {
    this.marcarCamposComoTocados();
    this.errorMessage = 'Por favor complete todos los campos requeridos';
    return;
  }

  if (!this.validarEnganche()) {
    this.errorMessage = `El enganche debe ser al menos el 10% del valor de la moto (mínimo: $${(this.versionSeleccionada!.precioBase * 0.10).toFixed(2)})`;
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const request: CotizacionRequest = {
    idVersion: this.cotizacionForm.get('idVersion')?.value,
    cliente: this.cotizacionForm.get('cliente')?.value,
    montoEnganche: this.cotizacionForm.get('montoEnganche')?.value,
    gastosAdministrativos: this.cotizacionForm.get('gastosAdministrativos')?.value,
    costoSeguro: this.cotizacionForm.get('costoSeguro')?.value,
    accesorios: this.accesoriosFormArray.controls.map(control => ({
      idAccesorio: control.get('idAccesorio')?.value,
      cantidad: control.get('cantidad')?.value
    }))
  };

  this.cotizacionService.crearCotizacion(request).subscribe({
    next: (response) => {
      console.log('Cotización creada exitosamente:', response);
      this.loading = false;
      
      this.mostrarConfirmacion(response);
    },
    error: (error) => {
      console.error('Error al crear cotización:', error);
      this.loading = false;
      this.errorMessage = error.error?.message || 'Error al crear la cotización';
    }
  });
}

mostrarConfirmacion(cotizacion: any): void {
  const mensaje = `
    ¡Cotización creada exitosamente!
    
    Cotización No. ${cotizacion.idCotizacion}
    Cliente: ${cotizacion.cliente.nombre}
    Modelo: ${cotizacion.modelo} ${cotizacion.version}
    Total: $${cotizacion.costoTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}
    
    ¿Desea ver el detalle completo?
  `;
  
  if (confirm(mensaje)) {
    this.router.navigate(['/cotizacion', cotizacion.idCotizacion]);
  } else {
    this.resetForm();
  }
  
  }
  
  obtenerErroresFormulario(): any {
    const errores: any = {};
    Object.keys(this.cotizacionForm.controls).forEach(key => {
      const control = this.cotizacionForm.get(key);
      if (control && control.invalid) {
        errores[key] = control.errors;
        
        if (control instanceof FormGroup) {
          errores[key] = {};
          Object.keys(control.controls).forEach(subKey => {
            const subControl = control.get(subKey);
            if (subControl && subControl.invalid) {
              errores[key][subKey] = subControl.errors;
            }
          });
        }
      }
    });
    return errores;
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.cotizacionForm.controls).forEach(key => {
      const control = this.cotizacionForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(subKey => {
          control.get(subKey)?.markAsTouched();
        });
      }
    });
  }

  resetForm(): void {
    this.cotizacionForm.reset({
      gastosAdministrativos: 2500,
      costoSeguro: 5000
    });
    this.accesoriosFormArray.clear();
    this.versionSeleccionada = null;
    this.errorMessage = '';
  }
}
