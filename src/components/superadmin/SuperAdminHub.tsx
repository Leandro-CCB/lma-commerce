import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  Layers, 
  Plus, 
  Store, 
  ExternalLink, 
  Palette, 
  Sparkles, 
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import { SEGMENT_TEMPLATES } from '../../lib/templates';

export const SuperAdminHub: React.FC = () => {
  const { allTenants, tenant, loadTenantBySlug, createTenant, setViewMode } = useCommerce();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [segment, setSegment] = useState('moda');
  const [whatsapp, setWhatsapp] = useState('');

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    createTenant({
      name,
      slug: finalSlug,
      segment: segment as any,
      whatsapp
    }, segment);

    setModalOpen(false);
    setName('');
    setSlug('');
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Topo do SuperAdmin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/30">
                LMA SOLUÇÕES MULTI-TENANT
              </span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white mt-2">
              LMA Commerce — Painel Coringa
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gerencie todas as lojas e clientes criados na plataforma para qualquer segmento
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('store')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Voltar para Loja Atual</span>
            </button>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>Criar Nova Loja</span>
            </button>
          </div>
        </div>

        {/* Grid de Tenants / Lojas Criadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTenants.map((t) => {
            const isCurrent = t.id === tenant?.id;
            return (
              <div
                key={t.id}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-slate-800/90 border-amber-500/80 ring-2 ring-amber-500/30 shadow-xl' 
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm"
                        style={{ backgroundColor: t.primary_color }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-white leading-tight">
                          {t.name}
                        </h3>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                          Segmento: {t.segment}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                        Ativa
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-light">
                    {t.slogan}
                  </p>

                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <p>Slug: <strong className="text-slate-200">/loja/{t.slug}</strong></p>
                    <p>WhatsApp: <strong className="text-slate-200">{t.whatsapp || 'Não informado'}</strong></p>
                    <p>Cor Primária: <span className="inline-block w-2.5 h-2.5 rounded-full align-middle ml-1" style={{ backgroundColor: t.primary_color }} /> {t.primary_color}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => {
                      loadTenantBySlug(t.slug);
                      setViewMode('store');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors text-center"
                  >
                    Abrir Loja
                  </button>

                  <button
                    onClick={() => {
                      loadTenantBySlug(t.slug);
                      setViewMode('admin');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors text-center"
                  >
                    Painel ERP
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de Criação de Novo Tenant */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
                <h3 className="font-display font-bold text-lg text-white">Criar Nova Loja (Tenant)</h3>
                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Nome do Cliente / Loja *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bella Modas, Confeitaria do Zé..."
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Slug da URL (/loja/slug) *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 font-mono text-amber-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Segmento de Negócio</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-medium"
                  >
                    <option value="moda">Vestuário / Moda (Blusas, vestidos, calças)</option>
                    <option value="gastronomia">Gastronomia (Bolos, salgados, doces)</option>
                    <option value="calcados">Calçados (Chinelos, sapatos, tênis)</option>
                    <option value="acessorios">Acessórios (Bolsas, mochilas, couros)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">WhatsApp da Loja</label>
                  <input
                    type="tel"
                    placeholder="11999998888"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl font-bold bg-slate-700 text-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg"
                  >
                    Gerar Loja em 1 Clique
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
