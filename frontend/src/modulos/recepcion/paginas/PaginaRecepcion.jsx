import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContexto } from '../../../contexto/useAppContexto';
import { RUTAS } from '../../../compartido/constantes/rutas';
import BuscadorPlaca from '../../../compartido/componentes/BuscadorPlaca';
import {
  OPCIONES_LUBRICANTE,
  OPCIONES_ENGRASE_FIL_GAS,
  OPCIONES_CAJA_TRANSMISION,
  OPCIONES_AIRE_AC,
} from '../../../compartido/constantes/servicios';
import { REGEX_CARRO, REGEX_MOTO } from '../../../compartido/constantes/placas';

const vehiculoVacio = {
  placa: '',
  cedula: '',
  nombreCliente: '',
  telefonos: '',
  marcaVehiculo: '',
};

const serviciosVacios = {
  lubricante: 'SI',
  valorLubricante: '',
  engraseFilGasolina: 'NO',
  valorEngraseFilGasolina: '',
  cajaTransmision: '',
  cambioAireAC: '',
  filtros: { fAire: '', fAceite: '', fGasolina: '', fDiesel: '', aireAcon: '' },
  lubricantes: {
    lubMotor: { marca: '', cantidad: '' },
    transCaja: { marca: '', cantidad: '' },
    adicionales: { marca: '', cantidad: '' },
  },
  lubricadorTecnico: '',
};

const serviciosMotoVacios = {
  aceite: '',
  servicio: '',
  factura: '',
  lubricador: '',
};

// Lista de técnicos que pueden prestar servicio (ajustar según datos reales)
const TECNICOS = [
  { id: 'carlos', nombre: 'Carlos' },
  { id: 'juan', nombre: 'Juan' },
  { id: 'maria', nombre: 'María' },
  { id: 'andres', nombre: 'Andrés' },
];

const claseInput =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all bg-white';
const claseSelect =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all bg-white';
const claseLabel =
  'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5';
const claseSeccion = 'bg-white rounded-2xl shadow-sm p-4';
const claseTitulo =
  'text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2';
const claseLineaTitulo = 'flex-1 h-px bg-orange-100 self-center';

