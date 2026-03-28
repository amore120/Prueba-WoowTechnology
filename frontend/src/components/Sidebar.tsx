/**
 * @component Sidebar
 * @description Barra lateral de navegación principal del sistema.
 *
 * Usa NavLink de React Router para detectar la ruta activa automáticamente
 * y aplicar estilos diferenciados al ítem seleccionado.
 *
 * Es un componente estático — no requiere props ni estado propio.
 */

import { NavLink } from 'react-router-dom';

/** Definición de los módulos del sistema con su ruta, icono y etiqueta */
const links = [
  { to: '/',          icon: '📊', label: 'Dashboard'  },
  { to: '/citas',     icon: '📅', label: 'Citas'       },
  { to: '/pacientes', icon: '👤', label: 'Pacientes'   },
  { to: '/doctores',  icon: '🩺', label: 'Doctores'    },
  { to: '/areas',     icon: '🏥', label: 'Áreas'       },
];

export const Sidebar = () => (
  <aside style={{
    width: 220, flexShrink: 0,
    background: 'rgba(6,14,24,0.9)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column',
    position: 'sticky', top: 0, height: '100vh', zIndex: 10,
  }}>

    {/* ── Logo / Identidad ── */}
    <div style={{ padding: '28px 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Ícono animado con glow cian */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #00e5d4, #00f59b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 4px 20px rgba(0,229,212,0.35)',
          animation: 'glow 3s ease infinite',
        }}>🏥</div>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#dff0f5', letterSpacing: '-0.01em' }}>
            MediCore
          </div>
          {/* Subtítulo en mayúsculas pequeñas */}
          <div style={{ fontSize: '0.62rem', color: '#3d5a6a', fontWeight: 500, letterSpacing: '0.06em' }}>
            SISTEMA MÉDICO
          </div>
        </div>
      </div>
    </div>

    {/* Separador decorativo */}
    <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 16 }} />

    {/* ── Navegación principal ── */}
    <nav style={{ padding: '0 12px', flex: 1 }}>
      {/* Etiqueta de sección */}
      <div style={{ fontSize: '0.6rem', color: '#3d5a6a', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 8px 8px', fontFamily: "'Syne',sans-serif" }}>
        Módulos
      </div>

      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'} // 'end' evita que '/' quede activo en todas las rutas
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, marginBottom: 2,
            textDecoration: 'none', transition: 'all 0.2s',
            // Estilos diferenciados para ruta activa vs inactiva
            background: isActive ? 'rgba(0,229,212,0.09)' : 'transparent',
            border: isActive ? '1px solid rgba(0,229,212,0.18)' : '1px solid transparent',
            color: isActive ? '#00e5d4' : '#7a9aaa',
            fontFamily: "'Outfit',sans-serif",
            fontSize: '0.85rem',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>

    {/* ── Footer del sidebar ── */}
    <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ fontSize: '0.65rem', color: '#3d5a6a', lineHeight: 1.6 }}>
        WoowTechnology<br />
        {/* Versión en fuente monoespaciada */}
        <span style={{ color: 'rgba(61,90,106,0.6)', fontFamily: "'JetBrains Mono',monospace" }}>
          v2.0.0
        </span>
      </div>
    </div>
  </aside>
);
