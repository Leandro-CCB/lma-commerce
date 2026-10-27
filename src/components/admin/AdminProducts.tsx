import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { CommerceProduct } from '../../types/commerce';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  X
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { tenant, products, categories, addProduct, updateProduct, deleteProduct } = useCommerce();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CommerceProduct | null>(null);

  // Form de Produto
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formPromo, setFormPromo] = useState('');
  const [formStock, setFormStock] = useState('10');
  const [formSku, setFormSku] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImg, setFormImg] = useState('');
  const [formBadge, setFormBadge] = useState('');

  if (!tenant) return null;

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  function openNewModal() {
    setEditingProduct(null);
    setFormName('');
    setFormCategory(categories[0]?.id || '');
    setFormPrice('');
    setFormCost('');
    setFormPromo('');
    setFormStock('10');
    setFormSku(`SKU-${Date.now().toString().slice(-4)}`);
    setFormDesc('');
    setFormImg('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
    setFormBadge('');
    setModalOpen(true);
  }

  function openEditModal(prod: CommerceProduct) {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category_id);
    setFormPrice(prod.base_price.toString());
    setFormCost(prod.cost_price.toString());
    setFormPromo(prod.promo_price ? prod.promo_price.toString() : '');
    setFormStock(prod.stock_qty.toString());
    setFormSku(prod.sku || '');
    setFormDesc(prod.description);
    setFormImg(prod.images[0] || '');
    setFormBadge(prod.badge || '');
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      alert('Nome e Preço Base são obrigatórios.');
      return;
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name: formName,
        category_id: formCategory,
        base_price: parseFloat(formPrice),
        cost_price: parseFloat(formCost || '0'),
        promo_price: formPromo ? parseFloat(formPromo) : undefined,
        stock_qty: parseInt(formStock || '0', 10),
        sku: formSku,
        description: formDesc,
        images: [formImg],
        badge: formBadge || undefined
      });
    } else {
      await addProduct({
        tenant_id: tenant!.id,
        category_id: formCategory,
        name: formName,
        slug: formName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: formDesc,
        base_price: parseFloat(formPrice),
        cost_price: parseFloat(formCost || '0'),
        promo_price: formPromo ? parseFloat(formPromo) : undefined,
        images: [formImg],
        stock_qty: parseInt(formStock || '0', 10),
        track_stock: true,
        sku: formSku,
        badge: formBadge || undefined,
        variations: [],
        tags: [tenant!.segment],
        active: true,
        featured: false
      });
    }

    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Produtos & Estoque ({tenant.segment})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cadastre novos itens, gerencie preços, fotos, especificações e níveis de estoque
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

          <button
            onClick={openNewModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 transition-all"
            style={{ backgroundColor: tenant.primary_color }}
          >
            <Plus size={15} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Grid de Produtos Cadastrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex gap-3 items-center justify-between">
            <img src={p.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold text-slate-400">{p.sku}</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{p.name}</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-extrabold text-xs text-slate-900">
                  R$ {(p.promo_price || p.base_price).toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">
                  Estoque: <strong className={p.stock_qty <= 5 ? 'text-rose-600' : 'text-slate-700'}>{p.stock_qty}</strong>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => openEditModal(p)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Editar"
              >
                <Edit3 size={13} />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Excluir ${p.name}?`)) deleteProduct(p.id);
                }}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                title="Excluir"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Criação / Edição */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-display font-bold text-base text-slate-900">
                {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Blusa Crepe, Bolo de Cenoura, Chinelo..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Preço Venda (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Preço Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Preço Promo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPromo}
                    onChange={(e) => setFormPromo(e.target.value)}
                    placeholder="Opcional"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Estoque (Qtd)</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">URL da Imagem</label>
                <input
                  type="url"
                  value={formImg}
                  onChange={(e) => setFormImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Detalhes, material, medidas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
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
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
