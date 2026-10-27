import React from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  CircleDollarSign, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  Sliders, 
  ArrowLeft,
  Truck,
  Sparkles,
  Layers
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { tenant, setViewMode, activeAdminTab, setActiveAdminTab, orders } = useCommerce();

  if (!tenant) return null;

  const newOrdersCount = orders.filter(o => o.order_status === 'novo').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
    { id: 'pos', label: 'PDV Frente de Caixa', icon: ShoppingCart },
    { id: 'orders', label: 'Pedidos & Vendas', icon: Truck, badge: newOrdersCount > 0 ? newOrdersCount : undefined },
    { id: 'products', label: 'Produtos & Estoque', icon: Package },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: CircleDollarSign },
    { id: 'payables', label: 'Contas a Pagar', icon: ArrowUpRight },
    { id: 'receivables', label: 'Contas a Receber', icon: ArrowDownLeft },
    { id: 'customers', label: 'Clientes & CRM', icon: Users },
    { id: 'dre', label: 'DRE & Relatórios', icon: FileText },
    { id: 'settings', label: 'Aparência & Loja', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Ruler Bar - Régua Superior com Destaque Forte na Aba Ativa */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            
            {/* Identificação da Loja e Botão Voltar para Loja */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('store')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                title="Voltar para a Loja Virtual"
              >
                <ArrowLeft size={14} />
                <span>Ver Loja</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 border-l border-slate-800 pl-3">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ backgroundColor: tenant.primary_color }}
                >
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  <span className="font-display font-extrabold text-sm text-white tracking-wide">
                    {tenant.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono ml-2 uppercase">
                    ERP {tenant.segment}
                  </span>
                </div>
              </div>
            </div>

            {/* Alternador Rápido de Abas em Estilo Régua */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {menuItems.slice(0, 7).map(item => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Troca de Loja / Multi-Tenant */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('superadmin')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Layers size={13} />
                <span className="hidden sm:inline">Multi-Tenant</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Corpo com Sidebar Fixa e Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-6">
        
        {/* Sidebar Fixa Não-Rolável */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 sticky top-20 h-[calc(100vh-6rem)] justify-between">
          <div>
            <div className="px-3 py-2 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Menu de Gestão
              </p>
            </div>

            <nav className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Rodapé da Sidebar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                <Sparkles size={14} className="text-amber-600" />
                <span>Segmento Ativo</span>
              </div>
              <p className="text-[11px] text-amber-800 capitalize font-medium">
                {tenant.segment} ({tenant.slug})
              </p>
            </div>
          </div>
        </aside>

        {/* Área Principal de Renderização */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
