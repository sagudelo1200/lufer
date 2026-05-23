import { Outlet } from 'react-router-dom';
import BarraSuperior from './componentes/BarraSuperior';
import NavegacionInferior from './componentes/NavegacionInferior';
import logoMotorline from '../assets/images/logo-motorline.png';
import ScrollToTop from '../compartido/componentes/ScrollToTop';

export default function DisenoPanel() {
  return (
    <div className='min-h-screen' style={{ backgroundColor: '#eef0f3' }}>
      <BarraSuperior />
      <main
        id='main-content'
        className='pt-14 px-3 md:pt-14 md:px-6 max-w-screen-lg mx-auto'
        style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom))' }}
      >
        <div className='flex justify-center pt-4 pb-0'>
          <img
            src={logoMotorline}
            alt='Motorline'
            className='h-16 md:h-30 w-auto object-contain'
          />
        </div>
        <ScrollToTop />
        <Outlet />
      </main>
      <NavegacionInferior />
    </div>
  );
}
