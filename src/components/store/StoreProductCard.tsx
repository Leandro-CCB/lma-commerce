import React, { useState } from 'react';
import { CommerceProduct } from '../../types/commerce';
import { useCommerce } from '../../context/CommerceContext';
import { ShoppingBag, Eye, Check } from 'lucide-react';

interface StoreProductCardProps {
  product: CommerceProduct;
  onOpenDetails: (product: CommerceProduct) => void;
}

export const StoreProductCard: React.FC<StoreProductCardProps> = ({ product, onOpenDetails }) => {
  const { tenant, addToCart } = useCommerce();
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    // Pré-selecionar a primeira opção de cada variação
    const initial: Record<string, string> = {};
    product.variations.forEach(g => {
      if (g.options.length > 0) {
        initial[g.name] = g.options[0].name;
      }
    });
    return initial;
  });
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!tenant) return null;

  const currentPrice = product.promo_price || product.base_price;
  const hasDiscount = product.promo_price && product.promo_price < product.base_price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.base_price - product.promo_price!) / product.base_price) * 100) 
    : 0;

  function handleQuickBuy(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(product, 1, selectedVariations);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  }

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Imagem do Produto com Badge e Overlay */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span 
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-sm"
              style={{ backgroundColor: tenant.primary_color }}
            >
              {product.badge}
            </span>
          )}
          {hasDiscount && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-600 text-white shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Ação rápida hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onOpenDetails(product); }}
            className="p-2.5 rounded-full bg-white text-slate-800 shadow-lg hover:scale-110 active:scale-95 transition-transform"
            title="Ver detalhes completos"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-light">
            {product.description}
          </p>

          {/* Variações Visíveis no Card (Ex: P, M, G ou Sabores) */}
          {product.variations.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
              {product.variations[0].options.slice(0, 4).map((opt) => (
                <button
                  key={opt.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariations({ ...selectedVariations, [product.variations[0].name]: opt.name });
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                    selectedVariations[product.variations[0].name] === opt.name
                      ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.name}
                </button>
              ))}
              {product.variations[0].options.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{product.variations[0].options.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Preço e Botão Adicionar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through block">
                R$ {product.base_price.toFixed(2)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-600 font-medium">R$</span>
              <span className="font-extrabold text-lg text-slate-900 leading-none">
                {currentPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleQuickBuy}
            disabled={product.stock_qty <= 0 && product.track_stock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 ${
              product.stock_qty <= 0 && product.track_stock
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : ''
            }`}
            style={
              !addedAnimation && (product.stock_qty > 0 || !product.track_stock)
                ? { backgroundColor: tenant.primary_color }
                : {}
            }
          >
            {addedAnimation ? (
              <>
                <Check size={14} />
                <span>Salvo</span>
              </>
            ) : product.stock_qty <= 0 && product.track_stock ? (
              <span>Esgotado</span>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
