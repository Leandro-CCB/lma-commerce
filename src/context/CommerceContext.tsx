import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CommerceTenant, 
  CommerceCategory, 
  CommerceProduct, 
  CartItem, 
  CommerceOrder, 
  CommerceCustomer, 
  CommerceFinancialTransaction 
} from '../types/commerce';
import { supabase, TABLES } from '../lib/supabase';
import { SEGMENT_TEMPLATES } from '../lib/templates';

interface CommerceContextType {
  // Tenant atual
  tenant: CommerceTenant | null;
  setTenant: (tenant: CommerceTenant) => void;
  allTenants: CommerceTenant[];
  loadTenantBySlug: (slug: string) => Promise<void>;
  createTenant: (data: Partial<CommerceTenant>, segmentTemplate?: string) => Promise<CommerceTenant>;
  updateTenant: (data: Partial<CommerceTenant>) => Promise<void>;

  // Catálogo
  categories: CommerceCategory[];
  products: CommerceProduct[];
  addProduct: (product: Omit<CommerceProduct, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<CommerceProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Carrinho
  cart: CartItem[];
  addToCart: (product: CommerceProduct, quantity: number, selectedVariations: Record<string, string>, observation?: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Pedidos & Vendas
  orders: CommerceOrder[];
  createOrder: (orderData: Omit<CommerceOrder, 'id' | 'order_number' | 'created_at'>) => Promise<CommerceOrder>;
  updateOrderStatus: (orderId: string, status: CommerceOrder['order_status']) => Promise<void>;
  updatePaymentStatus: (orderId: string, status: CommerceOrder['payment_status']) => Promise<void>;

  // Clientes
  customers: CommerceCustomer[];
  upsertCustomer: (customerData: Partial<CommerceCustomer>) => Promise<void>;

  // Financeiro (Fluxo de Caixa & Contas)
  transactions: CommerceFinancialTransaction[];
  addTransaction: (data: Omit<CommerceFinancialTransaction, 'id' | 'created_at'>) => Promise<void>;
  updateTransactionStatus: (id: string, status: 'pendente' | 'pago') => Promise<void>;

  // Modo / Visão
  viewMode: 'store' | 'admin' | 'superadmin';
  setViewMode: (mode: 'store' | 'admin' | 'superadmin') => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;

  loading: boolean;
}

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

const LS_PREFIX = 'commercer_';

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allTenants, setAllTenants] = useState<CommerceTenant[]>([]);
  const [tenant, setTenant] = useState<CommerceTenant | null>(null);
  const [categories, setCategories] = useState<CommerceCategory[]>([]);
  const [products, setProducts] = useState<CommerceProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LS_PREFIX}cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [orders, setOrders] = useState<CommerceOrder[]>([]);
  const [customers, setCustomers] = useState<CommerceCustomer[]>([]);
  const [transactions, setTransactions] = useState<CommerceFinancialTransaction[]>([]);
  const [viewMode, setViewMode] = useState<'store' | 'admin' | 'superadmin'>('store');
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Inicializar Tenants e identificar loja pela URL
  useEffect(() => {
    bootstrapSystem();
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LS_PREFIX}cart`, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Aplicar cores do tenant na raiz do CSS
  useEffect(() => {
    if (tenant?.primary_color) {
      document.documentElement.style.setProperty('--brand-500', tenant.primary_color);
      document.documentElement.style.setProperty('--brand-600', tenant.primary_color + 'dd');
    }
  }, [tenant]);

  async function bootstrapSystem() {
    setLoading(true);
    try {
      // 1. Tentar ler do Supabase ou inicializar templates padrões
      let tenantsList: CommerceTenant[] = [];
      const { data: supaTenants, error } = await supabase
        .from(TABLES.TENANTS)
        .select('*')
        .order('name');

      if (!error && supaTenants && supaTenants.length > 0) {
        tenantsList = supaTenants as CommerceTenant[];
      } else {
        // Fallback local caso Supabase ainda não tenha registros
        const cached = localStorage.getItem(`${LS_PREFIX}tenants`);
        if (cached) {
          tenantsList = JSON.parse(cached);
        } else {
          // Criar tenants a partir dos templates (Moda, Gastronomia, Calçados, Acessórios)
          tenantsList = Object.keys(SEGMENT_TEMPLATES).map((key, i) => {
            const tmpl = SEGMENT_TEMPLATES[key];
            return {
              id: `tenant-${key}-${i + 1}`,
              ...tmpl.tenant,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as CommerceTenant;
          });
          localStorage.setItem(`${LS_PREFIX}tenants`, JSON.stringify(tenantsList));
        }
      }

      setAllTenants(tenantsList);

      // 2. Extrair slug da URL: ?loja=slug ou /loja/slug ou subdomínio
      const urlParams = new URLSearchParams(window.location.search);
      const urlSlug = urlParams.get('loja') || window.location.pathname.split('/')[2] || 'aura-boutique';

      const current = tenantsList.find(t => t.slug === urlSlug) || tenantsList[0];
      if (current) {
        await selectTenant(current);
      }
    } catch (err) {
      console.warn('Erro ao inicializar LMA Commerce:', err);
    } finally {
      setLoading(false);
    }
  }

  async function selectTenant(selected: CommerceTenant) {
    setTenant(selected);
    setLoading(true);
    try {
      // Buscar categorias e produtos do tenant no Supabase com fallback local
      const { data: supaCategories } = await supabase
        .from(TABLES.CATEGORIES)
        .select('*')
        .eq('tenant_id', selected.id)
        .order('display_order');

      const { data: supaProducts } = await supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('tenant_id', selected.id)
        .order('name');

      const { data: supaOrders } = await supabase
        .from(TABLES.ORDERS)
        .select('*')
        .eq('tenant_id', selected.id)
        .order('created_at', { ascending: false });

      const { data: supaCustomers } = await supabase
        .from(TABLES.CUSTOMERS)
        .select('*')
        .eq('tenant_id', selected.id)
        .order('name');

      const { data: supaTrans } = await supabase
        .from(TABLES.TRANSACTIONS)
        .select('*')
        .eq('tenant_id', selected.id)
        .order('due_date', { ascending: false });

      if (supaCategories && supaCategories.length > 0) {
        setCategories(supaCategories);
      } else {
        const tmpl = SEGMENT_TEMPLATES[selected.segment] || SEGMENT_TEMPLATES.moda;
        const genCats: CommerceCategory[] = tmpl.categories.map((c, i) => ({
          id: `cat-${selected.id}-${i}`,
          tenant_id: selected.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          display_order: i,
          active: true
        }));
        setCategories(genCats);
      }

      if (supaProducts && supaProducts.length > 0) {
        setProducts(supaProducts);
      } else {
        const tmpl = SEGMENT_TEMPLATES[selected.segment] || SEGMENT_TEMPLATES.moda;
        const genProds: CommerceProduct[] = tmpl.products.map((p, i) => ({
          id: `prod-${selected.id}-${i}`,
          tenant_id: selected.id,
          category_id: `cat-${selected.id}-0`,
          name: p.name,
          slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: p.description,
          base_price: p.base_price,
          cost_price: p.cost_price,
          promo_price: p.promo_price,
          images: p.images,
          stock_qty: p.stock_qty,
          track_stock: true,
          sku: `SKU-${1000 + i}`,
          badge: p.badge,
          variations: p.variations.map((v, vi) => ({
            id: `var-${vi}`,
            name: v.name,
            required: v.required,
            options: v.options.map((o, oi) => ({
              id: `opt-${oi}`,
              name: o.name,
              priceModifier: o.priceModifier || 0,
              stock: o.stock || 10
            }))
          })),
          tags: p.tags,
          active: true,
          featured: p.featured,
          created_at: new Date().toISOString()
        }));
        setProducts(genProds);
      }

      setOrders(supaOrders || []);
      setCustomers(supaCustomers || []);
      setTransactions(supaTrans || []);
    } catch (err) {
      console.warn('Fallback local para tenant:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadTenantBySlug(slug: string) {
    const found = allTenants.find(t => t.slug === slug);
    if (found) {
      await selectTenant(found);
    }
  }

  async function createTenant(data: Partial<CommerceTenant>, segmentTemplate = 'moda'): Promise<CommerceTenant> {
    const tmpl = SEGMENT_TEMPLATES[segmentTemplate] || SEGMENT_TEMPLATES.moda;
    const newTenant: CommerceTenant = {
      id: `tenant-${Date.now()}`,
      name: data.name || 'Nova Loja',
      slug: data.slug || `loja-${Date.now().toString(36)}`,
      segment: (data.segment as any) || tmpl.tenant.segment,
      slogan: data.slogan || tmpl.tenant.slogan,
      description: data.description || tmpl.tenant.description,
      logo_url: data.logo_url || tmpl.tenant.logo_url,
      banner_url: data.banner_url || tmpl.tenant.banner_url,
      whatsapp: data.whatsapp || tmpl.tenant.whatsapp,
      email: data.email || tmpl.tenant.email,
      phone: data.phone || tmpl.tenant.phone,
      address_street: data.address_street || tmpl.tenant.address_street,
      address_number: data.address_number || tmpl.tenant.address_number,
      address_neighborhood: data.address_neighborhood || tmpl.tenant.address_neighborhood,
      address_city: data.address_city || tmpl.tenant.address_city,
      address_state: data.address_state || tmpl.tenant.address_state,
      address_zip: data.address_zip || tmpl.tenant.address_zip,
      primary_color: data.primary_color || tmpl.tenant.primary_color,
      secondary_color: data.secondary_color || tmpl.tenant.secondary_color,
      accent_color: data.accent_color || tmpl.tenant.accent_color,
      delivery_fee: data.delivery_fee ?? tmpl.tenant.delivery_fee,
      free_shipping_threshold: data.free_shipping_threshold ?? tmpl.tenant.free_shipping_threshold,
      delivery_estimate: data.delivery_estimate || tmpl.tenant.delivery_estimate,
      allows_pickup: data.allows_pickup ?? tmpl.tenant.allows_pickup,
      pickup_instructions: data.pickup_instructions || tmpl.tenant.pickup_instructions,
      pix_key: data.pix_key || tmpl.tenant.pix_key,
      pix_type: data.pix_type || tmpl.tenant.pix_type,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      await supabase.from(TABLES.TENANTS).insert(newTenant);
    } catch {}

    const updated = [...allTenants, newTenant];
    setAllTenants(updated);
    localStorage.setItem(`${LS_PREFIX}tenants`, JSON.stringify(updated));
    await selectTenant(newTenant);
    return newTenant;
  }

  async function updateTenant(data: Partial<CommerceTenant>) {
    if (!tenant) return;
    const updated = { ...tenant, ...data, updated_at: new Date().toISOString() };
    setTenant(updated);

    try {
      await supabase.from(TABLES.TENANTS).update(data).eq('id', tenant.id);
    } catch {}

    const list = allTenants.map(t => t.id === tenant.id ? updated : t);
    setAllTenants(list);
    localStorage.setItem(`${LS_PREFIX}tenants`, JSON.stringify(list));
  }

  // --- Produtos ---
  async function addProduct(prod: Omit<CommerceProduct, 'id' | 'created_at'>) {
    if (!tenant) return;
    const newProd: CommerceProduct = {
      ...prod,
      id: `prod-${Date.now()}`,
      tenant_id: tenant.id,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from(TABLES.PRODUCTS).insert(newProd);
    } catch {}

    setProducts(prev => [newProd, ...prev]);
  }

  async function updateProduct(id: string, updates: Partial<CommerceProduct>) {
    try {
      await supabase.from(TABLES.PRODUCTS).update(updates).eq('id', id);
    } catch {}

    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  async function deleteProduct(id: string) {
    try {
      await supabase.from(TABLES.PRODUCTS).delete().eq('id', id);
    } catch {}

    setProducts(prev => prev.filter(p => p.id !== id));
  }

  // --- Carrinho ---
  function addToCart(
    product: CommerceProduct, 
    quantity: number, 
    selectedVariations: Record<string, string>, 
    observation?: string
  ) {
    // Calcular preço unitário considerando modificadores de variação
    let unitPrice = product.promo_price || product.base_price;
    product.variations.forEach(g => {
      const selectedOptionName = selectedVariations[g.name];
      if (selectedOptionName) {
        const opt = g.options.find(o => o.name === selectedOptionName);
        if (opt?.priceModifier) {
          unitPrice += opt.priceModifier;
        }
      }
    });

    setCart(prev => {
      // Verificar se o item já existe com exatamente as mesmas variações
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariations) === JSON.stringify(selectedVariations)
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      }

      return [...prev, {
        product,
        quantity,
        selectedVariations,
        unitPrice,
        observation
      }];
    });
  }

  function updateCartQuantity(index: number, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity } : item));
  }

  function removeFromCart(index: number) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  const cartTotal = cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // --- Pedidos & Vendas ---
  async function createOrder(orderData: Omit<CommerceOrder, 'id' | 'order_number' | 'created_at'>): Promise<CommerceOrder> {
    if (!tenant) throw new Error('Tenant não selecionado');

    const orderNumber = (orders.length > 0 ? Math.max(...orders.map(o => o.order_number)) : 1000) + 1;
    const newOrder: CommerceOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      tenant_id: tenant.id,
      order_number: orderNumber,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from(TABLES.ORDERS).insert(newOrder);
    } catch {}

    setOrders(prev => [newOrder, ...prev]);

    // Baixa automática no estoque
    orderData.items.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod && prod.track_stock) {
        updateProduct(prod.id, { stock_qty: Math.max(0, prod.stock_qty - item.quantity) });
      }
    });

    // Atualizar ou criar cliente automaticamente (Zero dados fictícios)
    await upsertCustomer({
      name: orderData.customer_name,
      whatsapp: orderData.customer_whatsapp,
      address: orderData.customer_address,
      document: orderData.customer_document,
      total_spent: orderData.total,
      total_orders: 1
    });

    // Se o pagamento for à vista (PIX, Dinheiro, Débito), lançar no Fluxo de Caixa
    if (orderData.payment_status === 'pago') {
      await addTransaction({
        tenant_id: tenant.id,
        type: 'entrada',
        category: 'Venda de Produtos',
        description: `Pedido #${orderNumber} — ${orderData.customer_name}`,
        amount: orderData.total,
        payment_method: orderData.payment_method,
        account: orderData.payment_method === 'dinheiro' ? 'Caixa Balcão' : 'Conta Corrente / PIX',
        due_date: new Date().toISOString().split('T')[0],
        payment_date: new Date().toISOString().split('T')[0],
        status: 'pago',
        related_order_id: newOrder.id
      });
    }

    clearCart();
    return newOrder;
  }

  async function updateOrderStatus(orderId: string, status: CommerceOrder['order_status']) {
    try {
      await supabase.from(TABLES.ORDERS).update({ order_status: status }).eq('id', orderId);
    } catch {}
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status } : o));
  }

  async function updatePaymentStatus(orderId: string, status: CommerceOrder['payment_status']) {
    try {
      await supabase.from(TABLES.ORDERS).update({ payment_status: status }).eq('id', orderId);
    } catch {}
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, payment_status: status } : o));
  }

  // --- Clientes ---
  async function upsertCustomer(data: Partial<CommerceCustomer>) {
    if (!tenant || !data.whatsapp) return;

    setCustomers(prev => {
      const cleanPhone = data.whatsapp!.replace(/\D/g, '');
      const existing = prev.find(c => c.whatsapp.replace(/\D/g, '') === cleanPhone);

      if (existing) {
        const updated: CommerceCustomer = {
          ...existing,
          name: data.name || existing.name,
          email: data.email || existing.email,
          document: data.document || existing.document,
          address: data.address || existing.address,
          total_spent: existing.total_spent + (data.total_spent || 0),
          total_orders: existing.total_orders + (data.total_orders || 1)
        };
        try {
          supabase.from(TABLES.CUSTOMERS).update(updated).eq('id', existing.id);
        } catch {}
        return prev.map(c => c.id === existing.id ? updated : c);
      } else {
        const newCust: CommerceCustomer = {
          id: `cust-${Date.now()}`,
          tenant_id: tenant.id,
          name: data.name || 'Cliente',
          whatsapp: data.whatsapp!,
          email: data.email,
          document: data.document,
          address: data.address,
          total_spent: data.total_spent || 0,
          total_orders: data.total_orders || 1,
          created_at: new Date().toISOString()
        };
        try {
          supabase.from(TABLES.CUSTOMERS).insert(newCust);
        } catch {}
        return [newCust, ...prev];
      }
    });
  }

  // --- Financeiro ---
  async function addTransaction(trans: Omit<CommerceFinancialTransaction, 'id' | 'created_at'>) {
    if (!tenant) return;
    const newTrans: CommerceFinancialTransaction = {
      ...trans,
      id: `fin-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from(TABLES.TRANSACTIONS).insert(newTrans);
    } catch {}

    setTransactions(prev => [newTrans, ...prev]);
  }

  async function updateTransactionStatus(id: string, status: 'pendente' | 'pago') {
    const payment_date = status === 'pago' ? new Date().toISOString().split('T')[0] : undefined;
    try {
      await supabase.from(TABLES.TRANSACTIONS).update({ status, payment_date }).eq('id', id);
    } catch {}

    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status, payment_date } : t));
  }

  return (
    <CommerceContext.Provider value={{
      tenant,
      setTenant,
      allTenants,
      loadTenantBySlug,
      createTenant,
      updateTenant,
      categories,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
      orders,
      createOrder,
      updateOrderStatus,
      updatePaymentStatus,
      customers,
      upsertCustomer,
      transactions,
      addTransaction,
      updateTransactionStatus,
      viewMode,
      setViewMode,
      activeAdminTab,
      setActiveAdminTab,
      loading
    }}>
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce deve ser usado dentro de um CommerceProvider');
  }
  return context;
};
