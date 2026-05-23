import { useParams, useNavigate } from 'react-router-dom';
import { useAppContexto } from '../../../contexto/useAppContexto';
import Insignia from '../../../compartido/componentes/Insignia';
import { LISTA_ESTADOS } from '../../../compartido/constantes/estados';
import {
  OPCIONES_LUBRICANTE,
  OPCIONES_ENGRASE_FIL_GAS,
  OPCIONES_CAJA_TRANSMISION,
  OPCIONES_AIRE_AC,
} from '../../../compartido/constantes/servicios';

const etiquetaDe = (opciones, valor) => {
  if (!valor) return null;
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
};

function FilaServicio({ icono, label, valor, subValor }) {
  const activo = valor && valor !== 'NO';
  return (
    <div
      className={`flex items-center gap-2 px-2 py-2 rounded-lg ${activo ? 'bg-emerald-50' : 'opacity-35'}`}
    >
      <i
        className={`${icono} w-4 text-center text-xs ${activo ? 'text-emerald-500' : 'text-slate-300'}`}
      ></i>
      <div className='flex-1 min-w-0'>
        <p
          className={`text-xs font-medium leading-tight ${activo ? 'text-slate-800' : 'text-slate-400'}`}
        >
          {label}
        </p>
        {subValor && (
          <p className='text-[11px] text-emerald-600 font-semibold mt-0'>
            {subValor}
          </p>
        )}
      </div>
      <i
        className={`text-xs ${activo ? 'fa-solid fa-check text-emerald-500' : 'fa-solid fa-minus text-slate-200'}`}
      ></i>
    </div>
  );
}

