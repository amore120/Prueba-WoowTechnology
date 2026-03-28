import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppointmentView, AppointmentStatus } from '../types/appointment';
import { StatusBadge } from './StatusBadge';
import { updateStatus, deleteAppointment } from '../services/api';

interface Props { appointment: AppointmentView; onRefresh:()=>void; onToast:(m:string,t?:'success'|'error')=>void; onEdit:(a:AppointmentView)=>void; index:number; }
const STATUSES: AppointmentStatus[] = ['pendiente','confirmada','cancelada','completada'];

export const AppointmentCard = ({ appointment:a, onRefresh, onToast, onEdit, index }: Props) => {
  const navigate = useNavigate();
  const [hov, setHov] = useState(false);

  const handleStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try { await updateStatus(a.id, e.target.value as AppointmentStatus); onToast('Estado actualizado'); onRefresh(); }
    catch { onToast('Error al cambiar estado','error'); }
  };
  const handleDelete = async () => {
    if(!confirm(`¿Eliminar cita de ${a.patientName}?`)) return;
    try { await deleteAppointment(a.id); onToast('Cita eliminada'); onRefresh(); }
    catch { onToast('Error al eliminar','error'); }
  };

  const date = new Date(a.appointmentDate);
  const day  = date.toLocaleDateString('es-ES',{day:'2-digit'});
  const mon  = date.toLocaleDateString('es-ES',{month:'short'}).toUpperCase();
  const time = date.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});

  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
        border:`1px solid ${hov ? 'rgba(0,229,212,0.22)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:14,
        transition:'all 0.22s ease', backdropFilter:'blur(8px)',
        boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,229,212,0.08)' : '0 2px 12px rgba(0,0,0,0.2)',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
        animation:'fadeUp 0.4s ease both', animationDelay:`${index*55}ms`,
      }}>
      {/* Date + Status */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{ background:'rgba(0,229,212,0.08)', border:'1px solid rgba(0,229,212,0.15)', borderRadius:10, padding:'7px 11px', textAlign:'center', minWidth:50 }}>
            <div style={{ fontSize:'0.58rem', color:'#00e5d4', fontWeight:700, letterSpacing:'0.08em', fontFamily:"'Syne',sans-serif" }}>{mon}</div>
            <div style={{ fontSize:'1.3rem', fontWeight:800, color:'#dff0f5', lineHeight:1, fontFamily:"'Syne',sans-serif" }}>{day}</div>
          </div>
          <div style={{fontSize:'0.78rem',color:'#7a9aaa'}}>⏰ {time}</div>
        </div>
        <StatusBadge status={a.status} />
      </div>

      <div style={{height:1,background:'rgba(255,255,255,0.04)'}} />

      {/* Patient + Doctor */}
      <div>
        <div style={{fontSize:'0.98rem',fontWeight:700,color:'#dff0f5',fontFamily:"'Syne',sans-serif",marginBottom:4,letterSpacing:'-0.01em'}}>
          {a.patientName}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'0.8rem',color:'#7a9aaa'}}>
          <span style={{width:18,height:18,borderRadius:'50%',background:'linear-gradient(135deg,#00e5d4,#00f59b)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#03080f',fontWeight:800,flexShrink:0}}>
            {a.doctorName.charAt(0)}
          </span>
          Dr. {a.doctorName}
          {a.areaName && <span style={{marginLeft:4,background:'rgba(167,139,250,0.12)',color:'#a78bfa',border:'1px solid rgba(167,139,250,0.2)',borderRadius:6,padding:'1px 6px',fontSize:'0.65rem',fontWeight:600}}>
            {a.areaName}
          </span>}
        </div>
      </div>

      {/* Reason */}
      <div style={{fontSize:'0.78rem',color:'rgba(223,240,245,0.4)',fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',borderLeft:'2px solid rgba(0,229,212,0.18)',paddingLeft:10}}>
        {a.reason}
      </div>

      {/* Status selector */}
      <select value={a.status} onChange={handleStatus}
        style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,color:'#dff0f5',padding:'7px 10px',fontSize:'0.78rem',cursor:'pointer',fontFamily:"'Outfit',sans-serif",outline:'none',width:'100%'}}>
        {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
      </select>

      {/* Actions */}
      <div style={{display:'flex',gap:6}}>
        <button onClick={()=>navigate(`/citas/${a.id}`)} style={gBtn('#0a1628','#7a9aaa','rgba(255,255,255,0.06)')}>Detalle</button>
        <button onClick={()=>onEdit(a)} style={gBtn('rgba(0,229,212,0.08)','#00e5d4','rgba(0,229,212,0.22)')}>Editar</button>
        <button onClick={handleDelete} style={gBtn('rgba(255,63,108,0.07)','#ff3f6c','rgba(255,63,108,0.2)')}>Eliminar</button>
      </div>
    </div>
  );
};
const gBtn=(bg:string,color:string,bd:string):React.CSSProperties=>({flex:1,padding:'8px 4px',background:bg,border:`1px solid ${bd}`,borderRadius:8,color,fontSize:'0.72rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all 0.15s'});
