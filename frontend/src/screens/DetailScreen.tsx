import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppointmentView, AppointmentStatus } from '../types/appointment';
import { fetchAppointmentById, updateStatus } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';

const STATUSES: AppointmentStatus[] = ['pendiente','confirmada','cancelada','completada'];

export const DetailScreen = () => {
  const { id }  = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appt, setAppt]   = useState<AppointmentView|null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{msg:string;type?:'success'|'error'}|null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAppointmentById(id).then(setAppt).catch(()=>navigate('/citas')).finally(()=>setLoading(false));
  }, [id, navigate]);

  const handleStatus = async (status: AppointmentStatus) => {
    if (!appt) return;
    try { await updateStatus(appt.id, status); setAppt({...appt,status}); setToast({msg:'Estado actualizado ✓'}); }
    catch { setToast({msg:'Error al actualizar','error':'error'} as any); }
  };

  if (loading) return (
    <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,color:'#3d5a6a' }}>
      <div style={{ width:40,height:40,border:'3px solid rgba(0,229,212,0.15)',borderTopColor:'#00e5d4',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!appt) return null;

  const date    = new Date(appt.appointmentDate);
  const created = new Date(appt.createdAt);

  return (
    <div style={{ flex:1, overflow:'auto' }}>
      {/* Header */}
      <div style={{ padding:'18px 32px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',gap:14,background:'rgba(3,8,15,0.6)',backdropFilter:'blur(10px)',position:'sticky',top:0,zIndex:40 }}>
        <button onClick={()=>navigate('/citas')} style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,color:'#7a9aaa',padding:'7px 14px',cursor:'pointer',fontSize:'0.8rem',fontFamily:"'Outfit',sans-serif",fontWeight:600,transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.color='#dff0f5';}} onMouseLeave={e=>{e.currentTarget.style.color='#7a9aaa';}}>
          ← Volver
        </button>
        <div style={{ width:1,height:18,background:'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize:'0.8rem',color:'#3d5a6a',fontWeight:500 }}>Detalle de Cita</span>
        <div style={{ marginLeft:'auto' }}><StatusBadge status={appt.status} /></div>
      </div>

      <div style={{ padding:'32px',maxWidth:780,margin:'0 auto',animation:'fadeUp 0.35s ease' }}>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 300px',gap:20,alignItems:'start' }}>

          {/* Main card */}
          <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:16,overflow:'hidden' }}>
            {/* Top accent bar */}
            <div style={{ height:3,background:'linear-gradient(90deg,#00e5d4,#00f59b,#a78bfa)' }} />
            <div style={{ padding:28 }}>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:'0.65rem',color:'#3d5a6a',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase' as const,fontFamily:"'Syne',sans-serif",marginBottom:6 }}>Expediente de Cita</div>
                <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:'1.6rem',fontWeight:800,color:'#dff0f5',margin:0,letterSpacing:'-0.02em' }}>{appt.patientName}</h1>
              </div>

              <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
                {[
                  {icon:'🩺',label:'Médico',value:`Dr. ${appt.doctorName}`,sub:appt.specialty},
                  {icon:'🏥',label:'Área',value:appt.areaName??'Sin área asignada'},
                  {icon:'📅',label:'Fecha',value:date.toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})},
                  {icon:'⏰',label:'Hora',value:date.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})},
                  {icon:'📝',label:'Motivo',value:appt.reason},
                  ...(appt.notes ? [{icon:'💬',label:'Notas',value:appt.notes}] : []),
                  {icon:'🗓️',label:'Registrado',value:created.toLocaleString('es-ES')},
                  {icon:'🔑',label:'ID',value:appt.id,mono:true},
                ].map((row,i,arr)=>(
                  <div key={row.label} style={{ display:'flex',gap:14,padding:'14px 0',borderBottom:i<arr.length-1?'1px solid rgba(255,255,255,0.04)':'none',alignItems:'flex-start' }}>
                    <span style={{ width:32,height:32,borderRadius:8,background:'rgba(0,229,212,0.07)',border:'1px solid rgba(0,229,212,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0 }}>{row.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.65rem',color:'#3d5a6a',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'0.08em',fontFamily:"'Syne',sans-serif",marginBottom:3 }}>{row.label}</div>
                      <div style={{ fontSize:(row as any).mono?'0.75rem':'0.9rem',color:'#dff0f5',fontFamily:(row as any).mono?"'JetBrains Mono',monospace":"'Outfit',sans-serif",wordBreak:'break-all' as const }}>{row.value}</div>
                      {(row as any).sub && <div style={{ fontSize:'0.72rem',color:'#00e5d4',marginTop:2 }}>{(row as any).sub}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel — cambiar estado */}
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <div style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:20 }}>
              <div style={{ fontSize:'0.65rem',color:'#3d5a6a',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase' as const,fontFamily:"'Syne',sans-serif",marginBottom:14 }}>Cambiar Estado</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {STATUSES.map(s=>{
                  const cfg: Record<string,{c:string;bg:string;bd:string;icon:string}> = {
                    pendiente:{c:'#ffcb47',bg:'rgba(255,203,71,0.08)',bd:'rgba(255,203,71,0.22)',icon:'⏳'},
                    confirmada:{c:'#00f59b',bg:'rgba(0,245,155,0.08)',bd:'rgba(0,245,155,0.22)',icon:'✅'},
                    cancelada:{c:'#ff3f6c',bg:'rgba(255,63,108,0.08)',bd:'rgba(255,63,108,0.22)',icon:'❌'},
                    completada:{c:'#a78bfa',bg:'rgba(167,139,250,0.08)',bd:'rgba(167,139,250,0.22)',icon:'🏁'},
                  };
                  const st = cfg[s];
                  const active = appt.status===s;
                  return (
                    <button key={s} onClick={()=>handleStatus(s)}
                      style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:active?st.bg:'transparent',border:`1px solid ${active?st.bd:'rgba(255,255,255,0.06)'}`,borderRadius:10,color:active?st.c:'#7a9aaa',cursor:'pointer',fontFamily:"'Outfit',sans-serif",fontWeight:active?700:400,fontSize:'0.85rem',textAlign:'left' as const,transition:'all 0.18s',width:'100%' }}
                      onMouseEnter={e=>{if(!active){e.currentTarget.style.background=st.bg;e.currentTarget.style.borderColor=st.bd;e.currentTarget.style.color=st.c;}}}
                      onMouseLeave={e=>{if(!active){e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.color='#7a9aaa';}}}>
                      <span>{st.icon}</span>
                      {s.charAt(0).toUpperCase()+s.slice(1)}
                      {active && <span style={{ marginLeft:'auto',fontSize:'0.65rem',fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase' as const }}>ACTUAL</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={()=>navigate('/citas')} style={{ padding:'11px',background:'rgba(0,229,212,0.07)',border:'1px solid rgba(0,229,212,0.18)',borderRadius:10,color:'#00e5d4',cursor:'pointer',fontSize:'0.85rem',fontWeight:600,fontFamily:"'Outfit',sans-serif",transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,229,212,0.12)';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,229,212,0.07)';}}>
              ← Volver al listado
            </button>
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
};
