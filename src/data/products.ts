export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Saree' | 'Kurta' | 'Lehenga' | 'Fusion';
  image: string;
  description: string;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Banarasi Silk Saree',
    price: 12500,
    category: 'Saree',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Handwoven pure silk Banarasi saree with intricate zari work.',
    isNew: true,
  },
  {
    id: '2',
    name: 'Embroidered Chikankari Kurta',
    price: 4500,
    category: 'Kurta',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant white Chikankari kurta with delicate hand embroidery.',
  },
   {
  id: '3',
  name: 'Floral Print Lehenga',
  price: 18900,
  category: 'Lehenga',
  image: '/images/4.jpeg',
  description: 'Modern floral print lehenga set for festive occasions.',
  isNew: true,
},
  {
  id: '3',
  name: 'Floral Print Lehenga',
  price: 18900,
  category: 'Lehenga',
  image: '/images/4.jpeg',
  description: 'Modern floral print lehenga set for festive occasions.',
  isNew: true,
},
  {
    id: '5',
    name: 'Kanjeevaram Pattu Saree',
    price: 15000,
    category: 'Saree',
     image: '/images/5.jpeg',
    description: 'Traditional Kanjeevaram silk saree with temple borders.',
  },
  {
    id: '6',
    name: 'Mirror Work Kurta Set',
    price: 6800,
    category: 'Kurta',
     image: '/images/6.jpeg',
    description: 'Vibrant kurta set with authentic mirror work from Gujarat.',
  },
];
