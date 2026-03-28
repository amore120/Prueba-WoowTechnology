/**
 * @component Toast
 * @description Notificación flotante temporal que aparece en la esquina inferior derecha.
 *
 * Comportamiento:
 *  - Entra con animación bounce desde abajo (cubic-bezier elástico)
 *  - Desaparece automáticamente después de 3.5 segundos
 *  - Soporta 3 tipos: success (verde), error (rojo), info (cian)
 *  - El borde izquierdo de color comunica visualmente el tipo de mensaje
 *
 * @param message - Texto del mensaje a mostrar
 * @param type    - Tipo de notificación: 'success' | 'error' | 'info'
 * @param onClose - Callback ejecutado después de que el toast desaparece
 */

import { useEffect, useState } from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast = ({ message, type = 'success', onClose }: Props) => {
  // Controla la visibilidad para las animaciones de entrada y salida
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pequeño delay para que la animación de entrada sea visible
    requestAnimationFrame(() => setVisible(true));

    // Inicia el temporizador de cierre automático
    const timer = setTimeout(() => {
      setVisible(false); // Dispara animación de salida
      setTimeout(onClose, 400); // Espera a que termine la animación antes de destruir
    }, 3500);

    return () => clearTimeout(timer); // Limpieza al desmontar
  }, [onClose]);

  // Color del acento según el tipo de notificación
  const color = type === 'success' ? '#00f59b' : type === 'error' ? '#ff3f6c' : '#00e5d4';
  const icon  = type === 'success' ? '✓'       : type === 'error' ? '✕'       : 'ℹ';

  return (
    <div style={{
      position: 'fixed',
      bottom: 28, right: 28,
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(3,8,15,0.96)',
      backdropFilter: 'blur(24px)',
      // Borde izquierdo de color como indicador visual del tipo
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      color: '#dff0f5',
      padding: '13px 18px',
      borderRadius: 12,
      fontSize: '0.875rem', fontWeight: 500,
      boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 24px ${color}18`,
      // Animación de entrada/salida controlada por el estado 'visible'
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', // Efecto bounce
      zIndex: 9999,
      minWidth: 240,
      fontFamily: "'Outfit',sans-serif",
    }}>
      {/* Ícono circular con color del tipo */}
      <span style={{
        width: 28, height: 28, borderRadius: '50%',
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 14, flexShrink: 0, fontWeight: 700,
      }}>
        {icon}
      </span>
      {message}
    </div>
  );
};
