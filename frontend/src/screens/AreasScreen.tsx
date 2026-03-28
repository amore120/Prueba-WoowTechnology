import { useEffect, useState, useCallback } from 'react';
import { Area, CreateAreaDTO } from '../types/appointment';
import { fetchAreas, createArea, updateArea, deleteArea } from '../services/api';
import { Modal } from '../components/Modal';
import { FormField } from '../components/FormField';
import { Toast } from '../components/Toast';

const COLORS = ['#00e5d4','#00f59b','#a78bfa','#ffcb47','#ff3f6c','#60a5fa','#fb923c','#34d399'];
const EMPTY: CreateAreaDTO = { name:'', description:'', color:'#00e5d4' };

export const AreasScreen = () => {
  const [items, setItems]           = useState<Area[]>([]);
  const [loading, setLoading]       = useState(true);
  const [formOpen, setFormOpen]     = useState(false);
  const [editTarget, setEditTarget] = useState<Area|null>(null);
  const [form, setForm]             = useState<CreateAreaDTO>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState<{msg:string;type?:'success'|'error'}|null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await fetchAreas()); }
    catch { showToast('Error al cargar áreas','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  const showToast = (msg:string, type?:'success'|'error') => setToast({msg,type});

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setFormOpen(true); };
  const openEdit   = (a: Area) => {
    setForm({ name:a.name, description:a.description??'', color:a.color });
    setEditTarget(a); setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      if (editTarget) { await updateArea(editTarget.id, form); showToast('Área actualizada ✓'); }
      else            { await createArea(form); showToast('Área creada ✓'); }
      setFormOpen(false); load();
    } catch { showToast('Error al guardar','error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (a: Area) => {
    if (!confirm(`¿Eliminar el área "${a.name}"?`)) return;
    try { await deleteArea(a.id); showToast('Área eliminada'); load(); }
    catch { showToast('Error al eliminar','error'); }
  };

  const handleChange = (e: React.ChangeEvent<any>) => setForm(p => ({...p,[e.target.name]:e.target.value}));

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
      <div style={{ padding:'22px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(3,8,15,0.6)', backdropFilter:'blur(10px)', position:'sticky', top:0, zIndex:40 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:'1.25rem', fontWeight:800, color:'#dff0f5', margin:0 }}>Áreas Médicas</h1>
          <p style={{ color:'#3d5a6a', fontSize:'0.78rem', margin:'2px 0 0' }}>{items.length} área{items.length!==1?'s':''} registrada{items.length!==1?'s':''}</p>
        </div>
        <button onClick={openCreate} style={{ padding:'10px 20px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',fontWeight:700,cursor:'pointer',fontSize:'0.85rem',fontFamily:"'Syne',sans-serif",boxShadow:'0 4px 20px rgba(0,229,212,0.3)' }}>
          + Nueva Área
        </button>
      </div>

      <div style={{ padding:'24px 32px', flex:1 }}>
        {loading ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a' }}>
            <div style={{ width:36,height:36,margin:'0 auto 12px',border:'3px solid rgba(0,229,212,0.15)',borderTopColor:'#00e5d4',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />
          </div>
        ) : items.length===0 ? (
          <div style={{ textAlign:'center',padding:'80px 0',color:'#3d5a6a',border:'1px dashed rgba(255,255,255,0.06)',borderRadius:14 }}>
            <div style={{ fontSize:'3rem',marginBottom:12,opacity:0.35 }}>🏥</div>
            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:600 }}>No hay áreas registradas</div>
            <div style={{ fontSize:'0.82rem',marginTop:6,opacity:0.6 }}>Crea áreas como Cardiología, Pediatría, etc.</div>
          </div>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14 }}>
            {items.map((a,i) => (
              <div key={a.id} style={{ background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:16,padding:22,display:'flex',flexDirection:'column',gap:14,animation:'fadeUp 0.4s ease both',animationDelay:`${i*50}ms`,transition:'all 0.2s',overflow:'hidden',position:'relative' }}
                onMouseEnter={e=>{e.currentTarget.style.border=`1px solid ${a.color}35`;e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.border='1px solid rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';}}>

                {/* Decorative top bar */}
                <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${a.color},${a.color}60)`,borderRadius:'16px 16px 0 0' }} />
                {/* Ambient glow */}
                <div style={{ position:'absolute',top:-20,right:-20,width:100,height:100,background:`radial-gradient(circle,${a.color}18 0%,transparent 70%)`,pointerEvents:'none' }} />

                {/* Icon + name */}
                <div style={{ display:'flex',alignItems:'center',gap:14,paddingTop:8 }}>
                  <div style={{ width:48,height:48,borderRadius:14,background:`${a.color}18`,border:`1px solid ${a.color}35`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>
                    🏥
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1rem',color:'#dff0f5',letterSpacing:'-0.01em' }}>{a.name}</div>
                    <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:4 }}>
                      <div style={{ width:10,height:10,borderRadius:'50%',background:a.color,boxShadow:`0 0 6px ${a.color}` }} />
                      <span style={{ fontSize:'0.65rem',color:'#3d5a6a',fontFamily:"'JetBrains Mono',monospace" }}>{a.color}</span>
                    </div>
                  </div>
                </div>

                {a.description && (
                  <div style={{ fontSize:'0.8rem',color:'#7a9aaa',lineHeight:1.5,borderLeft:`2px solid ${a.color}40`,paddingLeft:10 }}>
                    {a.description}
                  </div>
                )}

                <div style={{ display:'flex',gap:6,marginTop:'auto' }}>
                  <button onClick={()=>openEdit(a)} style={{ flex:1,padding:'8px',background:`${a.color}12`,border:`1px solid ${a.color}30`,borderRadius:8,color:a.color,fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Editar</button>
                  <button onClick={()=>handleDelete(a)} style={{ flex:1,padding:'8px',background:'rgba(255,63,108,0.07)',border:'1px solid rgba(255,63,108,0.18)',borderRadius:8,color:'#ff3f6c',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editTarget ? '✏️ Editar Área' : '➕ Nueva Área'} onClose={()=>setFormOpen(false)}>
          <form onSubmit={handleSubmit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <FormField label="Nombre del área" name="name" value={form.name} onChange={handleChange} placeholder="Ej: Cardiología, Pediatría..." required />
            <FormField label="Descripción" name="description" value={form.description??''} onChange={handleChange} as="textarea" placeholder="Descripción breve del área médica..." />
            <div>
              <label style={{ display:'block',marginBottom:10,fontSize:'0.68rem',color:'#3d5a6a',fontWeight:700,letterSpacing:'0.09em',textTransform:'uppercase' as const,fontFamily:"'Syne',sans-serif" }}>
                Color identificador
              </label>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' as const }}>
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={()=>setForm(p=>({...p,color:c}))}
                    style={{ width:32,height:32,borderRadius:'50%',background:c,border:form.color===c?`3px solid white`:'3px solid transparent',cursor:'pointer',transition:'all 0.15s',boxShadow:form.color===c?`0 0 12px ${c}`:'none',outline:'none' }} />
                ))}
              </div>
              <div style={{ marginTop:8,fontSize:'0.75rem',color:'#3d5a6a' }}>
                Color seleccionado: <span style={{ color:form.color,fontFamily:"'JetBrains Mono',monospace",fontWeight:600 }}>{form.color}</span>
              </div>
            </div>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end',paddingTop:4 }}>
              <button type="button" onClick={()=>setFormOpen(false)} style={{ padding:'10px 20px',background:'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,color:'#7a9aaa',cursor:'pointer',fontFamily:"'Outfit',sans-serif",fontWeight:600 }}>Cancelar</button>
              <button type="submit" disabled={submitting} style={{ padding:'10px 24px',background:'linear-gradient(135deg,#00e5d4,#00bfb3)',border:'none',borderRadius:10,color:'#03080f',cursor:submitting?'not-allowed':'pointer',fontWeight:700,fontFamily:"'Syne',sans-serif",opacity:submitting?0.7:1 }}>
                {submitting ? 'Guardando...' : (editTarget?'Actualizar':'Crear Área')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)} />}
    </div>
  );
};