export default function PaginaRecepcion() {
  const { buscarVehiculoPorPlaca, agregarVehiculo, crearOrden } =
    useAppContexto();
  const navegar = useNavigate();
  const [vehiculo, setVehiculo] = useState(vehiculoVacio);
  const [servicios, setServicios] = useState(serviciosVacios);
  const [vehiculoExistente, setVehiculoExistente] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [errorPlaca, setErrorPlaca] = useState('');
  const [erroresEnvio, setErroresEnvio] = useState({});
  const [serviciosMoto, setServiciosMoto] = useState(serviciosMotoVacios);
  const esMoto = REGEX_MOTO.test(vehiculo.placa.trim().toUpperCase());
  const refPlaca = useRef(null);
  const formRef = useRef(null);
  const fieldRefs = useRef({});
  useEffect(() => {
    refPlaca.current?.focus();
  }, []);

  const buscarVehiculo = (placaArg) => {
    const placa = (placaArg || vehiculo.placa).trim().toUpperCase();
    if (!placa) return;
    if (!REGEX_CARRO.test(placa) && !REGEX_MOTO.test(placa)) {
      setErrorPlaca('Formato inválido. Use LLLNNN (carro) o LLLNNL (moto).');
      return;
    }
    setErrorPlaca('');
    const encontrado = buscarVehiculoPorPlaca(placa);
    if (encontrado) {
      setVehiculo({
        placa: encontrado.placa,
        cedula: encontrado.cedula || '',
        nombreCliente: encontrado.nombreCliente,
        telefonos: encontrado.telefonos.join(', '),
        marcaVehiculo: encontrado.marcaVehiculo,
      });
      setVehiculoExistente(true);
    } else {
      setVehiculoExistente(false);
    }
    setBuscado(true);
  };

  const manejarCambioVehiculo = (e) => {
    const { name, value } = e.target;
    if (name === 'placa') {
      // Al editar la placa se limpia el formulario
      setBuscado(false);
      setVehiculoExistente(false);
      setErrorPlaca('');
      setVehiculo({ ...vehiculoVacio, placa: value.toUpperCase() });
      setServicios(serviciosVacios);
      setServiciosMoto(serviciosMotoVacios);
      return;
    }
    setVehiculo((prev) => ({ ...prev, [name]: value }));
  };
  const manejarServicio = (e) => {
    const { name, value } = e.target;
    setServicios((prev) => ({ ...prev, [name]: value }));
  };
  const manejarFiltro = (e) => {
    const { name, value } = e.target;
    setServicios((prev) => ({
      ...prev,
      filtros: { ...prev.filtros, [name]: value },
    }));
  };
  const manejarLubricante = (grupo, campo, valor) => {
    setServicios((prev) => ({
      ...prev,
      lubricantes: {
        ...prev.lubricantes,
        [grupo]: { ...prev.lubricantes[grupo], [campo]: valor },
      },
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    // check native validity first (required fields, etc.)
    if (formRef.current) {
      const invalid = formRef.current.querySelector(':invalid');
      if (invalid) {
        const name = invalid.name || 'form';
        setErroresEnvio({ [name]: 'Campo obligatorio' });
        setTimeout(() => {
          try {
            invalid.focus();
            invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (err) {
            console.debug('focus invalid failed', err);
          }
        }, 0);
        return;
      }
    }
    const placaFinal = vehiculo.placa.toUpperCase().trim();
    const isMoto = REGEX_MOTO.test(placaFinal);
    if (!isMoto) {
      const errs = {};
      if (servicios.lubricante === 'SI' && !servicios.valorLubricante)
        errs.valorLubricante = 'Selecciona el valor del servicio';
      if (
        servicios.engraseFilGasolina === 'SI' &&
        !servicios.valorEngraseFilGasolina
      )
        errs.valorEngraseFilGasolina = 'Selecciona el valor del servicio';
      if (Object.keys(errs).length) {
        setErroresEnvio(errs);
        // focus the first invalid field
        setTimeout(() => {
          const first = Object.keys(errs)[0];
          const el =
            fieldRefs.current[first] ||
            (formRef.current &&
              formRef.current.querySelector(`[name="${first}"]`));
          if (el && el.focus) {
            try {
              el.focus();
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (err) {
              console.debug('focus first error field failed', err);
            }
          }
        }, 0);
        return;
      }
      setErroresEnvio({});
    }
    const datosVehiculo = {
      ...vehiculo,
      placa: placaFinal,
      telefonos: vehiculo.telefonos
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (!vehiculoExistente) agregarVehiculo(datosVehiculo);
    if (isMoto) {
      crearOrden({
        placa: datosVehiculo.placa,
        estado: 'recibido',
        tipoVehiculo: 'moto',
        aceite: serviciosMoto.aceite,
        servicio: serviciosMoto.servicio,
        factura: serviciosMoto.factura,
        lubricador: serviciosMoto.lubricador,
      });
    } else {
      crearOrden({
        placa: datosVehiculo.placa,
        estado: 'recibido',
        lubricante: servicios.lubricante,
        valorLubricante:
          servicios.lubricante === 'SI' ? servicios.valorLubricante : '',
        engraseFilGasolina: servicios.engraseFilGasolina,
        valorEngraseFilGasolina:
          servicios.engraseFilGasolina === 'SI'
            ? servicios.valorEngraseFilGasolina
            : '',
        cajaTransmision: servicios.cajaTransmision,
        cambioAireAC: servicios.cambioAireAC,
        filtros: { ...servicios.filtros },
        lubricantes: {
          lubMotor: { ...servicios.lubricantes.lubMotor },
          transCaja: { ...servicios.lubricantes.transCaja },
          adicionales: { ...servicios.lubricantes.adicionales },
        },
        lubricador: servicios.lubricadorTecnico,
      });
    }
    navegar(RUTAS.ORDENES);
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex items-center gap-2.5 my-4'>
        <i className='fa-solid fa-car-side text-orange-500 text-lg'></i>
        <h1 className='text-lg font-bold text-slate-800'>
          Recepción de Vehículo
        </h1>
      </div>

      <form ref={formRef} onSubmit={manejarEnvio} className='space-y-3'>
        {/* Búsqueda por placa */}
        <BuscadorPlaca
          valor={vehiculo.placa}
          onChange={manejarCambioVehiculo}
          onBuscar={buscarVehiculo}
          inputRef={refPlaca}
          error={errorPlaca}
          inputProps={{ name: 'placa' }}
        >
          {buscado && !errorPlaca && (
            <>
              <div className='mt-3'>
                <label className={claseLabel}>
                  Marca del vehículo <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='marcaVehiculo'
                  value={vehiculo.marcaVehiculo}
                  onChange={manejarCambioVehiculo}
                  required
                  placeholder='Ej: Toyota, Chevrolet'
                  className={claseInput}
                />
                {erroresEnvio.marcaVehiculo && (
                  <p className='mt-1 text-xs text-red-500'>
                    <i className='fa-solid fa-circle-exclamation fa-bounce mr-1' />
                    {erroresEnvio.marcaVehiculo}
                  </p>
                )}
              </div>
              <p
                className={`mt-2.5 text-xs font-medium ${
                  vehiculoExistente ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                <i
                  className={`mr-1 ${
                    vehiculoExistente
                      ? 'fa-solid fa-circle-check'
                      : 'fa-solid fa-circle-exclamation'
                  }`}
                ></i>
                {vehiculoExistente
                  ? 'Vehículo encontrado — datos cargados automáticamente.'
                  : 'Vehículo nuevo — completa los datos del cliente.'}
              </p>
            </>
          )}
        </BuscadorPlaca>

        {buscado && (
          <>
            {/* Datos del cliente */}
            <div className={claseSeccion}>
              <h2 className={claseTitulo}>
                Datos del cliente <span className={claseLineaTitulo} />
                <i className='fa-solid fa-user text-orange-300 text-xs' />
              </h2>
              <div className='space-y-3'>
                <div>
                  <label className={claseLabel}>
                    Nombre del cliente <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    name='nombreCliente'
                    value={vehiculo.nombreCliente}
                    onChange={manejarCambioVehiculo}
                    required
                    className={claseInput}
                  />
                </div>
                <div>
                  <label className={claseLabel}>
                    Cédula{' '}
                    <span className='text-slate-400 normal-case font-normal'>
                      (opcional)
                    </span>
                  </label>
                  <input
                    type='text'
                    name='cedula'
                    value={vehiculo.cedula}
                    onChange={manejarCambioVehiculo}
                    placeholder='Ej: 1234567890'
                    className={claseInput}
                  />
                </div>
                <div>
                  <label className={claseLabel}>
                    Teléfonos{' '}
                    <span className='text-slate-400 normal-case font-normal'>
                      (separados por coma)
                    </span>
                  </label>
                  <input
                    type='text'
                    name='telefonos'
                    value={vehiculo.telefonos}
                    onChange={manejarCambioVehiculo}
                    placeholder='Ej: 3001234567, 6012345678'
                    className={claseInput}
                  />
                </div>
              </div>
            </div>

            {esMoto ? (
              /* ── Formulario MOTO ── */
              <div className={claseSeccion}>
                <h2 className={claseTitulo}>
                  Servicio Moto <span className={claseLineaTitulo} />
                  <i className='fa-solid fa-motorcycle text-orange-300 text-xs' />
                </h2>
                <div className='space-y-3'>
                  {/* Aceite */}
                  <div>
                    <label className={claseLabel}>Aceite</label>
                    <input
                      type='text'
                      value={serviciosMoto.aceite}
                      onChange={(e) =>
                        setServiciosMoto((p) => ({
                          ...p,
                          aceite: e.target.value,
                        }))
                      }
                      placeholder='Tipo de aceite'
                      className={claseInput}
                    />
                  </div>
                  {/* Servicio — 2 botones exclusivos */}
                  <div>
                    <label className={claseLabel}>Servicio</label>
                    <div className='flex gap-2'>
                      {['5000', '12800'].map((val) => (
                        <button
                          key={val}
                          type='button'
                          onClick={() =>
                            setServiciosMoto((p) => ({ ...p, servicio: val }))
                          }
                          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                            serviciosMoto.servicio === val
                              ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                          }`}
                        >
                          {parseInt(val).toLocaleString('es-CO')}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Factura */}
                  <div>
                    <label className={claseLabel}>Factura</label>
                    <input
                      type='text'
                      value={serviciosMoto.factura}
                      onChange={(e) =>
                        setServiciosMoto((p) => ({
                          ...p,
                          factura: e.target.value,
                        }))
                      }
                      placeholder='Número de factura'
                      className={claseInput}
                    />
                  </div>
                  {/* Lubricador */}
                  <div>
                    <label className={claseLabel}>Lubricador</label>
                    <select
                      value={serviciosMoto.lubricador}
                      onChange={(e) =>
                        setServiciosMoto((p) => ({
                          ...p,
                          lubricador: e.target.value,
                        }))
                      }
                      className={claseSelect}
                    >
                      <option value=''>-----</option>
                      {TECNICOS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Servicios */}
                <div className={claseSeccion}>
                  <h2 className={claseTitulo}>
                    Servicios a realizar <span className={claseLineaTitulo} />
                    <i className='fa-solid fa-wrench text-orange-300 text-xs' />
                  </h2>
                  <div className='space-y-4'>
                    {/* Lubricante */}
                    <div className='flex items-center gap-3 py-1'>
                      <button
                        type='button'
                        onClick={() =>
                          manejarServicio({
                            target: {
                              name: 'lubricante',
                              value:
                                servicios.lubricante === 'SI' ? 'NO' : 'SI',
                            },
                          })
                        }
                        className='cursor-pointer shrink-0'
                      >
                        <span
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            servicios.lubricante === 'SI'
                              ? 'bg-orange-500'
                              : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              servicios.lubricante === 'SI'
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </span>
                      </button>
                      <label
                        className='flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer flex-1'
                        onClick={() =>
                          manejarServicio({
                            target: {
                              name: 'lubricante',
                              value:
                                servicios.lubricante === 'SI' ? 'NO' : 'SI',
                            },
                          })
                        }
                      >
                        <i className='fa-solid fa-oil-can text-slate-400'></i>
                        Lubricante
                      </label>
                      {/* Select valor Lubricante — siempre en DOM para no cambiar altura */}
                      <div className='relative'>
                        <select
                          name='valorLubricante'
                          ref={(el) => (fieldRefs.current.valorLubricante = el)}
                          value={servicios.valorLubricante}
                          onChange={(e) => {
                            manejarServicio(e);
                            setErroresEnvio((p) => ({
                              ...p,
                              valorLubricante: '',
                            }));
                          }}
                          className={`w-36 border rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all bg-white ${
                            servicios.lubricante !== 'SI'
                              ? 'invisible pointer-events-none'
                              : erroresEnvio.valorLubricante
                                ? 'border-red-400'
                                : 'border-slate-200'
                          }`}
                        >
                          <option value=''>--- Valor ---</option>
                          {OPCIONES_LUBRICANTE.map((op) => (
                            <option key={op.valor} value={op.valor}>
                              {op.etiqueta}
                            </option>
                          ))}
                        </select>
                        {servicios.lubricante === 'SI' &&
                          erroresEnvio.valorLubricante && (
                            <p className='absolute -bottom-4 right-0 text-[10px] text-red-500 whitespace-nowrap flex items-center gap-1'>
                              <i className='fa-solid fa-circle-exclamation fa-bounce' />
                              <span className='ml-1'>
                                {erroresEnvio.valorLubricante}
                              </span>
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Engrase / Filtro gasolina */}
                    <div className='flex items-center gap-3 py-1'>
                      <button
                        type='button'
                        onClick={() =>
                          manejarServicio({
                            target: {
                              name: 'engraseFilGasolina',
                              value:
                                servicios.engraseFilGasolina === 'SI'
                                  ? 'NO'
                                  : 'SI',
                            },
                          })
                        }
                        className='cursor-pointer shrink-0'
                      >
                        <span
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                            servicios.engraseFilGasolina === 'SI'
                              ? 'bg-orange-500'
                              : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              servicios.engraseFilGasolina === 'SI'
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </span>
                      </button>
                      <label
                        className='flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wide cursor-pointer flex-1'
                        onClick={() =>
                          manejarServicio({
                            target: {
                              name: 'engraseFilGasolina',
                              value:
                                servicios.engraseFilGasolina === 'SI'
                                  ? 'NO'
                                  : 'SI',
                            },
                          })
                        }
                      >
                        <i className='fa-solid fa-droplet text-slate-400'></i>
                        Engrase / Fil. Gasolina
                      </label>
                      {/* Select valor Engrase — siempre en DOM para no cambiar altura */}
                      <div className='relative'>
                        <select
                          name='valorEngraseFilGasolina'
                          ref={(el) =>
                            (fieldRefs.current.valorEngraseFilGasolina = el)
                          }
                          value={servicios.valorEngraseFilGasolina}
                          onChange={(e) => {
                            manejarServicio(e);
                            setErroresEnvio((p) => ({
                              ...p,
                              valorEngraseFilGasolina: '',
                            }));
                          }}
                          className={`w-36 border rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all bg-white ${
                            servicios.engraseFilGasolina !== 'SI'
                              ? 'invisible pointer-events-none'
                              : erroresEnvio.valorEngraseFilGasolina
                                ? 'border-red-400'
                                : 'border-slate-200'
                          }`}
                        >
                          <option value=''>--- Valor ---</option>
                          {OPCIONES_ENGRASE_FIL_GAS.map((op) => (
                            <option key={op.valor} value={op.valor}>
                              {op.etiqueta}
                            </option>
                          ))}
                        </select>
                        {servicios.engraseFilGasolina === 'SI' &&
                          erroresEnvio.valorEngraseFilGasolina && (
                            <p className='absolute -bottom-4 right-0 text-[10px] text-red-500 whitespace-nowrap flex items-center gap-1'>
                              <i className='fa-solid fa-circle-exclamation fa-bounce' />
                              <span className='ml-1'>
                                {erroresEnvio.valorEngraseFilGasolina}
                              </span>
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Caja / Aire AC */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div>
                        <label className={claseLabel}>
                          <i className='fa-solid fa-gears mr-1.5 text-slate-400'></i>{' '}
                          Caja y Transmisión
                        </label>
                        <select
                          name='cajaTransmision'
                          value={servicios.cajaTransmision}
                          onChange={manejarServicio}
                          className={claseSelect}
                        >
                          <option value=''>-----</option>
                          {OPCIONES_CAJA_TRANSMISION.map((op) => (
                            <option key={op.valor} value={op.valor}>
                              {op.etiqueta}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={claseLabel}>
                          <i className='fa-solid fa-wind mr-1.5 text-slate-400'></i>{' '}
                          Cambio Aire Acondicionado
                        </label>
                        <select
                          name='cambioAireAC'
                          value={servicios.cambioAireAC}
                          onChange={manejarServicio}
                          className={claseSelect}
                        >
                          <option value=''>-----</option>
                          {OPCIONES_AIRE_AC.map((op) => (
                            <option key={op.valor} value={op.valor}>
                              {op.etiqueta}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* Seleccionar lubricador técnico para carro */}
                  <div className='mt-3'>
                    <label className={claseLabel}>Lubricador</label>
                    <select
                      name='lubricadorTecnico'
                      value={servicios.lubricadorTecnico}
                      onChange={(e) => manejarServicio(e)}
                      className={claseSelect}
                    >
                      <option value=''>-----</option>
                      {TECNICOS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtros */}
                <div className={claseSeccion}>
                  <h2 className={claseTitulo}>
                    Filtros <span className={claseLineaTitulo} />
                    <i className='fa-solid fa-filter text-orange-300 text-xs' />
                  </h2>
                  <div className='grid grid-cols-2 gap-3'>
                    {[
                      {
                        name: 'fAire',
                        label: 'Filtro de Aire',
                        icon: 'fa-solid fa-wind',
                      },
                      {
                        name: 'fAceite',
                        label: 'Filtro de Aceite',
                        icon: 'fa-solid fa-oil-can',
                      },
                      {
                        name: 'fGasolina',
                        label: 'Filtro de Gasolina',
                        icon: 'fa-solid fa-gas-pump',
                      },
                      {
                        name: 'fDiesel',
                        label: 'Filtro Diesel',
                        icon: 'fa-solid fa-gas-pump',
                      },
                      {
                        name: 'aireAcon',
                        label: 'Filtro Aire Acondicionado',
                        icon: 'fa-solid fa-snowflake',
                      },
                    ].map(({ name, label, icon }) => (
                      <div key={name}>
                        <label className={claseLabel}>
                          <i className={`${icon} mr-1.5 text-slate-400`}></i>
                          {label}
                        </label>
                        <input
                          type='text'
                          name={name}
                          value={servicios.filtros[name]}
                          onChange={manejarFiltro}
                          placeholder='Referencia'
                          className={claseInput}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lubricantes */}
                <div className={claseSeccion}>
                  <h2 className={claseTitulo}>
                    Lubricantes <span className={claseLineaTitulo} />
                    <i className='fa-solid fa-oil-can text-orange-300 text-xs' />
                  </h2>
                  <div className='space-y-4'>
                    {[
                      {
                        grupo: 'lubMotor',
                        label: 'Lubricante Motor',
                        icon: 'fa-solid fa-oil-can',
                      },
                      {
                        grupo: 'transCaja',
                        label: 'Transmisión / Caja',
                        icon: 'fa-solid fa-gears',
                      },
                      {
                        grupo: 'adicionales',
                        label: 'Adicionales',
                        icon: 'fa-solid fa-plus',
                      },
                    ].map(({ grupo, label, icon }) => (
                      <div key={grupo}>
                        <p className='text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2'>
                          <i className={`${icon} mr-1.5 text-slate-400`}></i>
                          {label}
                        </p>
                        <div className='grid grid-cols-2 gap-3'>
                          <div>
                            <label className={claseLabel}>Marca</label>
                            <input
                              type='text'
                              value={servicios.lubricantes[grupo].marca}
                              onChange={(e) =>
                                manejarLubricante(
                                  grupo,
                                  'marca',
                                  e.target.value,
                                )
                              }
                              placeholder='Ej: MOTORLINE SAE 10w40'
                              className={claseInput}
                            />
                          </div>
                          <div>
                            <label className={claseLabel}>Cantidad</label>
                            <input
                              type='text'
                              value={servicios.lubricantes[grupo].cantidad}
                              onChange={(e) =>
                                manejarLubricante(
                                  grupo,
                                  'cantidad',
                                  e.target.value,
                                )
                              }
                              placeholder='Ej: 2 cuartos/galones'
                              className={claseInput}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type='submit'
              className='w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-3.5 rounded-2xl transition-all text-sm shadow-sm'
              style={{
                marginBottom: 'calc(56px + env(safe-area-inset-bottom) + 8px)',
              }}
            >
              <i className='fa-solid fa-circle-plus mr-2'></i>
              Registrar ingreso y crear orden
            </button>
          </>
        )}
      </form>
    </div>
  );
}
