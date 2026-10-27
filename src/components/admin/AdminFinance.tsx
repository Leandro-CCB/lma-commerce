import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  CheckCircle2, 
  Clock, 
  FileText,
  X
} from 'lucide-react';

export const AdminFinance: React.FC<{ type: 'cashflow' | 'payables' | 'receivables' | 'dre' }> = ({ type }) => {
  const { tenant, transactions, addTransaction, updateTransactionStatus, orders, products } = useCommerce();
  const [modalOpen, setModalOpen] = useState(false);

  // Form de Lançamento
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Despesas Operacionais');
  const [transType, setTransType] = useState<'entrada' | 'saida'>(type === 'payables' ? 'saida' : 'entrada');
  const [account, setAccount] = useState('Caixa Balcão');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  if (!tenant) return null;

  // Filtragem conforme o tipo de tela
  let filtered = transactions;
  if (type === 'payables') {
    filtered = transactions.filter(t => t.type === 'saida');
  } else if (type === 'receivables') {
    filtered = transactions.filter(t => t.type === 'entrada');
  }

  const totalEntradas = transactions
    .filter(t => t.type === 'entrada' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPendentePagar = transactions
    .filter(t => t.type === 'saida' && t.status === 'pendente')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPendenteReceber = transactions
    .filter(t => t.type === 'entrada' && t.status === 'pendente')
    .reduce((acc, t) => acc + t.amount, 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!desc.trim() || !amount) return;

    await addTransaction({
      tenant_id: tenant!.id,
      type: transType,
      category,
      description: desc,
      amount: parseFloat(amount),
      account,
      due_date: dueDate,
      status: 'pago',
      payment_date: new Date().toISOString().split('T')[0]
    });

    setModalOpen(false);
    setDesc('');
    setAmount('');
  }

  // Se for tela DRE Gerencial
  if (type === 'dre') {
    const faturamentoBruto = orders.filter(o => o.payment_status === 'pago').reduce((acc, o) => acc + o.total, 0);
    const cmvEstimado = faturamentoBruto * 0.42; // Custo de mercadoria estimado ~42%
    const lucroBruto = faturamentoBruto - cmvEstimado;
    const despesasOp = totalSaidas;
    const resultadoLiquido = lucroBruto - despesasOp;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            DRE Gerencial — Demonstrativo de Resultados
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Apuração contábil e operacional em tempo real (Sem campos de assinatura - Padrão LMA)
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-4 text-xs font-mono">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="font-bold text-slate-700">(+) RECEITA BRUTA DE VENDAS</span>
            <span className="font-extrabold text-slate-950">R$ {faturamentoBruto.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500">
            <span>(-) Deduções e Taxas de Operação</span>
            <span>R$ 0,00</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-200 font-bold text-slate-900 bg-slate-50 px-2 rounded-lg">
            <span>(=) RECEITA LÍQUIDA</span>
            <span>R$ {faturamentoBruto.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600">
            <span>(-) CMV (Custo de Mercadorias / Insumos)</span>
            <span>- R$ {cmvEstimado.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-200 font-bold text-slate-900 bg-slate-50 px-2 rounded-lg">
            <span>(=) LUCRO BRUTO DA OPERAÇÃO</span>
            <span>R$ {lucroBruto.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600">
            <span>(-) Despesas Operacionais, Fretes e Manutenção</span>
            <span>- R$ {despesasOp.toFixed(2)}</span>
          </div>

          <div className="flex justify-between py-3 border-t-2 border-slate-900 font-extrabold text-sm text-slate-950 bg-amber-50 px-3 rounded-xl border border-amber-200">
            <span>(=) RESULTADO LÍQUIDO / EBITDA</span>
            <span className={resultadoLiquido >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
              R$ {resultadoLiquido.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Topo */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            {type === 'cashflow' && 'Fluxo de Caixa Diário'}
            {type === 'payables' && 'Contas a Pagar'}
            {type === 'receivables' && 'Contas a Receber'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controle de receitas, pagamentos de fornecedores, fretes e conciliação de caixa
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all"
          style={{ backgroundColor: tenant.primary_color }}
        >
          <Plus size={15} />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Entradas Realizadas</p>
          <p className="font-extrabold text-xl text-emerald-600 mt-1">
            R$ {totalEntradas.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saídas Realizadas</p>
          <p className="font-extrabold text-xl text-rose-600 mt-1">
            R$ {totalSaidas.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {type === 'payables' ? 'A Pagar (Pendente)' : 'Saldo Atual em Caixa'}
          </p>
          <p className="font-extrabold text-xl text-slate-900 mt-1">
            R$ {type === 'payables' ? totalPendentePagar.toFixed(2) : (totalEntradas - totalSaidas).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CircleDollarSign size={36} className="mx-auto mb-2 text-slate-300 stroke-1" />
            <p className="text-xs font-bold text-slate-700">Nenhum lançamento encontrado</p>
            <p className="text-[11px] text-slate-400 mt-1">Adicione despesas ou aguarde as vendas automáticas</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Descrição</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Conta</th>
                  <th className="py-2.5 px-3">Valor</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500">{t.due_date}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{t.description}</td>
                    <td className="py-3 px-3 text-slate-500">{t.category}</td>
                    <td className="py-3 px-3 text-slate-500">{t.account}</td>
                    <td className={`py-3 px-3 font-extrabold ${t.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'entrada' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {t.status === 'pendente' && (
                        <button
                          onClick={() => updateTransactionStatus(t.id, 'pago')}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-white hover:bg-slate-800"
                        >
                          Dar Baixa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Lançamento */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">Novo Lançamento Financeiro</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransType('entrada')}
                    className={`py-2 rounded-xl font-bold border ${transType === 'entrada' ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                  >
                    Entrada (Receita)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransType('saida')}
                    className={`py-2 rounded-xl font-bold border ${transType === 'saida' ? 'bg-rose-600 text-white' : 'bg-slate-50'}`}
                  >
                    Saída (Despesa)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Descrição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fornecedor de Tecido, Energia Elétrica..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Data</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white shadow-md"
                  style={{ backgroundColor: tenant.primary_color }}
                >
                  Lançar no Caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
