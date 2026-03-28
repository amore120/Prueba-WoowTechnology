import { useEffect, useState, useCallback } from 'react';
import { Patient, CreatePatientDTO } from '../types/appointment';
import { fetchPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';

const EMPTY: CreatePatientDTO = { name:'', dni:'', phone:'', email:'', birthDate:'', gender:'masculino', address:'' };

export const PacientesScreen = () => {
  const [items, setItems]         = useState<Patient[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [formOpen, setFormOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Patient|null>(null);
  const [form, setForm]           = useState<CreatePatientDTO>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState<{msg:string;type?:'success'|'error'}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchPatients()); }
    catch { showToast('Error al cargar pacientes','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const showToast = (msg:string, type?:'success'|'error') => setToast({msg,type});

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setFormOpen(true); };
  const openEdit   = (p: Patient) => {
    setForm({ name:p.name, dni:p.dni??'', phone:p.phone??'', email:p.email??'', birthDate:p.birthDate??'', gender:p.gender??'masculino', address:p.address??'' });
    setEditTarget(p); setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editTarget) { await updatePatient(editTarget.id, form); showToast('Paciente actualizado ✓'); }
      else            { await createPatient(form); showToast('Paciente registrado ✓'); }
      setFormOpen(false); load();
    } catch { showToast('Error al guardar','error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (p: Patient) => {
    if (!confirm(`¿Eliminar a ${p.name}?`)) return;
    try { await deletePatient(p.id); showToast('Paciente eliminado'); load(); }
    catch { showToast('Error al eliminar','error'); }
  };

  const handleChange = (e: React.ChangeEvent<any>) => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.dni??'').includes(search) || (p.email??'').toLowerCase().includes(search.toLowerCase())
  );

  const calcAge = (bd?: string) => {
    if (!bd) return null;
    const diff = Date.now() - new Date(bd).getTime();
    return Math.floor(diff / (365.25*24*60*60*1000));
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
      {/* Header */}
      <div style={{ padding:'22px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(3,8,15,0.6)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.25rem', fontWeight:800, color:'#dff0f5', margin:0 }}>Pacientes</h1>
          <p style={{ color:'#3d5a6a', fontSize:'0.78rem', margin:'2px 0 0' }}>{items.length} paciente{items.length!==1?'s':''} registrado{items.length!==1?'s':''}</p>
        </div>
        <button onClick={openCreate} style={{ padding:'10px 20px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',fontWeight:700,cursor:'pointer',fontSize:'0.85rem',fontFamily:"'Syne',sans-serif",boxShadow:'0 4px 20px rgba(0,229,212,0.3)' }}>
          + Nuevo Paciente
        </button>
      </div>

      <div style={{ padding:'24px 32px', flex:1 }}>
        {/* Search */}
        <div style={{ position:'relative', maxWidth:360, marginBottom:24 }}>
          <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#3d5a6a',fontSize:13 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre, DNI o email..."
            style={{ width:'100%',padding:'9px 14px 9px 34px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#dff0f5',fontSize:'0.85rem',outline:'none',fontFamily:"'Outfit',sans-serif",boxSizing:'border-box' as const }}
            onFocus={e=>{e.target.style.borderColor='rgba(0,229,212,0.35)';}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.07)';}} />
        </div>

        {loading ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a' }}>
            <div style={{ width:36,height:36,margin:'0 auto 12px',border:'3px solid rgba(0,229,212,0.15)',borderTopColor:'#00e5d4',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:14 }}>
            <div style={{ fontSize:'3rem',marginBottom:12,opacity:0.35 }}>👤</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600 }}>
              {search ? 'Sin resultados' : 'No hay pacientes registrados'}
            </div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
            {filtered.map((p,i)=>{
              const age = calcAge(p.birthDate);
              const initials = p.name.split(' ').slice(0,2).map((n:string)=>n[0]).join('').toUpperCase();
              return (
                <div key={p.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:20,display:'flex',flexDirection:'column',gap:14,animation:'fadeUp 0.4s ease both',animationDelay:`${i*50}ms`,transition:'all 0.2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgba(0,229,212,0.18)';e.currentTarget.style.transform='translateY(-2px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';}}>
                  {/* Avatar + nombre */}
                  <div style={{ display:'flex',gap:12,alignItems:'center' }}>
                    <div style={{ width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,rgba(0,229,212,0.2),rgba(0,245,155,0.1))',border:'1px solid rgba(0,229,212,0.25)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1rem',color:'#00e5d4',flexShrink:0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',color:'#dff0f5' }}>{p.name}</div>
                      {p.dni && <div style={{ fontSize:'0.72rem',color:'#3d5a6a',fontFamily:"'JetBrains Mono',monospace",marginTop:2 }}>DNI: {p.dni}</div>}
                    </div>
                  </div>

                  <div style={{ height:1,background:'rgba(255,255,255,0.04)' }} />

                  {/* Info */}
                  <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                    {age !== null && <div style={{ fontSize:'0.78rem',color:'#7a9aaa' }}>🎂 {age} años — {p.gender ?? '—'}</div>}
                    {p.phone && <div style={{ fontSize:'0.78rem',color:'#7a9aaa' }}>📞 {p.phone}</div>}
                    {p.email && <div style={{ fontSize:'0.78rem',color:'#7a9aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>✉️ {p.email}</div>}
                    {p.address && <div style={{ fontSize:'0.75rem',color:'#3d5a6a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>📍 {p.address}</div>}
                  </div>

                  <div style={{ display:'flex',gap:6 }}>
                    <button onClick={()=>openEdit(p)} style={{ flex:1,padding:'8px',background:'rgba(0,229,212,0.08)',border:'1px solid rgba(0,229,212,0.2)',borderRadius:8,color:'#00e5d4',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Editar</button>
                    <button onClick={()=>handleDelete(p)} style={{ flex:1,padding:'8px',background:'rgba(255,63,108,0.07)',border:'1px solid rgba(255,63,108,0.18)',borderRadius:8,color:'#ff3f6c',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editTarget ? '✏️ Editar Paciente' : '➕ Nuevo Paciente'} onClose={()=>setFormOpen(false)}>
          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <FormField label="Nombre completo" name="name" value={form.name} onChange={handleChange} placeholder="Nombre y apellidos" required />
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              <FormField label="DNI / Cédula" name="dni" value={form.dni??''} onChange={handleChange} placeholder="12345678" />
              <FormField label="Género" name="gender" value={form.gender??'masculino'} onChange={handleChange} as="select">
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </FormField>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              <FormField label="Teléfono" name="phone" value={form.phone??''} onChange={handleChange} placeholder="+593 99..." />
              <FormField label="Fecha de nacimiento" name="birthDate" type="date" value={form.birthDate??''} onChange={handleChange} />
            </div>
            <FormField label="Email" name="email" type="email" value={form.email??''} onChange={handleChange} placeholder="correo@ejemplo.com" />
            <FormField label="Dirección" name="address" value={form.address??''} onChange={handleChange} as="textarea" placeholder="Dirección completa..." />
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end',paddingTop:4 }}>
              <button type="button" onClick={()=>setFormOpen(false)} style={{ padding:'10px 20px',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#7a9aaa',cursor:'pointer',fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:'0.875rem' }}>Cancelar</button>
              <button type="submit" disabled={submitting} style={{ padding:'10px 24px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',cursor:submitting?'not-allowed':'pointer',fontWeight:700,fontFamily:"'Syne',sans-serif",fontSize:'0.875rem',opacity:submitting?0.7:1 }}>
                {submitting ? 'Guardando...' : (editTarget?'Actualizar':'Registrar')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
};
