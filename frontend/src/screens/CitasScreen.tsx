import { useEffect, useState, useCallback } from 'react';
import { AppointmentView, AppointmentStatus, CreateAppointmentDTO, Doctor, Patient, Area } from '../types/appointment';
import { fetchAppointments, createAppointment, updateAppointment, fetchDoctors, fetchPatients, fetchAreas } from '../services/api';
import { AppointmentCard } from '../components/AppointmentCard';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';

type FilterStatus = AppointmentStatus | 'todas';
const FILTERS: { l:string; v:FilterStatus }[] = [
  {l:'Todas',v:'todas'},{l:'Pendientes',v:'pendiente'},{l:'Confirmadas',v:'confirmada'},
  {l:'Completadas',v:'completada'},{l:'Canceladas',v:'cancelada'},
];
const EMPTY: CreateAppointmentDTO = { patientId:'', doctorId:'', areaId:'', appointmentDate:'', reason:'', notes:'' };

export const CitasScreen = () => {
  const [appointments, setAppointments] = useState<AppointmentView[]>([]);
  const [doctors, setDoctors]   = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [areas, setAreas]       = useState<Area[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<FilterStatus>('todas');
  const [search, setSearch]     = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AppointmentView | null>(null);
  const [form, setForm] = useState<CreateAppointmentDTO>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{msg:string;type?:'success'|'error'}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, d, p, ar] = await Promise.all([fetchAppointments(), fetchDoctors(), fetchPatients(), fetchAreas()]);
      setAppointments(a); setDoctors(d); setPatients(p); setAreas(ar);
    } catch { showToast('Error al cargar datos','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg:string, type?:'success'|'error') => setToast({msg,type});

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setFormOpen(true); };
  const openEdit   = (a: AppointmentView) => {
    setForm({ patientId:a.patientId, doctorId:a.doctorId, areaId:a.areaId??'', appointmentDate:a.appointmentDate.slice(0,16), reason:a.reason, notes:a.notes??'' });
    setEditTarget(a); setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editTarget) { await updateAppointment(editTarget.id, form); showToast('Cita actualizada ✓'); }
      else            { await createAppointment(form); showToast('Cita creada ✓'); }
      setFormOpen(false); load();
    } catch { showToast('Error al guardar','error'); }
    finally { setSubmitting(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) =>
    setForm(p => ({...p, [e.target.name]: e.target.value}));

  const filtered = appointments.filter(a => {
    const ms = filter==='todas' || a.status===filter;
    const mq = a.patientName.toLowerCase().includes(search.toLowerCase()) ||
               a.doctorName.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
      {/* Header */}
      <div style={{ padding:'22px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(3,8,15,0.6)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.25rem', fontWeight:800, color:'#dff0f5', margin:0 }}>Citas Médicas</h1>
          <p style={{ color:'#3d5a6a', fontSize:'0.78rem', margin:'2px 0 0' }}>{appointments.length} cita{appointments.length!==1?'s':''} en el sistema</p>
        </div>
        <button onClick={openCreate} style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 20px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',fontWeight:700,cursor:'pointer',fontSize:'0.85rem',fontFamily:"'Syne',sans-serif",letterSpacing:'0.02em',boxShadow:'0 4px 20px rgba(0,229,212,0.3)',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 6px 28px rgba(0,229,212,0.45)';e.currentTarget.style.transform='translateY(-1px)';}}
          onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 4px 20px rgba(0,229,212,0.3)';e.currentTarget.style.transform='translateY(0)';}}>
          + Nueva Cita
        </button>
      </div>

      <div style={{ padding:'24px 32px', flex:1 }}>
        {/* Search + filters */}
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#3d5a6a',fontSize:13 }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar paciente o doctor..."
              style={{ width:'100%',padding:'9px 14px 9px 34px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#dff0f5',fontSize:'0.85rem',outline:'none',fontFamily:"'Outfit',sans-serif",boxSizing:'border-box' as const,transition:'border-color 0.2s' }}
              onFocus={e=>{e.target.style.borderColor='rgba(0,229,212,0.35)';}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.07)';}} />
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {FILTERS.map(f=>(
              <button key={f.v} onClick={()=>setFilter(f.v)}
                style={{ padding:'8px 14px',background:filter===f.v?'rgba(0,229,212,0.1)':'rgba(255,255,255,0.03)',border:`1px solid ${filter===f.v?'rgba(0,229,212,0.3)':'rgba(255,255,255,0.06)'}`,borderRadius:8,color:filter===f.v?'#00e5d4':'#7a9aaa',fontSize:'0.78rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all 0.2s',whiteSpace:'nowrap' as const }}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a' }}>
            <div style={{ width:36,height:36,margin:'0 auto 12px',border:'3px solid rgba(0,229,212,0.15)',borderTopColor:'#00e5d4',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
            Cargando citas...
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:14,animation:'fadeUp 0.3s ease' }}>
            <div style={{ fontSize:'3rem',marginBottom:12,opacity:0.35 }}>📋</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600 }}>
              {search||filter!=='todas' ? 'Sin resultados' : 'No hay citas registradas'}
            </div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14 }}>
            {filtered.map((a,i)=>(
              <AppointmentCard key={a.id} appointment={a} onRefresh={load} onToast={showToast} onEdit={openEdit} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {formOpen && (
        <Modal title={editTarget ? '✏️ Editar Cita' : '➕ Nueva Cita'} onClose={()=>setFormOpen(false)}>
          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <FormField label="Paciente" name="patientId" value={form.patientId} onChange={handleChange} as="select" required>
              <option value="">— Seleccionar paciente —</option>
              {patients.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
            </FormField>
            <FormField label="Doctor" name="doctorId" value={form.doctorId} onChange={handleChange} as="select" required>
              <option value="">— Seleccionar doctor —</option>
              {doctors.filter(d=>d.status==='activo').map(d=><option key={d.id} value={d.id}>Dr. {d.name} — {d.specialty}</option>)}
            </FormField>
            <FormField label="Área" name="areaId" value={form.areaId??''} onChange={handleChange} as="select">
              <option value="">— Sin área específica —</option>
              {areas.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </FormField>
            <FormField label="Fecha y Hora" name="appointmentDate" type="datetime-local" value={form.appointmentDate} onChange={handleChange} required />
            <FormField label="Motivo" name="reason" value={form.reason} onChange={handleChange} as="textarea" placeholder="Motivo de consulta..." required />
            <FormField label="Notas adicionales" name="notes" value={form.notes??''} onChange={handleChange} as="textarea" placeholder="Observaciones opcionales..." />
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end',paddingTop:4 }}>
              <button type="button" onClick={()=>setFormOpen(false)} style={{ padding:'10px 20px',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#7a9aaa',cursor:'pointer',fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:'0.875rem' }}>Cancelar</button>
              <button type="submit" disabled={submitting} style={{ padding:'10px 24px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',cursor:submitting?'not-allowed':'pointer',fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:'0.875rem',opacity:submitting?0.7:1,display:'flex',alignItems:'center',gap:8 }}>
                {submitting && <span style={{ width:13,height:13,border:'2px solid rgba(3,8,15,0.3)',borderTopColor:'#03080f',borderRadius:'50%',animation:'spin 0.7s linear infinite',display:'inline-block' }} />}
                {submitting ? 'Guardando...' : (editTarget ? 'Actualizar' : 'Crear Cita')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
};
