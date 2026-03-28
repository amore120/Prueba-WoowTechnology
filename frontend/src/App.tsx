/**
 * @file App.tsx
 * @description Componente raíz de la aplicación.
 *
 * Configura el BrowserRouter y define la estructura de layout:
 *  - Sidebar fijo a la izquierda (navegación entre módulos)
 *  - Área principal a la derecha (donde se renderizan las pantallas)
 *
 * Rutas del sistema:
 *  /            → Dashboard con estadísticas globales
 *  /citas       → Gestión de citas médicas
 *  /citas/:id   → Detalle de una cita específica
 *  /pacientes   → Gestión de pacientes
 *  /doctores    → Gestión de doctores
 *  /areas       → Gestión de áreas médicas
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar }          from './components/Sidebar';
import { DashboardScreen }  from './screens/DashboardScreen';
import { CitasScreen }      from './screens/CitasScreen';
import { PacientesScreen }  from './screens/PacientesScreen';
import { DoctoresScreen }   from './screens/DoctoresScreen';
import { AreasScreen }      from './screens/AreasScreen';
import { DetailScreen }     from './screens/DetailScreen';

function App() {
  return (
    <BrowserRouter>
      {/* Layout principal: sidebar + contenido */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar de navegación — siempre visible */}
        <Sidebar />

        {/* Área de contenido — cambia según la ruta activa */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0, // Evita desbordamiento en flex con contenido largo
        }}>
          <Routes>
            <Route path="/"          element={<DashboardScreen />} />
            <Route path="/citas"     element={<CitasScreen />} />
            <Route path="/citas/:id" element={<DetailScreen />} />
            <Route path="/pacientes" element={<PacientesScreen />} />
            <Route path="/doctores"  element={<DoctoresScreen />} />
            <Route path="/areas"     element={<AreasScreen />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
