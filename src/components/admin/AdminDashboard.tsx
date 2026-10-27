import React from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { tenant, orders, products, customers, transactions, setActiveAdminTab } = useCommerce();

  if (!tenant) return null;

  // KPIs
  const totalRevenue = orders
    .filter(o => o.payment_status === 'pago')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrders = orders.filter(o => o.order_status === 'novo' || o.order_status === 'em_preparo');
  const deliveredOrders = orders.filter(o => o.order_status === 'entregue');

  const lowStockProducts = products.filter(p => p.track_stock && p.stock_qty <= 5);

  const totalEntradas = transactions
    .filter(t => t.type === 'entrada' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const saldoCaixa = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      {/* Top Banner de Boas-Vindas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            Painel Executivo • {tenant.name}
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-2">
            Visão Geral do Negócio
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Acompanhe vendas em tempo real, fluxo de caixa, pedidos e níveis de estoque da sua loja.
          </p>
        </div>

        <button
          onClick={() => setActiveAdminTab('pos')}
          className="self-start sm:self-auto px-5 py-3 rounded-2xl font-bold text-xs text-white shadow-lg active:scale-95 transition-all flex items-center gap-2"
          style={{ backgroundColor: tenant.primary_color }}
        >
          <ShoppingCart size={16} />
          <span>Abrir PDV Frente de Caixa</span>
        </button>
      </div>

      {/* 4 Cards de Métricas Principais (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento</p>
            <p className="font-extrabold text-2xl text-slate-900 mt-1">
              R$ {totalRevenue.toFixed(2)}
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp size={12} />
              Vendas Concluídas
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo em Caixa</p>
            <p className="font-extrabold text-2xl text-slate-900 mt-1">
              R$ {saldoCaixa.toFixed(2)}
            </p>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Entradas vs Saídas
            </span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <ArrowUpRight size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pedidos Ativos</p>
            <p className="font-extrabold text-2xl text-slate-900 mt-1">
              {pendingOrders.length}
            </p>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock size={12} />
              Aguardando Entrega
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <ShoppingCart size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total de Clientes</p>
            <p className="font-extrabold text-2xl text-slate-900 mt-1">
              {customers.length}
            </p>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Cadastrados nas Vendas
            </span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Grid: Últimos Pedidos & Alertas de Estoque */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabela de Últimos Pedidos (2 Colunas) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Últimos Pedidos Recebidos
            </h3>
            <button
              onClick={() => setActiveAdminTab('orders')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800"
            >
              Ver Todos ({orders.length})
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <ShoppingCart size={32} className="mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-xs font-semibold text-slate-600">Nenhum pedido registrado ainda.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Ao fazer uma compra na vitrine ou no PDV, os pedidos aparecem aqui automaticamente.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Nº</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Pagamento</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        #{order.order_number}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{order.customer_name}</div>
                        <div className="text-[10px] text-slate-400">{order.customer_whatsapp}</div>
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        R$ {order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.payment_status === 'pago' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.payment_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                          {order.order_status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alerta de Estoque Crítico (1 Coluna) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <AlertCircle size={16} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Nível de Estoque
              </h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl">
                <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-700">Estoque Saudável</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Nenhum item com estoque crítico no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-rose-600 font-semibold">
                  Atenção: {lowStockProducts.length} itens com 5 ou menos unidades!
                </p>
                {lowStockProducts.slice(0, 5).map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800 truncate max-w-[160px]">{prod.name}</span>
                    <span className="font-mono font-extrabold text-rose-600 px-2 py-0.5 rounded bg-rose-50">
                      {prod.stock_qty} un
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveAdminTab('products')}
            className="w-full mt-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Gerenciar Todos os Produtos
          </button>
        </div>
      </div>
    </div>
  );
};
