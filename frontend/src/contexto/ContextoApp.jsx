import { createContext, useContext, useState } from 'react';
import { vehiculosIniciales } from '../datos/vehiculos';
import { ordenesIniciales } from '../datos/ordenes';

const ContextoApp = createContext(null);

export function ProveedorApp({ children }) {
  const [vehiculos, setVehiculos] = useState(vehiculosIniciales);
  const [ordenes, setOrdenes] = useState(ordenesIniciales);

  const agregarVehiculo = (vehiculo) => {
    const nuevo = {
      ...vehiculo,
      id: Date.now(),
      fechaRegistro: new Date().toISOString().split('T')[0],
    };
    setVehiculos((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const buscarVehiculoPorPlaca = (placa) => {
    return (
      vehiculos.find((v) => v.placa.toLowerCase() === placa.toLowerCase()) ||
      null
    );
  };

  const crearOrden = (orden) => {
    const nueva = {
      ...orden,
      id: Date.now(),
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    setOrdenes((prev) => [...prev, nueva]);
    return nueva;
  };

  const actualizarOrden = (id, cambios) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...cambios } : o)),
    );
  };

  const actualizarEstadoOrden = (id, estado) => {
    setOrdenes((prev) => prev.map((o) => (o.id === id ? { ...o, estado } : o)));
  };

  const obtenerOrdenesPorPlaca = (placa) => {
    return ordenes.filter((o) => o.placa.toLowerCase() === placa.toLowerCase());
  };

  return (
    <ContextoApp.Provider
      value={{
        vehiculos,
        ordenes,
        agregarVehiculo,
        buscarVehiculoPorPlaca,
        crearOrden,
        actualizarOrden,
        actualizarEstadoOrden,
        obtenerOrdenesPorPlaca,
      }}
    >
      {children}
    </ContextoApp.Provider>
  );
}

export { ContextoApp };
