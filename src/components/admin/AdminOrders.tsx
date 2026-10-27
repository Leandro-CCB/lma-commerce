import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { CommerceOrder } from '../../types/commerce';
import { 
  Truck, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  MapPin, 
  PackageCheck,
  ChevronDown
} from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { tenant, orders, updateOrderStatus, updatePaymentStatus } = useCommerce();
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CommerceOrder | null>(null);

  if (!tenant) return null;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'todos' || o.order_status === filterStatus;
    const matchesSearch = !searchTerm || 
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.order_number.toString().includes(searchTerm) ||
      o.customer_whatsapp.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Topo com Título e Filtros */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Gestão de Pedidos & Expedição
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de pedidos online e balcão, status de entrega e confirmação de pagamento
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar pedido ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50"
          >
            <option value="todos">Todos os Status</option>
            <option value="novo">Novos</option>
            <option value="em_preparo">Em Preparo</option>
            <option value="saiu_para_entrega">Em Rota de Entrega</option>
            <option value="entregue">Entregues</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>
      </div>

      {/* Grid de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 text-slate-400">
          <Truck size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
          <p className="text-xs font-bold text-slate-700">Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => (
            <div 
              key={order.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono font-extrabold text-sm text-slate-900">
                    #{order.order_number}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')} {new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-sm text-slate-900">{order.customer_name}</h4>
                  <a 
                    href={`https://wa.me/55${order.customer_whatsapp.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-emerald-700 font-medium hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone size={12} />
                    <span>{order.customer_whatsapp}</span>
                  </a>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.customer_address}</span>
                  </p>
                </div>

                {/* Itens do Pedido */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Itens:</p>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-700">
                      <span className="truncate pr-2">
                        {it.quantity}x {it.product_name}
                      </span>
                      <span className="font-bold shrink-0">R$ {it.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status e Totais */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-500">Total</span>
                  <span className="text-base font-extrabold text-slate-950">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={order.order_status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="flex-1 text-[11px] font-bold py-1.5 px-2 rounded-xl border border-slate-200 bg-slate-50 capitalize"
                  >
                    <option value="novo">Novo</option>
                    <option value="em_preparo">Em Preparo</option>
                    <option value="saiu_para_entrega">Em Entrega</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>

                  <button
                    onClick={() => updatePaymentStatus(order.id, order.payment_status === 'pago' ? 'pendente' : 'pago')}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold transition-colors ${
                      order.payment_status === 'pago' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.payment_status.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
