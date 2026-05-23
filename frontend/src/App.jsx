import { Navigate, Route, Routes } from 'react-router-dom';
import DisenoPanel from './diseno/DisenoPanel';
import PaginaRecepcion from './modulos/recepcion/paginas/PaginaRecepcion';
import PaginaOrdenes from './modulos/ordenes/paginas/PaginaOrdenes';
import PaginaDetalleOrden from './modulos/ordenes/paginas/PaginaDetalleOrden';
import PaginaHistorial from './modulos/historial/paginas/PaginaHistorial';
import PaginaCheckin from './modulos/checkin/paginas/PaginaCheckin';

export default function App() {
  return (
    <Routes>
      <Route element={<DisenoPanel />}>
        <Route index element={<Navigate to='/recepcion' replace />} />
        <Route path='recepcion' element={<PaginaRecepcion />} />
        <Route path='checkin' element={<PaginaCheckin />} />
        <Route path='ordenes' element={<PaginaOrdenes />} />
        <Route path='ordenes/:id' element={<PaginaDetalleOrden />} />
        <Route path='historial' element={<PaginaHistorial />} />
      </Route>
    </Routes>
  );
}
