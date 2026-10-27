import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  Truck, 
  Menu, 
  X,
  Layers,
  ChevronDown
} from 'lucide-react';

interface StoreHeaderProps {
  onOpenCart: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  onOpenCart,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}) => {
  const { tenant, allTenants, loadTenantBySlug, categories, cartCount } = useCommerce();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  if (!tenant) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Bar de Avisos & Frete Grátis */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Truck size={13} />
              Frete Grátis acima de R$ {tenant.free_shipping_threshold.toFixed(2)}
            </span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Clock size={13} />
              Previsão: {tenant.delivery_estimate}
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <MapPin size={13} />
              {tenant.address_city} - {tenant.address_state}
            </span>
          </div>

          {/* Troca Rápida de Demonstração Multiloja para Você Testar */}
          <div className="relative shrink-0">
            <button
              onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors border border-slate-700"
              title="Demonstração Multi-Tenant"
            >
              <Layers size={11} className="text-amber-400" />
              <span>Segmento: <strong>{tenant.name.split(' ')[0]}</strong></span>
              <ChevronDown size={11} />
            </button>

            {tenantDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
                  Lojas Demonstrativas
                </div>
                {allTenants.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      loadTenantBySlug(t.slug);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      t.id === tenant.id ? 'font-bold text-slate-950 bg-slate-100/60' : 'text-slate-600'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase font-mono">
                      {t.segment}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo e Nome da Loja */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setSelectedCategory(''); setSearchTerm(''); }}
              className="flex items-center gap-3 text-left group"
            >
              <div 
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md overflow-hidden ring-2 ring-slate-100 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: tenant.primary_color }}
              >
                {tenant.logo_url ? (
                  <img src={tenant.logo_url} alt={tenant.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-xl">{tenant.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="font-display font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-slate-700 transition-colors">
                  {tenant.name}
                </h1>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {tenant.slogan}
                </p>
              </div>
            </button>
          </div>

          {/* Barra de Busca Centralizada */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Buscar produtos em ${tenant.name}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-slate-200/80 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 outline-none transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Contato Rápido & Carrinho Lateral */}
          <div className="flex items-center gap-2 sm:gap-3">
            {tenant.whatsapp && (
              <a
                href={`https://wa.me/55${tenant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vim pelo site ${tenant.name} e gostaria de mais informações.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200/60"
              >
                <Phone size={14} />
                <span>Atendimento WhatsApp</span>
              </a>
            )}

            {/* Botão Carrinho */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: tenant.primary_color }}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Sacola</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-slate-950 font-bold text-xs shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Campo de Busca no Mobile */}
        <div className="md:hidden mt-3">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Buscar produtos...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100/90 text-xs text-slate-900 rounded-full border border-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Régua de Categorias Horizontal (Estilo LMA Cosméticos - Não Rola para Fora) */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'text-white shadow-sm'
                  : 'text-slate-600 bg-slate-100/80 hover:bg-slate-200/80'
              }`}
              style={selectedCategory === '' ? { backgroundColor: tenant.primary_color } : {}}
            >
              Todos os Produtos
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 bg-slate-100/80 hover:bg-slate-200/80'
                }`}
                style={selectedCategory === cat.slug ? { backgroundColor: tenant.primary_color } : {}}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
