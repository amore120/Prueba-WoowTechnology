/**
 * @component Modal
 * @description Componente de modal reutilizable con backdrop blur y animación de entrada.
 *
 * Cierra automáticamente al hacer click fuera del contenido (en el backdrop).
 * El contenido se pasa como children para máxima flexibilidad.
 *
 * @param title    - Título mostrado en el encabezado del modal
 * @param onClose  - Función llamada al cerrar (botón X o click en backdrop)
 * @param children - Contenido del modal (formularios, detalles, etc.)
 * @param width    - Ancho máximo del modal en px (por defecto 500)
 */

import { ReactNode } from 'react';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export const Modal = ({ title, onClose, children, width = 500 }: Props) => (
  // Backdrop — capa semitransparente que cubre toda la pantalla
  <div
    onClick={e => {
      // Cierra solo si el click fue en el backdrop (no en el contenido)
      if (e.target === e.currentTarget) onClose();
    }}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(3,8,15,0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
      animation: 'fadeIn 0.2s ease',
    }}
  >
    {/* Contenedor del modal */}
    <div style={{
      background: '#060e18',
      border: '1px solid rgba(0,229,212,0.18)',
      borderRadius: 20,
      padding: 32,
      width: '100%',
      maxWidth: width,
      boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,212,0.06)',
      animation: 'fadeUp 0.25s ease',
      maxHeight: '90vh',
      overflowY: 'auto', // Scroll interno si el contenido es muy largo
    }}>
      {/* Encabezado con título y botón de cierre */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: '1.1rem',
          color: '#dff0f5',
        }}>
          {title}
        </h2>

        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, color: '#7a9aaa',
            width: 32, height: 32, cursor: 'pointer',
            fontSize: 14, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: "'Outfit',sans-serif",
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#dff0f5';
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#7a9aaa';
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
        >
          ✕
        </button>
      </div>

      {/* Contenido dinámico del modal */}
      {children}
    </div>
  </div>
);
