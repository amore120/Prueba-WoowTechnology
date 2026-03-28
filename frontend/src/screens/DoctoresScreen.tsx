import { useEffect, useState, useCallback } from 'react';
import { Doctor, CreateDoctorDTO, Area } from '../types/appointment';
import { fetchDoctors, createDoctor, updateDoctor, deleteDoctor, fetchAreas } from '../services/api';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';

const EMPTY: CreateDoctorDTO = { name:'', specialty:'', areaId:'', phone:'', email:'', status:'activo' };

export const DoctoresScreen = () => {
  const [items, setItems]           = useState<Doctor[]>([]);
  const [areas, setAreas]           = useState<Area[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [formOpen, setFormOpen]     = useState(false);
  const [editTarget, setEditTarget] = useState<Doctor|null>(null);
  const [form, setForm]             = useState<CreateDoctorDTO>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState<{msg:string;type?:'success'|'error'}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const [d, a] = await Promise.all([fetchDoctors(), fetchAreas()]); setItems(d); setAreas(a); }
    catch { showToast('Error al cargar datos','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const showToast = (msg:string, type?:'success'|'error') => setToast({msg,type});

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setFormOpen(true); };
  const openEdit   = (d: Doctor) => {
    setForm({ name:d.name, specialty:d.specialty, areaId:d.areaId??'', phone:d.phone??'', email:d.email??'', status:d.status });
    setEditTarget(d); setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editTarget) { await updateDoctor(editTarget.id, form); showToast('Doctor actualizado ✓'); }
      else            { await createDoctor(form); showToast('Doctor registrado ✓'); }
      setFormOpen(false); load();
    } catch { showToast('Error al guardar','error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (d: Doctor) => {
    if (!confirm(`¿Eliminar al Dr. ${d.name}?`)) return;
    try { await deleteDoctor(d.id); showToast('Doctor eliminado'); load(); }
    catch { showToast('Error al eliminar','error'); }
  };

  const handleChange = (e: React.ChangeEvent<any>) => setForm(p => ({...p,[e.target.name]:e.target.value}));

  const filtered = items.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const getAreaName = (id?: string) => areas.find(a=>a.id===id)?.name ?? null;

  const specialtyColors: Record<string,string> = {
    'Cardiología':'#ff3f6c','Neurología':'#a78bfa','Pediatría':'#00f59b',
    'Traumatología':'#ffcb47','Dermatología':'#00e5d4','Oncología':'#ff8a65',
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
      <div style={{ padding:'22px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(3,8,15,0.6)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.25rem', fontWeight:800, color:'#dff0f5', margin:0 }}>Doctores</h1>
          <p style={{ color:'#3d5a6a', fontSize:'0.78rem', margin:'2px 0 0' }}>
            {items.filter(d=>d.status==='activo').length} activo{items.filter(d=>d.status==='activo').length!==1?'s':''} de {items.length} registrado{items.length!==1?'s':''}
          </p>
        </div>
        <button onClick={openCreate} style={{ padding:'10px 20px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',fontWeight:700,cursor:'pointer',fontSize:'0.85rem',fontFamily:"'Syne',sans-serif",boxShadow:'0 4px 20px rgba(0,229,212,0.3)' }}>
          + Nuevo Doctor
        </button>
      </div>

      <div style={{ padding:'24px 32px', flex:1 }}>
        <div style={{ position:'relative', maxWidth:360, marginBottom:24 }}>
          <span style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#3d5a6a',fontSize:13 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por nombre o especialidad..."
            style={{ width:'100%',padding:'9px 14px 9px 34px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#dff0f5',fontSize:'0.85rem',outline:'none',fontFamily:"'Outfit',sans-serif",boxSizing:'border-box' as const }}
            onFocus={e=>{e.target.style.borderColor='rgba(0,229,212,0.35)';}} onBlur={e=>{e.target.style.borderColor='rgba(255,255,255,0.07)';}} />
        </div>

        {loading ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a' }}>
            <div style={{ width:36,height:36,margin:'0 auto 12px',border:'3px solid rgba(0,229,212,0.15)',borderTopColor:'#00e5d4',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:14 }}>
            <div style={{ fontSize:'3rem',marginBottom:12,opacity:0.35 }}>🩺</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600 }}>{search?'Sin resultados':'No hay doctores registrados'}</div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
            {filtered.map((d,i) => {
              const areaName  = getAreaName(d.areaId);
              const initials  = d.name.split(' ').slice(0,2).map((n:string)=>n[0]).join('').toUpperCase();
              const specColor = Object.entries(specialtyColors).find(([k])=>d.specialty.toLowerCase().includes(k.toLowerCase()))?.[1] ?? '#00e5d4';
              return (
                <div key={d.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:20,display:'flex',flexDirection:'column',gap:14,animation:'fadeUp 0.4s ease both',animationDelay:`${i*50}ms`,transition:'all 0.2s',position:'relative',overflow:'hidden' }}
                  onMouseEnter={e=>{e.currentTarget.style.border='1px solid rgba(0,229,212,0.18)';e.currentTarget.style.transform='translateY(-2px)';}}
                  onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';}}>

                  {/* Status indicator */}
                  <div style={{ position:'absolute',top:14,right:14,display:'flex',alignItems:'center',gap:5,fontSize:'0.65rem',fontWeight:700,color:d.status==='activo'?'#00f59b':'#ff3f6c',background:d.status==='activo'?'rgba(0,245,155,0.1)':'rgba(255,63,108,0.1)',border:`1px solid ${d.status==='activo'?'rgba(0,245,155,0.25)':'rgba(255,63,108,0.25)'}`,borderRadius:20,padding:'3px 8px',textTransform:'uppercase' as const,letterSpacing:'0.05em' }}>
                    <span style={{ width:5,height:5,borderRadius:'50%',background:d.status==='activo'?'#00f59b':'#ff3f6c',boxShadow:`0 0 5px ${d.status==='activo'?'#00f59b':'#ff3f6c'}` }} />
                    {d.status}
                  </div>

                  <div style={{ display:'flex',gap:12,alignItems:'center' }}>
                    <div style={{ width:48,height:48,borderRadius:'50%',background:`linear-gradient(135deg,${specColor}30,${specColor}10)`,border:`1px solid ${specColor}40`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.05rem',color:specColor,flexShrink:0 }}>
                      {initials}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',color:'#dff0f5',paddingRight:60 }}>Dr. {d.name}</div>
                      <div style={{ fontSize:'0.72rem',color:specColor,fontWeight:600,marginTop:2 }}>{d.specialty}</div>
                    </div>
                  </div>

                  <div style={{ height:1,background:'rgba(255,255,255,0.04)' }} />

                  <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                    {areaName && <div style={{ fontSize:'0.78rem',color:'#a78bfa' }}>🏥 {areaName}</div>}
                    {d.phone && <div style={{ fontSize:'0.78rem',color:'#7a9aaa' }}>📞 {d.phone}</div>}
                    {d.email && <div style={{ fontSize:'0.78rem',color:'#7a9aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' as const }}>✉️ {d.email}</div>}
                  </div>

                  <div style={{ display:'flex',gap:6 }}>
                    <button onClick={()=>openEdit(d)} style={{ flex:1,padding:'8px',background:'rgba(0,229,212,0.08)',border:'1px solid rgba(0,229,212,0.2)',borderRadius:8,color:'#00e5d4',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Editar</button>
                    <button onClick={()=>handleDelete(d)} style={{ flex:1,padding:'8px',background:'rgba(255,63,108,0.07)',border:'1px solid rgba(255,63,108,0.18)',borderRadius:8,color:'#ff3f6c',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editTarget ? '✏️ Editar Doctor' : '➕ Nuevo Doctor'} onClose={()=>setFormOpen(false)}>
          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <FormField label="Nombre completo" name="name" value={form.name} onChange={handleChange} placeholder="Nombre y apellidos" required />
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              <FormField label="Especialidad" name="specialty" value={form.specialty} onChange={handleChange} placeholder="Ej: Cardiología" required />
              <FormField label="Estado" name="status" value={form.status} onChange={handleChange} as="select">
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </FormField>
            </div>
            <FormField label="Área" name="areaId" value={form.areaId??''} onChange={handleChange} as="select">
              <option value="">— Sin área asignada —</option>
              {areas.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </FormField>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
              <FormField label="Teléfono" name="phone" value={form.phone??''} onChange={handleChange} placeholder="+593 99..." />
              <FormField label="Email" name="email" type="email" value={form.email??''} onChange={handleChange} placeholder="dr@clinica.com" />
            </div>
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
