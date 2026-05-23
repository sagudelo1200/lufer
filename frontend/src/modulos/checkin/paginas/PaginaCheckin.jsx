import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscadorPlaca from '../../../compartido/componentes/BuscadorPlaca';
import { useAppContexto } from '../../../contexto/useAppContexto';
import { REGEX_CARRO, REGEX_MOTO } from '../../../compartido/constantes/placas';

const claseSeccion = 'bg-white rounded-2xl shadow-sm p-4';
const claseTitulo =
  'text-sm font-bold text-orange-600 uppercase tracking-wide mb-3 flex items-center gap-2';
const claseLineaTitulo = 'flex-1 h-px bg-orange-100 self-center';
const claseLabel =
  'block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5';
const claseSelect =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 tranSition-all bg-white';
const claseInput =
  'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 tranSition-all bg-white';

// REGEX_PLACA imported from shared constants

export default function PaginaCheckin() {
  const refPlaca = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    refPlaca.current?.focus();
  }, []);

  // Prepare canvas size and drawing context
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = c.clientWidth;
      const height = c.clientHeight;
      c.width = Math.floor(width * ratio);
      c.height = Math.floor(height * ratio);
      const ctx = c.getContext('2d');
      ctx.scale(ratio, ratio);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#111827';
      c.style.display = 'block';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPointerPos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    // Prefer offset coordinates when available (more precise)
    if (typeof e.offsetX === 'number' && typeof e.offsetY === 'number') {
      return { x: e.offsetX, y: e.offsetY };
    }
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    // Pointer or touch start
    e.preventDefault?.();
    const ev = e.nativeEvent || e;
    const pos = getPointerPos(ev);
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    isDrawingRef.current = true;
    lastPosRef.current = pos;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    // pointer capture if available
    const tid = ev.pointerId;
    try {
      if (
        canvasRef.current &&
        typeof tid !== 'undefined' &&
        canvasRef.current.setPointerCapture
      )
        canvasRef.current.setPointerCapture(tid);
    } catch (err) {
      console.debug('setPointerCapture failed', err);
    }
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault?.();
    const ev = e.nativeEvent || e;
    const pos = getPointerPos(ev);
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPosRef.current = pos;
  };

  const stopDrawing = (e) => {
    if (!isDrawingRef.current) return;
    e && e.preventDefault?.();
    isDrawingRef.current = false;
    const c = canvasRef.current;
    const ctx = c.getContext('2d');
    ctx.closePath();
    // save dataURL to form
    try {
      const data = c.toDataURL('image/png');
      setForm((p) => ({ ...p, out_firmaCliente: data }));
    } catch (err) {
      console.debug('toDataURL failed', err);
    }
    const ev = e && (e.nativeEvent || e);
    const tid = ev && ev.pointerId;
    try {
      if (
        canvasRef.current &&
        typeof tid !== 'undefined' &&
        canvasRef.current.releasePointerCapture
      )
        canvasRef.current.releasePointerCapture(tid);
    } catch (err) {
      console.debug('releasePointerCapture failed', err);
    }
  };

  const clearSignature = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    setForm((p) => ({ ...p, out_firmaCliente: '' }));
  };

  const opciones = {
    nivelAceite: ['Ok', 'Bajo', 'Riesgo'],
    estadoVarilla: ['Ok', 'Aceptable', 'Defectuosa'],
    estadoTapaAceite: ['Ok', 'Aceptable', 'Defectuosa'],
    filtroAceiteCombustible: ['Ok', 'Aceptable', 'Defectuosa'],
    manguerasAdmiSion: ['Ok', 'Aceptable', 'Defectuosa'],
    fugasOGoteos: ['No', 'Si'],
    manguerasCristalizadas: ['No', 'Si', 'Defectuosa'],
    motorRecalentado: ['No', 'Si'],
    taponCarter: ['Ok', 'Aceptable', 'Defectuoso'],
    estadoCarter: ['Ok', 'Aceptable', 'Defectuoso'],
    estadoVisualAceite: ['Normal', 'Lodoso Limalla'],
    taponCajaTransmiSion: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    carcasaCajaTransmiSion: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    nivelAceiteCaja: ['No Aplica', 'Ok', 'Bajo', 'Riesgo'],
    estadoGraseras: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    estadoManguerasAcoples: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    estadoVasosSensores: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    estCarcasaTapaFiltroAire: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
    estCarcasaTapafiltroAceite: ['No Aplica', 'Ok', 'Aceptable', 'Defectuosa'],
  };

  const inicial = {
    placa: '',
    fecha: new Date().toISOString().slice(0, 10),
    nivelAceite: opciones.nivelAceite[0],
    estadoVarilla: opciones.estadoVarilla[0],
    estadoTapaAceite: opciones.estadoTapaAceite[0],
    filtroAceiteCombustible: opciones.filtroAceiteCombustible[0],
    manguerasAdmiSion: opciones.manguerasAdmiSion[0],
    fugasOGoteos: opciones.fugasOGoteos[0],
    manguerasCristalizadas: opciones.manguerasCristalizadas[0],
    motorRecalentado: opciones.motorRecalentado[0],
    taponCarter: opciones.taponCarter[0],
    estadoCarter: opciones.estadoCarter[0],
    estadoVisualAceite: opciones.estadoVisualAceite[0],
    taponCajaTransmiSion: opciones.taponCajaTransmiSion[0],
    carcasaCajaTransmiSion: opciones.carcasaCajaTransmiSion[0],
    nivelAceiteCaja: opciones.nivelAceiteCaja[0],
    estadoGraseras: opciones.estadoGraseras[0],
    estadoManguerasAcoples: opciones.estadoManguerasAcoples[0],
    estadoVasosSensores: opciones.estadoVasosSensores[0],
    estCarcasaTapaFiltroAire: opciones.estCarcasaTapaFiltroAire[0],
    estCarcasaTapafiltroAceite: opciones.estCarcasaTapafiltroAceite[0],
    // Checkout fields (Check-out)
    out_nivelAceiteEntregado: ['Conforme', 'No Conforme'][0],
    out_nivelAceiteCaja: ['No Aplica', 'Conforme', 'No Conforme'][0],
    out_engrase: ['No Aplica', 'Conforme', 'No Conforme'][0],
    out_entregaVarilla: ['Conforme', 'No Conforme'][0],
    out_entregaTapaAceite: ['Conforme', 'No Conforme'][0],
    out_entregaCarcasasFiltros: ['No Aplica', 'Conforme', 'No Conforme'][0],
    out_libreFugas: ['Si', 'No'][0],
    out_bloqueMotorLibre: ['Si', 'No'][0],
    out_firmaCliente: '',
  };

  const [form, setForm] = useState(inicial);
  const [modo, setModo] = useState('in'); // 'in' = checkin, 'out' = checkout
  // Mantener foco en el buscador de placa al cambiar entre modos (in/out)
  useEffect(() => {
    const t = setTimeout(() => refPlaca.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [modo]);
  const [errores, setErrores] = useState({});
  const [Ok, setOk] = useState('');
  const navigate = useNavigate();
  const {
    buscarVehiculoPorPlaca,
    obtenerOrdenesPorPlaca,
    crearOrden,
    actualizarOrden,
  } = useAppContexto();
  const [vehiculo, setVehiculo] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const cambiar = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrores((p) => ({ ...p, [name]: '' }));
    setOk('');
  };

  const manejarCambioPlaca = (value) => {
    // Al editar la placa ocultamos el detalle relacionado
    setForm((p) => ({ ...p, placa: value }));
    setBuscado(false);
    setVehiculo(null);
    setOrdenes([]);
    setErrores((p) => ({ ...p, placa: '' }));
    setOk('');
  };

  const validar = () => {
    const e = {};
    if (
      !form.placa ||
      !(
        REGEX_CARRO.test(form.placa.trim().toUpperCase()) ||
        REGEX_MOTO.test(form.placa.trim().toUpperCase())
      )
    )
      e.placa = 'Placa inválida. Formato LLLNNN o LLLNNL.';
    // Nota: validamos solo la placa aquí para no bloquear el flujo de guardado
    return e;
  };

  const buscar = (placaArg) => {
    const placa = (placaArg || form.placa).trim().toUpperCase();
    if (!placa) return;
    if (!(REGEX_CARRO.test(placa) || REGEX_MOTO.test(placa))) {
      setErrores((p) => ({
        ...p,
        placa: 'Formato inválido. Use LLLNNN o LLLNNL.',
      }));
      setBuscado(false);
      return;
    }
    setErrores((p) => ({ ...p, placa: '' }));
    const v = buscarVehiculoPorPlaca(placa);
    const o = obtenerOrdenesPorPlaca(placa);
    setVehiculo(v || null);
    setOrdenes(o || []);
    setBuscado(true);
    if (!o || o.length === 0) {
      setOk('No hay órdenes registradas para esta placa');
    } else {
      setOk('');
    }
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) {
      setErrores(e);
      const firstKey = Object.keys(e)[0];
      // focus first error
      if (firstKey === 'placa') refPlaca.current?.focus();
      return;
    }
    setErrores({});
    // Enviar el checkin/checkout al contexto
    const placa = form.placa.trim().toUpperCase();
    const ordenesExistentes = obtenerOrdenesPorPlaca(placa) || [];
    // Buscar orden activa (no 'entregado' ni 'terminado'), la más reciente
    const ordenActiva = ordenesExistentes
      .slice()
      .sort((a, b) => b.id - a.id)
      .find((o) => o.estado !== 'entregado' && o.estado !== 'terminado');

    if (modo === 'in') {
      if (ordenActiva) {
        // Vincular checkin a la orden activa: marcar recibido si aplica
        actualizarOrden(ordenActiva.id, { estado: 'recibido' });
        setOk('Checkin vinculado a la orden existente');
        buscar(placa);
        navigate(`/ordenes/${ordenActiva.id}`);
      } else {
        const ordenPayload = {
          placa,
          estado: 'recibido',
          lubricante: 'NO',
          valorLubricante: '',
          engraseFilGasolina: 'NO',
          valorEngraseFilGasolina: '',
          cajaTransmision: '',
          cambioAireAC: '',
          filtros: {
            fAire: '',
            fAceite: '',
            fGasolina: '',
            fDiesel: '',
            aireAcon: '',
          },
          lubricantes: {
            lubMotor: { marca: '', cantidad: '' },
            transCaja: { marca: '', cantidad: '' },
            adicionales: { marca: '', cantidad: '' },
          },
        };
        const nueva = crearOrden(ordenPayload);
        console.log('Checkin registrado', nueva);
        setOk('Checkin registrado correctamente');
        buscar(nueva.placa);
        navigate(`/ordenes/${nueva.id}`);
      }
    } else {
      // Checkout: si hay orden activa, actualizarla con datos de salida
      const cambiosSalida = {
        estado: 'entregado',
        out_nivelAceiteEntregado: form.out_nivelAceiteEntregado,
        out_nivelAceiteCaja: form.out_nivelAceiteCaja,
        out_engrase: form.out_engrase,
        out_entregaVarilla: form.out_entregaVarilla,
        out_entregaTapaAceite: form.out_entregaTapaAceite,
        out_entregaCarcasasFiltros: form.out_entregaCarcasasFiltros,
        out_libreFugas: form.out_libreFugas,
        out_bloqueMotorLibre: form.out_bloqueMotorLibre,
        out_firmaCliente: form.out_firmaCliente,
      };

      if (ordenActiva) {
        actualizarOrden(ordenActiva.id, cambiosSalida);
        setOk('Checkout vinculado a la orden existente');
        buscar(placa);
        navigate(`/ordenes/${ordenActiva.id}`);
      } else {
        // No hay orden previa: crear una nueva orden con estado entregado
        const ordenPayload = {
          placa,
          estado: 'entregado',
          ...cambiosSalida,
        };
        const nueva = crearOrden(ordenPayload);
        setOk('Checkout registrado y orden creada');
        buscar(nueva.placa);
        navigate(`/ordenes/${nueva.id}`);
      }
      // limpiar formulario tras checkout
      setForm(inicial);
      setBuscado(false);
      setVehiculo(null);
      setOrdenes([]);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex items-center gap-2.5 my-4 justify-between'>
        <div className='flex items-center gap-2.5'>
          <i className='fa-solid fa-list-check text-orange-500 text-lg'></i>
          <h1 className='text-lg font-bold text-slate-800'>Checkin/out</h1>
        </div>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setModo('in')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
              modo === 'in'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Check in
          </button>
          <button
            type='button'
            onClick={() => setModo('out')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
              modo === 'out'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Check out
          </button>
        </div>
      </div>

      <form onSubmit={submit} className='space-y-3'>
        <BuscadorPlaca
          valor={form.placa}
          onChange={(e) => manejarCambioPlaca(e.target.value.toUpperCase())}
          onBuscar={buscar}
          inputRef={refPlaca}
          error={errores.placa}
        />

        {!buscado && null}

        {buscado && ordenes.length === 0 && (
          <div className='text-center py-8 text-slate-400 bg-white rounded-2xl shadow-sm'>
            <i className='fa-solid fa-clipboard-question text-2xl mb-2 block text-slate-300'></i>
            <p className='text-sm'>
              No hay órdenes de servicio registradas para{' '}
              <span className='font-bold uppercase'>{form.placa}</span>
            </p>
          </div>
        )}

        {buscado && ordenes.length > 0 && (
          <>
            {vehiculo && (
              <div className={`${claseSeccion} border-l-4 border-orange-500`}>
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
                        {vehiculo.placa?.toUpperCase()}
                      </span>
                    </p>
                    <p className='text-xs text-slate-400 mt-0.5'>
                      <i className='fa-solid fa-phone mr-1'></i>
                      {(vehiculo.telefonos || []).join(' / ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className={claseSeccion}>
              <h2 className={claseTitulo}>
                {modo === 'in' ? 'Checkin' : 'Checkout'}{' '}
                <span className={claseLineaTitulo} />
                <i className='fa-solid fa-clipboard-list text-orange-300 text-xs' />
              </h2>

              {Ok && (
                <div className='mb-3 text-sm text-emerald-600 font-medium'>
                  {Ok}
                </div>
              )}

              {modo === 'out' ? (
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-oil-can mr-2 text-slate-400' />
                      NIVEL DE ACEITE MOTOR ENTREGADO
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_nivelAceiteEntregado}
                      onChange={(e) =>
                        cambiar('out_nivelAceiteEntregado', e.target.value)
                      }
                    >
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-gear mr-2 text-slate-400' />
                      NIVEL ACEITE CAJA DE TRANSMISION
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_nivelAceiteCaja}
                      onChange={(e) =>
                        cambiar('out_nivelAceiteCaja', e.target.value)
                      }
                    >
                      <option>No Aplica</option>
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-droplet mr-2 text-slate-400' />
                      ENGRASE (graseras)
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_engrase}
                      onChange={(e) => cambiar('out_engrase', e.target.value)}
                    >
                      <option>No Aplica</option>
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-ruler-vertical mr-2 text-slate-400' />
                      ENTREGA VARILLA DE MEDICION
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_entregaVarilla}
                      onChange={(e) =>
                        cambiar('out_entregaVarilla', e.target.value)
                      }
                    >
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-circle-stop mr-2 text-slate-400' />
                      ENTREGA TAPA ACEITE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_entregaTapaAceite}
                      onChange={(e) =>
                        cambiar('out_entregaTapaAceite', e.target.value)
                      }
                    >
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-filter mr-2 text-slate-400' />
                      ENTREGA DE CARCASAS Y TAPAS DE FILTROS
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_entregaCarcasasFiltros}
                      onChange={(e) =>
                        cambiar('out_entregaCarcasasFiltros', e.target.value)
                      }
                    >
                      <option>No Aplica</option>
                      <option>Conforme</option>
                      <option>No Conforme</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-droplet mr-2 text-slate-400' />
                      LIBRE DE FUGAS, GOTEOS, ACEITE O COMBUSTIBLE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_libreFugas}
                      onChange={(e) =>
                        cambiar('out_libreFugas', e.target.value)
                      }
                    >
                      <option>Si</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      <i className='fa-solid fa-wrench mr-2 text-slate-400' />
                      BLOQUE DE MOTOR LIBRE DE HERRAMIENTAS, ESTOPA U OTROS
                      ELEMENTOS
                    </label>
                    <select
                      className={claseSelect}
                      value={form.out_bloqueMotorLibre}
                      onChange={(e) =>
                        cambiar('out_bloqueMotorLibre', e.target.value)
                      }
                    >
                      <option>Si</option>
                      <option>No</option>
                    </select>
                  </div>

                  <div className='col-span-2'>
                    <label className={claseLabel}>FIRMA CLIENTE</label>
                    <div className='border border-slate-200 rounded-xl overflow-hidden bg-white'>
                      <canvas
                        ref={canvasRef}
                        className='w-full h-48 touch-none block'
                        onPointerDown={startDrawing}
                        onPointerMove={draw}
                        onPointerUp={stopDrawing}
                        onPointerCancel={stopDrawing}
                        onPointerLeave={stopDrawing}
                      />
                    </div>
                    <div className='flex items-center justify-between mt-2'>
                      <div className='text-xs text-slate-500'>
                        Arrastre para firmar
                      </div>
                      <div>
                        <button
                          type='button'
                          className='text-sm text-slate-500 hover:text-slate-700'
                          onClick={clearSignature}
                        >
                          Limpiar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className={claseLabel}>FECHA</label>
                    <input
                      type='date'
                      className={claseInput}
                      value={form.fecha}
                      onChange={(e) => cambiar('fecha', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={claseLabel}>NIVEL DE ACEITE</label>
                    <select
                      className={claseSelect}
                      value={form.nivelAceite}
                      onChange={(e) => cambiar('nivelAceite', e.target.value)}
                    >
                      {opciones.nivelAceite.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>ESTADO VARILLA</label>
                    <select
                      className={claseSelect}
                      value={form.estadoVarilla}
                      onChange={(e) => cambiar('estadoVarilla', e.target.value)}
                    >
                      {opciones.estadoVarilla.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>ESTADO TAPA ACEITE</label>
                    <select
                      className={claseSelect}
                      value={form.estadoTapaAceite}
                      onChange={(e) =>
                        cambiar('estadoTapaAceite', e.target.value)
                      }
                    >
                      {opciones.estadoTapaAceite.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      FILTRO ACEITE Y COMBUSTIBLE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.filtroAceiteCombustible}
                      onChange={(e) =>
                        cambiar('filtroAceiteCombustible', e.target.value)
                      }
                    >
                      {opciones.filtroAceiteCombustible.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>MANGUERAS ADMISiON</label>
                    <select
                      className={claseSelect}
                      value={form.manguerasAdmiSion}
                      onChange={(e) =>
                        cambiar('manguerasAdmiSion', e.target.value)
                      }
                    >
                      {opciones.manguerasAdmiSion.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={claseLabel}>
                      MANGUERAS CRISTALIZADAS
                    </label>
                    <select
                      className={claseSelect}
                      value={form.manguerasCristalizadas}
                      onChange={(e) =>
                        cambiar('manguerasCristalizadas', e.target.value)
                      }
                    >
                      {opciones.manguerasCristalizadas.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      FUGAS O GOTEOS EN MOTOR
                    </label>
                    <select
                      className={claseSelect}
                      value={form.fugasOGoteos}
                      onChange={(e) => cambiar('fugasOGoteos', e.target.value)}
                    >
                      {opciones.fugasOGoteos.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>MOTOR RECALENTADO</label>
                    <select
                      className={claseSelect}
                      value={form.motorRecalentado}
                      onChange={(e) =>
                        cambiar('motorRecalentado', e.target.value)
                      }
                    >
                      {opciones.motorRecalentado.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>TAPON DEL CARTER</label>
                    <select
                      className={claseSelect}
                      value={form.taponCarter}
                      onChange={(e) => cambiar('taponCarter', e.target.value)}
                    >
                      {opciones.taponCarter.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>ESTADO DEL CARTER</label>
                    <select
                      className={claseSelect}
                      value={form.estadoCarter}
                      onChange={(e) => cambiar('estadoCarter', e.target.value)}
                    >
                      {opciones.estadoCarter.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      ESTADO VISUAL DEL ACEITE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.estadoVisualAceite}
                      onChange={(e) =>
                        cambiar('estadoVisualAceite', e.target.value)
                      }
                    >
                      {opciones.estadoVisualAceite.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      TAPON CAJA Y TRANSMISiON
                    </label>
                    <select
                      className={claseSelect}
                      value={form.taponCajaTransmiSion}
                      onChange={(e) =>
                        cambiar('taponCajaTransmiSion', e.target.value)
                      }
                    >
                      {opciones.taponCajaTransmiSion.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      CARCASA CAJA Y TRANSMISiON
                    </label>
                    <select
                      className={claseSelect}
                      value={form.carcasaCajaTransmiSion}
                      onChange={(e) =>
                        cambiar('carcasaCajaTransmiSion', e.target.value)
                      }
                    >
                      {opciones.carcasaCajaTransmiSion.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>NIVEL ACEITE CAJA</label>
                    <select
                      className={claseSelect}
                      value={form.nivelAceiteCaja}
                      onChange={(e) =>
                        cambiar('nivelAceiteCaja', e.target.value)
                      }
                    >
                      {opciones.nivelAceiteCaja.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>ESTADO GRASERAS</label>
                    <select
                      className={claseSelect}
                      value={form.estadoGraseras}
                      onChange={(e) =>
                        cambiar('estadoGraseras', e.target.value)
                      }
                    >
                      {opciones.estadoGraseras.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      ESTADO MANGUERAS Y ACOPLES
                    </label>
                    <select
                      className={claseSelect}
                      value={form.estadoManguerasAcoples}
                      onChange={(e) =>
                        cambiar('estadoManguerasAcoples', e.target.value)
                      }
                    >
                      {opciones.estadoManguerasAcoples.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      ESTADO VASOS Y SENSORES
                    </label>
                    <select
                      className={claseSelect}
                      value={form.estadoVasosSensores}
                      onChange={(e) =>
                        cambiar('estadoVasosSensores', e.target.value)
                      }
                    >
                      {opciones.estadoVasosSensores.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      EST. CARCASA Y TAPA FILTRO DE AIRE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.estCarcasaTapaFiltroAire}
                      onChange={(e) =>
                        cambiar('estCarcasaTapaFiltroAire', e.target.value)
                      }
                    >
                      {opciones.estCarcasaTapaFiltroAire.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={claseLabel}>
                      EST. CARCASA Y TAPAFILTRO DE ACEITE
                    </label>
                    <select
                      className={claseSelect}
                      value={form.estCarcasaTapafiltroAceite}
                      onChange={(e) =>
                        cambiar('estCarcasaTapafiltroAceite', e.target.value)
                      }
                    >
                      {opciones.estCarcasaTapafiltroAceite.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lubricador removed per request */}
                </div>
              )}

              <div className='mt-4'>
                <button
                  type='submit'
                  className='w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-3.5 rounded-2xl tranSition-all text-sm shadow-sm'
                >
                  {modo === 'in' ? 'Guardar Checkin' : 'Guardar Checkout'}
                </button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
