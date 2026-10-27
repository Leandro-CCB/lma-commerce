export type TenantSegment = 
  | 'moda'           // Blusas, vestidos, moda praia, roupas
  | 'calcados'       // Chinelos, sapatos, tênis, rasteirinhas
  | 'acessorios'     // Bolsas, mochilas, cintos, carteiras
  | 'gastronomia'    // Bolos, salgados, doces, marmitas, buffet
  | 'cosmeticos'     // Perfumaria, maquiagem, skincare
  | 'servicos'       // Manicure, barbearia, consultoria
  | 'geral';         // Multi-categoria

export interface VariationOption {
  id: string;
  name: string;        // Ex: 'P', 'M', 'G' ou '37', '38' ou 'Chocolate', 'Cenoura'
  priceModifier?: number; // Ex: +5.00
  stock?: number;
}

export interface VariationGroup {
  id: string;
  name: string;        // Ex: 'Tamanho', 'Cor', 'Sabor', 'Recheio', 'Dimensões'
  required: boolean;
  options: VariationOption[];
}

export interface CommerceTenant {
  id: string;
  name: string;
  slug: string;                 // URL identifier: /loja/:slug ou subdomínio
  segment: TenantSegment;
  slogan: string;
  description: string;
  logo_url: string;
  banner_url: string;
  whatsapp: string;
  email: string;
  phone: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zip: string;
  primary_color: string;        // Hex: #c6892e, #e11d48, #059669 etc.
  secondary_color: string;
  accent_color: string;
  delivery_fee: number;
  free_shipping_threshold: number;
  delivery_estimate: string;
  allows_pickup: boolean;
  pickup_instructions: string;
  pix_key: string;
  pix_type: 'cpf' | 'cnpj' | 'telefone' | 'email' | 'aleatoria';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommerceCategory {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  icon?: string;
  display_order: number;
  active: boolean;
}

export interface CommerceProduct {
  id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  cost_price: number;
  promo_price?: number;
  images: string[];
  stock_qty: number;
  track_stock: boolean;
  sku: string;
  barcode?: string;
  badge?: string;                // 'Mais Vendido', 'Lançamento', 'Promoção'
  variations: VariationGroup[];  // Ex: Tamanhos P/M/G, Cores, Sabores
  tags: string[];
  active: boolean;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product: CommerceProduct;
  quantity: number;
  selectedVariations: Record<string, string>; // group.name -> option.name
  unitPrice: number;
  observation?: string;
}

export interface CommerceOrder {
  id: string;
  tenant_id: string;
  order_number: number;
  customer_name: string;
  customer_whatsapp: string;
  customer_document?: string;
  customer_address: string;
  delivery_type: 'delivery' | 'pickup';
  delivery_fee: number;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'faturado';
  payment_status: 'pendente' | 'pago' | 'cancelado';
  order_status: 'novo' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  notes?: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    selected_variations: Record<string, string>;
    observation?: string;
  }[];
  created_at: string;
}

export interface CommerceCustomer {
  id: string;
  tenant_id: string;
  name: string;
  whatsapp: string;
  email?: string;
  document?: string;
  address?: string;
  total_spent: number;
  total_orders: number;
  created_at: string;
}

export interface CommerceFinancialTransaction {
  id: string;
  tenant_id: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  account: string;               // 'Caixa Balcão', 'Conta Corrente', 'PIX'
  due_date: string;
  payment_date?: string;
  status: 'pendente' | 'pago';
  related_order_id?: string;
  created_at: string;
}
