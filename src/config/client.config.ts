// ─────────────────────────────────────────────────────────────────────────────
// ARCHIVO PRINCIPAL DE CONFIGURACIÓN DE CLIENTE
//
// Para cambiar de cliente, simplemente cambia el import de abajo:
//   import { turismoConfig as config }    from './turismo.config';
//   import { retailConfig as config }     from './retail.config';
//   import { miClienteConfig as config }  from './micliente.config';
//
// Luego exporta como `clientConfig` y nada más cambia.
// ─────────────────────────────────────────────────────────────────────────────

// import { manufacturaConfig } from './manufactura.config';
// import { turismoConfig } from './turismo.config';
import { retailConfig } from './retail.config';

// export const clientConfig = manufacturaConfig;
// export const clientConfig = turismoConfig;
export const clientConfig = retailConfig;
