import React from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Sparkles, ShieldCheck, CreditCard, Clock, ArrowRight } from 'lucide-react';

export const StoreHero: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const { tenant } = useCommerce();
  if (!tenant) return null;

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Imagem de Fundo com Overlay Gradiente */}
      <div className="absolute inset-0 z-0">
        <img 
          src={tenant.banner_url} 
          alt={tenant.name} 
          className="w-full h-full object-cover opacity-25 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-amber-300 mb-4">
            <Sparkles size={14} />
            <span>Coleção Oficial 2026</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
            {tenant.slogan}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-8">
            {tenant.description}
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onExplore}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: tenant.primary_color }}
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={16} />
            </button>

            {tenant.whatsapp && (
              <a
                href={`https://wa.me/55${tenant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de consultar o catálogo da ${tenant.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all"
              >
                Falar com Vendedor
              </a>
            )}
          </div>
        </div>

        {/* 4 Cards de Garantia e Confiança (Padrão LMA Cosméticos) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Compra Segura</p>
              <p className="text-[11px] text-slate-400">Garantia total</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">PIX ou Cartão</p>
              <p className="text-[11px] text-slate-400">Até 10x sem juros</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-300">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Envio Rápido</p>
              <p className="text-[11px] text-slate-400">Pronta entrega</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Qualidade LMA</p>
              <p className="text-[11px] text-slate-400">100% autêntico</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
