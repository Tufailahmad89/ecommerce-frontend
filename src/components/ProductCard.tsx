import React from 'react';
import { Product } from '../data/products';
import { ShoppingBag, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-black text-white text-[10px] uppercase tracking-widest px-2 py-1">
            New Arrival
          </span>
        )}

        <button 
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-black py-3 flex items-center justify-center space-x-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black hover:text-white"
        >
          <Plus size={16} />
          <span className="text-xs font-medium uppercase tracking-widest">Add to Bag</span>
        </button>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 italic font-serif">
            {product.category}
          </p>
        </div>
        <span className="text-sm font-medium text-gray-900">
          ₹{product.price.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
};
