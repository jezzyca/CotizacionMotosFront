export interface CotizacionRequest {
    idVersion: number;
    cliente: Cliente;
    montoEnganche: number;
    gastosAdministrativos: number;
    costoSeguro: number;
    accesorios?: AccesorioSeleccionado[];
}

export interface Cliente{
    idCliente?: number;
    nombre: string;
    telefono: string;
    email:string;
}

export interface AccesorioSeleccionado {
    idAccesorio: number;
    cantidad: number;
}

export interface CotizacionResponse {
    idCotizacion: number;
    modelo: string;
    version: string;
    fechaCotizacion: string;
    costos: CostosDesglosados;
    costoTotal: number;
    montoEnganche: number;
    porcentajeEnganche: number;
    montoFinanciar: number;
    opcionesFinanciamiento: Financiamiento[];
    cliente: Cliente;
    accesorios: Accesorio[];
}

export interface CostosDesglosados {
    precioSinIva: number;
    iva: number;
    precioConIva: number;
    gastosAdministrativos: number;
    costoSeguro: number;
    costoAccesorios: number;
}

export interface Financiamiento {
    plazoMeses: number;
    tasaInteres: number;
    pagoMensual: number;
    totalIntereses: number;
    totalPagar: number;
}

export interface Accesorio {
    idAccesorio: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad?: number;
    subtotal?: number;
}

export interface VersionMoto {
    idVersion: number;
    nombreVersion: string;
    precioBase: number;
    descripcion: string;
    modeloNombre: string;
    marca: string;
    anio: number;
}

export interface ModeloMoto {
    idModelo: number;
    nombre: string;
    marca: string;
    anio: number;
    versiones?: VersionMoto[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}