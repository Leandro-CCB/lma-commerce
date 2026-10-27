import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Sliders, Save, Check, Palette, MapPin, Phone, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { tenant, updateTenant } = useCommerce();
  const [name, setName] = useState(tenant?.name || '');
  const [slogan, setSlogan] = useState(tenant?.slogan || '');
  const [desc, setDesc] = useState(tenant?.description || '');
  const [whatsapp, setWhatsapp] = useState(tenant?.whatsapp || '');
  const [color, setColor] = useState(tenant?.primary_color || '#c6892e');
  const [deliveryFee, setDeliveryFee] = useState(tenant?.delivery_fee?.toString() || '10');
  const [freeThreshold, setFreeThreshold] = useState(tenant?.free_shipping_threshold?.toString() || '150');
  const [estimate, setEstimate] = useState(tenant?.delivery_estimate || '30 a 60 min');
  const [pixKey, setPixKey] = useState(tenant?.pix_key || '');
  const [pixType, setPixType] = useState(tenant?.pix_type || 'chave');
  const [saved, setSaved] = useState(false);

  if (!tenant) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await updateTenant({
      name,
      slogan,
      description: desc,
      whatsapp,
      primary_color: color,
      delivery_fee: parseFloat(deliveryFee),
      free_shipping_threshold: parseFloat(freeThreshold),
      delivery_estimate: estimate,
      pix_key: pixKey,
      pix_type: pixType as any
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900">
            Personalização da Loja ({tenant.segment})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Altere nome, cores da marca, taxas de entrega e chaves PIX de recebimento
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <Check size={14} /> Salvo com sucesso!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-xs">
        <div>
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 mb-4">
            <Palette size={16} className="text-amber-500" />
            <span>Identidade Visual & Cores</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Nome Comercial da Loja</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Cor Primária (Hexadecimal)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-9 p-1 rounded-xl border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="font-bold text-slate-800 block mb-1">Slogan de Impacto</label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            />
          </div>

          <div className="mt-4">
            <label className="font-bold text-slate-800 block mb-1">Descrição do Negócio</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 mb-4">
            <Phone size={16} className="text-emerald-500" />
            <span>Atendimento & Pagamento PIX</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">WhatsApp para Notificações</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Chave PIX da Loja</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-blue-500" />
            <span>Logística & Frete</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Taxa de Entrega Padrão (R$)</label>
              <input
                type="number"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Frete Grátis Acima de (R$)</label>
              <input
                type="number"
                step="0.01"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Previsão de Entrega</label>
              <input
                type="text"
                value={estimate}
                onChange={(e) => setEstimate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-xl active:scale-95 transition-all"
            style={{ backgroundColor: tenant.primary_color }}
          >
            <Save size={16} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
