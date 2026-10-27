import { CommerceTenant, CommerceCategory, CommerceProduct } from '../types/commerce';

export interface SegmentTemplate {
  tenant: Omit<CommerceTenant, 'id' | 'created_at' | 'updated_at'>;
  categories: { name: string; slug: string; icon: string }[];
  products: {
    name: string;
    categorySlug: string;
    description: string;
    base_price: number;
    cost_price: number;
    promo_price?: number;
    images: string[];
    stock_qty: number;
    badge?: string;
    variations: {
      name: string;
      required: boolean;
      options: { name: string; priceModifier?: number; stock?: number }[];
    }[];
    tags: string[];
    featured: boolean;
  }[];
}

export const SEGMENT_TEMPLATES: Record<string, SegmentTemplate> = {
  moda: {
    tenant: {
      name: 'Aura Boutique & Moda',
      slug: 'aura-boutique',
      segment: 'moda',
      slogan: 'Elegância e Sofisticação no seu Dia a Dia',
      description: 'Coleções exclusivas de blusas, vestidos e moda contemporânea com acabamento premium e entrega expressa.',
      logo_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
      banner_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
      whatsapp: '11999998888',
      email: 'contato@auraboutique.com.br',
      phone: '(11) 3456-7890',
      address_street: 'Rua Oscar Freire',
      address_number: '1240',
      address_neighborhood: 'Cerqueira César',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip: '01426-001',
      primary_color: '#be185d', // Rosa nobre / Burgundy
      secondary_color: '#1f2937',
      accent_color: '#fb7185',
      delivery_fee: 15.0,
      free_shipping_threshold: 250.0,
      delivery_estimate: '1 a 3 dias úteis',
      allows_pickup: true,
      pickup_instructions: 'Disponível em até 2 horas na loja da Oscar Freire.',
      pix_key: 'contato@auraboutique.com.br',
      pix_type: 'email',
      active: true,
    },
    categories: [
      { name: 'Blusas & Camisas', slug: 'blusas', icon: 'Shirt' },
      { name: 'Vestidos & Macacões', slug: 'vestidos', icon: 'Sparkles' },
      { name: 'Calças & Alfaiataria', slug: 'calcas', icon: 'Layers' },
      { name: 'Casacos & Blazers', slug: 'casacos', icon: 'Shield' },
    ],
    products: [
      {
        name: 'Camisa Seda Pura Soft Silk',
        categorySlug: 'blusas',
        description: 'Camisa de seda acetinada com botões em madrepérola e caimento fluido impecável.',
        base_price: 249.90,
        cost_price: 95.00,
        promo_price: 219.90,
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],
        stock_qty: 24,
        badge: 'Destaque',
        variations: [
          {
            name: 'Tamanho',
            required: true,
            options: [{ name: 'PP' }, { name: 'P' }, { name: 'M' }, { name: 'G' }, { name: 'GG' }]
          },
          {
            name: 'Cor',
            required: true,
            options: [{ name: 'Off-White' }, { name: 'Champagne' }, { name: 'Preto Clássico' }]
          }
        ],
        tags: ['seda', 'luxo', 'trabalho', 'elegante'],
        featured: true
      },
      {
        name: 'Blusa Crepe Manga Bufante',
        categorySlug: 'blusas',
        description: 'Modelagem moderna com punho ajustado e decote elegante em V.',
        base_price: 159.00,
        cost_price: 58.00,
        images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80'],
        stock_qty: 35,
        variations: [
          {
            name: 'Tamanho',
            required: true,
            options: [{ name: 'P' }, { name: 'M' }, { name: 'G' }]
          },
          {
            name: 'Cor',
            required: true,
            options: [{ name: 'Terracota' }, { name: 'Verde Oliva' }, { name: 'Branco' }]
          }
        ],
        tags: ['romantica', 'casual'],
        featured: true
      },
      {
        name: 'Vestido Midi Fluido Riviera',
        categorySlug: 'vestidos',
        description: 'Vestido midi em linho misto com faixa para amarração e fenda lateral sutil.',
        base_price: 329.00,
        cost_price: 130.00,
        promo_price: 289.00,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'],
        stock_qty: 18,
        badge: 'Coleção Nova',
        variations: [
          {
            name: 'Tamanho',
            required: true,
            options: [{ name: 'P' }, { name: 'M' }, { name: 'G' }]
          }
        ],
        tags: ['festa', 'verao', 'linho'],
        featured: true
      }
    ]
  },

  gastronomia: {
    tenant: {
      name: 'Delícias & Sabor Gourmet',
      slug: 'delicias-sabor',
      segment: 'gastronomia',
      slogan: 'Bolos Artesanais, Salgados & Doces Finos',
      description: 'Feitos com ingredientes nobres e amor caseiro. Bolos recheados na hora, salgados fritos sequinhos e doces gourmet.',
      logo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
      banner_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1600&q=80',
      whatsapp: '11988887777',
      email: 'pedidos@deliciasesabor.com.br',
      phone: '(11) 3222-1111',
      address_street: 'Avenida Paulista',
      address_number: '777',
      address_neighborhood: 'Bela Vista',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip: '01311-000',
      primary_color: '#ea580c', // Laranja quente apetitoso
      secondary_color: '#431407',
      accent_color: '#f97316',
      delivery_fee: 10.0,
      free_shipping_threshold: 120.0,
      delivery_estimate: '40 a 60 min',
      allows_pickup: true,
      pickup_instructions: 'Retirada no balcão sem fila com código do pedido.',
      pix_key: 'pedidos@deliciasesabor.com.br',
      pix_type: 'email',
      active: true,
    },
    categories: [
      { name: 'Bolos Confeitados', slug: 'bolos', icon: 'Cake' },
      { name: 'Salgados para Festa', slug: 'salgados', icon: 'Utensils' },
      { name: 'Doces Finos & Trufas', slug: 'doces', icon: 'Cookie' },
      { name: 'Bebidas & Sucos', slug: 'bebidas', icon: 'Coffee' },
    ],
    products: [
      {
        name: 'Bolo Red Velvet Supreme 1.5kg',
        categorySlug: 'bolos',
        description: 'Massa aveludada com recheio cremoso de cream cheese tradicional e frutas vermelhas frescas.',
        base_price: 129.90,
        cost_price: 45.00,
        images: ['https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80'],
        stock_qty: 12,
        badge: 'Mais Pedido',
        variations: [
          {
            name: 'Peso / Tamanho',
            required: true,
            options: [
              { name: '1.5kg (serve 12 pessoas)', priceModifier: 0 },
              { name: '2.5kg (serve 22 pessoas)', priceModifier: 70.0 }
            ]
          },
          {
            name: 'Topping Opcional',
            required: false,
            options: [
              { name: 'Tradicional sem acréscimo', priceModifier: 0 },
              { name: 'Morangos Extras Frescos', priceModifier: 15.0 }
            ]
          }
        ],
        tags: ['bolo', 'aniversario', 'festa'],
        featured: true
      },
      {
        name: 'Cento de Salgados Sortidos (Fritos na Hora)',
        categorySlug: 'salgados',
        description: '100 unidades: 30 coxinhas de frango com catupiry, 25 bolinhas de queijo, 25 kibe com hortelã e 20 risoles de carne.',
        base_price: 98.00,
        cost_price: 32.00,
        promo_price: 89.90,
        images: ['https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80'],
        stock_qty: 50,
        badge: 'Combo Festa',
        variations: [
          {
            name: 'Ponto de Fritura',
            required: true,
            options: [
              { name: 'Fritos quentinhos para consumo imediato' },
              { name: 'Congelados para fritar em casa' }
            ]
          }
        ],
        tags: ['salgados', 'coxinha', 'festa'],
        featured: true
      }
    ]
  },

  calcados: {
    tenant: {
      name: 'Passo Nobre Calçados & Chinelos',
      slug: 'passo-nobre',
      segment: 'calcados',
      slogan: 'Conforto Absoluto a Cada Passo',
      description: 'Chinelos anatômicos, rasteirinhas artesanais e calçados leves para o dia a dia e momentos de descanso.',
      logo_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80',
      banner_url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80',
      whatsapp: '11977776666',
      email: 'contato@passonobre.com.br',
      phone: '(11) 3333-2222',
      address_street: 'Rua Direita',
      address_number: '450',
      address_neighborhood: 'Centro',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip: '01002-000',
      primary_color: '#059669', // Verde esmeralda fresco
      secondary_color: '#064e3b',
      accent_color: '#10b981',
      delivery_fee: 12.0,
      free_shipping_threshold: 180.0,
      delivery_estimate: '2 a 4 dias úteis',
      allows_pickup: true,
      pickup_instructions: 'Retirada no centro com vaga rápida para retirada.',
      pix_key: 'contato@passonobre.com.br',
      pix_type: 'email',
      active: true,
    },
    categories: [
      { name: 'Chinelos Anatômicos', slug: 'chinelos', icon: 'Footprints' },
      { name: 'Rasteiras & Sandálias', slug: 'rasteiras', icon: 'Sun' },
      { name: 'Tênis Conforto', slug: 'tenis', icon: 'Activity' },
    ],
    products: [
      {
        name: 'Chinelo Nuvem Ultra Macio Antiderrapante',
        categorySlug: 'chinelos',
        description: 'Espuma EVA premium ortopédica que alivia o cansaço e dores plantares com solado antiderrapante.',
        base_price: 89.90,
        cost_price: 28.00,
        promo_price: 69.90,
        images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80'],
        stock_qty: 60,
        badge: 'Top 1 Vendas',
        variations: [
          {
            name: 'Numeração',
            required: true,
            options: [
              { name: '35/36' },
              { name: '37/38' },
              { name: '39/40' },
              { name: '41/42' },
              { name: '43/44' }
            ]
          },
          {
            name: 'Cor',
            required: true,
            options: [
              { name: 'Preto Matte' },
              { name: 'Bege Areia' },
              { name: 'Rosa Pastel' },
              { name: 'Verde Sálvia' }
            ]
          }
        ],
        tags: ['chinelo', 'nuvem', 'ortopedico'],
        featured: true
      }
    ]
  },

  acessorios: {
    tenant: {
      name: 'Vogue Bolsas & Couros',
      slug: 'vogue-bolsas',
      segment: 'acessorios',
      slogan: 'Design Autêntico em Couro Legítimo',
      description: 'Bolsas estruturadas, carteiras, mochilas e cintos pensados para unir praticidade, beleza e alta durabilidade.',
      logo_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&q=80',
      banner_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80',
      whatsapp: '11966665555',
      email: 'vendas@voguebolsas.com.br',
      phone: '(11) 3111-0000',
      address_street: 'Alameda Santos',
      address_number: '1800',
      address_neighborhood: 'Jardins',
      address_city: 'São Paulo',
      address_state: 'SP',
      address_zip: '01418-102',
      primary_color: '#78350f', // Couro âmbar caramelo
      secondary_color: '#292524',
      accent_color: '#d97706',
      delivery_fee: 18.0,
      free_shipping_threshold: 300.0,
      delivery_estimate: '1 a 3 dias úteis',
      allows_pickup: true,
      pickup_instructions: 'Showroom Jardins, segunda a sábado das 10h às 19h.',
      pix_key: 'vendas@voguebolsas.com.br',
      pix_type: 'email',
      active: true,
    },
    categories: [
      { name: 'Bolsas de Ombro', slug: 'ombro', icon: 'Briefcase' },
      { name: 'Bolsas Transversais', slug: 'transversal', icon: 'ShoppingBag' },
      { name: 'Carteiras & Clutches', slug: 'carteiras', icon: 'CreditCard' },
    ],
    products: [
      {
        name: 'Bolsa Tote Couro Caramelo Clássica',
        categorySlug: 'ombro',
        description: 'Espaço generoso com compartimento para notebook de até 14", forro em tecido acetinado e fecho magnético reforçado.',
        base_price: 489.00,
        cost_price: 190.00,
        promo_price: 439.00,
        images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'],
        stock_qty: 15,
        badge: 'Artesanal',
        variations: [
          {
            name: 'Cor do Couro',
            required: true,
            options: [
              { name: 'Caramelo Vintage' },
              { name: 'Preto Nobre' },
              { name: 'Pinhão / Café' }
            ]
          }
        ],
        tags: ['couro', 'bolsa', 'tote', 'luxo'],
        featured: true
      }
    ]
  }
};
