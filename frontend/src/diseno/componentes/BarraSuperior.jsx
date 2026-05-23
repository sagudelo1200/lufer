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
    etiqueta: 'Órdenes',
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

export default function BarraSuperior() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-sm'>
      <div className='h-14 flex items-center justify-between px-4 md:px-6 max-w-screen-lg mx-auto'>
        <div className='flex items-center w-full'>
          <img
            src={logoMotorline}
            alt='Motorline'
            className='h-6 md:h-7 w-auto object-contain'
          />
          <span className='text-xs font-medium md:hidden text-slate-700 ml-auto mr-3 relative top-1'>
            Lubricantes LUFER S.A.S
          </span>
        </div>

        <nav className='hidden md:flex items-center gap-0.5'>
          {navegacion.map(({ ruta, icono, etiqueta }) => (
            <NavLink
              key={ruta}
              to={ruta}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`
              }
            >
              <i className={icono}></i>
              {etiqueta}
            </NavLink>
          ))}
        </nav>

        <span className='hidden lg:block text-[11px] font-medium text-slate-300 tracking-widest uppercase'>
          Demo
        </span>
      </div>
    </header>
  );
}
