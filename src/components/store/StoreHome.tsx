import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { StoreHeader } from './StoreHeader';
import { StoreHero } from './StoreHero';
import { StoreProductCard } from './StoreProductCard';
import { StoreProductModal } from './StoreProductModal';
import { StoreCartDrawer } from './StoreCartDrawer';
import { StoreFooter } from './StoreFooter';
import { CommerceProduct } from '../../types/commerce';
import { Package, SlidersHorizontal, Sparkles } from 'lucide-react';

export const StoreHome: React.FC = () => {
  const { tenant, products, categories } = useCommerce();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<CommerceProduct | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  if (!tenant) return null;

  // Filtrar produtos por categoria e busca
  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const catObj = categories.find(c => c.slug === selectedCategory);
    const matchesCategory = !selectedCategory || p.category_id === catObj?.id;

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        {/* Header da Vitrine */}
        <StoreHeader
          onOpenCart={() => setCartDrawerOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Hero Section apenas se não estiver buscando ou filtrando */}
        {!searchTerm && !selectedCategory && (
          <StoreHero onExplore={() => {
            const el = document.getElementById('catalogo-anchor');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} />
        )}

        {/* Seção Principal de Produtos */}
        <main id="catalogo-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Título da Seção & Contador */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: tenant.primary_color }}
                />
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                  {selectedCategory 
                    ? categories.find(c => c.slug === selectedCategory)?.name || 'Produtos'
                    : searchTerm 
                    ? `Resultados para "${searchTerm}"`
                    : 'Catálogo de Produtos'
                  }
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos disponíveis'}
              </p>
            </div>

            {/* Tags e Filtros Rápidos */}
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
                >
                  Limpar Filtro
                </button>
              )}
            </div>
          </div>

          {/* Grid de Produtos */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto my-12">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
                <Package size={28} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-800">
                Nenhum produto encontrado
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Não encontramos itens para o filtro selecionado. Tente buscar por outro termo ou limpe os filtros.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
                className="mt-5 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md"
                style={{ backgroundColor: tenant.primary_color }}
              >
                Ver Todos os Produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <StoreProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}

          {/* Destaques Especiais se não estiver pesquisando */}
          {!searchTerm && !selectedCategory && featuredProducts.length > 0 && (
            <div className="mt-20 pt-10 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className="font-display font-bold text-xl text-slate-900">
                  Mais Vendidos da Semana
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <StoreProductCard
                    key={`feat-${product.id}`}
                    product={product}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer da Vitrine com Botão de Acesso ao ERP */}
      <StoreFooter />

      {/* Modal Ficha Técnica do Produto com Variações */}
      <StoreProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => setCartDrawerOpen(true)}
      />

      {/* Gaveta do Carrinho / Sacola de Compras */}
      <StoreCartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
};
