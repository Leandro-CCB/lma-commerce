import React from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { StoreHome } from './components/store/StoreHome';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPos } from './components/admin/AdminPos';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminFinance } from './components/admin/AdminFinance';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminSettings } from './components/admin/AdminSettings';
import { SuperAdminHub } from './components/superadmin/SuperAdminHub';

const MainRouter: React.FC = () => {
  const { viewMode, activeAdminTab, loading, tenant } = useCommerce();

  if (loading && !tenant) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-display font-bold text-lg tracking-wide">Carregando LMA Commerce...</p>
        <p className="text-xs text-slate-400 mt-1">Conectando ao banco de dados multi-tenant</p>
      </div>
    );
  }

  // 1. Visão SuperAdmin (Painel de Gestão de Lojas LMA)
  if (viewMode === 'superadmin') {
    return <SuperAdminHub />;
  }

  // 2. Visão ERP Administrativo
  if (viewMode === 'admin') {
    return (
      <AdminLayout>
        {activeAdminTab === 'dashboard' && <AdminDashboard />}
        {activeAdminTab === 'pos' && <AdminPos />}
        {activeAdminTab === 'orders' && <AdminOrders />}
        {activeAdminTab === 'products' && <AdminProducts />}
        {activeAdminTab === 'cashflow' && <AdminFinance type="cashflow" />}
        {activeAdminTab === 'payables' && <AdminFinance type="payables" />}
        {activeAdminTab === 'receivables' && <AdminFinance type="receivables" />}
        {activeAdminTab === 'customers' && <AdminCustomers />}
        {activeAdminTab === 'dre' && <AdminFinance type="dre" />}
        {activeAdminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // 3. Visão Padrão do Cliente Final: Loja Virtual 100% Limpa e Luxuosa
  return <StoreHome />;
};

export const App: React.FC = () => {
  return (
    <CommerceProvider>
      <MainRouter />
    </CommerceProvider>
  );
};

export default App;
