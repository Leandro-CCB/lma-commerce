import React from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { MapPin, Phone, Mail, Shield, Lock, Layers } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const { tenant, setViewMode } = useCommerce();
  if (!tenant) return null;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Loja e Slogan */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: tenant.primary_color }}
              >
                {tenant.name.charAt(0)}
              </div>
              <span className="font-display font-extrabold text-base text-white">
                {tenant.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light">
              {tenant.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-slate-500 text-[11px]">
              <Shield size={14} className="text-emerald-400" />
              <span>Ambiente Seguro com Criptografia SSL</span>
            </div>
          </div>

          {/* Coluna 2: Localização & Horários */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Endereço & Retirada
            </h4>
            <p className="flex items-start gap-2 text-slate-400 leading-snug">
              <MapPin size={14} className="shrink-0 mt-0.5 text-slate-300" />
              <span>
                {tenant.address_street}, {tenant.address_number} - {tenant.address_neighborhood}<br />
                {tenant.address_city} - {tenant.address_state}, CEP {tenant.address_zip}
              </span>
            </p>
            {tenant.allows_pickup && (
              <p className="mt-2.5 text-[11px] text-amber-300/80 bg-amber-950/30 p-2 rounded-lg border border-amber-800/30">
                {tenant.pickup_instructions}
              </p>
            )}
          </div>

          {/* Coluna 3: Atendimento Oficial */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Fale Conosco
            </h4>
            <ul className="space-y-2">
              {tenant.whatsapp && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-400" />
                  <a 
                    href={`https://wa.me/55${tenant.whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-white transition-colors"
                  >
                    WhatsApp: {tenant.whatsapp}
                  </a>
                </li>
              )}
              {tenant.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-slate-400" />
                  <span className="hover:text-white transition-colors">{tenant.email}</span>
                </li>
              )}
              {tenant.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-slate-400" />
                  <span>Fixo: {tenant.phone}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 4: Plataforma LMA & Acesso Administrativo */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Tecnologia LMA Soluções
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-4">
              Plataforma desenvolvida com alto desempenho, multi-tenant em nuvem e gestão integrada de estoque e vendas.
            </p>

            <div className="flex flex-col gap-2">
              {/* Botão de Área do Administrador (Padrão Solicitado pelo Chefe) */}
              <button
                onClick={() => setViewMode('admin')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-xs transition-all shadow-sm group"
              >
                <Lock size={13} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Área do Administrador (ERP)</span>
              </button>

              {/* Botão SuperAdmin / Multi-Tenant */}
              <button
                onClick={() => setViewMode('superadmin')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-[11px] font-medium transition-colors"
              >
                <Layers size={12} />
                <span>Painel LMA Commerce (Multi-Tenant)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1 font-medium">
            <span>Powered by</span>
            <strong className="text-slate-400">LMA Soluções Tecnológicas</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