export default function PaginaDetalleOrden() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { ordenes, actualizarEstadoOrden } = useAppContexto();
  const orden = ordenes.find((o) => String(o.id) === id);

  if (!orden) {
    return (
      <div className='text-center py-20 text-slate-400'>
        <i className='fa-solid fa-file-circle-xmark text-4xl mb-3 block'></i>
        <p>Orden no encontrada</p>
        <button
          onClick={() => navegar(-1)}
          className='mt-4 text-sm text-blue-500 hover:underline'
        >
          Volver
        </button>
      </div>
    );
  }

  const { filtros = {}, lubricantes = {} } = orden;

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <button
        onClick={() => navegar(-1)}
        className='flex items-center gap-1.5 text-slate-400 hover:text-slate-700 mb-2 text-sm font-medium transition-colors'
      >
        <i className='fa-solid fa-arrow-left text-xs'></i> Volver
      </button>

      <div className='flex items-start justify-between mb-2'>
        <div>
          <h1 className='text-lg font-bold text-slate-800'>
            Orden #{String(orden.id).slice(-4).padStart(4, '0')}
          </h1>
          <p className='text-xs font-mono text-slate-500 mt-0 flex items-center gap-2'>
            <i className='fa-solid fa-car-side text-[12px] text-slate-400'></i>
            <span className='truncate'>{orden.placa}</span>
          </p>
          <p className='text-[11px] text-slate-400 mt-0 flex items-center gap-1'>
            <i className='fa-solid fa-calendar mr-1 text-[11px]'></i>
            {orden.fechaCreacion}
          </p>
        </div>
        <Insignia estado={orden.estado} />
      </div>

      {/* Cambio de estado */}
      <div className='bg-white rounded-2xl shadow-sm p-3 mb-2'>
        <p className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2'>
          <i className='fa-solid fa-flag text-[12px] text-slate-400'></i>
          Cambiar estado
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {LISTA_ESTADOS.map(({ valor, etiqueta, icono, clases }) => (
            <button
              key={valor}
              onClick={() => actualizarEstadoOrden(orden.id, valor)}
              className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm border transition-all ${
                orden.estado === valor
                  ? `${clases} border-transparent font-semibold shadow-sm`
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={icono}></i>
              <span className='truncate'>{etiqueta}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Servicios */}
      <div className='bg-white rounded-2xl shadow-sm p-3 mb-2'>
        <p className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2'>
          <i className='fa-solid fa-wrench text-[12px] text-slate-400'></i>
          Servicios a realizar
        </p>
        <div className='space-y-1'>
          <FilaServicio
            icono='fa-solid fa-oil-can'
            label='Lubricante'
            valor={orden.lubricante}
            subValor={
              orden.lubricante === 'SI' && orden.valorLubricante
                ? etiquetaDe(OPCIONES_LUBRICANTE, orden.valorLubricante)
                : null
            }
          />
          <FilaServicio
            icono='fa-solid fa-droplet'
            label='Engrase / Fil. Gasolina'
            valor={orden.engraseFilGasolina}
            subValor={
              orden.engraseFilGasolina === 'SI' && orden.valorEngraseFilGasolina
                ? etiquetaDe(
                    OPCIONES_ENGRASE_FIL_GAS,
                    orden.valorEngraseFilGasolina,
                  )
                : null
            }
          />
          <FilaServicio
            icono='fa-solid fa-gears'
            label='Caja y Transmisión'
            valor={orden.cajaTransmision}
            subValor={
              orden.cajaTransmision
                ? etiquetaDe(OPCIONES_CAJA_TRANSMISION, orden.cajaTransmision)
                : null
            }
          />
          <FilaServicio
            icono='fa-solid fa-wind'
            label='Cambio Aire Acondicionado'
            valor={orden.cambioAireAC}
            subValor={
              orden.cambioAireAC
                ? etiquetaDe(OPCIONES_AIRE_AC, orden.cambioAireAC)
                : null
            }
          />
        </div>
      </div>

      {/* Filtros */}
      <div className='bg-white rounded-2xl shadow-sm p-3 mb-2'>
        <p className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2'>
          <i className='fa-solid fa-filter text-[12px] text-slate-400'></i>
          Filtros
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {[
            { campo: 'fAire', label: 'Filtro Aire', icono: 'fa-solid fa-wind' },
            {
              campo: 'fAceite',
              label: 'Filtro Aceite',
              icono: 'fa-solid fa-droplet',
            },
            {
              campo: 'fGasolina',
              label: 'Filtro Gasolina',
              icono: 'fa-solid fa-gas-pump',
            },
            {
              campo: 'fDiesel',
              label: 'Filtro Diesel',
              icono: 'fa-solid fa-oil-can',
            },
            {
              campo: 'aireAcon',
              label: 'Aire Acondicionado',
              icono: 'fa-solid fa-snowflake',
            },
          ].map(({ campo, label, icono }) => (
            <div key={campo} className='p-2 bg-slate-50 rounded-xl'>
              <div className='flex items-center gap-2'>
                <i className={`${icono} text-slate-400 text-[12px] w-4`}></i>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wide m-0'>
                  {label}
                </p>
              </div>
              <p
                className={`text-sm mt-1 font-medium ${filtros[campo] ? 'text-slate-800' : 'text-slate-300'}`}
              >
                {filtros[campo] || 'No especificado'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lubricantes */}
      <div className='bg-white rounded-2xl shadow-sm p-3'>
        <p className='text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2'>
          <i className='fa-solid fa-oil-can text-[12px] text-slate-400'></i>
          Lubricantes
        </p>
        <div className='space-y-2'>
          {[
            {
              grupo: 'lubMotor',
              label: 'Lubricante Motor',
              icono: 'fa-solid fa-oil-can',
            },
            {
              grupo: 'transCaja',
              label: 'Transmisión y Caja',
              icono: 'fa-solid fa-gears',
            },
            {
              grupo: 'adicionales',
              label: 'Adicionales',
              icono: 'fa-solid fa-plus',
            },
          ].map(({ grupo, label, icono }) => {
            const datos = lubricantes[grupo] ?? {};
            const tieneDatos = datos.marca || datos.cantidad;
            return (
              <div
                key={grupo}
                className={`p-2 rounded-xl ${tieneDatos ? 'bg-blue-50' : 'opacity-35'}`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <i
                      className={`${icono} text-slate-400 text-[14px] w-5`}
                    ></i>
                    <p className='text-sm font-semibold text-slate-700 m-0'>
                      {label}
                    </p>
                  </div>
                </div>

                {tieneDatos ? (
                  <div className='flex items-center justify-between mt-2'>
                    <div className='text-sm font-medium text-slate-800'>
                      {datos.marca || '—'}
                    </div>
                    <div className='text-sm font-medium text-slate-800'>
                      {datos.cantidad || '—'}
                    </div>
                  </div>
                ) : (
                  <p className='text-sm text-slate-300 mt-2'>No especificado</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
