import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContexto } from '../../../contexto/useAppContexto';
import Insignia from '../../../compartido/componentes/Insignia';
import { RUTAS } from '../../../compartido/constantes/rutas';
import { LISTA_ESTADOS } from '../../../compartido/constantes/estados';

const etiquetasServicio = [
  {
    predicate: (o) => o.lubricante === 'SI',
    etiqueta: 'Lubricante',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    predicate: (o) => o.engraseFilGasolina === 'SI',
    etiqueta: 'Engrase',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    predicate: (o) => !!o.cajaTransmision,
    etiqueta: 'Caja',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    predicate: (o) => !!o.cambioAireAC,
    etiqueta: 'A/C',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

export default function PaginaOrdenes() {
  const { ordenes, actualizarEstadoOrden } = useAppContexto();
  const navegar = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('all');

  const ordenadas = [...ordenes].sort((a, b) => b.id - a.id);
  const ordenadasFiltradas =
    filtroEstado === 'all'
      ? ordenadas
      : ordenadas.filter((o) => o.estado === filtroEstado);

  const irAlDetalle = (id) => navegar(`/ordenes/${id}`);

  return (
    <div>
      <div className='flex items-center justify-between my-2'>
        <div>
          <h1 className='text-base font-bold text-slate-800 flex items-center gap-2'>
            <i className='fa-solid fa-clipboard-list text-orange-500'></i>
            Órdenes de Servicio
          </h1>
          <p className='text-slate-400 mt-0 text-xs font-medium'>
            {ordenes.length} orden{ordenes.length !== 1 ? 'es' : ''} registrada
            {ordenes.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className='border rounded-xl px-3 py-2 text-sm bg-white'
          >
            <option value='all'>Todo</option>
            {LISTA_ESTADOS.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.etiqueta}
              </option>
            ))}
          </select>

          <button
            onClick={() => navegar(RUTAS.RECEPCION)}
            className='flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 active:bg-orange-800 transition-all shadow-sm'
          >
            <i className='fa-solid fa-plus'></i>
            <span className='hidden sm:inline'>Nueva recepción</span>
          </button>
        </div>
      </div>

      {/* Mobile: tarjetas */}
      <div className='md:hidden space-y-2'>
        {ordenadasFiltradas.length === 0 ? (
          <div className='text-center py-14 text-slate-400 bg-white rounded-xl border border-slate-200'>
            <i className='fa-solid fa-inbox text-3xl mb-3 block'></i>
            No hay órdenes registradas
          </div>
        ) : (
          ordenadasFiltradas.map((orden) => (
            <div
              key={orden.id}
              onClick={() => irAlDetalle(orden.id)}
              onKeyDown={(e) => e.key === 'Enter' && irAlDetalle(orden.id)}
              role='button'
              tabIndex={0}
              className='bg-white rounded-2xl shadow-sm p-3 transition-all cursor-pointer'
            >
              <div className='flex items-center justify-between mb-1'>
                <span className='font-bold text-slate-800 uppercase tracking-widest text-base'>
                  {orden.placa}
                </span>
                <Insignia estado={orden.estado} />
              </div>

              <div className='flex gap-1 flex-wrap mb-2'>
                {etiquetasServicio.map(({ predicate, etiqueta, color }) =>
                  predicate(orden) ? (
                    <span
                      key={etiqueta}
                      className={`text-xs px-1.5 py-0.5 rounded font-medium ${color}`}
                    >
                      {etiqueta}
                    </span>
                  ) : null,
                )}
              </div>

              <div className='flex items-center justify-between text-[11px]'>
                <span className='font-mono text-[11px] text-slate-400'>
                  #{String(orden.id).slice(-4).padStart(4, '0')}
                </span>
                <span className='text-[11px] text-slate-400 flex items-center gap-1'>
                  <i className='fa-solid fa-calendar mr-1 text-[11px]'></i>
                  {orden.fechaCreacion}
                </span>
              </div>

              <div className='mt-3 flex items-center gap-2'>
                {orden.estado !== 'terminado' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actualizarEstadoOrden(orden.id, 'terminado');
                    }}
                    className='ml-auto text-[13px] py-1 px-2 rounded-md bg-emerald-600 text-white flex items-center gap-2'
                  >
                    <i className='fa-solid fa-check text-[12px]'></i>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet+: tabla */}
      <div className='hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden'>
        <table className='w-full text-xs'>
          <thead className='bg-slate-50/80 border-b border-slate-100'>
            <tr>
              <th className='text-left px-3 py-2 font-medium text-slate-500 text-xs uppercase tracking-wide'>
                # Orden
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-500 text-xs uppercase tracking-wide'>
                Placa
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-500 text-xs uppercase tracking-wide'>
                Servicios
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-500 text-xs uppercase tracking-wide'>
                Estado
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-500 text-xs uppercase tracking-wide'>
                Fecha
              </th>
              <th className='px-3 py-2'></th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100'>
            {ordenadasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className='text-center py-14 text-slate-400'>
                  <i className='fa-solid fa-inbox text-3xl mb-3 block'></i>
                  No hay órdenes registradas
                </td>
              </tr>
            ) : (
              ordenadasFiltradas.map((orden) => (
                <tr
                  key={orden.id}
                  onClick={() => irAlDetalle(orden.id)}
                  className='hover:bg-slate-50 cursor-pointer transition-colors'
                >
                  <td className='px-3 py-2 font-mono text-slate-400 text-xs'>
                    #{String(orden.id).slice(-4).padStart(4, '0')}
                  </td>
                  <td className='px-3 py-2 font-bold text-slate-800 uppercase tracking-wider'>
                    {orden.placa}
                  </td>
                  <td className='px-3 py-2'>
                    <div className='flex gap-1 flex-wrap'>
                      {etiquetasServicio.map(
                        ({ predicate, etiqueta, color }) =>
                          predicate(orden) ? (
                            <span
                              key={etiqueta}
                              className={`text-[11px] px-1 py-0.5 rounded font-medium ${color}`}
                            >
                              {etiqueta}
                            </span>
                          ) : null,
                      )}
                    </div>
                  </td>
                  <td className='px-3 py-2'>
                    <Insignia estado={orden.estado} />
                  </td>
                  <td className='px-3 py-2 text-slate-400 text-xs'>
                    {orden.fechaCreacion}
                  </td>
                  <td className='px-3 py-2'>
                    <i className='fa-solid fa-chevron-right text-slate-300 text-xs'></i>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
