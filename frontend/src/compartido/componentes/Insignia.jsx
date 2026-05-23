import { ESTADOS_ORDEN } from '../constantes/estados';

export default function Insignia({ estado }) {
  const config = ESTADOS_ORDEN[estado];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.clases}`}
    >
      <i className={config.icono}></i>
      {config.etiqueta}
    </span>
  );
}
