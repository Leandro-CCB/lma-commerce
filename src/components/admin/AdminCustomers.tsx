import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Users, Search, Phone, ShoppingCart, Award } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { tenant, customers } = useCommerce();
  const [searchTerm, setSearchTerm] = useState('');

  if (!tenant) return null;

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.whatsapp.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Base de Clientes & CRM
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Clientes cadastrados automaticamente através das compras (Zero dados fictícios)
          </p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-xs font-bold text-slate-700">Nenhum cliente cadastrado ainda</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Conforme as vendas são realizadas pelo site ou no PDV, os clientes são adicionados aqui automaticamente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3">Contato WhatsApp</th>
                  <th className="py-2.5 px-3">Endereço</th>
                  <th className="py-2.5 px-3 text-center">Pedidos</th>
                  <th className="py-2.5 px-3 text-right">Total Comprado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 font-mono">
                      <a 
                        href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone size={12} />
                        <span>{c.whatsapp}</span>
                      </a>
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{c.address || '—'}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                        {c.total_orders}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                      R$ {c.total_spent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
