import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchAppointments } from '../services/api';
import { Stats, AppointmentView } from '../types/appointment';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardScreen = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<AppointmentView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchAppointments()])
      .then(([s, a]) => { setStats(s); setRecent(a.slice(0, 5)); })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label:'Total Citas',  value:stats.total,     color:'#00e5d4', icon:'📋', sub:'registradas' },
    { label:'Pendientes',   value:stats.pending,   color:'#ffcb47', icon:'⏳', sub:'por atender'  },
    { label:'Confirmadas',  value:stats.confirmed, color:'#00f59b', icon:'✅', sub:'agendadas'    },
    { label:'Completadas',  value:stats.completed, color:'#a78bfa', icon:'🏁', sub:'finalizadas'  },
    { label:'Pacientes',    value:stats.patients,  color:'#00e5d4', icon:'👤', sub:'registrados'  },
    { label:'Doctores',     value:stats.doctors,   color:'#00f59b', icon:'🩺', sub:'activos'      },
    { label:'Canceladas',   value:stats.cancelled, color:'#ff3f6c', icon:'❌', sub:'canceladas'   },
    { label:'Áreas',        value:stats.areas,     color:'#a78bfa', icon:'🏥', sub:'habilitadas'  },
  ] : [];

  if (loading) return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16, color:'#3d5a6a' }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(0,229,212,0.2)', borderTopColor:'#00e5d4', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'0.875rem' }}>Cargando sistema...</span>
    </div>
  );

  return (
    <div style={{ padding:'28px 32px', flex:1, overflow:'auto' }}>
      {/* Header */}
      <div style={{ marginBottom:28, animation:'fadeUp 0.3s ease' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'#dff0f5', margin:0, letterSpacing:'-0.02em' }}>
          Dashboard
        </h1>
        <p style={{ color:'#3d5a6a', fontSize:'0.82rem', marginTop:4 }}>
          {new Date().toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:14, marginBottom:32 }}>
        {statCards.map((s, i) => (
          <div key={s.label} style={{
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:14, padding:'18px 20px', position:'relative', overflow:'hidden',
            animation:'fadeUp 0.4s ease both', animationDelay:`${i*60}ms`,
            cursor:'default', transition:'all 0.2s',
          }}
          onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${s.color}28`; e.currentTarget.style.background='rgba(255,255,255,0.05)';}}
          onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.06)'; e.currentTarget.style.background='rgba(255,255,255,0.03)';}}>
            {/* Glow */}
            <div style={{ position:'absolute',top:0,right:0,width:90,height:90,background:`radial-gradient(circle,${s.color}14 0%,transparent 70%)`,borderRadius:'0 14px 0 90px',pointerEvents:'none' }} />
            <div style={{ fontSize:'0.62rem', color:'#3d5a6a', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', fontFamily:"'Syne',sans-serif", marginBottom:10 }}>
              {s.icon}  {s.label}
            </div>
            <div style={{ fontSize:'2.2rem', fontWeight:800, color:s.color, fontFamily:"'Syne',sans-serif", lineHeight:1 }}>
              {String(s.value).padStart(2,'0')}
            </div>
            <div style={{ fontSize:'0.68rem', color:'#3d5a6a', marginTop:4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div style={{ animation:'fadeUp 0.5s ease both', animationDelay:'200ms' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1rem', fontWeight:700, color:'#dff0f5', margin:0 }}>
            Citas Recientes
          </h2>
          <button onClick={()=>navigate('/citas')}
            style={{ background:'rgba(0,229,212,0.08)', border:'1px solid rgba(0,229,212,0.2)', borderRadius:8,
              color:'#00e5d4', padding:'6px 14px', cursor:'pointer', fontSize:'0.78rem', fontWeight:600,
              fontFamily:"'Outfit',sans-serif", transition:'all 0.2s' }}>
            Ver todas →
          </button>
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0', color:'#3d5a6a', border:'1px dashed rgba(255,255,255,0.06)', borderRadius:14 }}>
            <div style={{ fontSize:'2.5rem', marginBottom:10, opacity:0.4 }}>📋</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:600 }}>Sin citas registradas</div>
            <button onClick={()=>navigate('/citas')}
              style={{ marginTop:14, background:'linear-gradient(135deg,#00e5d4,#00f59b)', border:'none', borderRadius:8,
                color:'#03080f', padding:'9px 20px', cursor:'pointer', fontWeight:700, fontSize:'0.82rem',
                fontFamily:"'Syne',sans-serif" }}>
              Crear primera cita
            </button>
          </div>
        ) : (
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, overflow:'hidden' }}>
            {/* Table header */}
            <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1.5fr 1.2fr 1fr', padding:'10px 20px',
              borderBottom:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.02)' }}>
              {['Paciente','Doctor','Área','Fecha','Estado'].map(h=>(
                <div key={h} style={{ fontSize:'0.62rem', color:'#3d5a6a', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', fontFamily:"'Syne',sans-serif" }}>{h}</div>
              ))}
            </div>
            {recent.map((a,i)=>{
              const date = new Date(a.appointmentDate);
              return (
                <div key={a.id} onClick={()=>navigate(`/citas/${a.id}`)}
                  style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1.5fr 1.2fr 1fr', padding:'14px 20px',
                    borderBottom: i<recent.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    cursor:'pointer', transition:'background 0.15s', animation:`slideIn 0.3s ease both`, animationDelay:`${i*60}ms` }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,229,212,0.04)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                  <div style={{ fontSize:'0.85rem', fontWeight:600, color:'#dff0f5', fontFamily:"'Syne',sans-serif" }}>{a.patientName}</div>
                  <div style={{ fontSize:'0.82rem', color:'#7a9aaa' }}>Dr. {a.doctorName}</div>
                  <div style={{ fontSize:'0.78rem', color:'#a78bfa' }}>{a.areaName || '—'}</div>
                  <div style={{ fontSize:'0.78rem', color:'#7a9aaa', fontFamily:"'JetBrains Mono',monospace" }}>
                    {date.toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'})} {date.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}
                  </div>
                  <div><StatusBadge status={a.status} /></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
