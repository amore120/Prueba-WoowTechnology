/**
 * @component FormField
 * @description Campo de formulario reutilizable con estado de foco animado.
 *
 * Soporta tres variantes: input, textarea y select.
 * Al recibir foco muestra un borde cian y un glow sutil para indicar el campo activo.
 *
 * @param label       - Etiqueta visible del campo
 * @param name        - Nombre del campo (para el onChange del formulario padre)
 * @param value       - Valor controlado
 * @param onChange    - Handler del cambio de valor
 * @param type        - Tipo del input (text, email, date, datetime-local, etc.)
 * @param placeholder - Texto de ayuda cuando el campo está vacío
 * @param required    - Si es true, muestra un asterisco rojo en el label
 * @param as          - Tipo de elemento: 'input' | 'textarea' | 'select'
 * @param children    - Solo para 'select': las opciones <option>
 */

import { useState, ReactNode } from 'react';

interface Props {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  as?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
}

export const FormField = ({
  label, name, value, onChange,
  type = 'text', placeholder, required,
  as = 'input', children,
}: Props) => {
  // Controla si el campo tiene foco para aplicar estilos de activación
  const [focused, setFocused] = useState(false);

  /** Estilos base compartidos por input, textarea y select */
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    // Fondo ligeramente más claro cuando tiene foco
    background: focused ? 'rgba(0,229,212,0.05)' : 'rgba(255,255,255,0.03)',
    // Borde cian cuando tiene foco, sutil cuando no
    border: `1px solid ${focused ? 'rgba(0,229,212,0.45)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 10,
    color: '#dff0f5',
    fontSize: '0.875rem',
    outline: 'none', // Quitamos el outline por defecto del navegador
    fontFamily: "'Outfit',sans-serif",
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    // Glow exterior sutil al tener foco
    boxShadow: focused ? '0 0 0 3px rgba(0,229,212,0.07)' : 'none',
  };

  return (
    <div>
      {/* Label con asterisco opcional para campos requeridos */}
      <label style={{
        display: 'block',
        marginBottom: 6,
        fontSize: '0.68rem',
        color: '#3d5a6a',
        fontWeight: 700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        fontFamily: "'Syne',sans-serif",
      }}>
        {label}
        {required && <span style={{ color: '#ff3f6c', marginLeft: 3 }}>*</span>}
      </label>

      {/* Renderiza el elemento correcto según la prop 'as' */}
      {as === 'textarea' ? (
        <textarea
          name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required} rows={3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...baseStyle, resize: 'vertical' }}
        />
      ) : as === 'select' ? (
        <select
          name={name} value={value} onChange={onChange} required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        >
          {children}
        </select>
      ) : (
        <input
          name={name} type={type} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
};
