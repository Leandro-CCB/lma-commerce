import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard,
  MapPin,
  MessageCircle,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoreCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreCartDrawer: React.FC<StoreCartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    tenant, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartCount,
    createOrder 
  } = useCommerce();

  // Estados do Checkout
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'dinheiro'>('pix');
  const [orderNotes, setOrderNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState<number | null>(null);

  if (!isOpen || !tenant) return null;

  const deliveryFee = deliveryType === 'delivery' 
    ? (cartTotal >= tenant.free_shipping_threshold ? 0 : tenant.delivery_fee) 
    : 0;
  const finalTotal = cartTotal + deliveryFee;

  async function handleFinishOrder() {
    if (!customerName.trim() || !customerWhatsapp.trim()) {
      alert('Por favor, informe seu nome e WhatsApp.');
      return;
    }

    if (deliveryType === 'delivery' && !customerAddress.trim()) {
      alert('Por favor, informe seu endereço de entrega completo.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder({
        tenant_id: tenant.id,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        customer_address: deliveryType === 'delivery' ? customerAddress : 'Retirada no Balcão',
        delivery_type: deliveryType,
        delivery_fee: deliveryFee,
        subtotal: cartTotal,
        discount: 0,
        total: finalTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'pix' ? 'pago' : 'pendente',
        order_status: 'novo',
        notes: orderNotes,
        items: cart.map(i => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.unitPrice * i.quantity,
          selected_variations: i.selectedVariations,
          observation: i.observation
        }))
      });

      setLastOrderNumber(order.order_number);
      setStep('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      // Disparar WhatsApp para a loja com o resumo formatado
      const itemsText = cart.map(item => {
        const vars = Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ');
        return `• ${item.quantity}x ${item.product.name}${vars ? ` (${vars})` : ''} - R$ ${(item.unitPrice * item.quantity).toFixed(2)}`;
      }).join('\n');

      const msg = `🎉 *NOVO PEDIDO #${order.order_number} — ${tenant.name}*\n\n` +
        `👤 *Cliente:* ${customerName}\n` +
        `📱 *WhatsApp:* ${customerWhatsapp}\n` +
        `📍 *Tipo:* ${deliveryType === 'delivery' ? `Entrega em: ${customerAddress}` : 'Retirada no Balcão'}\n` +
        `💳 *Pagamento:* ${paymentMethod.toUpperCase()}\n\n` +
        `🛍️ *Itens do Pedido:*\n${itemsText}\n\n` +
        `Subtotal: R$ ${cartTotal.toFixed(2)}\n` +
        `Frete: R$ ${deliveryFee.toFixed(2)}\n` +
        `*TOTAL: R$ ${finalTotal.toFixed(2)}*\n\n` +
        `${orderNotes ? `📝 *Obs:* ${orderNotes}\n\n` : ''}` +
        `Aguardando confirmação!`;

      if (tenant.whatsapp) {
        window.open(`https://wa.me/55${tenant.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      }
    } catch (err) {
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: tenant.primary_color }}
            >
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                {step === 'cart' && 'Sua Sacola de Compras'}
                {step === 'checkout' && 'Finalizar Pedido'}
                {step === 'success' && 'Pedido Confirmado!'}
              </h3>
              <p className="text-xs text-slate-500">
                {tenant.name} • {cartCount} {cartCount === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo Central */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ShoppingBag size={48} className="stroke-1 mb-3 text-slate-300" />
                  <p className="font-bold text-slate-700 text-sm">Sua sacola está vazia</p>
                  <p className="text-xs mt-1">Explore os produtos e monte seu pedido!</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: tenant.primary_color }}
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 items-center justify-between"
                    >
                      <img
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.product.name}
                        </h4>

                        {/* Variações Selecionadas */}
                        {Object.entries(item.selectedVariations).length > 0 && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {Object.entries(item.selectedVariations).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                          </p>
                        )}

                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-xs font-bold text-slate-900">
                            R$ {(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-400">
                              (R$ {item.unitPrice.toFixed(2)} un)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Controles de Quantidade e Excluir */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-900"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Seu Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Como podemos te chamar?"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 bg-slate-50 text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">WhatsApp para Contato *</label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 bg-slate-50 text-sm"
                />
              </div>

              {/* Tipo de Entrega */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Forma de Recebimento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck size={14} />
                      <span>Entrega</span>
                    </div>
                    <span className="text-[10px] mt-1 opacity-80">
                      {cartTotal >= tenant.free_shipping_threshold ? 'Frete Grátis' : `+R$ ${tenant.delivery_fee.toFixed(2)}`}
                    </span>
                  </button>

                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      <MapPin size={14} />
                      <span>Retirada</span>
                    </div>
                    <span className="text-[10px] mt-1 opacity-80">Balcão da Loja</span>
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Endereço de Entrega *</label>
                  <textarea
                    rows={2}
                    placeholder="Rua, número, complemento, bairro e ponto de referência"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 bg-slate-50 text-xs"
                  />
                </div>
              )}

              {/* Forma de Pagamento */}
              <div>
                <label className="font-bold text-slate-800 block mb-1.5">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    PIX (5% OFF)
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cartao_credito')}
                    className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      paymentMethod === 'cartao_credito'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Cartão
                  </button>
                  <button
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`p-2 rounded-xl border text-center font-bold text-xs transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    Dinheiro
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Observações do Pedido</label>
                <input
                  type="text"
                  placeholder="Alguma instrução especial para a entrega?"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-display font-black text-xl text-slate-900">
                Pedido #{lastOrderNumber} Confirmado!
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Já enviamos os detalhes para a equipe da <strong>{tenant.name}</strong>. Em instantes nosso atendente confirmará pelo seu WhatsApp!
              </p>

              {tenant.pix_key && paymentMethod === 'pix' && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-left w-full text-xs">
                  <p className="font-bold text-amber-900">Chave PIX da Loja ({tenant.pix_type}):</p>
                  <p className="font-mono text-xs bg-white p-2 rounded-lg border border-amber-200 mt-1 select-all break-all text-slate-800">
                    {tenant.pix_key}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1.5">
                    Valor: <strong>R$ {finalTotal.toFixed(2)}</strong>
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-white shadow-md"
                style={{ backgroundColor: tenant.primary_color }}
              >
                Continuar Comprando
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Drawer com Totais e Ação */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({cartCount} itens)</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>

              {step === 'checkout' && (
                <div className="flex justify-between text-slate-500">
                  <span>Taxa de Entrega</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
                style={{ backgroundColor: tenant.primary_color }}
              >
                <span>Avançar para Entrega</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  Voltar
                </button>
                <button
                  onClick={handleFinishOrder}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
                  style={{ backgroundColor: tenant.primary_color }}
                >
                  {submitting ? 'Gravando Pedido...' : 'Enviar Pedido no WhatsApp'}
                  <MessageCircle size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
