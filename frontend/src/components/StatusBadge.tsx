/**
 * @component StatusBadge
 * @description Etiqueta visual de estado para citas médicas.
 *
 * Muestra el estado con fondo de color, borde y un punto luminoso (glow).
 * Soporta los 4 estados del sistema: pendiente, confirmada, cancelada, completada.
 *
 * @param status - Estado de la cita a representar visualmente
 */

import { AppointmentStatus } from '../types/appointment';

/** Paleta de colores para cada estado */
const config: Record<AppointmentStatus, { c: string; bg: string; bd: string }> = {
  pendiente:  { c: '#ffcb47', bg: 'rgba(255,203,71,0.10)',  bd: 'rgba(255,203,71,0.28)'  }, // Amarillo ámbar
  confirmada: { c: '#00f59b', bg: 'rgba(0,245,155,0.10)',   bd: 'rgba(0,245,155,0.28)'   }, // Verde esmeralda
  cancelada:  { c: '#ff3f6c', bg: 'rgba(255,63,108,0.10)',  bd: 'rgba(255,63,108,0.28)'  }, // Rojo coral
  completada: { c: '#a78bfa', bg: 'rgba(167,139,250,0.10)', bd: 'rgba(167,139,250,0.28)' }, // Violeta suave
};

/** Etiquetas legibles en español para cada estado */
const labels: Record<AppointmentStatus, string> = {
  pendiente:  'Pendiente',
  confirmada: 'Confirmada',
  cancelada:  'Cancelada',
  completada: 'Completada',
};

export const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const s = config[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.c, border: `1px solid ${s.bd}`,
      padding: '3px 9px', borderRadius: 20,
      fontSize: '0.7rem', fontWeight: 700,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      whiteSpace: 'nowrap', fontFamily: "'Outfit',sans-serif",
    }}>
      {/* Punto luminoso indicador de estado */}
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: s.c,
        boxShadow: `0 0 5px ${s.c}`, // Efecto glow
        flexShrink: 0,
      }} />
      {labels[status]}
    </span>
  );
};
