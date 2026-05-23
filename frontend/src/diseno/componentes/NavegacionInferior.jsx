import { NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { RUTAS } from '../../compartido/constantes/rutas';

const navegacion = [
  {
    ruta: RUTAS.RECEPCION,
    icono: 'fa-solid fa-car-side',
    etiqueta: 'Recepción',
  },
  {
    ruta: RUTAS.CHECKIN,
    icono: 'fa-solid fa-clipboard-check',
    etiqueta: 'Checkin/out',
  },
  {
    ruta: RUTAS.ORDENES,
    icono: 'fa-solid fa-clipboard-list',
    etiqueta: 'Órdenes',
  },
  {
    ruta: RUTAS.HISTORIAL,
    icono: 'fa-solid fa-clock-rotate-left',
    etiqueta: 'Historial',
  },
];

export default function NavegacionInferior() {
  const navRef = useRef(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setBottomForViewport = () => {
      const vv = window.visualViewport;
      if (vv && typeof vv.height === 'number') {
        const kbHeight = Math.max(
          0,
          window.innerHeight - vv.height - (vv.offsetTop || 0),
        );
        // add small gap only when keyboard is visible so nav sits above it
        const gap = kbHeight > 0 ? 8 : 0;
        el.style.bottom = `${kbHeight + gap}px`;
      } else {
        el.style.bottom = '0px';
      }
    };

    const resetBottom = () => {
      el.style.bottom = '0px';
    };

    // listen to viewport changes (mobile keyboards)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setBottomForViewport);
      window.visualViewport.addEventListener('scroll', setBottomForViewport);
    } else {
      window.addEventListener('resize', setBottomForViewport);
    }

    // also respond to focus events to catch inputs
    window.addEventListener('focusin', setBottomForViewport);
    window.addEventListener('focusout', resetBottom);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          setBottomForViewport,
        );
        window.visualViewport.removeEventListener(
          'scroll',
          setBottomForViewport,
        );
      } else {
        window.removeEventListener('resize', setBottomForViewport);
      }
      window.removeEventListener('focusin', setBottomForViewport);
      window.removeEventListener('focusout', resetBottom);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className='fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex md:hidden z-50 transition-all'
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navegacion.map(({ ruta, icono, etiqueta }) => (
        <NavLink key={ruta} to={ruta} className='flex-1 relative'>
          {({ isActive }) => (
            <div
              className={`flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
                isActive ? 'text-orange-600' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <span className='absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-orange-500 rounded-full' />
              )}
              <i className={`${icono} text-xl`}></i>
              <span className='text-[11px] font-semibold'>{etiqueta}</span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
