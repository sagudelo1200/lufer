import { NavLink } from 'react-router-dom';
import { RUTAS } from '../../compartido/constantes/rutas';
import logoMotorline from '../../assets/images/logo-motorline.png';

const navegacion = [
  {
    ruta: RUTAS.RECEPCION,
    icono: 'fa-solid fa-car-side',
    etiqueta: 'Recepción',
  },
  {
    ruta: RUTAS.ORDENES,
    icono: 'fa-solid fa-clipboard-list',
    etiqueta: 'Órdenes de Servicio',
  },
  {
    ruta: RUTAS.CHECKIN,
    icono: 'fa-solid fa-clipboard-check',
    etiqueta: 'Checkin/out',
  },
  {
    ruta: RUTAS.HISTORIAL,
    icono: 'fa-solid fa-clock-rotate-left',
    etiqueta: 'Historial',
  },
];

export default function BarraLateral() {
  return (
    <aside className='hidden md:flex md:w-16 lg:w-64 min-h-screen bg-slate-900 text-white flex-col shrink-0 transition-all duration-300'>
      {/* Logo */}
      <div className='h-16 border-b border-slate-700 flex items-center justify-center lg:justify-start lg:px-5'>
        <img
          src={logoMotorline}
          alt='Motorline'
          className='h-8 w-auto object-contain'
        />
      </div>

      {/* Navegación */}
      <nav className='flex-1 px-2 py-4 space-y-1'>
        {navegacion.map(({ ruta, icono, etiqueta }) => (
          <NavLink
            key={ruta}
            to={ruta}
            title={etiqueta}
            className={({ isActive }) =>
              `flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-3 py-3 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <i className={`${icono} text-base w-5 text-center shrink-0`}></i>
            <span className='hidden lg:block'>{etiqueta}</span>
          </NavLink>
        ))}
      </nav>

      <div className='py-4 border-t border-slate-700'>
        <p className='hidden lg:block text-xs text-slate-500 text-center'>
          Demo
        </p>
      </div>
    </aside>
  );
}
