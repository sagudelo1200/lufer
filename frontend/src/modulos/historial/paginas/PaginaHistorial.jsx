import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContexto } from '../../../contexto/useAppContexto';
import Insignia from '../../../compartido/componentes/Insignia';
import BuscadorPlaca from '../../../compartido/componentes/BuscadorPlaca';

const claseSeccion = 'bg-white rounded-2xl shadow-sm p-4';
const claseTitulo =
  'text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2';
const claseLineaTitulo = 'flex-1 h-px bg-orange-100 self-center';

export default function PaginaHistorial() {
  const { buscarVehiculoPorPlaca, obtenerOrdenesPorPlaca } = useAppContexto();
  const navegar = useNavigate();

  const [placa, setPlaca] = useState('');
  const refPlaca = useRef(null);
  useEffect(() => {
    refPlaca.current?.focus();
  }, []);
  const [vehiculo, setVehiculo] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const buscar = (placaArg) => {
    const p = (placaArg || placa).trim();
    if (!p) return;
    const v = buscarVehiculoPorPlaca(p);
    const o = obtenerOrdenesPorPlaca(p);
    setVehiculo(v);
    setOrdenes([...o].sort((a, b) => b.id - a.id));
    setBuscado(true);
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex items-center gap-2.5 my-4'>
        <i className='fa-solid fa-clock-rotate-left text-orange-500 text-lg'></i>
        <h1 className='text-lg font-bold text-slate-800'>
          Historial de Servicio
        </h1>
      </div>

      <div className='space-y-3'>
        <BuscadorPlaca
          valor={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          onBuscar={buscar}
          inputRef={refPlaca}
        />

        {buscado && !vehiculo && (
          <div className='text-center py-12 text-slate-400 bg-white rounded-2xl shadow-sm'>
            <i className='fa-solid fa-car-burst text-3xl mb-3 block text-slate-300'></i>
            <p className='text-sm font-medium'>
              No se encontró el vehículo{' '}
              <span className='font-bold uppercase text-slate-600'>
                {placa}
              </span>
            </p>
          </div>
        )}

        {vehiculo && (
          <>
            {/* Tarjeta del vehículo */}
            <div className={`${claseSeccion} border-l-4 border-orange-500`}>
              <h2 className={claseTitulo}>
                Vehículo <span className={claseLineaTitulo} />
                <i className='fa-solid fa-car text-orange-300 text-xs' />
              </h2>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0'>
                  <i className='fa-solid fa-car text-orange-500'></i>
                </div>
                <div>
                  <p className='font-bold text-slate-800'>
                    {vehiculo.nombreCliente}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {vehiculo.marcaVehiculo}
                    <span className='font-mono tracking-widest ml-2 font-semibold text-slate-700'>
                      {vehiculo.placa.toUpperCase()}
                    </span>
                  </p>
                  <p className='text-xs text-slate-400 mt-0.5'>
                    <i className='fa-solid fa-phone mr-1'></i>
                    {vehiculo.telefonos.join(' / ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Órdenes de servicio */}
            <div className={claseSeccion}>
              <h2 className={claseTitulo}>
                Órdenes de servicio{' '}
                <span className='text-orange-400 font-normal normal-case text-xs'>
                  ({ordenes.length})
                </span>
                <span className={claseLineaTitulo} />
                <i className='fa-solid fa-clipboard-list text-orange-300 text-xs' />
              </h2>
              {ordenes.length === 0 ? (
                <div className='text-center py-8 text-slate-400'>
                  <i className='fa-solid fa-clipboard text-2xl mb-2 block text-slate-300'></i>
                  <p className='text-sm'>Sin órdenes de servicio registradas</p>
                </div>
              ) : (
                <div className='space-y-2'>
                  {ordenes.map((orden) => (
                    <div
                      key={orden.id}
                      onClick={() => navegar(`/ordenes/${orden.id}`)}
                      className='flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50 cursor-pointer active:scale-[0.98] transition-all duration-100'
                    >
                      <div>
                        <p className='font-mono text-sm font-bold text-slate-700'>
                          #{String(orden.id).slice(-4).padStart(4, '0')}
                        </p>
                        <p className='text-xs text-slate-400 mt-0.5'>
                          <i className='fa-solid fa-calendar mr-1'></i>
                          {orden.fechaCreacion}
                        </p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <Insignia estado={orden.estado} />
                        <i className='fa-solid fa-chevron-right text-slate-300 text-xs'></i>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
