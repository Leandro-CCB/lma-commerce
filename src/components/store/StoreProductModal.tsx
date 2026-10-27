import React, { useState } from 'react';
import { CommerceProduct } from '../../types/commerce';
import { useCommerce } from '../../context/CommerceContext';
import { X, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';

interface StoreProductModalProps {
  product: CommerceProduct | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const StoreProductModal: React.FC<StoreProductModalProps> = ({
  product,
  onClose,
  onOpenCart
}) => {
  const { tenant, addToCart } = useCommerce();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [observation, setObservation] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product || !tenant) return null;

  // Inicializar opções obrigatórias caso ainda não selecionadas
  const variationsToChoose = product.variations || [];
  
  // Calcular preço final com modificadores
  let unitPrice = product.promo_price || product.base_price;
  variationsToChoose.forEach(g => {
    const sel = selectedVariations[g.name];
    if (sel) {
      const opt = g.options.find(o => o.name === sel);
      if (opt?.priceModifier) unitPrice += opt.priceModifier;
    }
  });

  const totalPrice = unitPrice * quantity;

  function handleAddToCart() {
    // Validar se todas as variações obrigatórias foram selecionadas
    for (const g of variationsToChoose) {
      if (g.required && !selectedVariations[g.name]) {
        alert(`Por favor, selecione uma opção para "${g.name}".`);
        return;
      }
    }

    addToCart(product, quantity, selectedVariations, observation);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      onOpenCart();
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 shadow-md transition-all"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Galeria de Fotos */}
          <div className="bg-slate-100 p-6 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner bg-white">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span 
                  className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg text-white shadow-md"
                  style={{ backgroundColor: tenant.primary_color }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Miniaturas se houver mais de uma */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIdx === idx ? 'border-slate-900 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Truck size={14} /> Pronta Entrega</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Garantia de Fábrica</span>
            </div>
          </div>

          {/* Opções e Configuração de Compra */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Código: {product.sku}
              </span>
              <h2 className="font-display font-black text-2xl text-slate-900 mt-1 leading-snug">
                {product.name}
              </h2>

              {/* Preços */}
              <div className="mt-3 flex items-baseline gap-2">
                {product.promo_price && (
                  <span className="text-sm text-slate-400 line-through">
                    R$ {product.base_price.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                  R$ {unitPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">à vista no PIX</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-3 font-light leading-relaxed border-b border-slate-100 pb-4">
                {product.description}
              </p>

              {/* Variações Dinâmicas (Tamanho, Sabor, Cor, etc.) */}
              {variationsToChoose.map((group) => (
                <div key={group.id} className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      {group.name} {group.required && <span className="text-rose-500">*</span>}
                    </label>
                    {selectedVariations[group.name] && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        Selecionado: {selectedVariations[group.name]}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.options.map((opt) => {
                      const isSelected = selectedVariations[group.name] === opt.name;
                      return (
                        <button
                          key={opt.name}
                          onClick={() => setSelectedVariations({ ...selectedVariations, [group.name]: opt.name })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.priceModifier ? (
                            <span className="ml-1 text-[10px] opacity-80">
                              (+R$ {opt.priceModifier.toFixed(2)})
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Campo de Observações para o Pedido */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Observações para este item (opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ex: Sem cebola, embalar para presente, etc."
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-400 bg-slate-50"
                />
              </div>
            </div>

            {/* Quantidade e Adicionar */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between gap-4">
                {/* Seletor de Quantidade */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-9 text-center font-bold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Botão de Compra com Total */}
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-bold text-sm shadow-xl active:scale-95 transition-all"
                  style={{ backgroundColor: added ? '#059669' : tenant.primary_color }}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      <span>Adicionado à Sacola!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Adicionar • R$ {totalPrice.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
