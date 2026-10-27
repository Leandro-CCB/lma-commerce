import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle2, 
  ShoppingCart, 
  User, 
  CreditCard,
  Barcode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPos: React.FC = () => {
  const { tenant, products, createOrder } = useCommerce();
  const [searchTerm, setSearchTerm] = useState('');
  const [posCart, setPosCart] = useState<{
    product: any;
    quantity: number;
    unitPrice: number;
    selectedVariations: Record<string, string>;
  }[]>([]);

  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro'>('pix');
  const [discount, setDiscount] = useState(0);
  const [successOrder, setSuccessOrder] = useState<number | null>(null);

  if (!tenant) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function addToPosCart(product: any) {
    const defaultVariations: Record<string, string> = {};
    product.variations?.forEach((g: any) => {
      if (g.options?.length > 0) defaultVariations[g.name] = g.options[0].name;
    });

    const price = product.promo_price || product.base_price;

    setPosCart(prev => {
      const existing = prev.findIndex(item => item.product.id === product.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing].quantity += 1;
        return next;
      }
      return [...prev, {
        product,
        quantity: 1,
        unitPrice: price,
        selectedVariations: defaultVariations
      }];
    });
  }

  const subtotal = posCart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  async function handleFinalizeSale() {
    if (posCart.length === 0) {
      alert('Adicione pelo menos um item à venda.');
      return;
    }

    try {
      const order = await createOrder({
        tenant_id: tenant!.id,
        customer_name: customerName || 'Venda Balcão / Consumidor',
        customer_whatsapp: customerWhatsapp || 'Balcão',
        customer_address: 'Retirada no Balcão',
        delivery_type: 'pickup',
        delivery_fee: 0,
        subtotal,
        discount,
        total,
        payment_method: paymentMethod,
        payment_status: 'pago',
        order_status: 'entregue',
        notes: 'Venda rápida realizada no PDV Balcão',
        items: posCart.map(i => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.unitPrice * i.quantity,
          selected_variations: i.selectedVariations
        }))
      });

      setSuccessOrder(order.order_number);
      setPosCart([]);
      setCustomerName('');
      setCustomerWhatsapp('');
      setDiscount(0);
      confetti({ particleCount: 80, spread: 60 });
    } catch {
      alert('Erro ao registrar venda.');
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8.5rem)]">
      {/* Coluna 1 e 2: Catálogo Rápido do PDV */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                PDV Frente de Caixa
              </h2>
              <p className="text-xs text-slate-500">
                Toque ou digite o nome/código para lançar vendas rápidas de balcão
              </p>
            </div>

            <div className="relative w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar produto ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 rounded-xl border border-slate-200 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToPosCart(p)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 text-left transition-all flex flex-col justify-between group active:scale-95"
              >
                <div>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 mb-2">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">
                    R$ {(p.promo_price || p.base_price).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    Est: {p.stock_qty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coluna 3: Cupom / Finalização da Venda */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ShoppingCart size={16} />
              <span>Venda Atual</span>
            </span>
            {posCart.length > 0 && (
              <button
                onClick={() => setPosCart([])}
                className="text-[11px] text-rose-600 font-semibold hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Lista de Itens do PDV */}
          {posCart.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs">Nenhum produto adicionado</p>
              <p className="text-[11px] mt-1 text-slate-400">Clique em um item à esquerda para iniciar</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {posCart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">R$ {item.unitPrice.toFixed(2)} un</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) {
                          setPosCart(posCart.filter((_, i) => i !== idx));
                        } else {
                          const next = [...posCart];
                          next[idx].quantity -= 1;
                          setPosCart(next);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const next = [...posCart];
                        next[idx].quantity += 1;
                        setPosCart(next);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Plus size={12} />
                    </button>
                    <span className="font-extrabold text-slate-900 w-16 text-right">
                      R$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Identificação Opcional do Cliente */}
          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <input
              type="text"
              placeholder="Nome do Cliente (opcional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            />
            <input
              type="tel"
              placeholder="WhatsApp do Cliente (opcional)"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            />
          </div>

          {/* Formas de Pagamento no Caixa */}
          <div className="pt-3 border-t border-slate-100 mt-3">
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Pagamento no Balcão</label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                  paymentMethod === 'pix' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50'
                }`}
              >
                PIX
              </button>
              <button
                onClick={() => setPaymentMethod('dinheiro')}
                className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                  paymentMethod === 'dinheiro' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50'
                }`}
              >
                Dinheiro
              </button>
              <button
                onClick={() => setPaymentMethod('cartao_debito')}
                className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                  paymentMethod === 'cartao_debito' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50'
                }`}
              >
                Débito
              </button>
              <button
                onClick={() => setPaymentMethod('cartao_credito')}
                className={`py-1.5 rounded-lg border font-bold text-center transition-all ${
                  paymentMethod === 'cartao_credito' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50'
                }`}
              >
                Crédito
              </button>
            </div>
          </div>
        </div>

        {/* Totais e Botão Finalizar */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-950 pt-1 border-t border-slate-100">
              <span>Total a Receber</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleFinalizeSale}
            disabled={posCart.length === 0}
            className="w-full py-3 rounded-2xl font-bold text-xs text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: tenant.primary_color }}
          >
            <CheckCircle2 size={16} />
            <span>Confirmar e Emitir Venda</span>
          </button>

          {successOrder && (
            <p className="text-[11px] text-center text-emerald-600 font-bold">
              ✓ Venda #{successOrder} concluída com sucesso!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
