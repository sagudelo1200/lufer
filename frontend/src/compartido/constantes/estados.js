export const ESTADOS_ORDEN = {
  recibido: {
    etiqueta: 'Recibido',
    clases: 'bg-sky-100 text-sky-700',
    icono: 'fa-solid fa-inbox',
  },
  en_proceso: {
    etiqueta: 'En proceso',
    clases: 'bg-amber-100 text-amber-700',
    icono: 'fa-solid fa-wrench',
  },
  terminado: {
    etiqueta: 'Terminado',
    clases: 'bg-emerald-100 text-emerald-700',
    icono: 'fa-solid fa-circle-check',
  },
  entregado: {
    etiqueta: 'Entregado',
    clases: 'bg-slate-100 text-slate-500',
    icono: 'fa-solid fa-flag-checkered',
  },
};

export const LISTA_ESTADOS = Object.entries(ESTADOS_ORDEN).map(
  ([valor, config]) => ({
    valor,
    ...config,
  }),
);
